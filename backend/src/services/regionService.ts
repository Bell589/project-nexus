import { LOCATIONS } from "../data/locations.js";
import { RegionControlStore } from "../db/regionControlStore.js";
import { CharacterStore } from "../db/memoryStore.js";
import { getKampfkraft, ValidationError } from "./characterService.js";
import type { RegionControl } from "../types/region.js";

/** Nur diese Ortstypen sind als "Region" mit Herrschaft beanspruchbar. */
const CONTROLLABLE_TYPES = new Set(["insel", "hauptquartier", "dorf"]);

function requireControllableLocation(locationId: string) {
  const location = LOCATIONS.find((l) => l.id === locationId);
  if (!location) throw new ValidationError(`Ort "${locationId}" nicht gefunden`);
  if (!CONTROLLABLE_TYPES.has(location.type)) {
    throw new ValidationError(`"${location.name}" ist kein beanspruchbares Herrschaftsgebiet (Typ: ${location.type})`);
  }
  return location;
}

function log(control: RegionControl, message: string) {
  control.eventLog.push({ timestamp: new Date().toISOString(), message });
  if (control.eventLog.length > 30) control.eventLog.shift();
}

export function listRegions(worldId?: string) {
  const locations = LOCATIONS.filter((l) => CONTROLLABLE_TYPES.has(l.type) && (!worldId || l.worldId === worldId));
  return locations.map((l) => ({ location: l, control: RegionControlStore.getOrCreate(l.id) }));
}

export function claimRegion(characterId: string, locationId: string): RegionControl {
  const location = requireControllableLocation(locationId);
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);
  if (character.worldId !== location.worldId) throw new ValidationError("Charakter gehört nicht zur Welt dieses Ortes");

  const control = RegionControlStore.getOrCreate(locationId);
  if (control.rulerCharacterId) {
    throw new ValidationError(`"${location.name}" wird bereits beherrscht - erst erobern statt beanspruchen`);
  }

  const kampfkraft = getKampfkraft(character);
  if (kampfkraft < 40) {
    throw new ValidationError(`Kampfkraft zu niedrig, um ein Gebiet zu beanspruchen (${kampfkraft.toFixed(0)}/40).`);
  }

  control.rulerCharacterId = characterId;
  control.rulerPresent = true;
  control.siegeProgress = 0;
  control.defenderCharacterIds = [characterId];
  log(control, `${character.characterName} beansprucht ${location.name} als Herrschaftsgebiet.`);
  return RegionControlStore.save(control);
}

/** Der Herrscher legt fest, ob er persönlich vor Ort ist - Abwesenheit macht Angriffe leichter. */
export function setPresence(characterId: string, locationId: string, present: boolean): RegionControl {
  const location = requireControllableLocation(locationId);
  const control = RegionControlStore.getOrCreate(locationId);
  if (control.rulerCharacterId !== characterId) {
    throw new ValidationError("Nur der aktuelle Herrscher kann seine Anwesenheit ändern");
  }
  control.rulerPresent = present;
  log(control, `Herrscher ${present ? "ist wieder anwesend in" : "verlässt"} ${location.name}.`);
  return RegionControlStore.save(control);
}

/** Ein Verteidiger schließt sich dem Herrscher an. */
export function joinDefense(characterId: string, locationId: string): RegionControl {
  const location = requireControllableLocation(locationId);
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);

  const control = RegionControlStore.getOrCreate(locationId);
  if (!control.rulerCharacterId) throw new ValidationError(`"${location.name}" hat noch keinen Herrscher zu verteidigen`);
  if (control.defenderCharacterIds.includes(characterId)) {
    throw new ValidationError("Charakter verteidigt dieses Gebiet bereits");
  }
  control.defenderCharacterIds.push(characterId);
  log(control, `${character.characterName} schließt sich der Verteidigung von ${location.name} an.`);
  return RegionControlStore.save(control);
}

/**
 * Angriff auf eine Region. Ist der Herrscher persönlich anwesend, muss er
 * direkt bezwungen werden (harte, einmalige Entscheidung). Ist er
 * abwesend, erhöht ein Erfolg stattdessen den Belagerungsfortschritt -
 * erst bei 100% wechselt die Kontrolle (mehrstufige Eroberung).
 */
