import { useState } from "react";
import { api } from "../api/client";
import type { Character } from "../types/models";

const COMPONENTS: { key: string; label: string }[] = [
  { key: "erfahrung", label: "Erfahrung" },
  { key: "ausruestung", label: "Ausrüstung" },
  { key: "faehigkeiten", label: "Fähigkeiten" },
  { key: "systemBeherrschung", label: "Systembeherrschung" },
  { key: "erfolge", label: "Erfolge" },
  { key: "training", label: "Training" },
];

export function TrainingPanel({
  character,
  onUpdated,
}: {
  character: Character;
  onUpdated: (c: Character) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function train(component: string) {
    setBusy(component);
    setError(null);
    try {
      const updated = await api.trainComponent(character.id, component, 10);
      onUpdated(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, marginTop: 16 }}>
      <h3 style={{ marginTop: 0 }}>Training (+10 pro Klick)</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {COMPONENTS.map((c) => (
          <button key={c.key} onClick={() => train(c.key)} disabled={busy === c.key}>
            {busy === c.key ? "..." : `+ ${c.label}`}{" "}
            <small>({character.kampfkraftComponents[c.key as keyof typeof character.kampfkraftComponents]})</small>
          </button>
        ))}
      </div>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </div>
  );
}
