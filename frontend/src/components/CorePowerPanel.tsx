import { useState } from "react";
import { api } from "../api/client";
import type { Character, CorePowerArchetype, Faction } from "../types/models";

export function CorePowerPanel({
  character,
  faction,
  onUpdated,
}: {
  character: Character;
  faction: Faction;
  onUpdated: (c: Character) => void;
}) {
  const [found, setFound] = useState<CorePowerArchetype | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function search() {
    setBusy(true);
    setError(null);
    try {
      setFound(await api.searchCorePower(character.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setBusy(false);
    }
  }

  async function bind() {
    if (!found) return;
    setBusy(true);
    setError(null);
    try {
      const updated = await api.acquireCorePower(character.id, found.id);
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
      onUpdated(await api.advanceCorePower(character.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setBusy(false);
    }
  }

  if (!character.corePower) {
    return (
      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>{faction.corePowerLabel} finden</h3>
        <p style={{ fontSize: 14, color: "#555" }}>
          Benötigt Mindest-Kampfkraft. Name und Fähigkeiten sind fest vorgegeben — nicht frei
          wählbar.
        </p>
        {error && <p style={{ color: "crimson" }}>{error}</p>}

        {!found ? (
          <button disabled={busy} onClick={search}>
            {busy ? "Suche..." : `${faction.corePowerLabel} suchen`}
          </button>
        ) : (
          <div style={{ display: "grid", gap: 8, maxWidth: 400 }}>
            <div style={{ background: "#f7f7f7", borderRadius: 6, padding: 10 }}>
              <p style={{ fontSize: 12, color: "#777", margin: 0 }}>{found.typeLabel}</p>
              <strong>{found.properName}</strong>
              <p style={{ margin: "4px 0", fontSize: 14 }}>{found.description}</p>
              <p style={{ fontSize: 12, color: "#777" }}>
                Startfähigkeiten: {found.abilitiesByStage[0]?.join(", ")}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button disabled={busy} onClick={bind}>
                {busy ? "..." : "Binden"}
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

  const currentStageName = faction.corePowerStages[character.corePower.stageIndex];
  const isMaxStage = character.corePower.stageIndex >= faction.corePowerStages.length - 1;

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, marginTop: 16 }}>
      <h3 style={{ marginTop: 0 }}>
        {faction.corePowerLabel}: {character.corePower.name}
      </h3>
      <p style={{ fontSize: 14, color: "#555" }}>Typ: {character.corePower.typeLabel}</p>
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
