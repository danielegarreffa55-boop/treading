# UI architecture

## Composizione

`AppShell` coordina `PrimaryNavigation`, header globale, intestazione strumento e workspace. La vista grafico contiene toolbar, Lightweight Charts, indicatori sincronizzati e metric row. Il pannello contestuale ospita sintesi quantitativa, scenario, livelli, qualità dati e assistente. `CompanyPanel` è una vista parallela e non viene mostrata per crypto.

## Stato e flusso dati

Simbolo, timeframe e modalità sono le chiavi del contesto. Ogni cambio annulla la richiesta precedente, carica `/api/chart`, ricrea il grafico e invalida annotazioni dell'assistente. L'analisi usa barre chiuse; il WebSocket crypto aggiorna soltanto prezzo e stato live. Le azioni dell'assistente passano da `applyActions` e possono mostrare/nascondere indicatori o livelli verificati.

## Componenti esistenti

- `SearchBox`: ricerca accessibile con tastiera, portal, flip e shift.
- `IndicatorPanels`: RSI/MACD, resize e scala temporale condivisa tra indicatori.
- `ScenarioPanel`: conferme, invalidazioni, evidenze e qualità.
- `AIChat`: cronologia, origine quantitativa/LLM e azioni sul grafico.
- `CompanyPanel`: fondamentali, qualità, metriche e storico.
- `InfoGuide`: glossario e limiti del prodotto.

## Estrazioni pianificate

`WorkspaceHeader`, `ChartToolbar`, `MetricRow`, `ContextTabs`, `LevelTable`, `ProviderStatus`, `LoadingState` ed `ErrorState` sono ancora markup interno a `main.tsx`. L'estrazione deve preservare le chiavi di contesto per evitare re-render del grafico quando si apre un pannello.
