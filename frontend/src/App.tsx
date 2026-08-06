import { useState } from "react";
import { WorldSelect } from "./pages/WorldSelect";
import { FactionSelect } from "./pages/FactionSelect";
import { CharacterCreate } from "./pages/CharacterCreate";
import { Dashboard } from "./pages/Dashboard";
import type { World, Faction, Character } from "./types/models";

type Step =
  | { name: "world" }
  | { name: "faction"; world: World }
  | { name: "create"; world: World; faction: Faction }
  | { name: "dashboard"; character: Character };

export default function App() {
  const [step, setStep] = useState<Step>({ name: "world" });

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24, fontFamily: "system-ui" }}>
      <h1>Project Nexus</h1>

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
          onCreated={(character) => setStep({ name: "dashboard", character })}
        />
      )}

      {step.name === "dashboard" && <Dashboard character={step.character} />}
    </main>
  );
}
