import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  createChart,
  CandlestickSeries,
  LineSeries,
  HistogramSeries,
  ColorType,
} from "lightweight-charts";
import { SearchBox } from "./SearchBox";
import { HelpTip, InfoGuide } from "./InfoGuide";
import { AIChat } from "./AIChat";
import {IndicatorPanels} from "./IndicatorPanels";
import{CompanyPanel}from'./CompanyPanel';
import{AppIcon,Onboarding,PreferencesMenu,WatchlistControl,WatchlistView,type WatchItem}from'./ProductContinuity';
import "./style.css";
import'./design-system.css';
import './research-terminal.css';
const statusLabel: Record<string, string> = {
  bullish: "Rialzista",
  bearish: "Ribassista",
  sideways: "Laterale",
  aligned: "Concorde",
  mixed: "Misto",
  unavailable: "Non disponibile",
  complete: "Completa",
  partial: "Parziale",
  stale: "Obsoleta",
};
function ScenarioPanel({
  data,
  onActions,
}: {
  data: any;
  onActions: (a: any[]) => void;
}) {
  const s = data.analysis.technicalScenario,
    [open, setOpen] = useState(true);
  if (!s) return null;
  const condition = (x: any, invalidation = false) => (
    <li key={x.id}>
      <span>
        {x.description}
        <small>
          {x.timeframe} · {x.source}
        </small>
      </span>
      {x.levelId && (
        <span className="scenario-actions">
          <button
            onClick={() =>
              onActions([
                {
                  type: "showTechnicalLevel",
                  levelId: x.levelId,
                  reason: invalidation
                    ? "Invalidazione dello scenario tecnico"
                    : "Condizione dello scenario tecnico",
                },
              ])
            }
          >
            {invalidation ? "Evidenzia invalidazione" : "Mostra sul grafico"}
          </button>
          <button
            onClick={() =>
              onActions([{ type: "hideTechnicalLevel", levelId: x.levelId }])
            }
          >
            Nascondi
          </button>
        </span>
      )}
    </li>
  );
  return (
    <section className={`technical-scenario ${s.primary}`}>
      <button
        className="scenario-toggle"
        onClick={() => setOpen((x) => !x)}
        aria-expanded={open}
      >
        <span>
          <small>SCENARIO TECNICO</small>
          <b>{s.title}</b>
        </span>
        <i>{open ? "−" : "+"}</i>
      </button>
      {open && (
        <div className="scenario-body">
          <div className="scenario-meta">
            <span>{s.timeframe}</span>
            <span>Multi-timeframe: {statusLabel[s.multiTimeframeStatus]}</span>
            <span>Origine deterministica</span>
          </div>
          <h3>
            Riepilogo <HelpTip label="Scenario prevalente" />
          </h3>
          <p>{s.summary}</p>
          <h3>
            Conferme da osservare <HelpTip label="Condizione di conferma" />
          </h3>
          <ul>{s.confirmationConditions.map((x: any) => condition(x))}</ul>
          <h3>
            Invalidazioni <HelpTip label="Condizione di invalidazione" />
          </h3>
          <ul className="invalidations">
            {s.invalidationConditions.map((x: any) => condition(x, true))}
          </ul>
          <div className="scenario-columns">
            <div>
              <h3>Segnali favorevoli</h3>
              {s.supportingSignals.map((x: any) => (
                <p className="signal good" key={x.id}>
                  {x.description}
                </p>
              ))}
            </div>
            <div>
              <h3>Segnali contrari</h3>
              {s.conflictingSignals.length ? (
                s.conflictingSignals.map((x: any) => (
                  <p className="signal conflict" key={x.id}>
                    {x.description}
                  </p>
                ))
              ) : (
                <p className="signal neutral">
                  Nessun conflitto quantitativo rilevato.
                </p>
              )}
            </div>
          </div>
          <h3>Livelli rilevanti</h3>
          <div className="scenario-levels">
            {s.relevantLevels.map((x: any) => (
              <span key={x.levelId}>
                {x.type === "support" ? "Supporto" : "Resistenza"}{" "}
                {x.price.toFixed(2)} · {x.timeframe}
              </span>
            ))}
          </div>
          <h3>
            Qualità dei dati <HelpTip label="Qualità dei dati" />
          </h3>
          <div className={`quality ${s.dataQuality.status}`}>
            <b>{statusLabel[s.dataQuality.status]}</b>
            <span>
              {s.provider} · ultima barra chiusa{" "}
              {new Date(s.lastClosedBar).toLocaleString("it-IT")}
            </span>
            {s.dataQuality.notes.map((x: string) => (
              <small key={x}>{x}</small>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
function App() {
  const chartEl = useRef<HTMLDivElement>(null);
  const [symbol, setSymbol] = useState("AAPL"),
    [q, setQ] = useState("AAPL"),
    [tf, setTf] = useState("1D"),
    [mode, setMode] = useState("trading"),
    [view,setView]=useState<'chart'|'company'|'watchlist'>('chart'),
    [data, setData] = useState<any>(),
    [error, setError] = useState(""),
    [auto, setAuto] = useState(true),
    [showEma, setShowEma] = useState(true),
    [showLevels, setShowLevels] = useState(true),
    [showBollinger, setShowBollinger] = useState(false),
    [showTrendlines, setShowTrendlines] = useState(true),
    [showRsi,setShowRsi]=useState(()=>localStorage.getItem('showRsi')==='true'),
    [showMacd,setShowMacd]=useState(()=>localStorage.getItem('showMacd')==='true'),
    [live,setLive]=useState<{status:'off'|'connecting'|'live'|'fallback';price?:number;eventTime?:number}>({status:'off'}),
    [infoOpen, setInfoOpen] = useState(false),
    [aiIndicators, setAiIndicators] = useState<string[]>([]),
    [aiLevels, setAiLevels] = useState<string[]>([]),
    [aiReasons, setAiReasons] = useState<Record<string, string>>({});
  useEffect(() => {
    const controller=new AbortController();
    setError("");
    setData(undefined);
    fetch(
      `/api/chart?symbol=${encodeURIComponent(symbol)}&timeframe=${tf}&mode=${mode}`,
      {signal:controller.signal},
    )
      .then(async (r) => {
        const x = await r.json();
        if (!r.ok) throw new Error(x.error);
        setData(x);
      })
      .catch((e) => {if(e.name!=='AbortError')setError(e.message)});
    return()=>controller.abort();
  }, [symbol, tf, mode]);
  useEffect(()=>{localStorage.setItem('showRsi',String(showRsi));localStorage.setItem('showMacd',String(showMacd))},[showRsi,showMacd]);
  useEffect(()=>{if(!data?.meta?.streamUrl){setLive({status:'off'});return}let socket:WebSocket|undefined,timer:number|undefined,attempt=0,stopped=false,lastEvent=0;const connect=()=>{if(stopped)return;setLive(x=>({...x,status:'connecting'}));socket=new WebSocket(data.meta.streamUrl);socket.onopen=()=>{attempt=0;setLive(x=>({...x,status:'live'}))};socket.onmessage=e=>{try{const m=JSON.parse(e.data),event=Number(m.E||0);if(event<=lastEvent)return;lastEvent=event;if(m.k)setLive({status:'live',price:Number(m.k.c),eventTime:event})}catch{}};socket.onerror=()=>socket?.close();socket.onclose=()=>{if(stopped)return;setLive(x=>({...x,status:'fallback'}));timer=window.setTimeout(connect,Math.min(30000,1000*2**attempt++))}};connect();return()=>{stopped=true;if(timer)clearTimeout(timer);socket?.close()}},[data?.contextId]);
  useEffect(() => {
    setAiIndicators([]);
    setAiLevels([]);
    setAiReasons({});
  }, [symbol, tf, mode]);
  useEffect(() => {
    if (!data || !chartEl.current) return;
    chartEl.current.innerHTML = "";
    const chart = createChart(chartEl.current, {
        height: Math.max(440, chartEl.current.clientHeight),
        layout: {
          background: { type: ColorType.Solid, color: "#0b0d10" },
          textColor: "#8793a3",
          attributionLogo: true,
        },
        grid: {
          vertLines: { color: "#171b21" },
          horzLines: { color: "#171b21" },
        },
        timeScale: { borderColor: "#232832" },
      }),
      candles = chart.addSeries(CandlestickSeries, {
        upColor: "#28b487",
        downColor: "#e05a67",
        wickUpColor: "#28b487",
        wickDownColor: "#e05a67",
        borderVisible: false,
      });
    candles.setData(data.bars);
    const vol = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "",
    });
    vol.priceScale().applyOptions({ scaleMargins: { top: 0.84, bottom: 0 } });
    vol.setData(
      data.bars.map((b: any) => ({
        time: b.time,
        value: b.volume,
        color: b.close >= b.open ? "#28b48744" : "#e05a6744",
      })),
    );
    const adaptive = data.analysis.selectedIndicators as string[],
      emaOn = auto ? adaptive.some((x) => x.startsWith("EMA")) : showEma,
      bollOn =
        (auto
          ? adaptive.some((x) => x.startsWith("Bollinger"))
          : showBollinger) || aiIndicators.includes("bollinger");
    if (emaOn)
      for (const [key, color] of [
        ["ema20", "#53a7ff"],
        ["ema50", "#f7c65f"],
      ] as const) {
        const s = chart.addSeries(LineSeries, {
          color,
          lineWidth: 2,
          title: key.toUpperCase(),
        });
        s.setData(
          data.bars
            .map((b: any, i: number) => ({
              time: b.time,
              value: data.analysis.indicators[key][i],
            }))
            .filter((x: any) => x.value != null),
        );
      }
    for (const id of aiIndicators.filter((x) =>
      ["ema20", "ema50", "ema200"].includes(x),
    )) {
      if (emaOn && id !== "ema200") continue;
      const s = chart.addSeries(LineSeries, {
        color: "#4d8eff",
        lineWidth: 2,
        title: `AI ${id.toUpperCase()}`,
      });
      s.setData(
        data.bars
          .map((b: any, i: number) => ({
            time: b.time,
            value: data.analysis.indicators[id][i],
          }))
          .filter((x: any) => x.value != null),
      );
    }
    if (bollOn)
      for (const [key, color] of [
        ["bollingerUpper", "#8677f2"],
        ["bollingerLower", "#8677f2"],
      ] as const) {
        const s = chart.addSeries(LineSeries, {
          color,
          lineWidth: 1,
          title: aiIndicators.includes("bollinger") ? "AI BB" : "BB",
        });
        s.setData(
          data.bars
            .map((b: any, i: number) => ({
              time: b.time,
              value: data.analysis.indicators[key][i],
            }))
            .filter((x: any) => x.value != null),
        );
      }
    if (showLevels)
      data.analysis.levels.forEach((l: any) =>
        candles.createPriceLine({
          price: l.price,
          color: l.type === "support" ? "#25c2a0" : "#f05d78",
          lineWidth: 2,
          lineStyle: 2,
          axisLabelVisible: true,
          title: `${l.type === "support" ? "S" : "R"} ${l.relevance}`,
        }),
      );
    data.analysis.levels
      .filter((l: any) =>
        aiLevels.includes(
          `${l.type}:${Number(l.price).toFixed(6)}:${l.timeframe}`,
        ),
      )
      .forEach((l: any) =>
        candles.createPriceLine({
          price: l.price,
          color: aiReasons[l.id]?.toLowerCase().includes("invalidazione")
            ? "#e05a67"
            : "#4d8eff",
          lineWidth: 3,
          lineStyle: 0,
          axisLabelVisible: true,
          title: `${aiReasons[l.id]?.toLowerCase().includes("invalidazione") ? "INV" : "AI"} ${l.type === "support" ? "S" : "R"} ${l.relevance}`,
        }),
      );
    if (showTrendlines)
      data.analysis.trendlines.forEach((t: any) => {
        const s = chart.addSeries(LineSeries, {
          color: t.kind === "low" ? "#25c2a0" : "#f05d78",
          lineWidth: 2,
          title: "Pivot",
        });
        s.setData(
          [t.start, t.end].map((x: any) => ({ time: x.time, value: x.price })),
        );
      });
    chart.timeScale().fitContent();
    const ro = new ResizeObserver(() => chart.applyOptions({
      width: chartEl.current?.clientWidth,
      height: Math.max(440, chartEl.current?.clientHeight || 440),
    }));
    ro.observe(chartEl.current);
    return () => {
      ro.disconnect();
      chart.remove();
    };
  }, [
    data,
    auto,
    showEma,
    showBollinger,
    showLevels,
    showTrendlines,
    aiIndicators,
    aiLevels,
  ]);
  const applyActions = (actions: any[]) => {
    for (const a of actions) {
      if (a.type === "clearAIAnnotations") {
        setAiIndicators([]);
        setAiLevels([]);
        setAiReasons({});
      }
      if (a.type === "showIndicator") {
        setAiIndicators((x) => [...new Set([...x, a.indicator])]);
        setAiReasons((x) => ({ ...x, [a.indicator]: a.reason }));
        if(a.indicator==='rsi')setShowRsi(true);if(a.indicator==='macd')setShowMacd(true);
      }
      if (a.type === "hideIndicator"){
        setAiIndicators((x) => x.filter((i) => i !== a.indicator));
        if(a.indicator==='rsi')setShowRsi(false);if(a.indicator==='macd')setShowMacd(false);
      }
      if (a.type === "showTechnicalLevel") {
        setAiLevels((x) => [...new Set([...x, a.levelId])]);
        setAiReasons((x) => ({ ...x, [a.levelId]: a.reason }));
      }
      if (a.type === "hideTechnicalLevel")
        setAiLevels((x) => x.filter((id) => id !== a.levelId));
    }
  };
  return (
    <main className="app-shell">
      <nav className="side-nav" aria-label="Navigazione principale"><div className="side-mark">F</div><button className={view==='chart'?'active':''} onClick={()=>setView('chart')}><AppIcon name="chart"/>Grafico</button>{data?.meta?.assetClass!=='crypto'&&<button className={view==='company'?'active':''} onClick={()=>setView('company')}><AppIcon name="company"/>Company</button>}<button className={view==='watchlist'?'active':''} onClick={()=>setView('watchlist')}><AppIcon name="watchlist"/>Watchlist</button><button disabled><AppIcon name="search"/>Screener</button><small>RESEARCH<br/>TERMINAL</small></nav>
      <header>
        <div className="brand">
          <span>F</span>
          <div>
            <b>Financial Analyst</b>
            <small>Research terminal</small>
          </div>
        </div>
        <SearchBox
          value={q}
          onChange={setQ}
          onSelect={(r) => {
            setSymbol(r.symbol);
            setQ(r.symbol);
            setView('chart');
            if(r.type.toLowerCase().includes('crypto')&&!['1m','5m','15m','1h','4h','1D','1W'].includes(tf))setTf('1D');
          }}
        />
        <div className="switch">
          <button
            className={mode === "trading" ? "active" : ""}
            onClick={() => setMode("trading")}
          >
            Trading
          </button>
          <button
            className={mode === "investment" ? "active" : ""}
            onClick={() => setMode("investment")}
          >
            Investimento
          </button>
        </div>
        <button className="info-button" onClick={() => setInfoOpen(true)}>
          <span>?</span> Info
        </button>
        <PreferencesMenu />
        {data&&view!=='watchlist'&&<WatchlistControl symbol={symbol} meta={data.meta} data={data} timeframe={tf} onOpen={()=>setView('watchlist')}/>}
      </header>
      {view!=='watchlist'&&<section className="ticker">
        <div>
          <h1>{symbol}</h1>
          <span className="live">
            ●{" "}
            {data
              ? `${data.meta.currency} · ${data.meta.exchange}`
              : "Caricamento…"}
          </span>
          {data?.meta?.assetClass==='crypto'&&<div className="crypto-meta"><span>{data.meta.baseAsset}/{data.meta.quoteAsset}</span><span>{data.meta.marketType}</span><span className={live.status}>{live.status==='live'?`LIVE ${live.price?.toLocaleString('it-IT')}`:live.status==='connecting'?'Connessione live…':'REST fallback'}</span><small>Volume in {data.meta.volumeUnit} · UTC · {live.eventTime?new Date(live.eventTime).toLocaleTimeString('it-IT'):'in attesa'}</small></div>}
        </div>
        <nav>
          {[(data?.meta?.assetClass==='crypto'?'1m':null), "5m", "15m", "1h", "4h", "1D", "1W", ...(data?.meta?.assetClass==='crypto'?[]:["1M"])].filter((x):x is string=>Boolean(x)).map((x) => (
            <button
              key={x}
              className={tf === x ? "active" : ""}
              onClick={() => setTf(x)}
            >
              {x}
            </button>
          ))}
        </nav>
        <div className="toggles">
          <label>
            <input
              type="checkbox"
              checked={auto}
              onChange={(e) => setAuto(e.target.checked)}
            />{" "}
            Auto
          </label>
          {!auto && (
            <>
              <label>
                <input
                  type="checkbox"
                  checked={showEma}
                  onChange={(e) => setShowEma(e.target.checked)}
                />{" "}
                EMA
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={showBollinger}
                  onChange={(e) => setShowBollinger(e.target.checked)}
                />{" "}
                Bande
              </label>
            </>
          )}
          <label>
            <input
              type="checkbox"
              checked={showLevels}
              onChange={(e) => setShowLevels(e.target.checked)}
            />{" "}
            Livelli
          </label>
          <label>
            <input
              type="checkbox"
              checked={showTrendlines}
              onChange={(e) => setShowTrendlines(e.target.checked)}
            />{" "}
            Trendline
          </label>
          <label><input type="checkbox" checked={showRsi} onChange={e=>setShowRsi(e.target.checked)}/> RSI</label>
          <label><input type="checkbox" checked={showMacd} onChange={e=>setShowMacd(e.target.checked)}/> MACD</label>
        </div>
      </section>}
      {view==='watchlist'?<WatchlistView data={data} symbol={symbol} timeframe={tf} onSelect={(item:WatchItem)=>{setSymbol(item.symbol);setQ(item.symbol);setView('chart')}}/>:error ? (
        <div className="error">
          {error}. Nessun dato simulato è stato mostrato.
        </div>
      ) : (
        data && (view==='company'?<CompanyPanel symbol={symbol}/>: (
          <>
            <div className="layout">
              <section className="chart">
                <div ref={chartEl} />
                <IndicatorPanels bars={data.bars} indicators={data.analysis.indicators} showRsi={showRsi||aiIndicators.includes('rsi')} showMacd={showMacd||aiIndicators.includes('macd')}/>
                {(aiIndicators.length > 0 || aiLevels.length > 0) && (
                  <div className="ai-annotations">
                    <b>✦ Annotazioni AI</b>
                    {aiIndicators.map((x) => (
                      <span>
                        {x.toUpperCase()}{" "}
                        <HelpTip label={x} reason={aiReasons[x]} />
                        <button
                          onClick={() =>
                            applyActions([
                              { type: "hideIndicator", indicator: x },
                            ])
                          }
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {aiLevels.map((x) => (
                      <span>
                        Livello validato{" "}
                        <HelpTip
                          label="Rilevanza del livello"
                          reason={aiReasons[x]}
                        />
                      </span>
                    ))}
                    <button
                      onClick={() =>
                        applyActions([{ type: "clearAIAnnotations" }])
                      }
                    >
                      Pulisci
                    </button>
                  </div>
                )}
                <div className="osc">
                  <div>
                    <b>
                      RSI (14) <HelpTip label="RSI" />
                    </b>
                    <strong>
                      {data.analysis.indicators.rsi.at(-1)?.toFixed(1) || "—"}
                    </strong>
                  </div>
                  <div>
                    <b>
                      ADX (14) <HelpTip label="ADX" />
                    </b>
                    <strong>{data.analysis.adx.toFixed(1)}</strong>
                  </div>
                  <div>
                    <b>
                      ATR normalizzato <HelpTip label="ATR" />
                    </b>
                    <strong>{data.analysis.normalizedAtr.toFixed(2)}%</strong>
                  </div>
                </div>
                <div className="section-title">
                  <span>Livelli tecnici</span>
                  <HelpTip label="Cluster di pivot" />
                </div>
                <div className="levels">
                  {data.analysis.levels.map((l: any) => (
                    <article key={`${l.type}-${l.price}`}>
                      <b>
                        {l.type === "support" ? "Supporto" : "Resistenza"}{" "}
                        {l.price.toFixed(2)}{" "}
                        <HelpTip label="Supporto e resistenza" />
                      </b>
                      <span>
                        {l.touches} test · rilevanza {l.relevance}/100{" "}
                        <HelpTip label="Rilevanza del livello" /> ·{" "}
                        {l.timeframe}
                      </span>
                      <small>{l.origin}</small>
                      <em>
                        {l.touches >= 4
                          ? "Più test storici aumentano la rilevanza del livello."
                          : l.relevance >= 70
                            ? "Livello recente e vicino al prezzo corrente."
                            : "Livello secondario mostrato per contesto."}
                      </em>
                    </article>
                  ))}
                </div>
              </section>
              <aside>
                <div className="analysis-head">
                  <p className="eyebrow">ANALISI QUANTITATIVA DETERMINISTICA</p>
                  <span>{data.meta.provider}</span>
                </div>
                <h2>{data.analysis.trend}</h2>
                <div className="badges">
                  {data.analysis.secondary.map((x: string) => (
                    <span>{x}</span>
                  ))}
                </div>
                <p>{data.analysis.narrative}</p>
                <h3>
                  Indicatori scelti{" "}
                  <HelpTip
                    label="Scenario qualitativo"
                    reason={data.analysis.selectionReason}
                  />
                </h3>
                <div className="chips">
                  {data.analysis.selectedIndicators.map((x: string) => (
                    <span>
                      {x}
                      <HelpTip
                        label={x}
                        reason={data.analysis.selectionReason}
                      />
                    </span>
                  ))}
                </div>
                <p className="reason">
                  <b>Perché questa scelta</b>
                  {data.analysis.selectionReason}
                </p>
                <h3>
                  Confronto timeframe <HelpTip label="Multi-timeframe" />
                </h3>
                <div className="frames">
                  {data.analysis.multiTimeframe.map((x: any) => (
                    <span>
                      <b>{x.timeframe}</b>
                      {x.trend}
                    </span>
                  ))}
                </div>
                <p className={data.analysis.conflict ? "warning" : "ok"}>
                  {data.analysis.conflictText}
                </p>
                <ScenarioPanel data={data} onActions={applyActions} />
                <div className="data-source">
                  <b>Origine dati</b>
                  <span>
                    {data.meta.provider} · {data.meta.currency} ·{" "}
                    {data.meta.exchange}
                  </span>
                  <small>
                    Ultima barra chiusa:{" "}
                    {new Date(data.meta.lastData).toLocaleString("it-IT")} ·
                    cache {data.meta.cache}
                  </small>
                </div>
                <AIChat
                  data={data}
                  symbol={symbol}
                  timeframe={tf}
                  mode={mode}
                  onActions={applyActions}
                />
              </aside>
            </div>
          </>
          )
        )
      )}
      <InfoGuide open={infoOpen} onClose={() => setInfoOpen(false)} />
      <Onboarding />
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
