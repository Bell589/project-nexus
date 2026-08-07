import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Character, CombatResult, Enemy } from "../types/models";

export function CombatPage({
  character,
  onUpdated,
}: {
  character: Character;
  onUpdated: (c: Character) => void;
}) {
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<CombatResult | null>(null);

  useEffect(() => {
    api.getEnemies(character.id).then(setEnemies).catch((e) => setError(e.message));
  }, [character.id]);

  async function fight(enemyId: string) {
    setBusy(enemyId);
    setError(null);
    setLastResult(null);
    try {
      const result = await api.fight(enemyId, character.id);
      setLastResult(result);
      onUpdated(result.character);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setBusy(null);
    }
  }

  return (
    <section>
      <h2>Kampf</h2>
      <p style={{ fontSize: 14, color: "#777" }}>
        Vereinfachtes Modell: Sieg-Chance = deine Kampfkraft / (deine + gegnerische Kampfkraft).
      </p>
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {lastResult && (
        <div
          style={{
            border: `1px solid ${lastResult.won ? "#2a7" : "#c33"}`,
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
          }}
        >
          {lastResult.won ? "Sieg!" : "Niederlage."} Deine Kampfkraft: {lastResult.characterPower.toFixed(0)} vs.
          Gegner: {lastResult.enemyPower}
        </div>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {enemies.map((enemy) => (
          <div key={enemy.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
            <strong>{enemy.name}</strong> — Kampfkraft {enemy.kampfkraft}
            <p style={{ margin: "4px 0" }}>{enemy.description}</p>
            <button disabled={busy === enemy.id} onClick={() => fight(enemy.id)}>
              {busy === enemy.id ? "Kämpft..." : "Angreifen"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
