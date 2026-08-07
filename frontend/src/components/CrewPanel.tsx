import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Character, Crew, CrewRole } from "../types/models";

const ASSIGNABLE_ROLES: CrewRole[] = ["Offizier", "Kommandant", "Stellvertreter", "Mitglied"];

export function CrewPanel({
  character,
  onCharacterUpdated,
}: {
  character: Character;
  onCharacterUpdated: (c: Character) => void;
}) {
  const [allCrews, setAllCrews] = useState<Crew[]>([]);
  const [myCrew, setMyCrew] = useState<Crew | null>(null);
  const [newCrewName, setNewCrewName] = useState("");
  const [joinCrewId, setJoinCrewId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const crews = await api.listCrews();
    setAllCrews(crews);
    setMyCrew(crews.find((c) => c.id === character.crewId) ?? null);
  }

  useEffect(() => {
    refresh().catch((e) => setError(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character.crewId]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.createCrew(character.id, newCrewName);
      const updatedChar = await api.getCharacter(character.id);
      onCharacterUpdated(updatedChar);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setBusy(false);
    }
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.joinCrew(joinCrewId, character.id);
      const updatedChar = await api.getCharacter(character.id);
      onCharacterUpdated(updatedChar);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setBusy(false);
    }
  }

  async function handleAssignRole(targetCharacterId: string, role: CrewRole) {
    if (!myCrew) return;
    setBusy(true);
    setError(null);
    try {
      await api.assignCrewRole(myCrew.id, character.id, targetCharacterId, role);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setBusy(false);
    }
  }

  const joinableCrews = allCrews.filter(
    (c) => c.factionId === character.factionId && c.id !== character.crewId
  );

  if (myCrew) {
    const isCaptain = myCrew.members.find((m) => m.characterId === character.id)?.role === "Captain";
    return (
      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Crew: {myCrew.name}</h3>
        {error && <p style={{ color: "crimson" }}>{error}</p>}
        <ul>
          {myCrew.members.map((m) => (
            <li key={m.characterId}>
              {m.characterId === character.id ? "Du" : m.characterId} — <strong>{m.role}</strong>
              {isCaptain && m.role !== "Captain" && (
                <select
                  style={{ marginLeft: 8 }}
                  defaultValue=""
                  disabled={busy}
                  onChange={(e) => {
                    if (e.target.value) handleAssignRole(m.characterId, e.target.value as CrewRole);
                  }}
                >
                  <option value="" disabled>
                    Rolle ändern...
                  </option>
                  {ASSIGNABLE_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, marginTop: 16 }}>
      <h3 style={{ marginTop: 0 }}>Crew</h3>
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <form onSubmit={handleCreate} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Neue Crew gründen..."
          value={newCrewName}
          onChange={(e) => setNewCrewName(e.target.value)}
          required
        />
        <button type="submit" disabled={busy}>
          Gründen
        </button>
      </form>

      {joinableCrews.length > 0 && (
        <form onSubmit={handleJoin} style={{ display: "flex", gap: 8 }}>
          <select value={joinCrewId} onChange={(e) => setJoinCrewId(e.target.value)} required>
            <option value="" disabled>
              Bestehender Crew beitreten...
            </option>
            {joinableCrews.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.members.length} Mitglieder)
              </option>
            ))}
          </select>
          <button type="submit" disabled={busy}>
            Beitreten
          </button>
        </form>
      )}
    </div>
  );
}
