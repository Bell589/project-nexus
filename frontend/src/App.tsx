import { useState } from "react";
import { Home } from "./pages/Home";
import { WorldSelect } from "./pages/WorldSelect";
import { FactionSelect } from "./pages/FactionSelect";
import { CharacterCreate } from "./pages/CharacterCreate";
import { Game } from "./pages/Game";
import type { World, Faction, Character } from "./types/models";

type Step =
  | { name: "home" }
  | { name: "world" }
  | { name: "faction"; world: World }
  | { name: "create"; world: World; faction: Faction }
  | { name: "game"; character: Character };

export default function App() {
  const [step, setStep] = useState<Step>({ name: "home" });

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24, fontFamily: "system-ui" }}>
      {step.name !== "home" && <h1 style={{ fontSize: 22 }}>Project Nexus</h1>}

      {step.name === "home" && <Home onStart={() => setStep({ name: "world" })} />}

      {step.name === "world" && (
        <WorldSelect onSelect={(world) => setStep({ name: "faction", world })} />
      )}

      {step.name === "faction" && (
        <FactionSelect
          world={step.world}
          onBack={() => setStep({ name: "world" })}
          onSelect={(faction) => setStep({ name: "create", world: step.world, faction })}
        />
      )}

      {step.name === "create" && (
        <CharacterCreate
          world={step.world}
          faction={step.faction}
          onBack={() => setStep({ name: "faction", world: step.world })}
          onCreated={(character) => setStep({ name: "game", character })}
        />
      )}

      {step.name === "game" && <Game character={step.character} />}
    </main>
  );
}
