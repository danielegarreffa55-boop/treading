# Privacy — stato prototipo

La versione locale non dispone di account e non invia watchlist o preferenze onboarding al server: sono archiviate in `localStorage` sul dispositivo. Le richieste di ricerca/analisi inviano simbolo, timeframe e modalità al backend locale, che interroga i provider configurati. Se viene attivato un LLM remoto, domanda e contesto finanziario strutturato vengono inviati al provider configurato; non inserire dati personali.

Non è attiva telemetria remota. Prima di un servizio online servono titolare/responsabili, base giuridica, consenso ove necessario, retention, DPA, export, cancellazione, backup e procedura incidenti. La cancellazione locale avviene eliminando i dati del sito dal browser; una UI dedicata è pianificata.
