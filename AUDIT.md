# Audit tecnico iniziale — 22 novembre 2026

## Architettura osservata

- Frontend React/TypeScript in `src/main.tsx`, grafici tramite `lightweight-charts` (Apache-2.0).
- Backend Express/TypeScript in `server/index.ts`.
- Provider unico: `yahoo-finance2`, senza chiavi API.
- Motore quantitativo in `server/analysis.ts`.
- Nessun database, nessuna cache e nessun modello AI/LLM configurato.

## Problemi confermati prima delle modifiche

1. **Selezione non adattiva:** EMA 20/50/200, RSI e MACD venivano calcolati per ogni serie e la UI mostrava sempre EMA 20/50, RSI e MACD.
2. **Livelli troppo semplici:** supporto e resistenza erano esclusivamente minimo e massimo di una finestra di 40 o 120 barre; nessun pivot, cluster, test, recenza o punteggio.
3. **Trendline assenti:** non esisteva alcun calcolo o disegno di trendline.
4. **Regime incompleto:** solo rialzista/ribassista/laterale, determinato dal rapporto prezzo–EMA20–EMA50; mancavano ADX, ATR, compressione, breakout e inversione.
5. **Multi-timeframe assente:** il parametro timeframe cambiava davvero richiesta e intervallo, ma ogni risposta analizzava un solo timeframe e non confrontava quelli superiori.
6. **Aggregazione 4h errata:** i dati 1h erano prima filtrati una barra ogni quattro e poi aggregati usando indici della serie originale; inoltre i gruppi non erano allineati alle sessioni di mercato.
7. **Candela incompleta:** l'ultima candela non veniva distinta dalle candele chiuse e poteva influenzare una conferma.
8. **Metadati insufficienti:** valuta, borsa, tipo strumento, ultimo timestamp e completezza non arrivavano alla UI.
9. **Nessuna vera AI:** la narrativa era una stringa deterministica. L'etichetta interna era già “analisi deterministica”, ma il nome del prodotto poteva indurre aspettative maggiori.
10. **Test insufficienti:** un solo test copriva una serie monotona; nessun controllo di differenziazione, serie corte, timeframe, contaminazione o coordinate dei disegni.
11. **Cache assente:** non esiste contaminazione tra chiavi, ma ogni cambio ripete richieste al provider e manca gestione TTL/rate limit.
12. **Dati non simulati:** nessun fallback artificiale è presente; gli errori provider producono HTTP 502 e `demo:false`.

## Ipotesi da verificare

- Affidabilità e termini del provider Yahoo Finance nel tempo; non offre SLA.
- Ricerca per ISIN: dipende dall'indice di ricerca Yahoo e non è garantita.
- Accuratezza di borsa e valuta per tutti i fondi/strumenti cross-listed.
- Disponibilità intraday varia per mercato e tipo di strumento.

## Funzionalità mancanti al momento dell'audit

- Analisi adattiva e motivazione degli indicatori.
- Livelli pivot/cluster con metadati e relevance score.
- Trendline derivate da pivot.
- Confronto multi-timeframe e conflitti espliciti.
- Scenari qualitativi strutturati.
- Modalità automatica/manuale completa.
- Provider alternativi, cache persistente e modello probabilistico validato.

Questo documento descrive lo stato osservato **prima** delle correzioni. Gli esiti finali sono riportati in `IMPROVEMENTS.md`.

## Stato dopo la correzione

I problemi confermati 1–7, 8, 10 e 11 sono stati affrontati. Il punto 9 resta intenzionalmente trasparente: non è stato aggiunto un LLM e la UI dichiara esplicitamente “analisi quantitativa deterministica”. Per provider alternativi, ISIN persistenti e probabilità validate restano necessarie integrazioni future.
