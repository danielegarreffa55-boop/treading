# Company Intelligence Plan

## Stato iniziale

Il prodotto disponeva di analisi tecnica multi-asset, scenario, crypto spot e agente, ma non di profilo aziendale o storico di bilancio. Yahoo era già installato e supporta `quoteSummary` e `fundamentalsTimeSeries`.

## Verticale implementata

- identità equity con simbolo, mercato, valuta di quotazione e bilancio;
- profilo verificato dal provider;
- fino a cinque esercizi annuali disponibili;
- ricavi, FCF, debito/cassa, margini, ROE e multipli correnti;
- quality engine deterministico basato su evidenze separate;
- valutazione euristica dichiarata, non fair value;
- sintesi dinamica costruita dalle evidenze strutturate;
- fonti, timestamp, copertura e campi mancanti;
- gate asset class: crypto, ETF e fondi non ricevono metriche aziendali.

Verificati realmente AAPL, MSFT ed ENI.MI. Yahoo ha fornito cinque annuali e sette trimestri, non otto: la UI attuale espone la serie annuale. Peer affidabili, modelli settoriali completi, eventi e notizie restano pianificati.

## Redesign

La shell conserva grafico, scenario e agente. Token quasi neri/grafite e accento lime derivano dai principi del riferimento, non dalla sua composizione. Company usa una gerarchia editoriale, metriche tabulari, evidenze e fonti; mobile passa a navigazione inferiore.

## Rischi e criteri

Yahoo è best-effort e i dati possono essere rettificati. Nessun campo mancante diventa zero. La verticale è accettata solo con build, unit test, E2E, verifica equity/crypto e ispezione screenshot desktop/mobile.
