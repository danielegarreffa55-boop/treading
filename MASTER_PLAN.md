# Master implementation plan

Aggiornato il 22 novembre 2026. Questo documento distingue lo stato reale dal piano; non implica che le milestone future siano già operative.

## Stato attuale

Implementato: applicazione locale React/Express, ricerca Yahoo, OHLCV/NAV, motore quantitativo, supporti/resistenze, trendline, analisi multi-timeframe, scenario tecnico, agente contestuale con fallback deterministico, annotazioni validate, glossario, Vitest, Playwright e launcher Windows.

Debito tecnico osservato:

- frontend concentrato in `src/main.tsx` e backend API concentrato in `server/index.ts`;
- diversi confini dati usano ancora `any`;
- cache solo in memoria e chiave non ancora completa di provider/asset class/exchange;
- nessuna persistenza SQLite;
- nessun logging strutturato o pagina diagnostica;
- assenza di error boundary e mock provider E2E;
- file JavaScript/dichiarazioni generati accanto ai sorgenti TypeScript;
- directory priva di metadati Git, quindi non è possibile distinguere modifiche storiche dell'utente tramite `git status`.

## Ordine e dipendenze

1. **Milestone 1:** provider crypto spot e dati live; pannelli RSI/MACD sincronizzati. Stabilisce il modello multi-asset e il rendering indicatori.
2. **Milestone 2:** SQLite versionato, watchlist e alert. Dipende da identità strumento/provider stabili.
3. **Milestone 3:** screener server-side. Dipende da cache, persistenza e normalizzazione.
4. **Milestone 4:** backtesting senza look-ahead. Dipende da storico normalizzato e strategie tipizzate minime.
5. **Milestone 5:** Strategy Builder. Riusa schema backtest/screener/alert.
6. **Milestone 6:** fondamentali, eventi e notizie tramite provider astratti.
7. **Milestone 7:** portafoglio locale e conversioni valutarie dichiarate.
8. **Milestone 8:** diario, report e memoria controllata.
9. **Milestone 9:** workflow Opportunità end-to-end.

Non è prevista una riorganizzazione massiva: i moduli vengono estratti solo quando diventano operativi e testati.

## Criteri di accettazione Milestone 1

- coppie Binance spot BTC/USDT, ETH/USDT, BTC/EUR, ETH/EUR e SOL/USDT ricercabili senza chiavi;
- OHLCV reale, metadati base/quote/exchange/spot e timeframe 1m–1W;
- bucket UTC, annualizzazione crypto a 365 giorni ed esclusione della candela aperta dalle conferme;
- prezzo/candela live separati dall'analisi, connessione WebSocket con reconnect, deduplicazione e cleanup;
- fallback REST esplicito quando live non disponibile;
- pannelli RSI e MACD reali, sincronizzati temporalmente, attivabili manualmente o dall'agente;
- nessuna contaminazione al cambio contesto;
- build, Vitest e Playwright verdi su porta isolata; launcher invariato.

## Rischi

- Binance può essere indisponibile per area geografica o soggetto a rate limit; nessun dato sintetico lo sostituisce.
- Il browser può bloccare WebSocket per rete/proxy; il REST resta disponibile con stato dichiarato.
- I ticker concatenati richiedono metadati exchange per distinguere base e quote.
- Stablecoin e valute fiat restano etichettate distintamente.
- Le preferenze browser non sono ancora una persistenza applicativa multiutente.

## Provider e credenziali

- Yahoo Finance: operativo, nessuna chiave, best-effort.
- Binance Spot pubblico: pianificato nella Milestone 1, nessuna chiave per market data pubblici.
- LLM OpenAI-compatible/Ollama: opzionale; l'app funziona senza LLM.
- Fondamentali, eventi, notizie, email/Telegram e provider premium: pianificati; possono richiedere credenziali server-side e consenso.

## Registro milestone

| Milestone | Stato | Verifica |
|---|---|---|
| 1 — Crypto spot + RSI/MACD | Parzialmente completata: verticale operativa | Build, 27 unit test, E2E e smoke Binance/API superati; mock WS e crosshair col grafico principale restano pianificati |
| 2 — SQLite + watchlist + alert | Pianificata | Non eseguita |
| 3 — Screener | Pianificata | Non eseguita |
| 4 — Backtesting | Pianificata | Non eseguita |
| 5–9 | Pianificate | Non eseguite |

## Verticale Company Intelligence

Parzialmente implementata: profilo, storico annuale, metriche, qualità, valutazione euristica, sintesi da evidenze, fonti, agente e redesign responsive. Verificati AAPL, MSFT ed ENI.MI dal provider. Peer, modelli settoriali, trimestrali UI, eventi e notizie restano pianificati e non sono dichiarati operativi.
