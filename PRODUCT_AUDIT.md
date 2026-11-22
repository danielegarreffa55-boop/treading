# Product audit

Verifica del 22 novembre 2026. Il prodotto è un prototipo locale funzionante, non ancora un SaaS commerciale.

## Stato reale

Funzionano: ricerca multi-asset, grafici OHLCV, indicatori, livelli deterministici, scenari con conferme/invalidazioni, crypto spot, fondamentali parziali, agente con fallback, fonti/timestamp, design responsive, test unitari ed E2E. La nuova milestone aggiunge onboarding e watchlist persistente solo nel browser.

Non esistono: account, isolamento utenti server-side, database, alert schedulati, home di monitoraggio, email, billing, quote per piano, esportazione/eliminazione account, telemetria remota, SLA dati o licenze commerciali approvate.

## Flusso attuale e flusso obiettivo

Attuale: ricerca → analisi → scenario → annotazione → watchlist locale. Obiettivo validato: scoperta → analisi → scenario → watchlist → alert interno → diario → riesame. I passaggi successivi non vanno costruiti prima di osservare ritorno settimanale e disponibilità a pagare.

## Funzioni valide

- motore quantitativo separato dall’LLM;
- scenari senza probabilità inventate;
- contesto e azioni agente validati;
- candela crypto aperta esclusa dalle conferme;
- errori senza dati simulati;
- grafico Lightweight Charts con attribuzione;
- ricerca accessibile e responsive;
- launcher Windows essenziale.

## Da correggere

- provider dati non approvati per uso commerciale;
- cache in memoria e chiavi incomplete;
- frontend/backend monolitici e uso diffuso di `any`;
- assenza di rate limiting generale, logging strutturato e audit log;
- launcher senza readiness check, lock istanza e cleanup robusto;
- file JS/d.ts generati accanto ai TypeScript;
- watchlist solo locale, senza note/modifiche di scenario.

## Da rimandare

Screener avanzato, backtest, trading automatico, social, report complessi, intelligence settoriale profonda e notifiche push. Prima servono dati licenziati, 20–30 beta tester e prova di pagamento.

## Rischi principali

1. Licenze dati: blocco commerciale.
2. Posizionamento: rischio percezione “segnali AI”.
3. Retention: manca ancora un vero ciclo alert/riesame.
4. Sicurezza: architettura single-user locale non pronta per multi-tenant.
5. Affidabilità: Yahoo non offre API ufficiale né SLA nel percorso usato.

## Prima milestone scelta

Onboarding e watchlist locale. Impatto acquisto medio, retention alta, rischio basso, costo basso, nessuna dipendenza dati nuova, validabile subito osservando aggiunta e ritorno. Non introduce raccomandazioni personalizzate.
