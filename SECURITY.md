# Sicurezza

- Credenziali solo in variabili server-side; `.env` non è incluso nel bundle.
- Nessun ordine, trasferimento o gestione di denaro.
- Nessuna esecuzione arbitraria, terminale o URL controllato dall'agente.
- Azioni agente validate con Zod; livelli verificati contro il contesto.
- Body limitato, timeout provider/LLM e fallback deterministico.
- Nessun dato simulato nel runtime.

Limiti: rate limiting finanziario e logging strutturato sono ancora da implementare. La memoria persistente non esiste ancora.
