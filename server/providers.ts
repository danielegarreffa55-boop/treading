import YahooFinance from'yahoo-finance2';
export type InstrumentSearch={symbol:string;name:string;exchange:string;type:string;exchangeCode?:string};
export interface FinancialDataProvider{id:string;search(query:string):Promise<InstrumentSearch[]>;chart(symbol:string,options:any):Promise<any>}
export class YahooProvider implements FinancialDataProvider{id='yahoo';private client=new YahooFinance({suppressNotices:['yahooSurvey']});async search(q:string){const out=await this.client.search(q,{quotesCount:10,newsCount:0});return out.quotes.filter((x:any)=>['EQUITY','ETF','MUTUALFUND','INDEX'].includes(x.quoteType)).map((x:any)=>({symbol:x.symbol,name:x.longname||x.shortname||x.symbol,exchange:x.exchDisp||x.exchange,type:x.typeDisp||x.quoteType,exchangeCode:x.exchange}))}chart(symbol:string,options:any){return this.client.chart(symbol,options)}}
export const dataProvider:FinancialDataProvider=new YahooProvider();
export const optionalProviders={twelveData:{configured:!!process.env.TWELVE_DATA_API_KEY,status:'adapter previsto; non attivo in questo MVP'},eodhd:{configured:!!process.env.EODHD_API_KEY,status:'adapter previsto; non attivo in questo MVP'}};
