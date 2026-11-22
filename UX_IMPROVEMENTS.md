# Miglioramenti UX/UI — Fase 4

## Problemi iniziali

- Autocomplete assoluto dentro l'header, sempre aperto verso il basso, senza collision detection o portal.
- Nessuna chiusura affidabile su click esterno/Escape e nessuna navigazione completa da tastiera.
- Risultati poco gerarchizzati e potenzialmente tagliati dal viewport.
- Concetti quantitativi visibili senza una guida integrata.
- Motivazione degli indicatori presente solo come paragrafo, senza aiuto contestuale.
- Pannelli tecnici corretti ma visivamente molto compatti e con gerarchia debole.

## Librerie valutate

- **Floating UI — integrata:** risolve esattamente ancoraggio, portal, flip, shift, dimensionamento e aggiornamento su scroll/resize. È la dipendenza più piccola coerente con il problema.
- **Radix UI — non integrata:** ottimi primitive accessibili, ma per questo progetto avrebbe duplicato componenti e aumentato l'intervento oltre il necessario.
- **cmdk — non integrata:** indicata per command palette complesse; la ricerca attuale ha un'unica sorgente e non richiede gruppi/comandi.
- **shadcn/ui — non integrata:** richiederebbe Tailwind, configurazione e un design system aggiuntivo incompatibile con l'approccio CSS esistente.

## Soluzioni implementate

### Autocomplete adattivo

`src/SearchBox.tsx` usa `@floating-ui/react` con:

- `FloatingPortal` per non essere tagliato da overflow;
- `flip` per aprire sopra quando manca spazio sotto;
- `shift` per restare nel viewport;
- `size` per larghezza uguale al campo e altezza disponibile;
- `autoUpdate` durante scroll, resize e layout shift;
- altezza massima 360 px e scroll interno;
- debounce 220 ms e annullamento della richiesta precedente;
- frecce su/giù, Invio, Escape, click esterno e selezione mouse;
- ruoli ARIA `combobox`, `listbox`, `option` e `aria-activedescendant`;
- evidenziazione netta del risultato attivo e dati separati per ticker, nome, tipo e borsa.

### Guida didattica

Il tasto **Info** è nell'header, in alto a destra. Apre una guida modale ricercabile con definizione, logica/formula, esempio e limiti. Il glossario comprende ATR, ADX, RSI, MACD, RMA, Bollinger, pivot raggio 3, cluster e tolleranza 0,55 ATR, rilevanza dei livelli, supporto/resistenza, trendline, volume relativo, breakout, compressione, multi-timeframe e scenari.

Le icone `?` accanto a metriche, livelli, indicatori e confronto multi-timeframe mostrano tooltip focalizzabili. Gli indicatori selezionati automaticamente includono la motivazione contestuale del motore.

Le sigle del grafico `S` e `R` sono spiegate come supporto e resistenza; il numero è chiamato esplicitamente “rilevanza /100” e la guida chiarisce che non è una probabilità.

### Rifinitura visiva

- Barra di ricerca con stato focus chiaro e scorciatoia visuale.
- Card livelli più leggibili, con spiegazione sintetica della rilevanza.
- Provider separato nell'intestazione dell'analisi e card origine dati.
- Migliore gerarchia per motivazione automatica, badge e metadati.
- Modal responsive: due colonne su desktop, lista superiore e dettaglio sotto su mobile.
- Risultati ricerca compatti su mobile senza perdere ticker e nome.

## Accessibilità e responsive

- Navigazione da tastiera e semantica ARIA per autocomplete e dialog.
- Tooltip accessibili anche tramite focus.
- Escape chiude sia menu sia guida; click sul backdrop chiude la guida.
- Contrasto e focus ring visibili in dark mode.
- Breakpoint a 1100 e 700 px per header, ricerca, glossario, livelli e metriche.

## Verifiche

- Build TypeScript/Vite superata.
- Test quantitativi invariati e superati.
- Test del glossario aggiunti per copertura e associazione delle etichette.
- Smoke test HTTP/API previsto sul server locale.
- La verifica visuale automatizzata non è stata disponibile nella sessione perché il browser host ha restituito `browser access host unavailable`; resta consigliata una verifica manuale finale ai breakpoint principali.
