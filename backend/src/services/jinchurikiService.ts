import { BIJUU, BIJUU_STAGES } from "../data/bijuu.js";
import { CharacterStore } from "../db/memoryStore.js";
import { GlobalUniquenessRegistry } from "../db/globalUniquenessRegistry.js";
import { getKampfkraft, ValidationError } from "./characterService.js";
import { stageThresholdFor } from "../types/corePowerThresholds.js";
import { despawnEntityEncounter, isEntityEncounterActive } from "./worldEncounterService.js";
import type { Character, JinchurikiState } from "../types/character.js";
import type { BijuuOrigin } from "../data/bijuu.js";

const CATEGORY = "bijuu";

function requireShinobi(characterId: string): Character {
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);
  if (character.worldId !== "ninja_welt") {
    throw new ValidationError("Nur Charaktere der Ninja-Welt können einen Bijū versiegeln");
  }
  return character;
}

/** Bijū, die aktuell "auf der Weltkarte" erscheinen (an niemanden gebunden). */
export function listAvailableBijuu(): BijuuOrigin[] {
  return BIJUU.filter((b) => isEntityEncounterActive("bijuu", b.id) && !GlobalUniquenessRegistry.getBoundTo(CATEGORY, b.id));
}

/**
 * Ein Bijū muss tatsächlich bekämpft und besiegt werden, bevor er versiegelt
 * werden kann - kein Kauf über ein Menü. Erfolgschance hängt von der
 * Kampfkraft ab. Bei Misserfolg bleibt der Bijū frei.
 */
export function fightAndSealBijuu(characterId: string, bijuuId: string): Character {
  const character = requireShinobi(characterId);
  if (character.jinchuriki) {
    throw new ValidationError("Charakter ist bereits Jinchūriki eines anderen Bijū");
  }

  const bijuu = BIJUU.find((b) => b.id === bijuuId);
  if (!bijuu) throw new ValidationError(`Bijū "${bijuuId}" nicht gefunden`);
  if (!isEntityEncounterActive("bijuu", bijuuId)) throw new ValidationError(`${bijuu.name} ist aktuell nicht als Weltbegegnung auf der Karte erschienen.`);

  if (GlobalUniquenessRegistry.getBoundTo(CATEGORY, bijuuId)) {
    throw new ValidationError(`${bijuu.name} ist bereits an einen anderen Charakter gebunden.`);
  }

  const kampfkraft = getKampfkraft(character);
  const minRequired = 150;
  if (kampfkraft < minRequired) {
    throw new ValidationError(`Kampfkraft zu niedrig, um ${bijuu.name} überhaupt herauszufordern (${kampfkraft.toFixed(0)}/${minRequired}).`);
  }

  const winChance = Math.min(0.85, kampfkraft / (kampfkraft + 250));
  if (Math.random() >= winChance) {
    throw new ValidationError(`${bijuu.name} wurde nicht besiegt. Der Bijū bleibt frei - ein erneuter Versuch ist möglich.`);
  }

  if (GlobalUniquenessRegistry.getBoundTo(CATEGORY, bijuuId)) {
    throw new ValidationError(`${bijuu.name} wurde soeben von einem anderen Charakter versiegelt.`);
  }
  GlobalUniquenessRegistry.bind(CATEGORY, bijuuId, character.id);
  despawnEntityEncounter("bijuu", bijuuId);

  const stage0Abilities = bijuu.abilityPool
    .filter((a) => a.tier === "teilzugriff")
    .map((a) => ({ name: a.name, kind: a.kind, description: a.description, powerup: a.powerup, resourceCost: a.resourceCost, requiresActivePowerup: a.requiresActivePowerup }));

  const state: JinchurikiState = {
    bijuuId: bijuu.id,
    bijuuName: bijuu.name,
    stageIndex: 0,
    individualAbilities: stage0Abilities,
    developmentLog: [`${bijuu.name} besiegt und versiegelt. Charakter ist jetzt Jinchūriki.`],
  };
  character.jinchuriki = state;

  return CharacterStore.save(character);
}

