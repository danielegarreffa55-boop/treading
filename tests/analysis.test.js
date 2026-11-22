import { describe, it, expect } from 'vitest';
import { analyze, buildTechnicalScenario, levels } from '../server/analysis.js';
import { aggregate4h, cacheGet, cacheSet } from '../server/index.js';
const series = (kind, base = 100, n = 240) => Array.from({ length: n }, (_, i) => { const drift = kind === 'up' ? i * .35 : kind === 'down' ? -i * .25 : Math.sin(i / 4) * 2, close = base + drift; return { time: 1700000000 + i * 86400, open: close - .2, high: close + 1, low: close - 1, close, volume: 1000 + (i % 9) * 50 }; });
describe('motore adattivo', () => {
    it('A/D: serie diverse ricalcolano indicatori, livelli e regimi', () => { const up = analyze(series('up'), 'investment', '1D'), down = analyze(series('down'), 'investment', '1D'); expect(up.trend).toBe('Rialzista'); expect(down.trend).toBe('Ribassista'); expect(up.indicators.ema20.at(-1)).not.toBe(down.indicators.ema20.at(-1)); expect(up.support).not.toBe(down.support); });
    it('C: distingue trend e laterale', () => { expect(analyze(series('up'), 'trading').trend).toBe('Rialzista'); expect(analyze(series('down'), 'trading').trend).toBe('Ribassista'); expect(analyze(series('flat'), 'trading').trend).toBe('Laterale'); });
    it('B: aggregazione 4h conserva OHLCV corretto', () => { const q = [0, 1, 2, 3].map(i => ({ date: new Date(Date.UTC(2026, 0, 2, 8 + i)), open: 10 + i, high: 12 + i, low: 9 + i, close: 11 + i, volume: 100 })); const x = aggregate4h(q); expect(x).toHaveLength(1); expect(x[0]).toMatchObject({ open: 10, high: 15, low: 9, close: 14, volume: 400 }); });
    it('E: cache isola simbolo e timeframe', () => { cacheSet('AAPL|1D', { id: 1 }); cacheSet('MSFT|1D', { id: 2 }); cacheSet('AAPL|1W', { id: 3 }); expect(cacheGet('AAPL|1D').id).toBe(1); expect(cacheGet('MSFT|1D').id).toBe(2); expect(cacheGet('AAPL|1W').id).toBe(3); });
    it('F: rifiuta serie corte', () => { expect(() => analyze(series('up', 100, 10), 'trading')).toThrow(/20 barre/); });
    it('G: livelli e trendline usano tempi presenti nei dati', () => { const b = series('flat'), a = analyze(b, 'trading', '1D'), times = new Set(b.map(x => x.time)); expect(a.trendlines.every((x) => times.has(x.start.time) && times.has(x.end.time))).toBe(true); expect(levels(b, '1D').every(x => x.firstTime <= x.lastTime && x.relevance >= 0 && x.relevance <= 100)).toBe(true); });
    it('crea scenari rialzista e ribassista con condizioni inverse', () => { for (const [kind, primary] of [['up', 'bullish'], ['down', 'bearish']]) {
        const a = analyze(series(kind), 'investment', '1D'), s = buildTechnicalScenario(a, '1D', [{ timeframe: '1D', trend: a.trend }, { timeframe: '1W', trend: a.trend }], { provider: 'test', lastData: new Date().toISOString(), completeBarsOnly: true });
        expect(s.primary).toBe(primary);
        expect(s.confirmationConditions.length).toBeGreaterThan(0);
        expect(s.invalidationConditions.length).toBeGreaterThan(0);
        expect(s.multiTimeframeStatus).toBe('aligned');
    } });
    it('scenario laterale è delimitato da livelli backend e mostra conflitti', () => { const a = analyze(series('flat'), 'trading', '1D'), s = buildTechnicalScenario(a, '1D', [{ timeframe: '1D', trend: 'Laterale' }, { timeframe: '1W', trend: 'Rialzista' }], { provider: 'test', lastData: new Date().toISOString(), completeBarsOnly: true }); expect(s.primary).toBe('sideways'); expect(s.multiTimeframeStatus).toBe('mixed'); expect(s.conflictingSignals.some(x => x.metric === 'multi_timeframe')).toBe(true); const ids = new Set(a.levels.map(x => x.id)); expect(s.relevantLevels.every(x => ids.has(x.levelId))).toBe(true); expect([...s.confirmationConditions, ...s.invalidationConditions].filter(x => x.levelId).every(x => ids.has(x.levelId))).toBe(true); });
    it('non espone probabilità previsionali e usa barre chiuse dichiarate', () => { const a = analyze(series('up'), 'investment'), s = buildTechnicalScenario(a, '1D', [], { provider: 'test', lastData: new Date().toISOString(), completeBarsOnly: true }); expect(a).not.toHaveProperty('probability'); expect(JSON.stringify(s)).not.toMatch(/\d+%/); expect(s.dataQuality.notes.join(' ')).toMatch(/barre chiuse/i); });
});
