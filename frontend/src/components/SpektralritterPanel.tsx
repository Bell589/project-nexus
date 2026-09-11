import { useState } from "react";
import { api } from "../api/client";
import type { Character, UniquePowerInstance } from "../types/models";

const STAGES = ["Pakt", "Resonanz", "Beschwörungsbeherrschung", "Teilverschmelzung", "Vollständige Verschmelzung", "Erwachte Verschmelzung"];

export function SpektralritterPanel({
  character,
  onUpdated,
}: {
  character: Character;
  onUpdated: (c: Character) => void;
}) {
  const [found, setFound] = useState<UniquePowerInstance | null>(null);
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

  async function bind() {
    if (!found) return;
    setBusy(true);
    setError(null);
    try {
      const updated = await api.formPact(character.id, found);
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
          Ein Pakt mit einem Spektralritter ist unabhängig von deiner einzigartigen Magie. Viele
          individuelle Ritter mit unterschiedlichen Rollen existieren - Name und Fähigkeiten
          werden individuell generiert.
        </p>
        {error && <p style={{ color: "crimson" }}>{error}</p>}
        {!found ? (
          <button disabled={busy} onClick={search}>
            {busy ? "Suche..." : "Spektralritter suchen"}
          </button>
        ) : (
          <div style={{ display: "grid", gap: 8, maxWidth: 400 }}>
            <div style={{ background: "#f7f7f7", borderRadius: 6, padding: 10 }}>
              <p style={{ fontSize: 12, color: "#777", margin: 0 }}>Rolle: {found.variant}</p>
              <strong>{found.generatedName}</strong>
              <p style={{ fontSize: 12, color: "#777", marginTop: 6 }}>
                Startfähigkeiten: {found.individualAbilities.map((a) => a.name).join(", ") || "keine"}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button disabled={busy} onClick={bind}>
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
      <h3 style={{ marginTop: 0 }}>Spektralritter: {pact.generatedName}</h3>
      <p style={{ fontSize: 14, color: "#555" }}>Rolle: {pact.variant}</p>
      <p>
        Stufe {pact.stageIndex + 1}/{STAGES.length}: <strong>{STAGES[pact.stageIndex]}</strong>
      </p>
      <div style={{background:"#f7f7f7",padding:10,borderRadius:6}}><strong>Rittertechniken</strong><p style={{fontSize:13}}>Diese Fähigkeiten gehören dem Ritter. Der Magier kann sie nicht selbst einsetzen. Beschwöre ihn im Kampf; danach erscheinen sie als eigene Ritteraktionen.</p><ul>{pact.individualAbilities.map((a,i)=><li key={i}><b>{a.name}</b> — {a.description}</li>)}</ul></div>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <button onClick={advance} disabled={busy || isMaxStage}>
        {isMaxStage ? "Unbegrenzte Weiterentwicklung erreicht" : busy ? "..." : "Nächste Stufe"}
      </button>
    </div>
  );
}