const TIER_BY_STAGE = ["teilzugriff", "chakra_modus", "staerkere_transformation", "vollstaendige_manifestation"];

export function advanceJinchuriki(characterId: string): Character {
  const character = requireShinobi(characterId);
  if (!character.jinchuriki) throw new ValidationError("Charakter ist kein Jinchūriki");

  const bijuu = BIJUU.find((b) => b.id === character.jinchuriki!.bijuuId);
  if (!bijuu) throw new ValidationError("Bijū nicht mehr im System gefunden");

  const maxStageIndex = BIJUU_STAGES.length - 1;
  if (character.jinchuriki.stageIndex >= maxStageIndex) {
    throw new ValidationError("Vollständige Manifestation bereits erreicht - weitere Entwicklung nur noch über neue Techniken.");
  }

  const nextStageIndex = character.jinchuriki.stageIndex + 1;
  const kampfkraft = getKampfkraft(character);
  const required = stageThresholdFor(nextStageIndex) * 2.5;
  if (kampfkraft < required) {
    throw new ValidationError(`Kampfkraft zu niedrig für die nächste Jinchūriki-Stufe (${kampfkraft.toFixed(0)}/${required}).`);
  }

  const tier = TIER_BY_STAGE[nextStageIndex];
  const owned = character.jinchuriki.individualAbilities.map((a) => a.name);
  const newAbilities = bijuu.abilityPool
    .filter((a) => a.tier === tier && !owned.includes(a.name))
    .map((a) => ({ name: a.name, kind: a.kind, description: a.description, powerup: a.powerup, resourceCost: a.resourceCost, requiresActivePowerup: a.requiresActivePowerup }));

  character.jinchuriki.stageIndex = nextStageIndex;
  character.jinchuriki.individualAbilities.push(...newAbilities);
  character.jinchuriki.developmentLog.push(
    `Stufe "${BIJUU_STAGES[nextStageIndex]}" erreicht${newAbilities.length ? ` - neu: ${newAbilities.map((a) => a.name).join(", ")}` : ""}`
  );

  return CharacterStore.save(character);
}

export interface BaryonModeResult {
  character: Character;
  message: string;
  releasedBijuu: string;
}

/**
 * IRREVERSIBEL: Aktiviert Baryon Mode. Der Spieler erhält eine extreme,
 * temporäre Übermacht - verliert dabei aber dauerhaft den Bijū. Der Bijū
 * wird wieder frei und kann später erneut auf der Weltkarte erscheinen und
 * von einem beliebigen Charakter (auch einem anderen) versiegelt werden.
 */
export function activateBaryonMode(characterId: string): BaryonModeResult {
  const character = requireShinobi(characterId);
  if (!character.jinchuriki) throw new ValidationError("Charakter ist kein Jinchūriki - kein Bijū zum Opfern vorhanden");
  if (character.jinchuriki.stageIndex < 2) {
    throw new ValidationError(
      "Baryon Mode erfordert mindestens die Stufe 'Stärkere Transformation' - die Verbindung zum Bijū ist noch nicht tief genug."
    );
  }

  const bijuuName = character.jinchuriki.bijuuName;
  const bijuuId = character.jinchuriki.bijuuId;

  // Unumkehrbar: Jinchūriki-Status geht dauerhaft verloren, Bijū wird wieder frei.
  character.jinchuriki = null;
  GlobalUniquenessRegistry.release(CATEGORY, bijuuId);
  CharacterStore.save(character);

  return {
    character,
    releasedBijuu: bijuuName,
    message: `Baryon Mode aktiviert! Immense, aber temporäre Macht wurde freigesetzt. ${bijuuName} ist dabei unwiederbringlich verloren gegangen und kann nun erneut auf der Weltkarte erscheinen - auch für andere Spieler.`,
  };
}
