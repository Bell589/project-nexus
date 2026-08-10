import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Character } from "../types/models";

export function FusionPage({
  character,
  onFused,
}: {
  character: Character;
  onFused: (c: Character) => void;
}) {
  const [candidates, setCandidates] = useState<Character[]>([]);
  const [partnerId, setPartnerId] = useState("");
  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .listCharacters()
      .then((all) =>
        setCandidates(
          all.filter(
            (c) =>
              c.id !== character.id &&
              c.worldId === "avalon" &&
              c.factionId === "magier" &&
              !c.fusedInto
          )
        )
      )
      .catch((e) => setError(e.message));
  }, [character.id]);

  if (character.worldId !== "avalon") return null;

  async function fuse(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const fused = await api.fuseCharacters(character.id, partnerId, newName);
      onFused(fused);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <h2>Fusion</h2>
      <p style={{ fontSize: 14, color: "#555" }}>
        Zwei Magier verschmelzen freiwillig zu einem neuen Magier. Kampfkraft-Komponenten,
        Fähigkeiten und Kernmacht werden kombiniert. Beide Ausgangscharaktere gelten danach als
        fusioniert.
      </p>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {candidates.length === 0 ? (
        <p style={{ color: "#777" }}>Kein anderer Magier zum Fusionieren verfügbar.</p>
      ) : (
        <form onSubmit={fuse} style={{ display: "grid", gap: 8, maxWidth: 360 }}>
          <label>
            Fusionspartner
            <select value={partnerId} onChange={(e) => setPartnerId(e.target.value)} required>
              <option value="" disabled>
                Wählen...
              </option>
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.characterName} ({c.ownerName})
                </option>
              ))}
            </select>
          </label>
          <label>
            Name des fusionierten Charakters
            <input value={newName} onChange={(e) => setNewName(e.target.value)} required />
          </label>
          <button type="submit" disabled={busy}>
            {busy ? "..." : "Fusionieren"}
          </button>
        </form>
      )}
    </section>
  );
}
