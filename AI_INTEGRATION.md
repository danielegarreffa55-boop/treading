# Integrazione AI — Fase 5

## Architettura

Il motore quantitativo resta la fonte di verità. L'agente non legge screenshot e non calcola prezzi: il backend ricostruisce il contesto da Yahoo Finance e da `server/analysis.ts` per ogni domanda.

Dalla Fase 6 il contesto include anche `TechnicalScenario`: scenario prevalente, conferme, invalidazioni, segnali favorevoli e contrari, livelli, stato multi-timeframe e qualità dati. Il provider deterministico spiega direttamente questo oggetto. Le azioni sulle invalidazioni usano esclusivamente `levelId` già presenti nel backend e sono sottoposte alla stessa validazione Zod degli altri livelli.

Per domande su stabilità, fondamentali, valutazione, rischi o attesa, il backend aggiunge Company Intelligence verificata al contesto. Il fallback deterministico cita evidenze, copertura e fonti disponibili; non inventa peer o metriche mancanti.

Flusso:

1. Il frontend riceve `contextId = simbolo|timeframe|ultimo dato` dal grafico.
2. `POST /api/ai/chat` ricarica i dati server-side e rifiuta con HTTP 409 un contesto non più corrente.
3. Il provider AI riceve solo dati strutturati e un contesto ridotto; le serie complete degli indicatori non vengono inviate al modello.
4. La risposta JSON è validata con Zod.
5. I livelli richiesti sono confrontati con gli ID degli oggetti calcolati dal backend. Coordinate inventate vengono scartate.
6. Il frontend applica azioni reversibili e le etichetta in viola come annotazioni AI.

## Provider AI

- `deterministic` — predefinito, senza chiavi. Interpreta le richieste principali e spiega i dati quantitativi.
- `openai-compatible` — endpoint `/chat/completions` compatibile OpenAI. Richiede `AI_API_KEY`, `AI_BASE_URL` opzionale e `AI_MODEL`.
- `ollama` — usa l'endpoint OpenAI-compatible locale di Ollama, predefinito `http://127.0.0.1:11434/v1`.

In caso di timeout o errore di un LLM configurato, il sistema passa al motore deterministico e mostra chiaramente il fallback. Non è stata eseguita una chiamata LLM reale perché non erano disponibili credenziali o un server Ollama; il percorso è testato tramite interfacce e fallback.

### Configurazione

Copia `.env.example` in `.env`. Esempio OpenAI-compatible:

```env
AI_PROVIDER=openai-compatible
AI_BASE_URL=https://api.openai.com/v1
AI_API_KEY=la_tua_chiave
AI_MODEL=gpt-4.1-mini
```

Esempio Ollama:

```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://127.0.0.1:11434/v1
AI_MODEL=llama3.2
```

Le variabili sono lette solo dal server. Nessuna chiave è inclusa nelle risposte o nel bundle frontend.

## Strumenti e azioni disponibili

Le funzioni di lettura sono realizzate dal contesto server:

- contesto strumento e metadati;
- storico OHLCV/NAV;
- indicatori tecnici;
- analisi multi-timeframe;
- supporti, resistenze e trendline.

Azioni grafiche validate:

- `showIndicator`: EMA20, EMA50, EMA200, Bollinger, RSI, MACD, ADX, ATR;
- `hideIndicator`;
- `showTechnicalLevel`, esclusivamente con `levelId` generato dal backend;
- `clearAIAnnotations`.

L'MVP disegna sul grafico principale EMA e Bollinger; RSI/MACD/ADX/ATR restano metriche/pannelli esistenti. Nessuna azione può eseguire codice, terminale, HTTP arbitrario o ordini finanziari.

## Validazione e sicurezza

- Zod limita tipo, numero e dimensione delle azioni.
- Un livello ha ID deterministico `tipo:prezzo:timeframe` e deve esistere nel contesto corrente.
- Ogni risposta include lo stesso `contextId`; il frontend ignora contesti superati.
- Le richieste in corso sono annullate al cambio di strumento/timeframe.
- Timeout configurabile, body Express limitato a 64 KB e domanda massima 2.000 caratteri.
- Rate limit minimo applicato alle sole chiamate LLM; il fallback locale rimane fluido.
- Nessuna probabilità, rendimento o conferma futura viene inventata.

## Provider finanziari

`server/providers.ts` introduce `FinancialDataProvider`. Yahoo è l'adapter attivo. Twelve Data ed EODHD sono esposti come configurazioni opzionali ma non effettuano chiamate finché gli adapter e le chiavi non sono completati; nessun dato demo sostituisce dati mancanti.

## Decisioni sulle librerie

- Vercel AI SDK non integrato: per due endpoint compatibili bastano interfacce TypeScript e `fetch`, con minore superficie e dipendenze.
- Ollama supportato tramite API OpenAI-compatible, senza SDK aggiuntivo.
- Kandle non incorporato: offre strumenti grafici/MCP utili ma è AGPL-3.0 e implicherebbe un'integrazione/copyleft più ampia. Le azioni locali sono molto più ristrette e validate.
- Zod è l'unica nuova dipendenza runtime dedicata all'agente.

## Test

- Unit test Vitest: fallback senza modello, show/hide, rifiuto di ordini, scarto livelli inventati, isolamento contesti e limiti schema.
- Playwright Chromium: AAPL → richiesta EMA200 → annotazione visibile → richiesta livelli → livelli validati → cambio MSFT → contesto aggiornato e pulizia annotazioni.
- Il test LLM remoto reale non è eseguito senza credenziali; non viene dichiarato come verificato.

## Limiti e prossime evoluzioni

- Implementare veri adapter Twelve Data/EODHD e routing per copertura.
- Aggiungere pane separati comandabili per RSI e MACD.
- Rendere persistente la conversazione solo se esplicitamente richiesto, con isolamento per contesto.
- Supportare tool-calling nativo dei provider mantenendo la validazione locale.
- Aggiungere mock HTTP del provider compatibile per testare timeout, JSON malformato e concorrenza senza rete.
