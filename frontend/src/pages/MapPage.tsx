import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Character, GameLocation } from "../types/models";

export function MapPage({ character }: { character: Character }) {
  const [locations, setLocations] = useState<GameLocation[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getLocations(character.worldId).then(setLocations).catch((e) => setError(e.message));
  }, [character.worldId]);

  if (error) return <p style={{ color: "crimson" }}>Fehler: {error}</p>;

  return (
    <section>
      <h2>Karte</h2>
      <p style={{ fontSize: 14, color: "#777" }}>
        Textbasierte Orte-Übersicht — echte Kartendarstellung folgt später.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
        {locations.map((loc) => (
          <div key={loc.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
            <strong>{loc.name}</strong>
            <p style={{ fontSize: 12, color: "#777", margin: "2px 0" }}>{loc.type}</p>
            <p style={{ margin: 0 }}>{loc.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
