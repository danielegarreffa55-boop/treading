# Testing

Comandi Windows:

```powershell
npm.cmd run build
npm.cmd test
npm.cmd run test:e2e
```

Vitest copre motore, scenario, agente, glossario e normalizzazione crypto. Playwright usa una porta isolata (`8137`), non riusa server esistenti e copre scenario, annotazioni, pannelli RSI/MACD e cambio contesto.

I test crypto di normalizzazione sono riproducibili e non richiedono rete. Reconnect WebSocket browser e provider REST reale richiedono ancora un mock di rete E2E dedicato; non sono dichiarati verificati automaticamente.

Verifica Company/redesign del 22 novembre 2026: build superata; 32/32 test Vitest superati; 1/1 flusso Playwright Company+grafico superato; screenshot desktop 1440×1000 e mobile 390×844 aperti e ispezionati, senza overflow orizzontale; audit runtime senza vulnerabilità.
