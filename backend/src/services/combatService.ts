import { ENEMIES } from "../data/enemies.js";
import { CharacterStore } from "../db/memoryStore.js";
import { ValidationError } from "./characterService.js";
import { getKampfkraft } from "./characterService.js";
import type { Character } from "../types/character.js";
import type { Enemy } from "../types/enemy.js";

export interface CombatResult {
  won: boolean;
  characterPower: number;
  enemyPower: number;
  roll: number; // 0..1, für Transparenz/Nachvollziehbarkeit
  character: Character;
}

export function listEnemiesForCharacter(characterId: string): Enemy[] {
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);
  return ENEMIES.filter((e) => e.worldId === character.worldId);
}

/**
 * Vereinfachtes Kampfmodell: Sieg-Wahrscheinlichkeit ergibt sich aus dem
 * Verhältnis der Kampfkräfte, plus etwas Zufall. Kein echtes Aktionssystem
 * (Kombos, Timing, Konter) - das wäre der nächste Ausbauschritt.
 */
export function fightEnemy(characterId: string, enemyId: string): CombatResult {
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);

  const enemy = ENEMIES.find((e) => e.id === enemyId);
  if (!enemy) throw new ValidationError(`Gegner "${enemyId}" nicht gefunden`);
  if (enemy.worldId !== character.worldId) {
    throw new ValidationError("Gegner gehört nicht zur Welt des Charakters");
  }

  const characterPower = getKampfkraft(character);
  const enemyPower = enemy.kampfkraft;

  // Sieg-Chance: eigene Kraft / (eigene + gegnerische Kraft), gedeckelt 5-95%
  const rawChance = characterPower / (characterPower + enemyPower || 1);
  const winChance = Math.min(0.95, Math.max(0.05, rawChance));
  const roll = Math.random();
  const won = roll < winChance;

  if (won) {
    for (const [key, value] of Object.entries(enemy.rewardComponents)) {
      const k = key as keyof Character["kampfkraftComponents"];
      character.kampfkraftComponents[k] += value ?? 0;
    }
    CharacterStore.save(character);
  }

  return { won, characterPower, enemyPower, roll, character };
}
