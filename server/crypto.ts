import {z} from 'zod';
import type {Bar} from './analysis.js';

export const cryptoPairs=[
 {symbol:'BTC/USDT',baseAsset:'BTC',quoteAsset:'USDT'},
 {symbol:'ETH/USDT',baseAsset:'ETH',quoteAsset:'USDT'},
 {symbol:'BTC/EUR',baseAsset:'BTC',quoteAsset:'EUR'},
 {symbol:'ETH/EUR',baseAsset:'ETH',quoteAsset:'EUR'},
 {symbol:'SOL/USDT',baseAsset:'SOL',quoteAsset:'USDT'}
] as const;
export type CryptoPair=(typeof cryptoPairs)[number];
export const CryptoTimeframe=z.enum(['1m','5m','15m','1h','4h','1D','1W']);
const intervalMap:Record<z.infer<typeof CryptoTimeframe>,string>={'1m':'1m','5m':'5m','15m':'15m','1h':'1h','4h':'4h','1D':'1d','1W':'1w'};
const Kline=z.tuple([z.number(),z.string(),z.string(),z.string(),z.string(),z.string(),z.number(),z.string(),z.number(),z.string(),z.string(),z.string()]);
export function normalizePair(value:string){return value.trim().toUpperCase().replace(/[-_]/g,'/');}
export function findCryptoPair(value:string){const normalized=normalizePair(value);return cryptoPairs.find(x=>x.symbol===normalized);}
export function binanceSymbol(value:string){const pair=findCryptoPair(value);if(!pair)throw new Error(`Coppia spot non supportata: ${value}`);return`${pair.baseAsset}${pair.quoteAsset}`;}
export function normalizeKlines(raw:unknown,now=Date.now()){const rows=z.array(Kline).parse(raw),closed:Bar[]=[],current:Bar[]=[];for(const x of rows){const bar={time:Math.floor(x[0]/1000),open:Number(x[1]),high:Number(x[2]),low:Number(x[3]),close:Number(x[4]),volume:Number(x[5])};(x[6]<now?closed:current).push(bar)}return{closedBars:closed,currentBar:current.at(-1),lastCloseTime:rows.at(-1)?.[6]};}
export function cryptoCacheKey(pair:string,timeframe:string,dataType='bars'){return['binance','crypto','spot','BINANCE',binanceSymbol(pair),timeframe,dataType].join('|')}
export async function loadBinanceSpot(pairValue:string,timeframeValue:string,fetcher:typeof fetch=fetch){const pair=findCryptoPair(pairValue);if(!pair)throw new Error(`Coppia spot non supportata: ${pairValue}`);const timeframe=CryptoTimeframe.parse(timeframeValue),symbol=binanceSymbol(pair.symbol),url=new URL('/api/v3/klines',process.env.BINANCE_API_BASE||'https://api.binance.com');url.searchParams.set('symbol',symbol);url.searchParams.set('interval',intervalMap[timeframe]);url.searchParams.set('limit','500');const response=await fetcher(url,{signal:AbortSignal.timeout(10000)});if(!response.ok)throw new Error(`Binance REST HTTP ${response.status}`);const normalized=normalizeKlines(await response.json());if(normalized.closedBars.length<20)throw new Error('Storico crypto insufficiente');return{...normalized,meta:{provider:'Binance Spot',providerId:'binance',assetClass:'crypto',baseAsset:pair.baseAsset,quoteAsset:pair.quoteAsset,currency:pair.quoteAsset,exchange:'Binance',marketType:'spot',instrumentType:'CRYPTO_SPOT',marketStatus:'24/7',volumeUnit:pair.baseAsset,timezone:'UTC',completeBarsOnly:true,status:'Dati spot pubblici Binance; candela live esclusa dalle conferme',demo:false,streamUrl:`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${intervalMap[timeframe]}`}};}
export function searchCrypto(query:string){const q=normalizePair(query);return cryptoPairs.filter(x=>!q||x.symbol.includes(q)||`${x.baseAsset}${x.quoteAsset}`.includes(q.replace('/',''))).map(x=>({symbol:x.symbol,name:`${x.baseAsset} / ${x.quoteAsset}`,exchange:'Binance',type:'Crypto spot',assetClass:'crypto',baseAsset:x.baseAsset,quoteAsset:x.quoteAsset,marketType:'spot',provider:'Binance Spot'}));}
