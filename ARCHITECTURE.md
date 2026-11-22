# Architettura

Stato al 22 novembre 2026.

- `src/`: React, Lightweight Charts, ricerca, grafico, pannelli RSI/MACD, scenario e agente.
- `server/index.ts`: API Express, routing provider, cache in memoria e composizione del contesto.
- `server/providers.ts`: adapter Yahoo per strumenti tradizionali.
- `server/crypto.ts`: adapter Binance Spot pubblico e normalizzazione crypto.
- `server/analysis.ts`: indicatori e scenario deterministico; calendario exchange o 24/7.
- `server/ai.ts`: azioni Zod e provider deterministico/LLM opzionale.
- `server/fundamentals.ts`: profilo, serie annuali, metriche, quality/valuation e fonti Yahoo.
- `src/CompanyPanel.tsx`: verticale Company.
- `src/research-terminal.css`: token e composizione Research Terminal; sovrascrive in modo incrementale gli stili legacy.
- `UI_ARCHITECTURE.md`: gerarchia della shell, flusso di stato e piano di estrazione componenti.

Il frontend non riceve credenziali. Le barre chiuse alimentano analisi e scenario; la candela Binance corrente resta separata e il WebSocket browser aggiorna soltanto prezzo/stato live. La cache crypto include provider, asset class, mercato, exchange, coppia, timeframe e tipo dato. SQLite e la suddivisione API in moduli sono pianificati, non implementati.
