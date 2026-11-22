import { z } from "zod";
export const IndicatorId = z.enum([
  "ema20",
  "ema50",
  "ema200",
  "bollinger",
  "rsi",
  "macd",
  "adx",
  "atr",
]);
export const AgentAction = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("showIndicator"),
    indicator: IndicatorId,
    reason: z.string().max(300),
  }),
  z.object({ type: z.literal("hideIndicator"), indicator: IndicatorId }),
  z.object({
    type: z.literal("showTechnicalLevel"),
    levelId: z.string().max(80),
    reason: z.string().max(300),
  }),
  z.object({ type: z.literal("clearAIAnnotations") }),
]);
export const AgentResponse = z.object({
  answer: z.string().min(1).max(6000),
  actions: z.array(AgentAction).max(12).default([]),
});
export type AgentResponse = z.infer<typeof AgentResponse>;
export type AgentContext = {
  contextId: string;
  symbol: string;
  timeframe: string;
  mode: string;
  meta: any;
  lastPrice: number;
  barCount: number;
  analysis: any;
  companyIntelligence?:any;
};
export interface AIProvider {
  name: string;
  kind: "llm" | "deterministic";
  generate(
    question: string,
    context: AgentContext,
    signal: AbortSignal,
  ): Promise<AgentResponse>;
}
function levelId(x: any) {
  return x.id || `${x.type}:${Number(x.price).toFixed(6)}:${x.timeframe}`;
}
export function sanitizeResponse(
  raw: unknown,
  ctx: AgentContext,
): AgentResponse {
  const parsed = AgentResponse.parse(raw),
    validLevels = new Set((ctx.analysis.levels || []).map(levelId));
  return {
    ...parsed,
    actions: parsed.actions.filter(
      (a) => a.type !== "showTechnicalLevel" || validLevels.has(a.levelId),
    ),
  };
}
function deterministic(question: string, c: AgentContext): AgentResponse {
  const q = question.toLowerCase(),
    a = c.analysis,
    s = a.technicalScenario,
    actions: any[] = [];
  if (/pulisci|rimuovi tutto|cancella annot/.test(q))
    actions.push({ type: "clearAIAnnotations" });
  if (/media.*200|ema.*200/.test(q))
    actions.push({
      type: "showIndicator",
      indicator: "ema200",
      reason:
        "Richiesta esplicita: la serie EMA 200 è già calcolata dal motore quantitativo.",
    });
  if (/bollinger|band[ea]/.test(q))
    actions.push({
      type: "showIndicator",
      indicator: "bollinger",
      reason:
        "Richiesta esplicita: bande calcolate dal motore su 20 periodi e 2 deviazioni standard.",
    });
  if (/\brsi\b/.test(q))actions.push({type:'showIndicator',indicator:'rsi',reason:'Pannello RSI 14 calcolato sulle barre chiuse del contesto corrente.'});
  if (/\bmacd\b/.test(q))actions.push({type:'showIndicator',indicator:'macd',reason:'Pannello MACD 12,26,9 calcolato sulle barre chiuse del contesto corrente.'});
  if (/nascondi.*rsi/.test(q))actions.push({type:'hideIndicator',indicator:'rsi'});
  if (/nascondi.*macd/.test(q))actions.push({type:'hideIndicator',indicator:'macd'});
  if (/nascondi.*200/.test(q))
    actions.push({ type: "hideIndicator", indicator: "ema200" });
  if (/support|resisten|livell/.test(q))
    for (const l of (a.levels || []).slice(0, 4))
      actions.push({
        type: "showTechnicalLevel",
        levelId: levelId(l),
        reason: `Livello calcolato da ${l.touches} pivot, rilevanza ${l.relevance}/100.`,
      });
  if (/invalid/.test(q) && s)
    for (const x of s.invalidationConditions.filter((x: any) => x.levelId))
      actions.push({
        type: "showTechnicalLevel",
        levelId: x.levelId,
        reason:
          "Livello di invalidazione calcolato nello scenario tecnico corrente.",
      });
  const company=c.companyIntelligence;
  const levels = (a.levels || [])
    .map(
      (l: any) =>
        `${l.type === "support" ? "supporto" : "resistenza"} ${l.price.toFixed(2)} (${l.touches} test, rilevanza ${l.relevance}/100)`,
    )
    .join("; ");
  let answer = s
    ? `${c.symbol} sul timeframe ${c.timeframe}: ${s.title.toLowerCase()}. ${s.summary} Stato multi-timeframe: ${s.multiTimeframeStatus}.`
    : `${c.symbol} sul timeframe ${c.timeframe}: regime ${a.trend.toLowerCase()}. ${a.narrative}`;
  if (/conferm/.test(q) && s)
    answer = `Conferme da osservare: ${s.confirmationConditions.map((x: any) => x.description).join("; ") || "dati insufficienti"}. Sono condizioni su barre chiuse calcolate dal motore.`;
  if (/contrar|conflitt/.test(q) && s)
    answer = `Segnali contrari: ${s.conflictingSignals.map((x: any) => x.description).join("; ") || "nessun conflitto quantitativo rilevato"}.`;
  if (/settimanal|timeframe/.test(q) && s)
    answer = `Stato multi-timeframe: ${s.multiTimeframeStatus}. ${a.conflictText || ""}`;
  if (/laterale|perch[eé].*lateral/.test(q) && s)
    answer = `${s.summary} ADX ${a.adx.toFixed(1)}; il motore privilegia RSI, Bande di Bollinger e livelli orizzontali quando la direzionalità non è sufficiente.`;
  if (/perch[eé]|indicator/.test(q))
    answer = `Il motore ha scelto ${a.selectedIndicators.join(", ")}. ${a.selectionReason} La scelta deriva da ADX ${a.adx.toFixed(1)}, ATR normalizzato ${a.normalizedAtr.toFixed(2)}% e regime ${a.trend.toLowerCase()}.`;
  if (/support|resisten|livell/.test(q))
    answer = `Livelli confermati per ${c.symbol}: ${levels || "nessun cluster sufficientemente testato"}. Sono oggetti calcolati; il punteggio è una rilevanza, non una probabilità.`;
  if (/invalid/.test(q) && s)
    answer = `Invalidazioni calcolate: ${s.invalidationConditions.map((x: any) => x.description).join("; ") || "dati insufficienti"}. L'agente non aggiunge livelli a quelli del backend.`;
  if(company&&/azienda|stabil|fondamental|qualit/.test(q))answer=`${company.profile.legalName}: qualità ${company.quality.overall}. Evidenze favorevoli: ${company.quality.strengths.map((x:any)=>x.label).join(', ')||'nessuna evidenza forte'}. Segnali contrari: ${company.quality.weaknesses.map((x:any)=>x.label).join(', ')||'nessuna criticità quantitativa forte'}. Copertura metriche ${Math.round(company.dataQuality.coverage.metrics*100)}%; fonte ${company.sources.map((x:any)=>x.provider).filter((x:string,i:number,a:string[])=>a.indexOf(x)===i).join(', ')}.`;
  if(company&&/valutaz/.test(q))answer=`Valutazione ${company.valuation.status}. P/E ${company.metrics.trailingPE?.toFixed(1)??'non disponibile'}, forward P/E ${company.metrics.forwardPE?.toFixed(1)??'non disponibile'}, EV/EBITDA ${company.metrics.evToEbitda?.toFixed(1)??'non disponibile'}. ${company.valuation.limitations.join(' ')}`;
  if(company&&/risch|attendere/.test(q))answer=`Elementi contrari o limiti: ${[...company.quality.weaknesses.map((x:any)=>x.label),...company.dataQuality.missingFields.map((x:string)=>`dato mancante: ${x}`),...company.valuation.limitations].join('; ')||'nessun limite forte rilevato'}. Attendere può essere coerente finché le conferme tecniche restano incomplete: ${s?.confirmationConditions.map((x:any)=>x.description).join('; ')||'scenario tecnico non disponibile'}.`;
  return { answer, actions };
}
class DeterministicProvider implements AIProvider {
  name = "Motore quantitativo locale";
  kind = "deterministic" as const;
  async generate(q: string, c: AgentContext) {
    return deterministic(q, c);
  }
}
class CompatibleProvider implements AIProvider {
  name: string;
  readonly kind = "llm" as const;
  constructor(
    private base: string,
    private model: string,
    private key?: string,
    name = "LLM compatibile",
  ) {
    this.name = name;
  }
  async generate(q: string, c: AgentContext, signal: AbortSignal) {
    const system = `Sei un assistente finanziario prudente. Rispondi in italiano SOLO come JSON {"answer":string,"actions":array}. Non inventare numeri, livelli, timestamp o probabilità. Usa esclusivamente il contesto. Azioni consentite: showIndicator con indicator ema20|ema50|ema200|bollinger|rsi|macd|adx|atr; hideIndicator; showTechnicalLevel usando esattamente uno dei levelId forniti; clearAIAnnotations. Nessun trading o ordine.`;
    const levels = (c.analysis.levels || []).map((x: any) => ({
      ...x,
      levelId: levelId(x),
    }));
    const body = {
      model: this.model,
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: JSON.stringify({
            question: q,
            context: {
              ...c,
              analysis: { ...c.analysis, indicators: undefined, levels },
            },
          }),
        },
      ],
      temperature: 0.1,
      response_format: { type: "json_object" },
    };
    const r = await fetch(`${this.base.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(this.key ? { authorization: `Bearer ${this.key}` } : {}),
      },
      body: JSON.stringify(body),
      signal,
    });
    if (!r.ok) throw new Error(`LLM HTTP ${r.status}`);
    const data: any = await r.json();
    return sanitizeResponse(
      JSON.parse(data.choices?.[0]?.message?.content || "{}"),
      c,
    );
  }
}
const lastCalls = new Map<string, number>();
export function getAIProvider(): AIProvider {
  const provider = (process.env.AI_PROVIDER || "deterministic").toLowerCase();
  if (provider === "ollama")
    return new CompatibleProvider(
      process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434/v1",
      process.env.AI_MODEL || "llama3.2",
      undefined,
      "Ollama locale",
    );
  if (provider === "openai-compatible" && process.env.AI_API_KEY)
    return new CompatibleProvider(
      process.env.AI_BASE_URL || "https://api.openai.com/v1",
      process.env.AI_MODEL || "gpt-4.1-mini",
      process.env.AI_API_KEY,
      "LLM configurato",
    );
  return new DeterministicProvider();
}
export async function askAgent(question: string, context: AgentContext) {
  if (!question.trim() || question.length > 2000)
    throw new Error("Domanda vuota o troppo lunga");
  const p = getAIProvider(),
    now = Date.now(),
    previous = lastCalls.get(context.contextId) || 0;
  if (p.kind === "llm" && now - previous < 500)
    throw new Error("Richieste LLM troppo ravvicinate");
  lastCalls.set(context.contextId, now);
  const controller = new AbortController(),
    timer = setTimeout(
      () => controller.abort(),
      Number(process.env.AI_TIMEOUT_MS || 20000),
    );
  try {
    return {
      ...(await p.generate(question, context, controller.signal)),
      provider: p.name,
      kind: p.kind,
      contextId: context.contextId,
    };
  } catch (e) {
    if (p.kind === "deterministic") throw e;
    const fallback = new DeterministicProvider();
    return {
      ...(await fallback.generate(question, context)),
      provider: `Fallback dopo errore ${p.name}`,
      kind: fallback.kind,
      contextId: context.contextId,
      warning: String(e),
    };
  } finally {
    clearTimeout(timer);
  }
}
