# Miglioramenti implementati — 22 novembre 2026

## Problemi e cause

- Indicatori invarianti: selezione cablata nel frontend e calcolo fisso nel vecchio `analyze`.
- Livelli semplicistici: minimo/massimo della finestra, privi di struttura e metadati.
- Nessun confronto multi-timeframe: una sola richiesta analizzata per risposta.
- Aggregazione 4h difettosa: filtro e slicing operavano su indici non coerenti.
- Ultima candela potenzialmente aperta inclusa nelle conferme.
- Nessuna cache e un solo test automatico.

## Modifiche

- `server/analysis.ts`: ATR, ADX, Bollinger, RSI, MACD, volatilità, volume relativo, slope EMA; regime principale e segnali secondari; selezione adattiva; pivot, cluster, livelli e trendline; scenari qualitativi.
- `server/index.ts`: metadati provider, rimozione candela aperta, corretta aggregazione 4h, cache TTL isolata per `simbolo|timeframe`, confronto Trading 15m/1h/4h/1D e Investimento 1D/1W/1M.
- `src/main.tsx` e `src/style.css`: modalità Auto/Manuale, indicatori scelti e motivazione, livelli con test/rilevanza/origine, trendline, ADX/ATR, divergenze multi-timeframe e provenienza/aggiornamento dati.
- `tests/analysis.test.ts`: 7 test sui casi A–G e divieto di probabilità inventate.
- `AUDIT.md`: audit pre-modifica e stato successivo.

## Definizioni verificabili

- Regime direzionale: ADX ≥ 20, pendenza percentuale EMA20 su 10 barre oltre ±0,5% e posizione coerente del prezzo. In caso contrario il regime è laterale. Sono soglie euristiche dichiarate, comunemente interpretabili, non probabilità.
- Livelli: pivot locali con raggio 3; clustering entro `max(0,55 ATR, 0,3% del prezzo)`.
- Rilevanza 0–100: 55% numero di test (saturazione a 5), 30% recenza, 15% vicinanza entro il 20% dal prezzo. È un ranking, non una probabilità di tenuta.
- Alta volatilità: ATR normalizzato corrente oltre 1,35 volte la media delle ultime 60 barre.
- Compressione: ampiezza Bollinger corrente sotto il 65% della media recente.
- Breakout: chiusura oltre resistenza clusterizzata e volume relativo > 1,25x. La UI avverte di attendere conferma/retest.

## Test e prova reale

- `npm.cmd run build`: superato.
- `npm.cmd test`: 7/7 superati.
- AAPL: USD, NasdaqGS, 500 barre; giornaliero laterale, settimanale/mensile rialzisti.
- MSFT: USD, NasdaqGS, 500 barre; risultati e livelli diversi da AAPL.
- ENI.MI: EUR, Milan, 504 barre; divergenza giornaliero/settimanale/mensile rilevata.
- VWCE.DE: EUR, XETRA, 503 barre.
- VTSAX: USD, fondo/NAV giornaliero, 500 osservazioni.
- Ricerca ISIN `IE00BK5BQT80`: risolta dal provider come `VWRA.L`; `US9229087286`: risolta come VTSAX.
- Limite di ambiguità: la ricerca generica `ENI` restituisce prima `E` su NYSE; occorre selezionare esplicitamente `ENI.MI` per Milano. La UI mostra borsa e simbolo.
- Seconda richiesta identica AAPL/1D: cache hit; i test dimostrano isolamento tra simboli e timeframe.

## Funzionalità ancora mancanti

- Un vero LLM provider-agnostic: attualmente la spiegazione è deliberatamente deterministica.
- Mapping ISIN/ticker/borsa persistente e provider con SLA.
- Cache persistente SQLite e gestione distribuita dei rate limit.
- Validazione quantitativa walk-forward delle soglie e modello probabilistico calibrato.
- Retest formalizzato, regressione robusta delle trendline e backtesting dei segnali.
- Test browser visuale automatico; i valori temporali dei disegni sono coperti da unit test.

## Avvio Windows

Doppio clic su `Avvia Financial AI Analyst.cmd`, oppure:

```powershell
npm.cmd run build
npm.cmd start
```

Aprire `http://localhost:8000`. Nessuna chiave API è richiesta; Yahoo Finance resta un provider best-effort senza SLA.

## Fase 6 — scenario tecnico

- Rimosso il vecchio riquadro sulla probabilità non calibrata e rimossa la relativa proprietà dal motore.
- Aggiunto `TechnicalScenario`, calcolato dal backend su barre chiuse, con conferme, invalidazioni, segnali favorevoli/contrari, livelli e qualità dati.
- Stato multi-timeframe esplicito: concorde, misto o non disponibile.
- Livelli di scenario mostrabili e nascondibili; invalidazioni evidenziate distintamente e annotate senza semantica di ordine.
- Cambio simbolo, timeframe o modalità pulisce tutte le annotazioni.
- Agente deterministico aggiornato per spiegare l'oggetto calcolato senza inventare prezzi o condizioni.

## Master plan — Milestone 1

- Adapter Binance Spot pubblico con cinque coppie iniziali, metadati base/quote e identità cache completa.
- Timeframe crypto 1m–1W, bucket UTC, annualizzazione 24/7 e candela corrente esclusa dal motore.
- Stream kline live nel browser con deduplicazione, cleanup, reconnect esponenziale e fallback REST dichiarato.
- Pannelli RSI e MACD con linee di riferimento, istogramma e sincronizzazione temporale tra pannelli.
- Preferenze pannelli salvate nel browser e azioni agente show/hide operative.
- Launcher aggiornato per rigenerare sempre la build ed evitare artefatti obsoleti.

## Company Intelligence e redesign editoriale

- Endpoint Company Yahoo con identità equity, profilo, cinque annuali, metriche correnti, quality engine, valutazione limitata, fonti e copertura.
- Gate per asset class: crypto, ETF e fondi non ricevono metriche aziendali.
- Vista Company responsive, shell laterale/bottom navigation, token grafite/lime e `prefers-reduced-motion`.
- Agente deterministico esteso a qualità, valutazione, rischi e caso di attesa.
- Screenshot desktop/mobile ispezionati e autocomplete iniziale corretto dopo la verifica visiva.

## Fase 4 — UX/UI e guida didattica

- Autocomplete rifattorizzato con Floating UI: portal, flip sopra/sotto, shift nel viewport, dimensionamento adattivo e aggiornamento su scroll/resize.
- Navigazione completa da tastiera, Escape, click esterno, risultato attivo, debounce e annullamento richieste obsolete.
- Tasto **Info** aggiunto in alto a destra con glossario ricercabile, esempi, formule/logiche e limiti.
- Tooltip contestuali focalizzabili per indicatori, livelli, rilevanza e multi-timeframe.
- Motivazione delle scelte automatiche e della rilevanza dei livelli resa più evidente.
- Pannello analisi, origine dati, card tecniche e responsive layout rifiniti.
- Dettagli e scelte delle librerie documentati in `UX_IMPROVEMENTS.md`.
