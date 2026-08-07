import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Navbar, type GameView } from "../components/Navbar";
import { Dashboard } from "./Dashboard";
import { InventoryPage } from "./InventoryPage";
import { SkillsPage } from "./SkillsPage";
import { MapPage } from "./MapPage";
import { MissionsPage } from "./MissionsPage";
import { CombatPage } from "./CombatPage";
import { CrewPage } from "./CrewPage";
import type { Character, Faction } from "../types/models";

export function Game({ character: initial }: { character: Character }) {
  const [character, setCharacter] = useState(initial);
  const [faction, setFaction] = useState<Faction | null>(null);
  const [view, setView] = useState<GameView>("overview");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getFactions(character.worldId)
      .then((factions) => setFaction(factions.find((f) => f.id === character.factionId) ?? null))
      .catch((e) => setError(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character.worldId, character.factionId]);

  if (error) return <p style={{ color: "crimson" }}>Fehler: {error}</p>;
  if (!faction) return <p>Lade...</p>;

  const showCrewTab = character.worldId === "ozeanwelt";

  return (
    <div>
      <Navbar active={view} onChange={setView} showCrewTab={showCrewTab} />

      {view === "overview" && (
        <Dashboard character={character} faction={faction} onUpdated={setCharacter} />
      )}
      {view === "inventory" && <InventoryPage character={character} onUpdated={setCharacter} />}
      {view === "skills" && (
        <SkillsPage character={character} faction={faction} onUpdated={setCharacter} />
      )}
      {view === "map" && <MapPage character={character} />}
      {view === "missions" && <MissionsPage character={character} onUpdated={setCharacter} />}
      {view === "combat" && <CombatPage character={character} onUpdated={setCharacter} />}
      {view === "crew" && showCrewTab && <CrewPage character={character} onUpdated={setCharacter} />}
    </div>
  );
}
