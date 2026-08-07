import { CrewPanel } from "../components/CrewPanel";
import type { Character } from "../types/models";

export function CrewPage({
  character,
  onUpdated,
}: {
  character: Character;
  onUpdated: (c: Character) => void;
}) {
  return (
    <section>
      <h2>Crew &amp; Flotte</h2>
      <CrewPanel character={character} onCharacterUpdated={onUpdated} />
    </section>
  );
}
