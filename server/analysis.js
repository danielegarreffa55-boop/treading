const mean = (x) => x.reduce((a, b) => a + b, 0) / Math.max(1, x.length);
export const sma = (v, n) => v.map((_, i) => (i < n - 1 ? null : mean(v.slice(i - n + 1, i + 1))));
export const ema = (v, n) => {
    if (!v.length)
        return [];
    const k = 2 / (n + 1);
    let e = v[0];
    return v.map((x, i) => (i === 0 ? e : (e = x * k + e * (1 - k))));
};
export const rsi = (v, n = 14) => v.map((_, i) => {
    if (i < n)
        return null;
    let g = 0, l = 0;
    for (let j = i - n + 1; j <= i; j++) {
        const d = v[j] - v[j - 1];
        d > 0 ? (g += d) : (l -= d);
    }
    return l === 0 ? 100 : 100 - 100 / (1 + g / l);
});
export function atr(b, n = 14) {
    const tr = b.map((x, i) => i
        ? Math.max(x.high - x.low, Math.abs(x.high - b[i - 1].close), Math.abs(x.low - b[i - 1].close))
        : x.high - x.low);
    return ema(tr, n);
}
export function adx(b, n = 14) {
    if (!b.length)
        return [];
    const a = atr(b, n), plus = b.map((x, i) => i && x.high - b[i - 1].high > Math.max(0, b[i - 1].low - x.low)
        ? x.high - b[i - 1].high
        : 0), minus = b.map((x, i) => i && b[i - 1].low - x.low > Math.max(0, x.high - b[i - 1].high)
        ? b[i - 1].low - x.low
        : 0), p = ema(plus, n).map((x, i) => (100 * x) / (a[i] || 1)), m = ema(minus, n).map((x, i) => (100 * x) / (a[i] || 1)), dx = p.map((x, i) => (100 * Math.abs(x - m[i])) / (x + m[i] || 1));
    return ema(dx, n);
}
export function pivots(b, radius = 3) {
    const out = [];
    for (let i = radius; i < b.length - radius; i++) {
        const w = b.slice(i - radius, i + radius + 1);
        if (b[i].high === Math.max(...w.map((x) => x.high)))
            out.push({ index: i, time: b[i].time, price: b[i].high, kind: "high" });
        if (b[i].low === Math.min(...w.map((x) => x.low)))
            out.push({ index: i, time: b[i].time, price: b[i].low, kind: "low" });
    }
    return out;
}
export function levelId(type, price, timeframe) {
    return `${type}:${price.toFixed(6)}:${timeframe}`;
}
export function levels(b, timeframe, max = 4) {
    if (b.length < 7)
        return [];
    const ps = pivots(b), last = b.at(-1).close, tolerance = Math.max(atr(b).at(-1) * 0.55, last * 0.003), clusters = [];
    for (const p of ps) {
        const c = clusters.find((c) => Math.abs(mean(c.items.map((x) => x.price)) - p.price) <= tolerance);
        c ? c.items.push(p) : clusters.push({ items: [p] });
    }
    return clusters
        .map((c) => {
        const price = mean(c.items.map((x) => x.price)), recency = c.items.at(-1).index / (b.length - 1), touchScore = Math.min(c.items.length, 5) / 5, distance = Math.abs(price - last) / last, relevance = Math.round(100 *
            (0.55 * touchScore +
                0.3 * recency +
                0.15 * Math.max(0, 1 - distance / 0.2))), type = (price <= last ? "support" : "resistance");
        return {
            id: levelId(type, price, timeframe),
            price,
            type,
            timeframe,
            origin: "Cluster di pivot locali (raggio 3), tolleranza 0,55 ATR",
            firstTime: c.items[0].time,
            lastTime: c.items.at(-1).time,
            touches: c.items.length,
            relevance,
        };
    })
        .filter((x) => x.touches >= 2)
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, max);
}
function trendline(b, ps, kind) {
    const p = ps.filter((x) => x.kind === kind).slice(-4);
    if (p.length < 2)
        return null;
    const a = p[0], z = p.at(-1);
    return {
        kind,
        start: { time: a.time, price: a.price },
        end: { time: z.time, price: z.price },
        slopePerBar: (z.price - a.price) / (z.index - a.index),
        origin: `Linea tra pivot ${kind === "low" ? "minimi" : "massimi"} verificabili`,
    };
}
export function analyze(bars, mode, timeframe = "1D", calendar = "exchange-session") {
    if (bars.length < 20)
        throw new Error("Servono almeno 20 barre complete");
    const c = bars.map((b) => b.close), last = bars.length - 1, e20 = ema(c, 20), e50 = ema(c, 50), e200 = ema(c, 200), rs = rsi(c), at = atr(bars), ax = adx(bars), fast = ema(c, 12), slow = ema(c, 26), macd = fast.map((x, i) => x - slow[i]), signal = ema(macd, 9), s20 = sma(c, 20), sd = c.map((_, i) => i < 19
        ? null
        : Math.sqrt(mean(c.slice(i - 19, i + 1).map((x) => (x - s20[i]) ** 2)))), upper = s20.map((x, i) => (x == null ? null : x + 2 * (sd[i] || 0))), lower = s20.map((x, i) => (x == null ? null : x - 2 * (sd[i] || 0)));
    const annual24x7 = {
        "1m": 365 * 24 * 60,
        "5m": 365 * 24 * 12,
        "15m": 365 * 24 * 4,
        "1h": 365 * 24,
        "4h": 365 * 6,
        "1D": 365,
        "1W": 52,
    }, annualExchange = {
        "5m": 252 * 78,
        "15m": 252 * 26,
        "1h": 252 * 6.5,
        "4h": 252 * 1.625,
        "1D": 252,
        "1W": 52,
        "1M": 12,
    }, annualPeriods = (calendar === "24x7" ? annual24x7 : annualExchange)[timeframe] || 252;
    const returns = c.slice(1).map((x, i) => (x - c[i]) / c[i]), vol = Math.sqrt(mean(returns.slice(-30).map((x) => x * x))) *
        Math.sqrt(annualPeriods) *
        100, natr = (at[last] / c[last]) * 100, slope20 = ((e20[last] - e20[Math.max(0, last - 10)]) /
        e20[Math.max(0, last - 10)]) *
        100;
    const trend = ax[last] >= 20 && slope20 > 0.5 && c[last] > e20[last]
        ? "Rialzista"
        : ax[last] >= 20 && slope20 < -0.5 && c[last] < e20[last]
            ? "Ribassista"
            : "Laterale";
    const width = upper[last] && lower[last]
        ? ((upper[last] - lower[last]) / s20[last]) * 100
        : 0, baseWidth = mean(upper
        .slice(-60, -5)
        .map((x, i) => x && lower[i + Math.max(0, upper.length - 60)]
        ? ((x - lower[i + Math.max(0, upper.length - 60)]) /
            s20[i + Math.max(0, upper.length - 60)]) *
            100
        : 0)
        .filter(Boolean)), compression = width < baseWidth * 0.65, baselineNatr = mean(at
        .slice(-60)
        .map((x, i) => (x / c[Math.max(0, c.length - 60) + i]) * 100)), highVol = natr > baselineNatr * 1.35;
    const lv = levels(bars, timeframe), res = lv.find((x) => x.type === "resistance"), sup = lv.find((x) => x.type === "support"), volumes = bars.map((x) => x.volume).filter((x) => x > 0), relVol = bars[last].volume / (mean(volumes.slice(-21, -1)) || 1), breakout = !!res && c[last] > res.price && relVol > 1.25, reversal = (trend === "Ribassista" && rs[last] > 45 && macd[last] > signal[last]) ||
        (trend === "Rialzista" && rs[last] < 55 && macd[last] < signal[last]);
    const secondary = [
        highVol ? "Elevata volatilità" : null,
        compression ? "Compressione della volatilità" : null,
        breakout ? "Potenziale breakout" : null,
        reversal ? "Potenziale inversione" : null,
    ].filter(Boolean);
    const selected = trend === "Laterale"
        ? ["RSI 14", "Bollinger Bands 20,2", "Supporti/resistenze"]
        : ["EMA 20/50", "ADX 14", "MACD 12,26,9", "Struttura dei pivot"];
    if (highVol)
        selected.push("ATR 14 normalizzato");
    if (breakout)
        selected.push("Volume relativo 20");
    const reason = trend === "Laterale"
        ? "ADX e pendenza non confermano un trend: priorità a oscillatori, bande e livelli orizzontali."
        : "ADX e pendenza EMA indicano direzionalità: priorità a trend, momentum e struttura.";
    const scenario = breakout
        ? "Rialzista condizionale: breakout rilevato; attendere chiusura e retest."
        : trend === "Rialzista"
            ? "Rialzista finché i supporti principali restano validi."
            : trend === "Ribassista"
                ? "Ribassista finché non vengono recuperate le resistenze principali."
                : "Laterale: prevale l’oscillazione tra livelli finché non arriva una chiusura esterna.";
    const ps = pivots(bars);
    const narrative = `Regime principale ${trend.toLowerCase()} (ADX ${ax[last].toFixed(1)}, pendenza EMA20 su 10 barre ${slope20.toFixed(2)}%). RSI ${rs[last].toFixed(1)}, ATR normalizzato ${natr.toFixed(2)}% e volume relativo ${relVol.toFixed(2)}x. ${secondary.length ? `Segnali secondari: ${secondary.join(", ")}.` : "Nessun segnale secondario forte."} ${scenario}`;
    return {
        trend,
        secondary,
        volatility: vol,
        normalizedAtr: natr,
        adx: ax[last],
        relativeVolume: relVol,
        narrative,
        scenario,
        selectedIndicators: selected,
        selectionReason: reason,
        levels: lv,
        support: sup?.price ?? Math.min(...bars.slice(-40).map((x) => x.low)),
        resistance: res?.price ?? Math.max(...bars.slice(-40).map((x) => x.high)),
        trendlines: [
            trendline(bars, ps, "low"),
            trendline(bars, ps, "high"),
        ].filter(Boolean),
        indicators: {
            ema20: e20,
            ema50: e50,
            ema200: e200,
            rsi: rs,
            macd,
            signal,
            atr: at,
            adx: ax,
            bollingerUpper: upper,
            bollingerLower: lower,
        },
    };
}
export function buildTechnicalScenario(analysis, timeframe, frames, meta) {
    const primary = analysis.trend === "Rialzista"
        ? "bullish"
        : analysis.trend === "Ribassista"
            ? "bearish"
            : "sideways";
    const available = frames.filter((x) => x.trend !== "Non disponibile"), multiTimeframeStatus = available.length < 2
        ? "unavailable"
        : new Set(available.map((x) => x.trend)).size === 1
            ? "aligned"
            : "mixed";
    const supports = analysis.levels.filter((x) => x.type === "support"), resistances = analysis.levels.filter((x) => x.type === "resistance"), support = supports[0], resistance = resistances[0];
    const condition = (id, description, metric, operator, level) => ({
        id,
        description,
        metric,
        operator,
        ...(level ? { referenceValue: level.price, levelId: level.id } : {}),
        timeframe,
        source: level?.origin || "Motore quantitativo deterministico",
    });
    const confirmationConditions = primary === "bullish"
        ? [
            resistance
                ? condition("confirm-resistance", `Chiusura oltre la resistenza ${resistance.price.toFixed(2)}`, "close", "crosses_above", resistance)
                : condition("confirm-ema20", "Chiusura sopra EMA 20", "close_vs_ema20", "above"),
        ]
        : primary === "bearish"
            ? [
                support
                    ? condition("confirm-support", `Chiusura sotto il supporto ${support.price.toFixed(2)}`, "close", "crosses_below", support)
                    : condition("confirm-ema20", "Chiusura sotto EMA 20", "close_vs_ema20", "below"),
            ]
            : [
                resistance
                    ? condition("confirm-range-up", `Chiusura oltre il limite superiore ${resistance.price.toFixed(2)}`, "close", "crosses_above", resistance)
                    : condition("confirm-direction", "ADX sopra la soglia direzionale", "adx", "above"),
                support
                    ? condition("confirm-range-down", `Chiusura sotto il limite inferiore ${support.price.toFixed(2)}`, "close", "crosses_below", support)
                    : condition("confirm-direction-down", "Pendenza EMA 20 sotto la soglia ribassista", "ema20_slope", "below"),
            ];
    const invalidationConditions = primary === "bullish"
        ? [
            support
                ? condition("invalidate-support", `Chiusura sotto il supporto ${support.price.toFixed(2)}`, "close", "crosses_below", support)
                : condition("invalidate-ema20", "Chiusura sotto EMA 20", "close_vs_ema20", "below"),
        ]
        : primary === "bearish"
            ? [
                resistance
                    ? condition("invalidate-resistance", `Chiusura sopra la resistenza ${resistance.price.toFixed(2)}`, "close", "crosses_above", resistance)
                    : condition("invalidate-ema20", "Chiusura sopra EMA 20", "close_vs_ema20", "above"),
            ]
            : [
                ...(resistance
                    ? [
                        condition("invalidate-range-up", `Chiusura confermata sopra ${resistance.price.toFixed(2)}`, "close", "crosses_above", resistance),
                    ]
                    : []),
                ...(support
                    ? [
                        condition("invalidate-range-down", `Chiusura confermata sotto ${support.price.toFixed(2)}`, "close", "crosses_below", support),
                    ]
                    : []),
            ];
    const signal = (id, description, metric, value) => ({
        id,
        description,
        metric,
        value,
        timeframe,
        source: "Barre chiuse e indicatori del motore quantitativo",
    });
    const supportingSignals = [
        signal("regime", `Regime ${analysis.trend.toLowerCase()}`, "regime", analysis.trend),
        signal("adx", `ADX ${analysis.adx.toFixed(1)}`, "adx", Number(analysis.adx.toFixed(1))),
    ];
    const lastRsi = analysis.indicators.rsi.at(-1) ?? 50, lastMacd = analysis.indicators.macd.at(-1) ?? 0, lastSignal = analysis.indicators.signal.at(-1) ?? 0;
    if ((primary === "bullish" && lastMacd > lastSignal) ||
        (primary === "bearish" && lastMacd < lastSignal) ||
        (primary === "sideways" && analysis.adx < 20))
        supportingSignals.push(signal("momentum", "Momentum coerente con lo scenario", "macd_vs_signal", Number((lastMacd - lastSignal).toFixed(3))));
    const conflictingSignals = [];
    if ((primary === "bullish" && lastRsi < 50) ||
        (primary === "bearish" && lastRsi > 50))
        conflictingSignals.push(signal("rsi-conflict", `RSI ${lastRsi.toFixed(1)} non conferma pienamente la direzione`, "rsi", Number(lastRsi.toFixed(1))));
    if (multiTimeframeStatus === "mixed")
        conflictingSignals.push(signal("mtf-conflict", "I timeframe disponibili non sono concordi", "multi_timeframe", "mixed"));
    const relevantLevels = analysis.levels.map((x) => ({
        levelId: x.id,
        type: x.type,
        price: x.price,
        timeframe: x.timeframe,
        relevance: x.relevance,
        source: x.origin,
    }));
    const age = Date.now() - new Date(meta.lastData).getTime(), limits = {
        "5m": 30 * 60000,
        "15m": 90 * 60000,
        "1h": 6 * 3600000,
        "4h": 24 * 3600000,
        "1D": 4 * 86400000,
        "1W": 14 * 86400000,
        "1M": 45 * 86400000,
    }, stale = age > (limits[timeframe] || 4 * 86400000), status = stale ? "stale" : meta.completeBarsOnly ? "complete" : "partial";
    const labels = {
        bullish: "rialzista",
        bearish: "ribassista",
        sideways: "laterale",
    };
    return {
        primary,
        title: `Scenario ${labels[primary]}`,
        timeframe,
        summary: analysis.scenario,
        confirmationConditions,
        invalidationConditions,
        supportingSignals,
        conflictingSignals,
        relevantLevels,
        multiTimeframeStatus,
        origin: "deterministic",
        provider: meta.provider,
        lastClosedBar: meta.lastData,
        dataQuality: {
            status,
            lastUpdate: meta.lastData,
            notes: [
                meta.status || "Stato del provider non specificato",
                meta.completeBarsOnly
                    ? "Calcolo eseguito esclusivamente su barre chiuse."
                    : "La completezza delle barre non è confermata.",
            ],
        },
    };
}
