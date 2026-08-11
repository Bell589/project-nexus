import { nanoid } from "nanoid";
import { CharacterStore } from "../db/memoryStore.js";
import { ValidationError } from "./characterService.js";
import type { Character } from "../types/character.js";
import type { KampfkraftComponents } from "../types/kampfkraft.js";

export function fuseCharacters(
  characterAId: string,
  characterBId: string,
  newCharacterName: string
): Character {
  if (characterAId === characterBId) {
    throw new ValidationError("Ein Charakter kann nicht mit sich selbst fusionieren");
  }

  const a = CharacterStore.get(characterAId);
  const b = CharacterStore.get(characterBId);
  if (!a) throw new ValidationError(`Charakter "${characterAId}" nicht gefunden`);
  if (!b) throw new ValidationError(`Charakter "${characterBId}" nicht gefunden`);

  if (a.worldId !== "avalon" || b.worldId !== "avalon") {
    throw new ValidationError("Fusion ist nur in Avalon möglich");
  }
  if (a.factionId !== "magier" || b.factionId !== "magier") {
    throw new ValidationError("Nur Magier können fusionieren");
  }
  if (a.fusedInto || b.fusedInto) {
    throw new ValidationError("Ein bereits fusionierter Charakter kann nicht erneut fusionieren");
  }
  if (!newCharacterName?.trim()) {
    throw new ValidationError("newCharacterName darf nicht leer sein");
  }

  const combinedComponents = {} as KampfkraftComponents;
  for (const key of Object.keys(a.kampfkraftComponents) as (keyof KampfkraftComponents)[]) {
    combinedComponents[key] = a.kampfkraftComponents[key] + b.kampfkraftComponents[key];
  }

  const combinedSkills = [...a.skills];
  for (const bSkill of b.skills) {
    const existing = combinedSkills.find((s) => s.name === bSkill.name);
    if (existing) {
      existing.level = Math.max(existing.level, bSkill.level);
    } else {
      combinedSkills.push({ ...bSkill });
    }
  }

  const fused: Character = {
    id: nanoid(),
    ownerName: `${a.ownerName} & ${b.ownerName}`,
    characterName: newCharacterName.trim(),
    worldId: "avalon",
    factionId: "magier",
    kampfkraftComponents: combinedComponents,
    corePower:
      a.corePower && b.corePower
        ? {
            archetypeId: a.corePower.archetypeId,
            typeLabel: `Fusion: ${a.corePower.typeLabel} + ${b.corePower.typeLabel}`,
            name: `${a.corePower.name} / ${b.corePower.name}`,
            stageIndex: Math.max(a.corePower.stageIndex, b.corePower.stageIndex),
            unlockedAbilities: [...a.corePower.unlockedAbilities, ...b.corePower.unlockedAbilities],
          }
        : a.corePower ?? b.corePower,
    selfAssignedRank: null,
    crewId: null,
    inventory: [...a.inventory, ...b.inventory],
    equipped: { waffe: null, ruestung: null, accessoire: null },
    skills: combinedSkills,
    completedMissionIds: Array.from(new Set([...a.completedMissionIds, ...b.completedMissionIds])),
    activeDomainRuleId: null,
    fusedInto: null,
    spektralritterPact: a.spektralritterPact ?? b.spektralritterPact,
    createdAt: new Date().toISOString(),
  };

  a.fusedInto = fused.id;
  b.fusedInto = fused.id;
  CharacterStore.save(a);
  CharacterStore.save(b);
  CharacterStore.save(fused);

  return fused;
}
