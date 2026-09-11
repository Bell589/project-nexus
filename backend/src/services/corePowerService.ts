import { FACTIONS } from "../data/factions.js";
import { UNIQUE_POWER_ORIGINS } from "../data/uniquePowerOrigins.js";
import { LOCATIONS } from "../data/locations.js";
import { CharacterStore } from "../db/memoryStore.js";
import { getKampfkraft } from "./characterService.js";
import { stageThresholdFor } from "../types/corePowerThresholds.js";
import { ValidationError } from "./characterService.js";
import { generateUniquePower, advanceUniquePower as advanceInstance } from "./uniquePowerGenerationService.js";
import type { Character } from "../types/character.js";
import type { UniquePowerOrigin, UniquePowerInstance } from "../types/uniquePower.js";

// Diese Kategorien haben eigene, separate Slots/Endpunkte und dürfen NICHT
// über die allgemeine Haupt-Unique-Power-Suche gezogen werden.
const EXCLUDED_FROM_MAIN_SEARCH = new Set(["Spektralritter", "Dōjutsu"]);

function originsFor(character: Character): UniquePowerOrigin[] {
  return UNIQUE_POWER_ORIGINS.filter(
    (o) =>
      o.worldId === character.worldId &&
      o.factionIds.includes(character.factionId) &&
      !EXCLUDED_FROM_MAIN_SEARCH.has(o.category)
  );
}

/**
 * "Finden" statt frei eintippen: erzeugt eine individuell generierte
 * Ausprägung (Name, Variante, Startfähigkeiten) aus einem zufälligen
 * Origin-Pool der eigenen Welt/Fraktion. Bindet noch nichts - das passiert
 * erst über acquireUniquePower. Zwei Aufrufe können unterschiedliche
 * Ergebnisse liefern, auch bei identischer Origin.
 */
export function searchForUniquePower(characterId: string) {
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);
  if (character.uniquePower) {
    throw new ValidationError("Charakter besitzt bereits eine Unique Power");
  }

  if(character.origin.status!=="completed") throw new ValidationError("Schließe zuerst deinen Welt-Ursprung ab, bevor du nach einer seltenen Kernmacht suchst.");
  const loc=LOCATIONS.find(l=>l.id===character.currentLocationId);
  if(character.worldId==="ozeanwelt" && !["insel-sturmklippe","insel-goldbucht"].includes(character.currentLocationId??"")) throw new ValidationError("Reliktspuren findest du aktuell nur auf erforschbaren Inseln.");
  if(character.worldId==="avalon" && loc?.type!=="ort_der_macht") throw new ValidationError("Ancient/Unique Magic kann nur an einem Ort der Macht entdeckt werden. Reise zuerst dorthin.");
  if(character.worldId==="soul_society" && character.factionId==="hollow" && character.completedMissionIds.length<1) throw new ValidationError("Resurrección-Potenzial entsteht erst nach mindestens einer abgeschlossenen Jagd/Mission.");

  const kampfkraft = getKampfkraft(character);
  const requiredMin = stageThresholdFor(0);
  if (kampfkraft < requiredMin) {
    throw new ValidationError(
      `Kampfkraft zu niedrig (${kampfkraft.toFixed(0)}/${requiredMin}). Trainiere erst weiter.`
    );
  }

  const candidates = originsFor(character);
  if (candidates.length === 0) {
    throw new ValidationError("Kein Unique-Power-Ursprung für diese Welt/Fraktion im System");
  }

  const origin = candidates[Math.floor(Math.random() * candidates.length)];
  return generateUniquePower(origin);
}

/** Bindet eine zuvor generierte, individuelle Ausprägung dauerhaft an den Charakter.
 * Nimmt exakt die Instanz entgegen, die searchForUniquePower geliefert hat -
 * es wird NICHT erneut gewürfelt, sonst würde der Spieler etwas anderes
 * bekommen als ihm beim Suchen gezeigt wurde. */
export function acquireUniquePower(characterId: string, instance: UniquePowerInstance): Character {
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);
  if (character.uniquePower) {
    throw new ValidationError("Charakter besitzt bereits eine Unique Power");
  }
  if (!instance?.originId) {
    throw new ValidationError("Ungültige Unique-Power-Instanz - fehlendes originId");
  }

  const origin = UNIQUE_POWER_ORIGINS.find((o) => o.id === instance.originId);
  if (!origin) throw new ValidationError(`Origin "${instance.originId}" nicht gefunden`);
  if (origin.worldId !== character.worldId || !origin.factionIds.includes(character.factionId)) {
    throw new ValidationError("Diese Origin gehört nicht zur Welt/Fraktion des Charakters");
  }

  const kampfkraft = getKampfkraft(character);
  const requiredMin = stageThresholdFor(0);
  if (kampfkraft < requiredMin) {
    throw new ValidationError(
      `Kampfkraft zu niedrig (${kampfkraft.toFixed(0)}/${requiredMin}). Trainiere erst weiter.`
    );
  }

  character.uniquePower = {
    originId: instance.originId,
    category: instance.category,
    variant: instance.variant,
    generatedName: instance.generatedName,
    stageIndex: 0,
    individualAbilities: instance.individualAbilities,
    developmentLog: instance.developmentLog,
  };
  return CharacterStore.save(character);
}

export function advanceUniquePowerStage(characterId: string): Character {
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);
  if (!character.uniquePower) {
    throw new ValidationError("Charakter besitzt noch keine Unique Power");
  }

  const faction = FACTIONS.find((f) => f.id === character.factionId);
  if (!faction) throw new ValidationError("Fraktion nicht gefunden");

  const origin = UNIQUE_POWER_ORIGINS.find((o) => o.id === character.uniquePower!.originId);
  if (!origin) throw new ValidationError("Origin nicht mehr im System gefunden");

  const maxStageIndex = origin.stageDefinitions.length - 1;
  if (character.uniquePower.stageIndex >= maxStageIndex) {
    throw new ValidationError(
      "Unique Power ist bereits in unbegrenzter Weiterentwicklung - keine weitere Stufe zum Freischalten."
    );
  }

  const nextStageIndex = character.uniquePower.stageIndex + 1;
  const kampfkraft = getKampfkraft(character);
  const required = stageThresholdFor(nextStageIndex);
  if (kampfkraft < required) {
    throw new ValidationError(
      `Kampfkraft zu niedrig für nächste Stufe (${kampfkraft.toFixed(0)}/${required}).`
    );
  }

  character.uniquePower = advanceInstance(character.uniquePower, origin);
  return CharacterStore.save(character);
}
