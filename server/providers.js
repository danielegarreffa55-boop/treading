import YahooFinance from 'yahoo-finance2';
export class YahooProvider {
    id = 'yahoo';
    client = new YahooFinance({ suppressNotices: ['yahooSurvey'] });
    async search(q) { const out = await this.client.search(q, { quotesCount: 10, newsCount: 0 }); return out.quotes.filter((x) => ['EQUITY', 'ETF', 'MUTUALFUND', 'INDEX'].includes(x.quoteType)).map((x) => ({ symbol: x.symbol, name: x.longname || x.shortname || x.symbol, exchange: x.exchDisp || x.exchange, type: x.typeDisp || x.quoteType, exchangeCode: x.exchange, providerId: 'yahoo', providerSymbol: x.symbol, assetClass: String(x.quoteType || 'unknown').toLowerCase() })); }
    chart(symbol, options) { return this.client.chart(symbol, options); }
}
export const dataProvider = new YahooProvider();
export const optionalProviders = { twelveData: { configured: !!process.env.TWELVE_DATA_API_KEY, status: 'adapter previsto; non attivo in questo MVP' }, eodhd: { configured: !!process.env.EODHD_API_KEY, status: 'adapter previsto; non attivo in questo MVP' } };
