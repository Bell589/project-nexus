import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Character, GameLocation } from "../types/models";

const TYPE_COLOR: Record<string, string> = {
  insel: "#2a7",
  hauptquartier: "#c33",
  seelenbezirk: "#66c",
  ort_der_macht: "#a5c",
  arkaner_knoten: "#e90",
  dungeon: "#555",
};

export function MapPage({ character }: { character: Character }) {
  const [locations, setLocations] = useState<GameLocation[]>([]);
  const [controllers, setControllers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<GameLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.getLocations(character.worldId).then(setLocations).catch((e) => setError(e.message));
    if (character.worldId === "avalon") {
      api.getArcaneControllers().then(setControllers).catch(() => {});
    }
  }, [character.worldId]);

  async function claim(locationId: string) {
    setBusy(true);
    setError(null);
    try {
      const result = await api.claimArcaneNode(locationId, character.id);
      setControllers(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setBusy(false);
    }
  }

  if (error && locations.length === 0) return <p style={{ color: "crimson" }}>Fehler: {error}</p>;

  return (
    <section>
      <h2>Karte</h2>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <svg
          viewBox="0 0 100 100"
          style={{ width: "100%", background: "#f4f4f4", borderRadius: 8, border: "1px solid #ddd" }}
        >
          {locations.map((loc) => (
            <g key={loc.id} onClick={() => setSelected(loc)} style={{ cursor: "pointer" }}>
              <circle
                cx={loc.x}
                cy={loc.y}
                r={selected?.id === loc.id ? 3.2 : 2.4}
                fill={TYPE_COLOR[loc.type] ?? "#888"}
                stroke={controllers[loc.id] === character.id ? "#000" : "none"}
                strokeWidth={0.6}
              />
              <text x={loc.x} y={loc.y - 3.5} fontSize={2.6} textAnchor="middle" fill="#333">
                {loc.name}
              </text>
            </g>
          ))}
        </svg>

        <div>
          {selected ? (
            <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
              <strong>{selected.name}</strong>
              <p style={{ fontSize: 12, color: "#777", margin: "2px 0" }}>{selected.type}</p>
              <p>{selected.description}</p>
              {selected.type === "arkaner_knoten" && (
                <>
                  <p style={{ fontSize: 13 }}>
                    Kontrolliert von:{" "}
                    {controllers[selected.id]
                      ? controllers[selected.id] === character.id
                        ? "Dir"
                        : controllers[selected.id]
                      : "niemandem"}
                  </p>
                  {error && <p style={{ color: "crimson" }}>{error}</p>}
                  <button disabled={busy} onClick={() => claim(selected.id)}>
                    Beanspruchen
                  </button>
                </>
              )}
            </div>
          ) : (
            <p style={{ color: "#777" }}>Ort anklicken für Details.</p>
          )}
        </div>
      </div>
    </section>
  );
}
