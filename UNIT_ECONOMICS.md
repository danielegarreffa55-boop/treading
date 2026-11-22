# Unit economics

Stime esplorative, non dati certi. Nessun prezzo è stato deciso.

## Ipotesi da testare

Pilot Pro indicativo: €12–20/mese IVA inclusa o esclusa da definire. Prima chiedere pagamento reale a 3–5 beta tester. Il costo dati commerciale è la variabile dominante e attualmente ignota; finché manca un preventivo non esiste un margine affidabile.

| Voce mensile/utente | Free | Pro | Nota |
|---|---:|---:|---|
| infrastruttura | €0,10–1 | €0,30–2 | dipende da cache e frequenza |
| AI | €0–0,30 | €0,50–4 | quote, modello dinamico, fallback |
| dati | ignoto | ignoto | richiede contratto e minimi mensili |
| pagamento | n/a | percentuale + fisso | verificare provider scelto |
| supporto | basso | €1–5 | dipende da ticket e onboarding |

Condizione di sostenibilità: margine lordo obiettivo da validare solo dopo preventivo dati, consumo AI reale e churn. Implementare budget giornaliero, deduplica, cache conforme, quote e costo per workflow; mai usare AI per calcoli deterministici.

Esperimento: offrire pilot manuale limitato, misurare workflow completati e supporto, poi definire prezzo. Se nessuno paga, non costruire billing complesso.
