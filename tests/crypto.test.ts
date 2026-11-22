import{describe,it,expect}from'vitest';import{binanceSymbol,cryptoCacheKey,findCryptoPair,normalizeKlines,searchCrypto}from'../server/crypto.js';import{analyze,type Bar}from'../server/analysis.js';
const k=(open:number,close:number)=>[open,'100','110','90','105','12',close,'1260',4,'6','630','0'];
describe('Binance spot normalization',()=>{
 it.each(['BTC/USDT','ETH/USDT','BTC/EUR','ETH/EUR','SOL/USDT'])('normalizza %s come coppia spot',pair=>{expect(findCryptoPair(pair)?.symbol).toBe(pair);expect(binanceSymbol(pair)).toBe(pair.replace('/',''));expect(searchCrypto(pair)[0]).toMatchObject({symbol:pair,marketType:'spot',provider:'Binance Spot'})});
 it('separa barre chiuse e candela corrente',()=>{const now=1700001000000,x=normalizeKlines([k(1699990000000,1699990060000),k(1700000900000,1700001060000)],now);expect(x.closedBars).toHaveLength(1);expect(x.currentBar?.time).toBe(1700000900)});
 it('isola cache per provider, mercato, coppia e timeframe',()=>{expect(cryptoCacheKey('BTC/USDT','1h')).not.toBe(cryptoCacheKey('ETH/USDT','1h'));expect(cryptoCacheKey('BTC/USDT','1h')).not.toBe(cryptoCacheKey('BTC/USDT','4h'));expect(cryptoCacheKey('BTC/USDT','1h')).toContain('binance|crypto|spot')});
 it('annualizza il mercato 24/7 su 365 giorni',()=>{const bars:Bar[]=Array.from({length:60},(_,i)=>({time:1700000000+i*86400,open:100+i,high:102+i,low:99+i,close:101+i+(i%2),volume:10}));expect(analyze(bars,'trading','1D','24x7').volatility).toBeGreaterThan(analyze(bars,'trading','1D','exchange-session').volatility)});
});
