export type Bar = {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
};
export type Level = {
    id: string;
    price: number;
    type: "support" | "resistance";
    timeframe: string;
    origin: string;
    firstTime: number;
    lastTime: number;
    touches: number;
    relevance: number;
};
export type Pivot = {
    index: number;
    time: number;
    price: number;
    kind: "high" | "low";
};
export type ScenarioCondition = {
    id: string;
    description: string;
    metric: string;
    operator: "above" | "below" | "crosses_above" | "crosses_below";
    referenceValue?: number;
    timeframe: string;
    source: string;
    levelId?: string;
};
export type ScenarioSignal = {
    id: string;
    description: string;
    metric: string;
    value: number | string;
    timeframe: string;
    source: string;
};
export type ScenarioLevel = {
    levelId: string;
    type: "support" | "resistance";
    price: number;
    timeframe: string;
    relevance: number;
    source: string;
};
export type TechnicalScenario = {
    primary: "bullish" | "bearish" | "sideways";
    title: string;
    timeframe: string;
    summary: string;
    confirmationConditions: ScenarioCondition[];
    invalidationConditions: ScenarioCondition[];
    supportingSignals: ScenarioSignal[];
    conflictingSignals: ScenarioSignal[];
    relevantLevels: ScenarioLevel[];
    multiTimeframeStatus: "aligned" | "mixed" | "unavailable";
    origin: "deterministic";
    provider: string;
    lastClosedBar: string;
    dataQuality: {
        status: "complete" | "partial" | "stale";
        lastUpdate: string;
        notes: string[];
    };
};
export declare const sma: (v: number[], n: number) => (number | null)[];
export declare const ema: (v: number[], n: number) => number[];
export declare const rsi: (v: number[], n?: number) => (number | null)[];
export declare function atr(b: Bar[], n?: number): number[];
export declare function adx(b: Bar[], n?: number): number[];
export declare function pivots(b: Bar[], radius?: number): Pivot[];
export declare function levelId(type: Level["type"], price: number, timeframe: string): string;
export declare function levels(b: Bar[], timeframe: string, max?: number): Level[];
export declare function analyze(bars: Bar[], mode: string, timeframe?: string, calendar?: "exchange-session" | "24x7"): {
    trend: string;
    secondary: string[];
    volatility: number;
    normalizedAtr: number;
    adx: number;
    relativeVolume: number;
    narrative: string;
    scenario: string;
    selectedIndicators: string[];
    selectionReason: string;
    levels: Level[];
    support: number;
    resistance: number;
    trendlines: ({
        kind: "high" | "low";
        start: {
            time: number;
            price: number;
        };
        end: {
            time: number;
            price: number;
        };
        slopePerBar: number;
        origin: string;
    } | null)[];
    indicators: {
        ema20: number[];
        ema50: number[];
        ema200: number[];
        rsi: (number | null)[];
        macd: number[];
        signal: number[];
        atr: number[];
        adx: number[];
        bollingerUpper: (number | null)[];
        bollingerLower: (number | null)[];
    };
};
export declare function buildTechnicalScenario(analysis: ReturnType<typeof analyze>, timeframe: string, frames: {
    timeframe: string;
    trend: string;
}[], meta: {
    provider: string;
    lastData: string;
    completeBarsOnly?: boolean;
    status?: string;
}): TechnicalScenario;
