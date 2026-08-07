import { useEffect, useState } from "react";
import { api } from "../api/client";
import { TrainingPanel } from "../components/TrainingPanel";
import { CorePowerPanel } from "../components/CorePowerPanel";
import { CrewPanel } from "../components/CrewPanel";
import type { Character, Faction } from "../types/models";

export function Dashboard({ character: initial }: { character: Character }) {
  const [character, setCharacter] = useState(initial);
  const [faction, setFaction] = useState<Faction | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getFactions(character.worldId)
      .then((factions) => {
        const f = factions.find((f) => f.id === character.factionId) ?? null;
        setFaction(f);
      })
      .catch((e) => setError(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character.worldId, character.factionId]);

  if (error) return <p style={{ color: "crimson" }}>Fehler: {error}</p>;
  if (!faction) return <p>Lade...</p>;

  return (
    <section>
      <h2>{character.characterName}</h2>
      <p>
        Welt: <strong>{character.worldId}</strong> &middot; Fraktion: <strong>{faction.name}</strong>
      </p>
      <p>Kampfkraft: {character.kampfkraft ?? 0}</p>
      <p>Selbst vergebener Rang: {character.selfAssignedRank ?? "keiner"}</p>

      <TrainingPanel character={character} onUpdated={setCharacter} />
      <CorePowerPanel character={character} faction={faction} onUpdated={setCharacter} />
      {character.worldId === "ozeanwelt" && (
        <CrewPanel character={character} onCharacterUpdated={setCharacter} />
      )}
    </section>
  );
}
