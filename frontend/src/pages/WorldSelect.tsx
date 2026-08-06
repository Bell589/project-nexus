import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { World } from "../types/models";

export function WorldSelect({ onSelect }: { onSelect: (world: World) => void }) {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getWorlds().then(setWorlds).catch((e) => setError(e.message));
  }, []);

  if (error) return <p style={{ color: "crimson" }}>Fehler: {error}</p>;

  return (
    <section>
      <h2>Wähle deine Hauptwelt</h2>
      <div style={{ display: "grid", gap: 12 }}>
        {worlds.map((world) => (
          <button
            key={world.id}
            onClick={() => onSelect(world)}
            style={{ textAlign: "left", padding: 16, cursor: "pointer" }}
          >
            <strong>{world.name}</strong>
            <p style={{ margin: "4px 0 0" }}>{world.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
