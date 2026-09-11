import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Character, Mission } from "../types/models";

export function MissionsPage({
  character,
  onUpdated,
}: {
  character: Character;
  onUpdated: (c: Character) => void;
}) {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    api.getMissions(character.id).then(setMissions).catch((e) => setError(e.message));
  }, [character.id]);

  async function complete(missionId: string) {
    setBusy(missionId);
    setError(null);
    try {
      onUpdated(await api.completeMission(missionId, character.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setBusy(null);
    }
  }

  return (
    <section>
      <h2>Missionen</h2>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <div style={{ display: "grid", gap: 12 }}>
        {missions.map((m) => {
          const done = character.completedMissionIds.includes(m.id);
          return (
            <div key={m.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
              <strong>{m.title}</strong>
              <p style={{ margin: "4px 0" }}>{m.description}</p>
              <p style={{ fontSize: 12, color: "#777" }}>
                Mindest-Kampfkraft: {m.minKampfkraft} &middot; Belohnung:{" "}
                {Object.entries(m.rewardComponents)
                  .map(([k, v]) => `${k} +${v}`)
                  .join(", ")}
                {m.rewardGold ? ` · Gold: ${m.rewardGold}` : " · Gold: 100"}{m.rewardItemId ? ` + Item: ${m.rewardItemId}` : ""}
                {m.requiredLocationId ? ` · Missionsort: ${m.requiredLocationId}` : ""}
              </p>
              {m.requiredLocationId&&character.currentLocationId!==m.requiredLocationId&&<p style={{fontSize:12,color:"#8a5a00"}}>🔒 Reise zuerst zum Missionsort.</p>}
              <button disabled={done || busy === m.id || (!!m.requiredLocationId&&character.currentLocationId!==m.requiredLocationId)} onClick={() => complete(m.id)}>
                {done ? "Abgeschlossen" : busy === m.id ? "..." : "Abschließen"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
