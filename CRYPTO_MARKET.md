# Crypto market

Implementazione iniziale: Binance spot, timeframe 1m, 5m, 15m, 1h, 4h, 1D e 1W, storico OHLCV reale e live kline. Il motore usa calendario 24/7 e annualizzazione coerente con 365 giorni.

Il WebSocket applica deduplicazione per event time, cleanup al cambio contesto e reconnect esponenziale fino a 30 secondi. Se non disponibile, la UI dichiara `REST fallback`; non tratta il dato REST come live. La candela corrente non modifica scenario, conferme o invalidazioni.

Funding, open interest, liquidazioni, futures basis, dominance e confronti cross-exchange non sono implementati e non vengono mostrati.

Verificato realmente il 22 novembre 2026: BTC/USDT giornaliero ha restituito 499 barre chiuse e una candela corrente dall'endpoint Binance pubblico. Gli altri simboli sono coperti da test di mapping/normalizzazione, ma non sono stati tutti interrogati in rete nella verifica finale.
