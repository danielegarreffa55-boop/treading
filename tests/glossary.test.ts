import{describe,it,expect}from'vitest';import{findGlossary,glossary}from'../src/glossary.js';
describe('guida didattica',()=>{
 it('copre i concetti mostrati nell’interfaccia',()=>{for(const term of['ATR','ADX','RSI','MACD','RMA','Bande di Bollinger','Pivot locale (raggio 3)','Cluster di pivot','Volume relativo','Trendline','Supporto e resistenza','Breakout','Compressione di volatilità','Multi-timeframe','Scenario qualitativo'])expect(glossary.some(x=>x.term===term)).toBe(true)});
 it('associa le etichette degli indicatori alle spiegazioni',()=>{expect(findGlossary('RSI 14')?.term).toBe('RSI');expect(findGlossary('Bollinger Bands 20,2')?.term).toBe('Bande di Bollinger');expect(findGlossary('ADX 14')?.term).toBe('ADX')});
 it('chiarisce che la rilevanza non è una probabilità',()=>expect(findGlossary('Rilevanza del livello')?.short).toContain('non è una probabilità'));
});
