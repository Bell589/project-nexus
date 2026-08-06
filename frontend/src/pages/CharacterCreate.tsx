import { useState } from "react";
import { api } from "../api/client";
import type { Character, Faction, World } from "../types/models";

export function CharacterCreate({
  world,
  faction,
  onCreated,
  onBack,
}: {
  world: World;
  faction: Faction;
  onCreated: (character: Character) => void;
  onBack: () => void;
}) {
  const [ownerName, setOwnerName] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const character = await api.createCharacter({
        ownerName,
        characterName,
        worldId: world.id,
        factionId: faction.id,
      });
      onCreated(character);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <button onClick={onBack}>&larr; Zurück</button>
      <h2>
        {world.name} / {faction.name}: Charakter erstellen
      </h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 360 }}>
        <label>
          Spielername
          <input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required />
        </label>
        <label>
          Charaktername
          <input value={characterName} onChange={(e) => setCharacterName(e.target.value)} required />
        </label>
        {error && <p style={{ color: "crimson" }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Erstelle..." : "Charakter erstellen"}
        </button>
      </form>
    </section>
  );
}
