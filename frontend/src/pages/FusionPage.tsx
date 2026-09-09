import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Character } from "../types/models";

interface FusionState {
  id: string;
  characterAId: string;
  characterBId: string;
  fusedName: string;
  combinedAbilities: { name: string; kind: string; description: string }[];
  active: boolean;
}

export function FusionPage({ character }: { character: Character }) {
  const [candidates, setCandidates] = useState<Character[]>([]);
  const [partnerId, setPartnerId] = useState("");
  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [activeFusion, setActiveFusion] = useState<FusionState | null>(null);

  useEffect(() => {
    api
      .listCharacters()
      .then((all) =>
        setCandidates(all.filter((c) => c.id !== character.id && c.worldId === "avalon" && c.factionId === "magier"))
      )
      .catch((e) => setError(e.message));
  }, [character.id]);

  if (character.worldId !== "avalon") return null;

  async function fuse(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const fusion = (await api.fuseCharactersTemp(character.id, partnerId, newName)) as unknown as FusionState;
      setActiveFusion(fusion);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <h2>Magierfusion</h2>
      <p style={{ fontSize: 14, color: "#555" }}>
        Zwei Magier verschmelzen freiwillig zu einem <strong>temporären</strong> mächtigen
        Magier. Anders als Ritter- oder Esperverschmelzung bleiben beide Ausgangscharaktere
        eigenständig bestehen — die Fusion ist ein zeitlich begrenzter Zustand, kein neuer
        dauerhafter Charakter.
      </p>
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {activeFusion ? (
        <div style={{ border: "1px solid #2a7", borderRadius: 8, padding: 12 }}>
          <strong>{activeFusion.fusedName}</strong> — Fusion aktiv
          <ul style={{ listStyle: "none", padding: 0, fontSize: 13 }}>
            {activeFusion.combinedAbilities.map((a, i) => (
              <li key={i}>
                {a.name} ({a.kind})
              </li>
            ))}
          </ul>
        </div>
      ) : candidates.length === 0 ? (
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
            Name der Fusion
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
