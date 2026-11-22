# Data licensing audit

Verifica: 22 novembre 2026. Questo documento non è un parere legale.

| Fonte | Dati/endpoint | Auth | Stato commerciale | Limiti e azione |
|---|---|---|---|---|
| Yahoo tramite `yahoo-finance2` | chart, search, quoteSummary, fundamentalsTimeSeries | nessuna | **beta privata** | libreria non ufficiale; Yahoo non garantisce API/continuità. I termini Yahoo limitano monetizzazione/redistribuzione salvo permesso specifico. Non lanciare a pagamento senza accordo o sostituzione. |
| Binance Spot | `/api/v3/klines`, WebSocket kline | pubblico per market data | **beta privata** | endpoint pubblici documentati; termini generali limitano resale/uso commerciale senza accordo. Chiedere autorizzazione o provider licenziato. |
| Lightweight Charts | rendering locale | nessuna | **commerciale con obblighi** | Apache-2.0, NOTICE e link TradingView richiesti. `attributionLogo:true` è attivo; conservare LICENSE/NOTICE. |
| LLM OpenAI-compatible | spiegazioni strutturate | chiave server | **da approvare per provider/piano** | verificare DPA, retention, regione, costi e termini del provider selezionato. Fallback locale disponibile. |
| Ollama locale | spiegazioni locali | nessuna | **sviluppo/beta** | licenza del modello scelta separatamente; non assumere diritti commerciali dal solo runtime. |

Caching: attualmente memoria breve, nessuna redistribuzione permanente. Prima del commerciale definire per ogni contratto TTL, storage, display, export, attribuzione, territori e fallback. Non usare scraping fragile.

Fonti ufficiali consultate: Yahoo Developer API Terms/Guidelines; Binance Terms e Spot API docs; repository e documentazione Lightweight Charts. La libreria `yahoo-finance2` dichiara esplicitamente di essere non ufficiale.

Decisione: nessun piano a pagamento può dipendere dagli attuali feed finché un legale e il titolare del dato non confermano l’uso o viene integrato un provider commerciale.
