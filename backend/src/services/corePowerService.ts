import { FACTIONS } from "../data/factions.js";
import { CORE_POWER_ARCHETYPES } from "../data/corePowerArchetypes.js";
import { CharacterStore } from "../db/memoryStore.js";
import { getKampfkraft } from "./characterService.js";
import { stageThresholdFor } from "../types/corePowerThresholds.js";
import { ValidationError } from "./characterService.js";
import type { Character } from "../types/character.js";
import type { CorePowerArchetype } from "../types/corePowerArchetype.js";

function archetypesFor(character: Character): CorePowerArchetype[] {
  return CORE_POWER_ARCHETYPES.filter(
    (a) => a.worldId === character.worldId && a.factionIds.includes(character.factionId)
  );
}

/**
 * "Finden" statt frei eintippen: liefert eine zufällige, feste Kernmacht aus
 * dem Katalog der eigenen Welt/Fraktion - mit festem Eigennamen. Bindet noch
 * nichts, das passiert erst über acquireCorePower.
 */
export function searchForCorePower(characterId: string): CorePowerArchetype {
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);
  if (character.corePower) {
    throw new ValidationError("Charakter besitzt bereits eine Kernmacht");
  }

  const kampfkraft = getKampfkraft(character);
  const requiredMin = stageThresholdFor(0);
  if (kampfkraft < requiredMin) {
    throw new ValidationError(
      `Kampfkraft zu niedrig (${kampfkraft.toFixed(0)}/${requiredMin}). Trainiere erst weiter.`
    );
  }

  const candidates = archetypesFor(character);
  if (candidates.length === 0) {
    throw new ValidationError("Kein Kernmacht-Archetyp für diese Welt/Fraktion im Katalog");
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}

/** Bindet eine zuvor gefundene Kernmacht (archetypeId muss aus searchForCorePower stammen). Kein Freitext möglich. */
export function acquireCorePower(characterId: string, archetypeId: string): Character {
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);
  if (character.corePower) {
    throw new ValidationError("Charakter besitzt bereits eine Kernmacht");
  }

  const archetype = CORE_POWER_ARCHETYPES.find((a) => a.id === archetypeId);
  if (!archetype) throw new ValidationError(`Archetyp "${archetypeId}" nicht im Katalog`);
  if (archetype.worldId !== character.worldId || !archetype.factionIds.includes(character.factionId)) {
    throw new ValidationError("Dieser Archetyp gehört nicht zur Welt/Fraktion des Charakters");
  }

  const kampfkraft = getKampfkraft(character);
  const requiredMin = stageThresholdFor(0);
  if (kampfkraft < requiredMin) {
    throw new ValidationError(
      `Kampfkraft zu niedrig (${kampfkraft.toFixed(0)}/${requiredMin}). Trainiere erst weiter.`
    );
  }

  character.corePower = {
    archetypeId: archetype.id,
    typeLabel: archetype.typeLabel,
    name: archetype.properName,
    stageIndex: 0,
    unlockedAbilities: [...archetype.abilitiesByStage[0]],
  };

  return CharacterStore.save(character);
}

export function advanceCorePowerStage(characterId: string): Character {
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);
  if (!character.corePower) {
    throw new ValidationError("Charakter besitzt noch keine Kernmacht");
  }

  const faction = FACTIONS.find((f) => f.id === character.factionId);
  if (!faction) throw new ValidationError("Fraktion nicht gefunden");

  const archetype = CORE_POWER_ARCHETYPES.find((a) => a.id === character.corePower!.archetypeId);
  if (!archetype) throw new ValidationError("Archetyp nicht mehr im Katalog gefunden");

  const maxStageIndex = faction.corePowerStages.length - 1;
  if (character.corePower.stageIndex >= maxStageIndex) {
    throw new ValidationError(
      "Kernmacht ist bereits in unbegrenzter Weiterentwicklung - keine weitere Stufe zum Freischalten."
    );
  }

  const nextStageIndex = character.corePower.stageIndex + 1;
  const kampfkraft = getKampfkraft(character);
  const required = stageThresholdFor(nextStageIndex);
  if (kampfkraft < required) {
    throw new ValidationError(
      `Kampfkraft zu niedrig für nächste Stufe (${kampfkraft.toFixed(0)}/${required}).`
    );
  }

  character.corePower.stageIndex = nextStageIndex;
  const newAbilities = archetype.abilitiesByStage[nextStageIndex] ?? [];
  character.corePower.unlockedAbilities.push(...newAbilities);

  return CharacterStore.save(character);
}
