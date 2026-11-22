import { describe, it, expect } from 'vitest';
import { assessCompany } from '../server/fundamentals.js';
const row = (period, revenue, freeCashFlow, netIncome, netDebt) => ({ period, revenue, freeCashFlow, netIncome, netDebt });
describe('company quality engine', () => {
    it('usa evidenze scomponibili per una società stabile', () => { const x = assessCompany([row('2024', 100, 20, 15, 10), row('2025', 115, 24, 18, 8)], { currency: 'EUR' }); expect(x.overall).toBe('strong'); expect(x.strengths.map(e => e.label)).toEqual(expect.arrayContaining(['Ricavi in crescita', 'Free cash flow positivo', 'Margine netto'])); });
    it('rileva deterioramento senza trasformare mancanti in zero', () => { const x = assessCompany([row('2024', 100, 15, 12, 10), row('2025', 80, -3, -4, 30)], { currency: 'EUR' }); expect(x.overall).toBe('weak'); expect(x.weaknesses.length).toBeGreaterThanOrEqual(3); });
    it('dichiara dati insufficienti', () => expect(assessCompany([row('2025', 100, 10, 5, 2)], { currency: 'USD' }).overall).toBe('insufficient_data'));
    it('gestisce divisione per zero senza valori infiniti', () => { const x = assessCompany([row('2024', 0, 1, 1, 1), row('2025', 10, 2, 2, 1)], { currency: 'USD' }); expect(JSON.stringify(x)).not.toMatch(/Infinity|NaN/); });
});
