# Financial AI Analyst

Piattaforma locale incrementale per ricerca e analisi tecnica di azioni, ETF, fondi e crypto spot. Usa **Lightweight Charts** (Apache-2.0), Yahoo Finance e Binance Spot pubblico senza chiavi. Non presenta mai dati demo come reali.

## Avvio Windows

Doppio clic su `Avvia Financial AI Analyst.cmd`. Il launcher verifica Node.js, dipendenze, build, porta e stato del server; apre il browser soltanto quando `/api/health` risponde. Se l’app è già attiva, riapre il browser. Per fermare il server, chiudere la finestra del launcher o premere `Ctrl+C`.

Avvio manuale: `npm.cmd install`, `npm.cmd run build`, `npm.cmd start`.

## Verticale Evidence Ledger

La schermata principale è un **Dossier di ricerca**: conclusione, prove favorevoli, controprove/rischi, prossimo controllo, fonte e timestamp precedono il grafico. **Riesami** conserva nota e scenario per confrontare ciò che si pensava con i dati correnti. Il prodotto resta una beta locale: non è un terminale professionale vendibile e i feed correnti non sono autorizzati per un'offerta commerciale.

## Funzioni MVP

- Autocomplete reale per ticker/nome (ISIN solo se il provider lo risolve)
- OHLCV per 5m, 15m, 1h, 4h aggregato, 1D, 1W e 1M
- Candlestick, volume, EMA 20/50, RSI, MACD
- Supporto/resistenza deterministici e modalità Trading/Investimento
- Motore adattivo con ADX, ATR, Bollinger, pivot clusterizzati, trendline e selezione contestuale
- Confronto multi-timeframe, segnali contrastanti e modalità Auto/Manuale
- Analisi tecnica italiana, volatilità storica, errori espliciti
- Nessuna probabilità finché non esiste un modello validato
- Chat agente contestuale con fallback deterministico senza chiavi
- Annotazioni AI validate: EMA/Bollinger e livelli quantitativi esistenti
- Scenario tecnico strutturato con conferme, invalidazioni, conflitti e qualità dati
- Coppie Binance spot BTC/USDT, ETH/USDT, BTC/EUR, ETH/EUR e SOL/USDT, con storico 24/7 e stato live/fallback
- Pannelli grafici RSI e MACD attivabili manualmente o dall'agente
- Vista Company editoriale con profilo, cinque esercizi annuali, metriche, qualità deterministica, valutazione, sintesi e fonti
- Provider LLM OpenAI-compatible e Ollama opzionali
- Onboarding locale saltellabile e watchlist persistente nel browser, senza account o telemetria remota

## Watchlist e dati locali

Apri uno strumento, scegli **Aggiungi alla watchlist**, scrivi il motivo e usa **Salva scenario** quando vuoi creare uno snapshot. La sezione Watchlist confronta soltanto dati compatibili per identità e timeframe e distingue “Al salvataggio” da “Adesso”. Note, snapshot e preferenze restano nel browser.

Da **Preferenze** puoi riaprire l’onboarding, copiare una scheda feedback beta oppure cancellare esclusivamente le chiavi locali dell’app. La cancellazione non modifica altri dati del browser. Consulta `BETA_GUIDE.md` per una prova con cinque persone.

Lo scenario è specifico per strumento e timeframe, usa barre chiuse e livelli del backend e può evidenziare sul grafico le condizioni associate. Non mostra percentuali previsionali. Dettagli in `SCENARIO_ENGINE.md`.

## Architettura e fonti

Il frontend React/TypeScript riusa `lightweight-charts`. Il backend Express mantiene dati e future chiavi esclusivamente server-side. Il provider iniziale è Yahoo Finance (dati pubblici, copertura/ritardo/termini dipendono dallo strumento); i punti API isolati permettono di aggiungere Twelve Data, EODHD o OpenBB. Cache persistente e Qlib sono pianificati, non dichiarati come presenti.

La chat funziona subito in modalità quantitativa deterministica. Per collegare un LLM, configurare `.env` come descritto in `AI_INTEGRATION.md`. Le azioni sul grafico sono validate e non possono eseguire ordini o inventare livelli.

## Valutazione repository (22 novembre 2026)

- **Kandle**: TypeScript, AGPL-3.0, maturo per chart, disegni/MCP; richiede Node 22.12+. Eccellente riferimento ma incorporarlo imporrebbe AGPL all'intero derivato.
- **OpenStock**: Next.js/MongoDB, AGPL-3.0, molto completo e attivamente mantenuto; più pesante del necessario e dipende da Finnhub/servizi esterni per varie funzioni.
- **Alpha Terminal**: progetto web finanziario più piccolo; utile come riferimento, ma manutenzione/capacità inferiori alle alternative.
- **OpenBB v5**: Python, Apache-2.0 e vasto livello provider, ma installazione pesante; l'organizzazione originaria è in transizione/archiviata. Candidato futuro come adapter.
- **Microsoft Qlib**: Python/MIT, ottimo per ricerca ML/backtest, non per UI o primo MVP. Integrazione futura dopo dataset e validazione out-of-sample.
- **TradingAgents**: Python/Apache-2.0, framework LLM multi-agente; non adatto a produrre segnali quantitativi validati nel primo MVP.
- **Lightweight Charts**: TypeScript/Apache-2.0, attivo, performante e controllabile via API; scelto come dipendenza principale. L'attribuzione TradingView è abilitata nel grafico.

La scelta minimizza gli obblighi copyleft e il peso operativo, riusando il componente grafico ufficiale anziché ricostruirlo. Il progetto è un'integrazione originale, non un fork di Kandle/OpenStock.

## Limiti noti

Yahoo Finance non offre SLA e la copertura intraday varia. I fondi comuni espongono tipicamente solo NAV giornaliero; timeframe intraday falliscono esplicitamente. ISIN e alcuni ETF UCITS possono non essere risolti. Nessuna operazione reale viene eseguita. Configurare provider premium in `.env` quando saranno aggiunti.

Verifica reale eseguita: AAPL, MSFT, ENI.MI e VWCE.DE hanno restituito circa 500 barre giornaliere; VTSAX ha restituito 500 valori NAV. Il ticker europeo del fondo Fidelity `0P00000MJB.F` non è risultato coperto e genera correttamente un errore esplicito.
