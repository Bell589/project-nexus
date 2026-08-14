import { useState } from "react";
import { api } from "../api/client";
import { AbilityListItem } from "./AbilityListItem";
import type { Character, UniquePowerInstance, Faction } from "../types/models";

export function CorePowerPanel({
  character,
  faction,
  onUpdated,
}: {
  character: Character;
  faction: Faction;
  onUpdated: (c: Character) => void;
}) {
  const [found, setFound] = useState<UniquePowerInstance | null>(null);
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
      const updated = await api.acquireCorePower(character.id, found);
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

  if (!character.uniquePower) {
    return (
      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>{faction.corePowerLabel} finden</h3>
        <p style={{ fontSize: 14, color: "#555" }}>
          Benötigt Mindest-Kampfkraft. Name, Variante und Startfähigkeiten werden individuell
          generiert — zwei Charaktere mit demselben Ursprung können unterschiedlich ausfallen.
        </p>
        {error && <p style={{ color: "crimson" }}>{error}</p>}

        {!found ? (
          <button disabled={busy} onClick={search}>
            {busy ? "Suche..." : `${faction.corePowerLabel} suchen`}
          </button>
        ) : (
          <div style={{ display: "grid", gap: 8, maxWidth: 400 }}>
            <div style={{ background: "#f7f7f7", borderRadius: 6, padding: 10 }}>
              <p style={{ fontSize: 12, color: "#777", margin: 0 }}>
                {found.category} · {found.variant}
              </p>
              <strong>{found.generatedName}</strong>
              <p style={{ fontSize: 12, color: "#777", marginTop: 6 }}>
                Startfähigkeiten: {found.individualAbilities.map((a) => a.name).join(", ") || "keine"}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button disabled={busy} onClick={bind}>
                {busy ? "..." : "Binden"}
              </button>
              <button disabled={busy} onClick={search}>
                Nochmal suchen (ergibt evtl. andere Variante/Fähigkeiten)
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const currentStageName = faction.corePowerStages[character.uniquePower.stageIndex];
  const isMaxStage = character.uniquePower.stageIndex >= faction.corePowerStages.length - 1;

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, marginTop: 16 }}>
      <h3 style={{ marginTop: 0 }}>
        {faction.corePowerLabel}: {character.uniquePower.generatedName}
      </h3>
      <p style={{ fontSize: 14, color: "#555" }}>
        {character.uniquePower.category} · {character.uniquePower.variant}
      </p>
      <p>
        Stufe {character.uniquePower.stageIndex + 1}/{faction.corePowerStages.length}:{" "}
        <strong>{currentStageName}</strong>
      </p>
      {character.uniquePower.individualAbilities.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {character.uniquePower.individualAbilities.map((a, i) => (
            <AbilityListItem key={i} ability={a} />
          ))}
        </ul>
      )}
      <details style={{ marginTop: 8 }}>
        <summary style={{ cursor: "pointer", fontSize: 13, color: "#777" }}>Entwicklungs-Geschichte</summary>
        <ul style={{ fontSize: 13, color: "#666" }}>
          {character.uniquePower.developmentLog.map((entry, i) => (
            <li key={i}>{entry}</li>
          ))}
        </ul>
      </details>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <button onClick={advance} disabled={busy || isMaxStage} style={{ marginTop: 8 }}>
        {isMaxStage ? "Unbegrenzte Weiterentwicklung erreicht" : busy ? "..." : "Nächste Stufe"}
      </button>
    </div>
  );
}
