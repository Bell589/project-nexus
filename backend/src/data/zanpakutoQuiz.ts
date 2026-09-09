export interface QuizOption {
  label: string;
  /** Gewichtung pro Variante (z.B. Element), addiert sich über alle Antworten */
  weights: Record<string, number>;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export const ZANPAKUTO_QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "Wie gehst du einen Konflikt an?",
    options: [
      { label: "Direkt und mit voller Wucht", weights: { Feuer: 2 } },
      { label: "Ruhig, kontrolliert, kalkuliert", weights: { Eis: 2 } },
      { label: "Beweglich, ausweichend, unvorhersehbar", weights: { Wind: 2 } },
    ],
  },
  {
    id: "q2",
    question: "Was beschreibt dich am besten?",
    options: [
      { label: "Leidenschaftlich und impulsiv", weights: { Feuer: 1 } },
      { label: "Diszipliniert und distanziert", weights: { Eis: 1 } },
      { label: "Frei und ungebunden", weights: { Wind: 1 } },
    ],
  },
  {
    id: "q3",
    question: "Bevorzugte Kampfdistanz?",
    options: [
      { label: "Nahkampf, mittendrin", weights: { Feuer: 1, Eis: 1 } },
      { label: "Kontrolle über das Schlachtfeld", weights: { Eis: 1 } },
      { label: "Schnelle Positionswechsel", weights: { Wind: 2 } },
    ],
  },
];

/** Bestimmt aus den Antwort-Indizes die am stärksten gewichtete Variante. */
export function resolveQuizVariant(answerIndices: number[]): string {
  const totals: Record<string, number> = {};
  ZANPAKUTO_QUIZ.forEach((q, i) => {
    const answerIndex = answerIndices[i];
    const option = q.options[answerIndex];
    if (!option) return;
    for (const [variant, weight] of Object.entries(option.weights)) {
      totals[variant] = (totals[variant] ?? 0) + weight;
    }
  });

  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] ?? "Feuer";
}
