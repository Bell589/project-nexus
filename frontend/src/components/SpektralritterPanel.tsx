import { useState } from "react";
import { api } from "../api/client";
import type { Character, Spektralritter } from "../types/models";

const STAGES = ["Vertrag", "Resonanz", "Rüstung", "Teilverschmelzung", "Vollständige Verschmelzung", "Unbegrenzte Weiterentwicklung"];

export function SpektralritterPanel({
  character,
  onUpdated,
}: {
  character: Character;
  onUpdated: (c: Character) => void;
}) {
  const [found, setFound] = useState<Spektralritter | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (character.worldId !== "avalon" || character.factionId !== "magier") return null;

  async function search() {
    setBusy(true);
    setError(null);
    try {
      setFound(await api.searchSpektralritter(character.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setBusy(false);
    }
  }

  async function bind(ritterId: string) {
    setBusy(true);
    setError(null);
    try {
      const updated = await api.formPact(character.id, ritterId);
      onUpdated(updated);
      setFound(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setBusy(false);
    }
  }

  async function advance() {
    setBusy(true);
    setError(null);
    try {
      onUpdated(await api.advancePact(character.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setBusy(false);
    }
  }

  if (!character.spektralritterPact) {
    return (
      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Spektralritter</h3>
        <p style={{ fontSize: 14, color: "#555" }}>
          Ein Pakt mit einem Spektralritter ist unabhängig von deiner einzigartigen Magie.
        </p>
        {error && <p style={{ color: "crimson" }}>{error}</p>}
        {!found ? (
          <button disabled={busy} onClick={search}>
            {busy ? "Suche..." : "Spektralritter suchen"}
          </button>
        ) : (
          <div style={{ background: "#f7f7f7", borderRadius: 6, padding: 10, maxWidth: 400 }}>
            <strong>{found.name}</strong>
            <p style={{ margin: "4px 0", fontSize: 14 }}>{found.description}</p>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button disabled={busy} onClick={() => bind(found.id)}>
                Pakt schließen
              </button>
              <button disabled={busy} onClick={search}>
                Nochmal suchen
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const pact = character.spektralritterPact;
  const isMaxStage = pact.stageIndex >= STAGES.length - 1;

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, marginTop: 16 }}>
      <h3 style={{ marginTop: 0 }}>Spektralritter: {pact.name}</h3>
      <p>
        Stufe {pact.stageIndex + 1}/{STAGES.length}: <strong>{STAGES[pact.stageIndex]}</strong>
      </p>
      <ul>
        {pact.unlockedAbilities.map((a, i) => (
          <li key={i}>{a}</li>
        ))}
      </ul>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <button onClick={advance} disabled={busy || isMaxStage}>
        {isMaxStage ? "Unbegrenzte Weiterentwicklung erreicht" : busy ? "..." : "Nächste Stufe"}
      </button>
    </div>
  );
}
