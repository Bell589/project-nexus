import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Faction, World } from "../types/models";

export function FactionSelect({
  world,
  onSelect,
  onBack,
}: {
  world: World;
  onSelect: (faction: Faction) => void;
  onBack: () => void;
}) {
  const [factions, setFactions] = useState<Faction[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getFactions(world.id).then(setFactions).catch((e) => setError(e.message));
  }, [world.id]);

  if (error) return <p style={{ color: "crimson" }}>Fehler: {error}</p>;

  return (
    <section>
      <button onClick={onBack}>&larr; Zurück</button>
      <h2>{world.name}: Fraktion wählen</h2>
      <div style={{ display: "grid", gap: 12 }}>
        {factions.map((faction) => (
          <button
            key={faction.id}
            onClick={() => onSelect(faction)}
            style={{ textAlign: "left", padding: 16, cursor: "pointer" }}
          >
            <strong>{faction.name}</strong>
            <p style={{ margin: "4px 0" }}>{faction.description}</p>
            <small>Kernmacht: {faction.corePowerLabel}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
