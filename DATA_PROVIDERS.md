# Provider dati

## Yahoo Finance — implementato

Azioni, ETF, fondi e altri ticker coperti da Yahoo. Dati best-effort senza SLA; copertura intraday variabile. Nessuna chiave.

## Binance Spot — implementato nella Milestone 1

Market data pubblici per BTC/USDT, ETH/USDT, BTC/EUR, ETH/EUR e SOL/USDT. REST usa `/api/v3/klines`; live usa lo stream kline pubblico. Base asset, quote asset, mercato spot, exchange, unità volume e UTC sono espliciti. USDT non è etichettato come USD.

La candela aperta non entra nel motore. In caso di errore non vengono creati dati sostitutivi. Host alternativo configurabile solo server-side con `BINANCE_API_BASE`.

Provider fondamentali, eventi, notizie e premium sono pianificati.

## Yahoo Company Intelligence — implementazione parziale

Profilo e metriche correnti provengono da `quoteSummary`; lo storico annuale da `fundamentalsTimeSeries`. Verificati AAPL, MSFT ed ENI.MI con cinque annuali; Yahoo ha restituito sette trimestri, che non sono ancora esposti nella UI. La confidenza è `provider`, non `official`.
