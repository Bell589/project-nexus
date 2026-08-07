import { useState } from "react";
import { api } from "../api/client";
import type { Character, Faction } from "../types/models";

export function CorePowerPanel({
  character,
  faction,
  onUpdated,
}: {
  character: Character;
  faction: Faction;
  onUpdated: (c: Character) => void;
}) {
  const [archetype, setArchetype] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function acquire(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const updated = await api.acquireCorePower(character.id, archetype, name);
      onUpdated(updated);
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
      const updated = await api.advanceCorePower(character.id);
      onUpdated(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setBusy(false);
    }
  }

  if (!character.corePower) {
    return (
      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>{faction.corePowerLabel} erwerben</h3>
        <p style={{ fontSize: 14, color: "#555" }}>
          Benötigt Mindest-Kampfkraft. Trainiere erst, falls der Erwerb fehlschlägt.
        </p>
        <form onSubmit={acquire} style={{ display: "grid", gap: 8, maxWidth: 360 }}>
          <label>
            Archetyp (z.B. "Relikt des Blitzes")
            <input value={archetype} onChange={(e) => setArchetype(e.target.value)} required />
          </label>
          <label>
            Eigener Name (z.B. "Donner des Himmels")
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          {error && <p style={{ color: "crimson" }}>{error}</p>}
          <button type="submit" disabled={busy}>
            {busy ? "..." : `${faction.corePowerLabel} erwerben`}
          </button>
        </form>
      </div>
    );
  }

  const currentStageName = faction.corePowerStages[character.corePower.stageIndex];
  const isMaxStage = character.corePower.stageIndex >= faction.corePowerStages.length - 1;

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, marginTop: 16 }}>
      <h3 style={{ marginTop: 0 }}>
        {faction.corePowerLabel}: {character.corePower.name}
      </h3>
      <p style={{ fontSize: 14, color: "#555" }}>Archetyp: {character.corePower.archetype}</p>
      <p>
        Stufe {character.corePower.stageIndex + 1}/{faction.corePowerStages.length}:{" "}
        <strong>{currentStageName}</strong>
      </p>
      {character.corePower.unlockedAbilities.length > 0 && (
        <ul>
          {character.corePower.unlockedAbilities.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      )}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <button onClick={advance} disabled={busy || isMaxStage}>
        {isMaxStage ? "Unbegrenzte Weiterentwicklung erreicht" : busy ? "..." : "Nächste Stufe"}
      </button>
    </div>
  );
}
