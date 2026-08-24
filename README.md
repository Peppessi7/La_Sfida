# LA SFIDA

Companion mobile per gestire Sfida, Arroganza ed Enclave durante una partita di biliardo. È una web app statica: non usa account, server, database, analytics o servizi esterni.

## Avvio locale

Richiede Node.js 22 e pnpm 11.

```bash
pnpm install
pnpm dev
```

Controlli prima della pubblicazione:

```bash
pnpm typecheck
pnpm build
pnpm preview
```

La build pronta per la pubblicazione viene creata nella cartella `dist`.

## Pubblicazione gratuita su GitHub Pages

Il workflow `.github/workflows/deploy-pages.yml` pubblica automaticamente il sito a ogni aggiornamento del ramo `main`.

1. Crea un repository GitHub e carica qui il progetto.
2. Nel repository apri **Settings → Pages**.
3. In **Build and deployment → Source** seleziona **GitHub Actions**.
4. Apri **Actions** e verifica che “Pubblica LA SFIDA su GitHub Pages” termini correttamente.

L’indirizzo sarà simile a `https://nomeutente.github.io/nome-repository/`. Non serve acquistare un dominio.

## Installazione e uso offline su iPad

1. Con l’iPad connesso a Internet, apri l’indirizzo GitHub Pages in **Safari**.
2. Attendi il caricamento completo della pagina.
3. Tocca **Condividi → Aggiungi alla schermata Home → Aggiungi**.
4. Apri una volta **LA SFIDA** dalla nuova icona; da quel momento l’app e la partita corrente restano disponibili offline.

Per ricevere un aggiornamento futuro, riconnetti l’iPad, apri LA SFIDA e attendi il riavvio automatico con la nuova versione. I dati della partita restano salvati solo sul dispositivo tramite `localStorage`: cancellare i dati di Safari può rimuoverli.

## Regole implementate

- Livello di Sfida da 0 a 9 con cronologia e annullamento dell’ultima Sfida.
- Arroganza I, II e III dopo rispettivamente 3, 4 e almeno 5 Sfide consecutive dello stesso giocatore.
- Punteggi base da +1/0 fino a +10/−10.
- Fino a 2 Enclave per giocatore, applicate prima come protezione verso lo zero e poi, se residue, contro un punteggio avversario positivo.
- Salvataggio automatico di nomi, Sfide, Enclave, tipo di biglie e risultato corrente.

Il calcolatore non rappresenta né analizza il portabiglie: Poker ed Enclave vengono indicati manualmente.
