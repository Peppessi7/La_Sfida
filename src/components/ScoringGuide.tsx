import { Calculator, ChevronDown, FileText } from "lucide-react";
import { SCORE_TABLE } from "../lib/gameLogic";

const arroganceRows = [
  { streak: "1–2 sfide", level: "Nessuna", malus: "—" },
  { streak: "3 sfide", level: "Arroganza I", malus: "−1" },
  { streak: "4 sfide", level: "Arroganza II", malus: "−2" },
  { streak: "5+ sfide", level: "Arroganza III", malus: "−3" },
];

function ScoreValue({ value }: { value: number | string }) {
  const text = typeof value === "number" && value > 0 ? `+${value}` : value;
  return <span className="font-semibold text-foreground">{text}</span>;
}

export function ScoringGuide() {
  return (
    <section className="flex w-full flex-col gap-4">
      <details className="group overflow-hidden rounded-2xl border border-border bg-card/70 shadow-sm">
        <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 px-4 py-4 transition-colors hover:bg-white/[0.03] [&::-webkit-details-marker]:hidden">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/40 text-primary">
            <FileText size={16} aria-hidden="true" />
          </span>
          <span className="flex-1">
            <span className="block text-sm font-semibold tracking-wide text-foreground">
              Regolamento
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              Le regole della partita in breve
            </span>
          </span>
          <ChevronDown
            size={18}
            aria-hidden="true"
            className="text-muted-foreground transition-transform duration-200 group-open:rotate-180"
          />
        </summary>

        <div className="border-t border-border px-4 pb-5 pt-5">
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              Quando va a mettere a posto le biglie che ha imbucato, il
              giocatore deve cercare di formare una fila da 4, il cosiddetto{" "}
              <strong>Poker</strong>. Il Poker può essere fatto orizzontalmente, verticalmente o
              diagonalmente.
            </p>
            <p>
              Quando un giocatore completa un Poker, <strong>La Sfida</strong>{" "}termina e il
              vincitore (e talvolta anche lo sconfitto) ottiene i punti
              corrispondenti, secondo quanto riportato dalla tabella.
              Questo sarà il punteggio con cui il giocatore inizierà la partita di biliardo successiva.
            </p>
            <p>
              Quando un giocatore ha la possibilità di fare Poker, può decidere di <strong>sfidare</strong> l'avversario. In questo caso il giocatore che ha sfidato dovrà mettere la biglia in un altro posto. Se si decide di sfidare non si può comunque mettere la biglia per bloccare un possibile Poker avversario, a meno che non sia l'unica opzione disponibile.
              Ogni volta che un giocatore sfida l'avversario, il livello di Sfida aumenta di 1, con conseguente aumento dei punteggi in palio.
            </p>
            <p>
              La biglia nera, se c'è una Sfida in corso, deve per forza essere usata per formare un Poker.
            </p>
            <p>
              Se un giocatore sfida per 3 volte consecutive senza che l'avversario riesca a sfidare a sua volta, il giocatore che ha sfidato pecca di <strong>Arroganza</strong>. In questo caso, il livello di sfida continua ad aumentare, ma il giocatore che pecca di Arroganza subirà un malus più alto in caso di sconfitta.
            </p>
            <p>
              Ogni giocatore può creare un <strong>Enclave</strong> posizionando 4 biglie vicine a formare un quadrato. I lati di un Enclave possono essere in comune con un altro Enclave.
            </p>
            <p>
              Il punteggio cambia in base al livello di Sfida, all&apos;Arroganza e alle Enclave costruite. Le tabelle sono visualizzabili nella sezione seguente.
            </p>
          </div>
        </div>
      </details>

      <details className="group overflow-hidden rounded-2xl border border-border bg-card/70 shadow-sm">
        <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 px-4 py-4 transition-colors hover:bg-white/[0.03] [&::-webkit-details-marker]:hidden">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/40 text-primary">
            <Calculator size={16} aria-hidden="true" />
          </span>
          <span className="flex-1">
            <span className="block text-sm font-semibold tracking-wide text-foreground">
              Punteggi
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              Sfida, Arroganza ed Enclave in breve
            </span>
          </span>
          <ChevronDown
            size={18}
            aria-hidden="true"
            className="text-muted-foreground transition-transform duration-200 group-open:rotate-180"
          />
        </summary>

        <div className="space-y-6 border-t border-border px-4 pb-5 pt-5">
          <div>
            <div className="mb-3">
              <h3 className="font-serif text-lg font-semibold text-foreground">
                Livello di Sfida
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Chi chiude il Poker prende i punti da vincitore; l&apos;altro
                prende il punteggio da sconfitto.
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">
                  Punteggi per ogni livello di Sfida
                </caption>
                <thead className="bg-white/[0.04] text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2.5 font-medium">Livello</th>
                    <th className="px-3 py-2.5 text-right font-medium">
                      Vince
                    </th>
                    <th className="px-3 py-2.5 text-right font-medium">
                      Perde
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {Object.entries(SCORE_TABLE).map(([level, scores]) => (
                    <tr key={level} className="text-foreground">
                      <td className="px-3 py-2">
                        <span className="font-medium">{level}</span>
                        {level === "0" && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            Poker normale
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right text-primary">
                        <ScoreValue value={scores.winner} />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <ScoreValue value={scores.loser} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Limiti assoluti: massimo{" "}
              <strong className="text-primary">+10</strong>, minimo{" "}
              <strong className="text-destructive">−10</strong>.
            </p>
          </div>

          <div>
            <div className="mb-3">
              <h3 className="font-serif text-lg font-semibold text-foreground">
                Arroganza
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Conta le Sfide consecutive dello stesso giocatore. Il malus si
                applica solo se quel giocatore perde il Poker.
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">
                  Livelli di Arroganza e relativi malus
                </caption>
                <thead className="bg-white/[0.04] text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2.5 font-medium">Serie</th>
                    <th className="px-3 py-2.5 font-medium">Livello</th>
                    <th className="px-3 py-2.5 text-right font-medium">
                      Malus
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {arroganceRows.map((row) => (
                    <tr key={row.streak}>
                      <td className="px-3 py-2 text-foreground">
                        {row.streak}
                      </td>
                      <td className="px-3 py-2 text-foreground">{row.level}</td>
                      <td className="px-3 py-2 text-right text-destructive">
                        <ScoreValue value={row.malus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="mb-3">
              <h3 className="font-serif text-lg font-semibold text-foreground">
                Enclave
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Ogni giocatore può avere da 0 a 2 Enclavi. Il loro effetto
                dipende dal punteggio a fine Sfida del proprietario.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-white/[0.025] p-3">
                <p className="text-sm font-semibold text-foreground">
                  Proprietario sotto zero
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Ogni Enclave aggiunge 1 punto al proprietario, senza portarlo
                  sopra a zero.
                </p>
                <p className="mt-2 text-xs text-primary">
                  −3 con 2 Enclavi → −1
                </p>
              </div>
              <div className="rounded-xl border border-border bg-white/[0.025] p-3">
                <p className="text-sm font-semibold text-foreground">
                  Proprietario a zero o positivo
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Ogni Enclave sottrae{" "}
                  <strong className="text-primary">1</strong> punto
                  all&apos;avversario, senza portarlo sotto zero.
                </p>
                <p className="mt-2 text-xs text-primary">
                  Avversario +10 con 2 Enclave → +8
                </p>
              </div>
            </div>
            <p className="mt-3 rounded-lg border border-primary/20 bg-primary/[0.06] px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
              Ordine: punti della Sfida → malus Arroganza → Enclave → limiti
              finali −10/+10.
            </p>
          </div>
        </div>
      </details>
    </section>
  );
}
