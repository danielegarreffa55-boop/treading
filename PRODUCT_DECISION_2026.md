# Decisione di prodotto — Evidence Ledger

Verifica: 22 novembre 2026. Le ipotesi commerciali richiedono interviste reali; questo documento non è consulenza legale.

## Decisione condivisa dei tre profili

Cliente prioritario aggiornato: investitore autonomo evoluto che segue 10–20 strumenti e paga già strumenti di ricerca. L'offerta è: **all'apertura, aggiornare manualmente l'intera lista e capire in meno di due minuti che cosa richiede attenzione, perché conta rispetto alla tesi salvata, come verificarlo e quali strumenti sono stabili**. L'analista/autore indipendente resta il secondo segmento: condivide fonti, storico ed export, ma richiede un output più professionale.

La priorità è cambiata dopo la prova del monitor multi-strumento: il prodotto attuale può creare un ritorno 2–3 volte a settimana per un investitore senza introdurre collaborazione, ruoli o reporting editoriale. Il dossier resta l'approfondimento, non la home.

Il segmento col ticket potenziale maggiore è lo studio di consulenza/wealth management (€200–500 per utente/mese come ordine di grandezza), ma oggi è fuori portata: richiede feed licenziati, report cliente, account e isolamento, audit log, privacy/GDPR, integrazioni e revisione MiFID. Il migliore primo pilot è invece la micro-redazione: buyer e utente spesso coincidono, il lavoro è settimanale e il ciclo di vendita è breve.

Alternative bocciate:

- terminale AI multi-asset: compete su copertura e affidabilità con prodotti molto più maturi;
- monitoraggio retail con alert: promettente per retention, ma scheduler e alert non esistono;
- Market Desk grafico-first: sembra potente ma nasconde la differenza vendibile e peggiora il mobile.

## Disaccordi che hanno cambiato la priorità

- L'acquirente ha bocciato nuovi indicatori: non riducono il lavoro manuale né producono un output consegnabile.
- Il designer ha bocciato grafico e AI come primo livello: conclusione, prova e invalidazione devono precederli.
- L'ingegnere ha bocciato la promessa “AI professionale”: context identity e fondamentali avevano percorsi incoerenti; la demo resta deterministica e locale.
- Gli advisor pagherebbero di più, ma la promessa non è mantenibile senza prerequisiti legali e tecnici. Si parte da una redazione.

## Audit critico

Osservato in codice e test:

| Gravità | Schermata/file | Comportamento | Conseguenza |
|---|---|---|---|
| Critica | `src/main.tsx` | Il grafico precedeva conclusione e prova, anche a 390 px. | Il lavoro di riesame sembrava una funzione secondaria. |
| Critica | `server/index.ts` | Chat e chart ricostruivano identità/contextId diversi. | La chat poteva rispondere 409 sul contesto corrente. Corretto. |
| Critica | `CompanyPanel.tsx` / `main.tsx` | I fondamentali ricevevano il ticker visuale. | Un omonimo poteva aprire il mercato sbagliato. Corretto passando il simbolo canonico. |
| Alta | navigazione | “Screener” disabilitato e sezioni nominate per componenti. | Perdita di fiducia e tassonomia lontana dal lavoro. Rimosso e rinominato. |
| Alta | AI | Chat aperta e generica compete con fonti/calcoli. | Rischio percezione “chat finanziaria”; resta una funzione contestuale, non la proposta. |
| Alta | Watchlist | Un solo snapshot, non cronologia append-only. | Demo valida, pilot professionale non ancora valido. |
| Alta | dati | Feed correnti senza autorizzazione commerciale verificata. | Nessuna vendita basata sui feed attuali. |
| Media | CSS | Due sistemi visivi sovrapposti. | Cascade fragile; la nuova direzione è isolata in `evidence-ledger.css`. |
| Media | onboarding | Mercati/obiettivo salvati ma poco operativi. | Copy e preferenze da semplificare nel prossimo ciclo. |

Osservato in esecuzione controllata: persistenza di nota/snapshot, omonimi distinti, confronto compatibile, viewport desktop/tablet/mobile e launcher su porta alternativa. Deducibile dal codice ma non ancora validato con clienti: risparmio di tempo, qualità dell'handoff e disponibilità a pagare.

## Segmenti confrontati

| Segmento | Uso/buyer | Budget ipotetico | Decisione |
|---|---|---:|---|
| Investitore evoluto | ricerca personale settimanale; buyer=utente | €12–30/mese | accessibile ma alternative gratuite e ticket basso |
| Team indipendente di ricerca | handoff e tracciabilità; buyer=fondatore | €50–150/utente/mese | segmento successivo dopo export/collaborazione |
| Studio di consulenza | report e audit; buyer=titolare/compliance | €200–500/utente/mese | ticket massimo, oggi bloccato |
| Micro-redazione/newsletter | tesi pubblicabili e aggiornamenti; buyer=fondatore | €39–79/autore/mese | cliente prioritario |

Prezzi concorrenti verificati il 22 novembre 2026 su pagine ufficiali: [Koyfin](https://www.koyfin.com/pricing/) Free, Plus $39/mese, Premium $79 e piani advisor $209–299; [Stock Rover](https://www.stockrover.com/plans/) da $29/mese annuale con note, export e alert; [Finviz Elite](https://finviz.com/elite) come alternativa di screening/alert; [Seeking Alpha Premium](https://help.seekingalpha.com/what-is-seeking-alpha-premium) come archivio editoriale. Questi prezzi provano spesa nella categoria, non willingness-to-pay per questo prodotto.

## Criterio visuale

Senza spiegazioni, una persona deve trovare in meno di 30 secondi: conclusione, una prova, una controprova o rischio, invalidazione, freschezza/fonte e comando per aprire il registro tesi. Verde e rosso restano riservati a stati con etichetta; selezione e focus usano blu-grigio neutro.

## Risposta finale

- Chi dovrebbe comprare: una newsletter/redazione finanziaria indipendente italiana di 1–3 persone.
- Per quale attività settimanale: preparare, consegnare e riesaminare tesi mantenendo prove, fonti e condizioni di cambiamento.
- Quale prova manca: che almeno due team usino il dossier su ricerche reali, tornino a riesaminarlo e discutano termini e budget di un pilot.
