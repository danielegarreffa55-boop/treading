import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { analyze, buildTechnicalScenario, type Bar } from "./analysis.js";
import { dataProvider, optionalProviders } from "./providers.js";
import { askAgent } from "./ai.js";
import {findCryptoPair,loadBinanceSpot,searchCrypto,cryptoCacheKey} from "./crypto.js";
import{getCompanyIntelligence}from'./fundamentals.js';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "64kb" }));
const presets = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    exchange: "NASDAQ",
    type: "Azione USA",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    exchange: "NASDAQ",
    type: "Azione USA",
  },
  {
    symbol: "ENI.MI",
    name: "Eni S.p.A.",
    exchange: "Borsa Italiana",
    type: "Azione italiana",
  },
  {
    symbol: "VWCE.DE",
    name: "Vanguard FTSE All-World UCITS ETF",
    exchange: "XETRA",
    type: "ETF UCITS",
  },
  {
    symbol: "VTSAX",
    name: "Vanguard Total Stock Market Index Fund Admiral Shares",
    exchange: "NASDAQ",
    type: "Fondo comune",
  },
];
const ranges: Record<string, { days: number; interval: any }> = {
  "1m": { days: 1, interval: "1m" },
  "5m": { days: 5, interval: "5m" },
  "15m": { days: 30, interval: "15m" },
  "1h": { days: 90, interval: "1h" },
  "4h": { days: 180, interval: "1h" },
  "1D": { days: 730, interval: "1d" },
  "1W": { days: 1825, interval: "1wk" },
  "1M": { days: 3650, interval: "1mo" },
};
type Cached = { expires: number; value: any };
const cache = new Map<string, Cached>();
const cacheKey = (symbol: string, tf: string) =>
  `${symbol.toUpperCase()}|${tf}`;
