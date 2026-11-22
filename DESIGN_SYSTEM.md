# Design system — Research Terminal

Il tema scuro usa token centralizzati in `src/research-terminal.css`, caricato dopo gli stili legacy per mantenere compatibilità. Palette: app `#0b0d10`, pannelli `#101318`, superfici elevate `#161a20`, bordi `#232832`, testo `#f1f3f5`, accento azione `#4d8eff`, positivo `#28b487`, negativo `#e05a67`, attenzione `#d6a84b`.

Inter è il font UI; i dati usano una catena monospaziata e `font-variant-numeric: tabular-nums`. La scala di spazio è 4/8/12/16/24/32 px, i radius sono 4/6/8 px. Ombre solo su dropdown e overlay. Pill riservate a stati reali.

La gerarchia è composta da header globale da 56 px, navigazione primaria da 72 px, intestazione strumento, workspace grafico e pannello contestuale. Sotto 820 px il pannello scende dopo il grafico; sotto 700 px la navigazione diventa una bottom bar e ricerca/toolbar si ricompongono.

Focus visibile, contrasto semantico e `prefers-reduced-motion` sono obbligatori. Il colore non è l'unico segnale: valori e stati hanno sempre una label testuale.
