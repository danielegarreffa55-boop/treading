# Sicurezza

- Credenziali solo in variabili server-side; `.env` non è incluso nel bundle.
- Nessun ordine, trasferimento o gestione di denaro.
- Nessuna esecuzione arbitraria, terminale o URL controllato dall'agente.
- Azioni agente validate con Zod; livelli verificati contro il contesto.
- Body limitato, timeout provider/LLM e fallback deterministico.
- Nessun dato simulato nel runtime.

La watchlist e le preferenze onboarding della prima milestone restano nel browser e non contengono credenziali. Non sono ancora presenti account o separazione multi-tenant.

Limiti bloccanti per un servizio pubblico: rate limiting generale, autenticazione, autorizzazione, isolamento utenti, logging strutturato senza contenuti sensibili, audit log, backup/ripristino, gestione sessioni, CSRF/CSP e protezione endpoint sono da implementare. Il sistema attuale è adatto a uso locale/beta privata, non a esposizione Internet multiutente.
