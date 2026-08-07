import { TrainingPanel } from "../components/TrainingPanel";
import { CorePowerPanel } from "../components/CorePowerPanel";
import type { Character, Faction } from "../types/models";

export function Dashboard({
  character,
  faction,
  onUpdated,
}: {
  character: Character;
  faction: Faction;
  onUpdated: (c: Character) => void;
}) {
  return (
    <section>
      <h2>{character.characterName}</h2>
      <p>
        Welt: <strong>{character.worldId}</strong> &middot; Fraktion: <strong>{faction.name}</strong>
      </p>
      <p>Kampfkraft: {character.kampfkraft ?? 0}</p>
      <p>Selbst vergebener Rang: {character.selfAssignedRank ?? "keiner"}</p>

      <TrainingPanel character={character} onUpdated={onUpdated} />
      <CorePowerPanel character={character} faction={faction} onUpdated={onUpdated} />
    </section>
  );
}
