# Motore dello scenario tecnico

## Struttura

`TechnicalScenario` è calcolato nel backend per simbolo e timeframe. Contiene scenario prevalente (`bullish`, `bearish`, `sideways`), riepilogo, conferme, invalidazioni, segnali favorevoli e contrari, livelli rilevanti, stato multi-timeframe, provider, ultima barra chiusa e qualità dei dati. Condizioni e livelli conservano `timeframe`, sorgente e un `levelId` deterministico.

## Regole quantitative

Il regime usa esclusivamente barre chiuse. Un trend richiede ADX almeno 20, pendenza EMA20 su dieci barre oltre ±0,5% e prezzo dalla parte coerente della media. Negli altri casi lo scenario è laterale. RSI, MACD, ATR normalizzato, volume relativo, Bande di Bollinger e cluster di pivot forniscono segnali di supporto o conflitto. Le soglie sono euristiche trasparenti, non probabilità.

## Conferme e invalidazioni

- Rialzista: conferma mediante chiusura oltre resistenza (o recupero EMA20 se manca un livello); invalidazione sotto il supporto.
- Ribassista: regole inverse, con chiusura sotto supporto e invalidazione sopra resistenza.
- Laterale: uscita confermata dai limiti calcolati del range; la stessa uscita invalida la permanenza nel range.

Un massimo/minimo intraday non viene trattato come breakout confermato. I livelli provengono soltanto dai cluster del backend e nessun LLM può crearne di nuovi.

## Grafico e agente

Le condizioni dotate di `levelId` possono essere mostrate, nascoste o evidenziate come invalidazioni. Le azioni sono reversibili e vengono pulite al cambio di simbolo, timeframe o modalità. Lo stile di invalidazione non rappresenta un ordine stop-loss.

Lo scenario strutturato entra nel contesto dell'agente. Il provider deterministico risponde su scenario, conferme, invalidazioni, conflitti e multi-timeframe senza chiavi. Le risposte LLM e le azioni restano validate con Zod; gli ID non presenti nel contesto corrente vengono scartati.

## Qualità e limiti

La qualità è `complete`, `partial` o `stale` in base a completezza dichiarata e aggiornamento compatibile con il timeframe. Yahoo Finance resta best-effort. Lo scenario non è consulenza, non garantisce risultati e non attribuisce percentuali previsionali. Un modello probabilistico richiede dataset, backtesting e validazione walk-forward.

## Test eseguiti

Verifica finale del 22 novembre 2026:

- `npm.cmd run build`: superato.
- `npm.cmd test`: 3 file, 18 test superati.
- `npm.cmd run test:e2e`: 1 test Chromium superato.

La suite copre scenari direzionali e laterali, coerenza degli ID, conflitti multi-timeframe, assenza di probabilità previsionali, validazione agente, cambio contesto e pulizia annotazioni. Il primo tentativo E2E aveva riutilizzato un server locale precedente; la configurazione usa ora una porta di test isolata e avvia sempre il server della build corrente.

## Prossime priorità

1. Pannelli grafici completi RSI e MACD.
2. Scheda fondamentale.
3. Calendario risultati, dividendi ed eventi.
4. Notizie contestuali.
5. Backtesting dei segnali.
6. Modello probabilistico validato con walk-forward testing.