export function attackRegion(characterId: string, locationId: string): RegionControl {
  const location = requireControllableLocation(locationId);
  const attacker = CharacterStore.get(characterId);
  if (!attacker) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);
  if (attacker.worldId !== location.worldId) throw new ValidationError("Charakter gehört nicht zur Welt dieses Ortes");

  const control = RegionControlStore.getOrCreate(locationId);
  if (!control.rulerCharacterId) {
    throw new ValidationError(`"${location.name}" hat noch keinen Herrscher - erst mit claimRegion beanspruchen`);
  }
  if (control.rulerCharacterId === characterId) {
    throw new ValidationError("Der Herrscher kann sein eigenes Gebiet nicht angreifen");
  }

  const attackerPower = getKampfkraft(attacker);
  const defenderPower = control.defenderCharacterIds.reduce((sum, id) => {
    const c = CharacterStore.get(id);
    return sum + (c ? getKampfkraft(c) : 0);
  }, 0) || 20;

  if (control.rulerPresent) {
    // Direkter Herrscherkampf: Erfolg entscheidet sofort über die Kontrolle
    const winChance = Math.min(0.75, attackerPower / (attackerPower + defenderPower * 1.3));
    const won = Math.random() < winChance;
    if (won) {
      const oldRulerId = control.rulerCharacterId;
      control.rulerCharacterId = characterId;
      control.rulerPresent = true;
      control.siegeProgress = 0;
      control.defenderCharacterIds = [characterId];
      log(control, `${attacker.characterName} besiegt den anwesenden Herrscher direkt und übernimmt ${location.name}.`);
    } else {
      log(control, `${attacker.characterName} greift den anwesenden Herrscher von ${location.name} an - und scheitert.`);
    }
    return RegionControlStore.save(control);
  }

  // Herrscher abwesend: Belagerung statt direkter Entscheidungsschlacht
  const siegeChance = Math.min(0.8, attackerPower / (attackerPower + defenderPower));
  const won = Math.random() < siegeChance;
  if (won) {
    control.siegeProgress = Math.min(100, control.siegeProgress + 25);
    log(control, `${attacker.characterName} erzielt einen Belagerungserfolg gegen ${location.name} (${control.siegeProgress}%).`);
    if (control.siegeProgress >= 100) {
      control.rulerCharacterId = characterId;
      control.rulerPresent = true;
      control.siegeProgress = 0;
      control.defenderCharacterIds = [characterId];
      log(control, `Die Belagerung von ${location.name} ist erfolgreich - ${attacker.characterName} übernimmt die Herrschaft.`);
    }
  } else {
    log(control, `${attacker.characterName} scheitert bei der Belagerung von ${location.name}.`);
  }
  return RegionControlStore.save(control);
}

/**
 * Bürgerkrieg/Verrat: Ein Verteidiger, der dem Herrscher bereits dient,
 * kann ihn stürzen - ohne den Umweg über Belagerung, dafür riskanter
 * (geringere Erfolgschance, da er sich offen gegen die eigene Führung stellt).
 */
export function rebel(characterId: string, locationId: string): RegionControl {
  const location = requireControllableLocation(locationId);
  const rebelChar = CharacterStore.get(characterId);
  if (!rebelChar) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);

  const control = RegionControlStore.getOrCreate(locationId);
  if (!control.rulerCharacterId) throw new ValidationError(`"${location.name}" hat keinen Herrscher zum Stürzen`);
  if (!control.defenderCharacterIds.includes(characterId)) {
    throw new ValidationError("Nur wer bereits im Dienst des Herrschers steht, kann rebellieren");
  }
  if (control.rulerCharacterId === characterId) throw new ValidationError("Der Herrscher kann nicht gegen sich selbst rebellieren");

  const rebelPower = getKampfkraft(rebelChar);
  const ruler = CharacterStore.get(control.rulerCharacterId);
  const rulerPower = ruler ? getKampfkraft(ruler) : 20;

  const winChance = Math.min(0.6, rebelPower / (rebelPower + rulerPower * 1.5)); // Verrat ist riskanter als offene Belagerung
  const won = Math.random() < winChance;
  if (won) {
    control.rulerCharacterId = characterId;
    control.rulerPresent = true;
    control.siegeProgress = 0;
    control.defenderCharacterIds = [characterId];
    log(control, `Bürgerkrieg in ${location.name}: ${rebelChar.characterName} stürzt den Herrscher durch Verrat.`);
  } else {
    control.defenderCharacterIds = control.defenderCharacterIds.filter((id) => id !== characterId);
    log(control, `Der Verratsversuch von ${rebelChar.characterName} in ${location.name} scheitert - er wird aus der Gefolgschaft verstoßen.`);
  }
  return RegionControlStore.save(control);
}
