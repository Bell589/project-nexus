import { useState } from "react";
import { api } from "../api/client";
import type { Character, Faction } from "../types/models";

export function SkillsPage({
  character,
  faction,
  onUpdated,
}: {
  character: Character;
  faction: Faction;
  onUpdated: (c: Character) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function train(skillName: string) {
    setBusy(skillName);
    setError(null);
    try {
      onUpdated(await api.trainSkill(character.id, skillName));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setBusy(null);
    }
  }

  return (
    <section>
      <h2>Fähigkeiten von {faction.name}</h2>
      <p style={{ fontSize: 14, color: "#555" }}>
        Fähigkeiten-Kampfkraft vorhanden: {character.kampfkraftComponents.faehigkeiten} (10 pro
        Stufe nötig)
      </p>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <div style={{ display: "grid", gap: 8 }}>
        {faction.baseSkills.map((skillName) => {
          const level = character.skills.find((s) => s.name === skillName)?.level ?? 0;
          return (
            <div
              key={skillName}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: "8px 12px",
              }}
            >
              <span>
                {skillName} — Stufe {level}
              </span>
              <button disabled={busy === skillName} onClick={() => train(skillName)}>
                {busy === skillName ? "..." : "Trainieren"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