export function cacheSet(key: string, value: any, ttl = 120000) {
  cache.set(key, { expires: Date.now() + ttl, value });
}
export function cacheGet(key: string) {
  const x = cache.get(key);
  if (!x || x.expires < Date.now()) {
    cache.delete(key);
    return undefined;
  }
  return x.value;
}
export function aggregate4h(rows: any[]): Bar[] {
  const groups = new Map<string, any[]>();
  for (const q of rows) {
    if (q.close == null) continue;
    const d = new Date(q.date),
      session = `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`,
      slot = Math.floor(d.getUTCHours() / 4),
      key = `${session}-${slot}`;
    groups.set(key, [...(groups.get(key) || []), q]);
  }
  return [...groups.values()].map((g) => ({
    time: Math.floor(new Date(g[0].date).getTime() / 1000),
    open: g[0].open,
    high: Math.max(...g.map((x) => x.high)),
    low: Math.min(...g.map((x) => x.low)),
    close: g.at(-1).close,
    volume: g.reduce((s, x) => s + (x.volume || 0), 0),
  }));
}
function closedBars(b: Bar[], tf: string) {
  if (!b.length) return b;
  const seconds: Record<string, number> = {
    "5m": 300,
    "15m": 900,
    "1h": 3600,
    "4h": 14400,
    "1D": 86400,
    "1W": 604800,
    "1M": 2419200,
  };
  return Date.now() / 1000 - b.at(-1)!.time < (seconds[tf] || 86400) * 0.9
    ? b.slice(0, -1)
    : b;
}
async function load(symbol: string, tf: string) {
  const cryptoPair=findCryptoPair(symbol);
  if(cryptoPair){const key=cryptoCacheKey(cryptoPair.symbol,tf),hit=cacheGet(key);if(hit)return{...hit,cache:'hit'};const loaded=await loadBinanceSpot(cryptoPair.symbol,tf),bars=loaded.closedBars,lastData=new Date(bars.at(-1)!.time*1000).toISOString(),value={bars,currentBar:loaded.currentBar,meta:{...loaded.meta,lastData}};cacheSet(key,value,tf==='1m'?15000:60000);return{...value,cache:'miss'};}
  const key = cacheKey(symbol, tf),
    hit = cacheGet(key);
  if (hit) return { ...hit, cache: "hit" };
  const cfg = ranges[tf] || ranges["1D"],
    end = new Date(),
    start = new Date(end.getTime() - cfg.days * 86400000),
    rows: any = await dataProvider.chart(symbol, {
      period1: start,
      period2: end,
      interval: cfg.interval,
    }),
    raw = rows.quotes
      .filter((q: any) => q.open != null && q.close != null)
      .map((q: any) => ({
        time: Math.floor(new Date(q.date).getTime() / 1000),
        open: q.open,
        high: q.high,
        low: q.low,
        close: q.close,
        volume: q.volume || 0,
      }));
  const bars = closedBars(tf === "4h" ? aggregate4h(rows.quotes) : raw, tf);
  if (bars.length < 20) throw new Error("Storico insufficiente");
  const value = {
    bars,
    meta: {
      provider: "Yahoo Finance",
      currency: rows.meta.currency,
      exchange: rows.meta.fullExchangeName || rows.meta.exchangeName,
      instrumentType: rows.meta.instrumentType,
      lastData: new Date(bars.at(-1)!.time * 1000).toISOString(),
      completeBarsOnly: true,
      status:
        tf.includes("m") || tf.includes("h")
          ? "Dati intraday/ritardati secondo disponibilità del provider"
          : "Storico end-of-day",
      demo: false,
    },
  };
  cacheSet(key, value);
  return { ...value, cache: "miss" };
}
app.get("/api/health", (_, r) =>
  r.json({
    ok: true,
    provider: dataProvider.id,
    optionalProviders,
    cacheEntries: cache.size,
    aiProvider: process.env.AI_PROVIDER || "deterministic",
  }),
);
app.get("/api/search", async (req, res) => {
  const q = String(req.query.q || "").trim();
  if (!q) return res.json([...presets,...searchCrypto('')]);
  const crypto=searchCrypto(q);if(crypto.length)return res.json(crypto);
  try {
    res.json(await dataProvider.search(q));
  } catch (e) {
    res
      .status(502)
      .json({ error: "Ricerca provider non disponibile", detail: String(e) });
  }
});
app.get('/api/company/:symbol',async(req,res)=>{try{res.json(await getCompanyIntelligence(String(req.params.symbol)))}catch(e){res.status(502).json({error:'Dati aziendali non disponibili',detail:String(e),demo:false})}});
app.get("/api/chart", async (req, res) => {
  const symbol = String(req.query.symbol || "AAPL"),
    tf = String(req.query.timeframe || "1D"),
    mode = String(req.query.mode || "trading");
  try {
    const current = await load(symbol, tf),
      requested =
        mode === "investment" ? ["1D", "1W", "1M"] : ["15m", "1h", "4h", "1D"],
      frames: any[] = [];
    for (const frame of requested) {
      try {
        const x = frame === tf ? current : await load(symbol, frame);
        const a = analyze(x.bars, mode, frame,x.meta.assetClass==='crypto'?'24x7':'exchange-session');
        frames.push({
          timeframe: frame,
          trend: a.trend,
          secondary: a.secondary,
          lastData: x.meta.lastData,
        });
      } catch {
        frames.push({
          timeframe: frame,
          trend: "Non disponibile",
          secondary: [],
        });
      }
    }
    const analysis = analyze(current.bars, mode, tf,current.meta.assetClass==='crypto'?'24x7':'exchange-session'),
      valid = frames.filter((x) => x.trend !== "Non disponibile"),
      conflict = new Set(valid.map((x) => x.trend)).size > 1,
      technicalScenario = buildTechnicalScenario(
        analysis,
        tf,
        frames,
        current.meta,
      );
    res.json({
      symbol,
      timeframe: tf,
      contextId: `${current.meta.providerId||'yahoo'}|${current.meta.marketType||'exchange'}|${symbol}|${tf}|${current.meta.lastData}`,
      bars: current.bars,
      analysis: {
        ...analysis,
        technicalScenario,
        multiTimeframe: frames,
        conflict,
        conflictText: conflict
          ? "I timeframe non sono concordi: il segnale va interpretato con cautela."
          : "I timeframe disponibili sono concordi sul regime principale.",
      },
      meta: { ...current.meta, cache: current.cache },
    });
  } catch (e) {
    res
      .status(502)
      .json({
        error: `Dati reali non disponibili per ${symbol}`,
        detail: String(e),
        demo: false,
      });
  }
});
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { question, symbol, timeframe, mode, contextId } = req.body || {};
    if (!symbol || !timeframe || !contextId)
      return res.status(400).json({ error: "Contesto incompleto" });
    const current = await load(String(symbol), String(timeframe)),
      analysis = analyze(
        current.bars,
        String(mode || "trading"),
        String(timeframe),
        current.meta.assetClass==='crypto'?'24x7':'exchange-session',
      ),
      expected = `${current.meta.providerId||'yahoo'}|${current.meta.marketType||'exchange'}|${symbol}|${timeframe}|${current.meta.lastData}`;
    if (contextId !== expected)
      return res
        .status(409)
        .json({
          error: "Il contesto è cambiato. Riprova sul grafico corrente.",
          expectedContextId: expected,
        });
    const requested =
        mode === "investment" ? ["1D", "1W", "1M"] : ["15m", "1h", "4h", "1D"],
      frames = [];
    for (const frame of requested) {
      try {
        const x = await load(String(symbol), frame),
          a = analyze(x.bars, String(mode), frame,x.meta.assetClass==='crypto'?'24x7':'exchange-session');
        frames.push({
          timeframe: frame,
          trend: a.trend,
          lastData: x.meta.lastData,
        });
      } catch {
        frames.push({ timeframe: frame, trend: "Non disponibile" });
      }
    }
    const technicalScenario = buildTechnicalScenario(
        analysis,
        String(timeframe),
        frames,
        current.meta,
      ),
      fullAnalysis = {
        ...analysis,
        technicalScenario,
        multiTimeframe: frames,
        conflictText:
          new Set(
            frames
              .filter((x: any) => x.trend !== "Non disponibile")
              .map((x: any) => x.trend),
          ).size > 1
            ? "Segnali multi-timeframe contrastanti."
            : "Timeframe concordi.",
      },
      companyIntelligence=/azienda|stabil|valutaz|fondamental|settore|risch|attendere|long|short/i.test(String(question||''))&&!findCryptoPair(String(symbol))?await getCompanyIntelligence(String(symbol)).catch(()=>undefined):undefined,
      context = {
        contextId: expected,
        symbol: String(symbol),
        timeframe: String(timeframe),
        mode: String(mode),
        meta: current.meta,
        lastPrice: current.bars.at(-1)!.close,
        barCount: current.bars.length,
        analysis: fullAnalysis,
        companyIntelligence,
      };
    res.json(await askAgent(String(question || ""), context));
  } catch (e) {
    res
      .status(500)
      .json({ error: "Agente non disponibile", detail: String(e) });
  }
});
const here = path.dirname(fileURLToPath(import.meta.url)),
  dist = path.resolve(here, "../dist");
app.use(express.static(dist));
app.use((_, r) => r.sendFile(path.join(dist, "index.html")));
const port = Number(process.env.PORT || 8000);
if (process.env.NODE_ENV !== "test")
  app.listen(port, () =>
    console.log(`Financial AI Analyst: http://localhost:${port}`),
  );
