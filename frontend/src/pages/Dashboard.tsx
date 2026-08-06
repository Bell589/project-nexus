import type { Character } from "../types/models";

export function Dashboard({ character }: { character: Character }) {
  return (
    <section>
      <h2>{character.characterName}</h2>
      <p>
        Welt: <strong>{character.worldId}</strong> &middot; Fraktion:{" "}
        <strong>{character.factionId}</strong>
      </p>
      <p>Kampfkraft: {character.kampfkraft ?? 0}</p>
      <p>
        Kernmacht:{" "}
        {character.corePower
          ? `${character.corePower.name} (Stufe ${character.corePower.stageIndex})`
          : "noch nicht erhalten"}
      </p>
      <p>Selbst vergebener Rang: {character.selfAssignedRank ?? "keiner"}</p>
    </section>
  );
}
