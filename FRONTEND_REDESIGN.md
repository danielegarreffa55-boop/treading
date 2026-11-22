# Frontend redesign

La direzione visuale è **Research Terminal**: grafico dominante, superfici piatte, separatori sottili, densità controllata e colori esclusivamente semantici.

Completato:

- shell professionale con sidebar compatta e bottom navigation mobile;
- header contenuto, ricerca Floating UI e selettore Trading/Investimento;
- grafico adattivo con toolbar raggruppata e pannelli RSI/MACD coerenti;
- scenario, multi-timeframe, livelli e origine dati nel pannello destro;
- assistente integrato nel pannello, non più flottante sul grafico;
- crypto nello stesso design system, senza metriche aziendali;
- Company intelligence riallineata a tabelle e sezioni;
- stati loading/error, focus e reduced motion.

Debito noto: `main.tsx` resta monolitico e andrà estratto nei componenti descritti in `UI_ARCHITECTURE.md`. Il pannello destro non è ancora ridimensionabile con drag; su tablet viene impilato anziché presentato come drawer. Peer, eventi e notizie dipendono da dati non ancora disponibili.
