import { nanoid } from "nanoid";
import { ENEMIES } from "../data/enemies.js";
import { CharacterStore } from "../db/memoryStore.js";
import { CombatSessionStore } from "../db/combatSessionStore.js";
import { ValidationError } from "./characterService.js";
import { getKampfkraft } from "./characterService.js";
import type { Character } from "../types/character.js";
import type { Enemy } from "../types/enemy.js";
import type { Ability } from "../types/ability.js";
import type { CombatAction, CombatSession } from "../types/combatSession.js";
import type { WorldId } from "../types/world.js";

export function listEnemiesForCharacter(characterId: string): Enemy[] {
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);
  return ENEMIES.filter((e) => e.worldId === character.worldId);
}

const HP_PER_KAMPFKRAFT = 3;
const RESOURCE_PER_KAMPFKRAFT = 0.4;
const RESOURCE_BASE = 20;

const RESOURCE_LABELS: Record<WorldId, string> = {
  ozeanwelt: "Wille",
  soul_society: "Reiatsu",
  avalon: "Mana",
};

function abilityResourceCost(ability: Ability): number {
  if (ability.resourceCost !== undefined) return ability.resourceCost;
  if (ability.kind === "powerup") return 30;
  if (ability.kind === "technik") return 20;
  return 15; // angriff-Fähigkeiten aus dem Katalog (nicht die Basis-Aktion "Angriff")
}

export function startCombat(characterId: string, enemyId: string): CombatSession {
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);

  const enemy = ENEMIES.find((e) => e.id === enemyId);
  if (!enemy) throw new ValidationError(`Gegner "${enemyId}" nicht gefunden`);
  if (enemy.worldId !== character.worldId) {
    throw new ValidationError("Gegner gehört nicht zur Welt des Charakters");
  }

  const kampfkraft = getKampfkraft(character);
  const characterMaxHp = Math.round(kampfkraft * HP_PER_KAMPFKRAFT) + 30;
  const enemyMaxHp = Math.round(enemy.kampfkraft * HP_PER_KAMPFKRAFT) + 30;
  const characterResourceMax = Math.round(kampfkraft * RESOURCE_PER_KAMPFKRAFT) + RESOURCE_BASE;

  const session: CombatSession = {
    id: nanoid(),
    characterId,
    enemyId,
    characterHp: characterMaxHp,
    characterMaxHp,
    enemyHp: enemyMaxHp,
    enemyMaxHp,
    resourceLabel: RESOURCE_LABELS[character.worldId],
    characterResource: characterResourceMax,
    characterResourceMax,
    round: 0,
    status: "laufend",
    log: [],
    activePowerup: null,
    createdAt: new Date().toISOString(),
  };

  return CombatSessionStore.save(session);
}

function pickEnemyAction(): CombatAction {
  const roll = Math.random();
  if (roll < 0.6) return "angriff";
  if (roll < 0.85) return "verteidigung";
  return "spezialfaehigkeit";
}

function randomVariance(base: number): number {
  return base * (0.8 + Math.random() * 0.4); // ±20%
}

function unlockedAbilityPool(character: Character): Ability[] {
  const pool: Ability[] = [];
  if (character.corePower) pool.push(...character.corePower.unlockedAbilities);
  if (character.spektralritterPact) pool.push(...character.spektralritterPact.unlockedAbilities);
  return pool;
}

export function performAction(
  sessionId: string,
  action: CombatAction,
  abilityName?: string
): CombatSession {
  const session = CombatSessionStore.get(sessionId);
  if (!session) throw new ValidationError(`Kampf-Session "${sessionId}" nicht gefunden`);
  if (session.status !== "laufend") {
    throw new ValidationError(`Kampf ist bereits beendet (${session.status})`);
  }

  const character = CharacterStore.get(session.characterId);
  if (!character) throw new ValidationError("Charakter nicht gefunden");
  const enemy = ENEMIES.find((e) => e.id === session.enemyId);
  if (!enemy) throw new ValidationError("Gegner nicht gefunden");

  let usedAbility: Ability | null = null;

  if (action === "spezialfaehigkeit") {
    const pool = unlockedAbilityPool(character);
    if (pool.length === 0) {
      throw new ValidationError(
        "Erfordert eine erworbene Kernmacht oder einen Spektralritter-Pakt mit freigeschalteten Fähigkeiten"
      );
    }
    const match = pool.find((p) => p.name === abilityName);
    if (!match) {
      throw new ValidationError(
        `abilityName muss eine freigeschaltete Fähigkeit sein. Verfügbar: ${pool.map((p) => p.name).join(", ")}`
      );
    }
    if (match.requiresActivePowerup && session.activePowerup?.name !== match.requiresActivePowerup) {
      throw new ValidationError(
        `"${match.name}" erfordert die aktive Verwandlung/Domäne "${match.requiresActivePowerup}".`
      );
    }
    const cost = abilityResourceCost(match);
    if (session.characterResource < cost) {
      throw new ValidationError(
        `Nicht genug ${session.resourceLabel} (${session.characterResource}/${cost} benötigt).`
      );
    }
    session.characterResource -= cost;
    usedAbility = match;
  }

  const characterPower = getKampfkraft(character);
  const enemyPower = enemy.kampfkraft;
  const enemyAction = pickEnemyAction();

  let damageToEnemy = 0;
  let damageToCharacter = 0;
  let note = "";

  // Schaden/Wirkung des Charakters
  if (action === "angriff") {
    const activeDamageBonus = session.activePowerup ? session.activePowerup.damageBonusPct : 0;
    damageToEnemy = randomVariance(characterPower * 0.22 * (1 + activeDamageBonus));
  } else if (action === "spezialfaehigkeit" && usedAbility) {
    if (usedAbility.kind === "powerup" && usedAbility.powerup) {
      // Powerup: kein direkter Schaden, dafür ein Buff - wirkt SOFORT ab dieser Runde
      session.activePowerup = {
        name: usedAbility.name,
        roundsRemaining: usedAbility.powerup.rounds,
        damageBonusPct: usedAbility.powerup.damageBonusPct,
        incomingReductionPct: usedAbility.powerup.incomingReductionPct,
      };
      if (usedAbility.powerup.hpBonusFlat) {
        session.characterHp = Math.min(
          session.characterMaxHp,
          session.characterHp + usedAbility.powerup.hpBonusFlat
        );
      }
      damageToEnemy = 0;
      note = `Powerup aktiviert: "${usedAbility.name}" - ${usedAbility.description}`;
    } else {
      const activeDamageBonus = session.activePowerup ? session.activePowerup.damageBonusPct : 0;
      const stageMultiplier = usedAbility.kind === "angriff" ? 0.5 : 0.35;
      damageToEnemy = randomVariance(characterPower * stageMultiplier * (1 + activeDamageBonus));
      note = `"${usedAbility.name}" eingesetzt - ${usedAbility.description}`;
    }
  } else if (action === "verteidigung") {
    const activeDamageBonus = session.activePowerup ? session.activePowerup.damageBonusPct : 0;
    damageToEnemy = randomVariance(characterPower * 0.05 * (1 + activeDamageBonus)); // kleiner Konter
  } else if (action === "flucht") {
    const fleeChance = Math.min(0.9, Math.max(0.1, characterPower / (characterPower + enemyPower)));
    if (Math.random() < fleeChance) {
      session.status = "geflohen";
      session.round += 1;
      session.log.push({
        round: session.round,
        characterAction: action,
        enemyAction,
        damageToEnemy: 0,
        damageToCharacter: 0,
        abilityUsed: null,
        note: "Flucht erfolgreich.",
      });
      return CombatSessionStore.save(session);
    }
    note = "Flucht fehlgeschlagen! ";
  }

  // Schaden des Gegners (reduziert durch Verteidigung und/oder aktives Powerup)
  let rawEnemyDamage =
    enemyAction === "angriff"
      ? randomVariance(enemyPower * 0.22)
      : enemyAction === "spezialfaehigkeit"
        ? randomVariance(enemyPower * 0.4)
        : randomVariance(enemyPower * 0.05);

  if (action === "verteidigung") {
    rawEnemyDamage *= 0.4; // 60% Reduktion
  }
  if (action === "flucht") {
    rawEnemyDamage *= 1.5; // Bestrafung für fehlgeschlagene Flucht
  }
  const activeIncomingReduction = session.activePowerup ? session.activePowerup.incomingReductionPct : 0;
  rawEnemyDamage *= 1 - Math.min(1, activeIncomingReduction);
  damageToCharacter = rawEnemyDamage;

  session.enemyHp = Math.max(0, session.enemyHp - damageToEnemy);
  session.characterHp = Math.max(0, session.characterHp - damageToCharacter);
  session.round += 1;

  // Powerup-Dauer herunterzählen - die Aktivierungsrunde selbst zählt bereits als erste Runde
  if (session.activePowerup) {
    session.activePowerup.roundsRemaining -= 1;
    if (session.activePowerup.roundsRemaining <= 0) {
      session.activePowerup = null;
    }
  }

  session.log.push({
    round: session.round,
    characterAction: action,
    enemyAction,
    damageToEnemy: Math.round(damageToEnemy),
    damageToCharacter: Math.round(damageToCharacter),
    abilityUsed: usedAbility?.name ?? null,
    note: note || "-",
  });

  if (session.enemyHp <= 0) {
    session.status = "gewonnen";
    for (const [key, value] of Object.entries(enemy.rewardComponents)) {
      const k = key as keyof Character["kampfkraftComponents"];
      character.kampfkraftComponents[k] += value ?? 0;
    }
    CharacterStore.save(character);
  } else if (session.characterHp <= 0) {
    session.status = "verloren";
  }

  return CombatSessionStore.save(session);
}

export function getCombatSession(sessionId: string): CombatSession {
  const session = CombatSessionStore.get(sessionId);
  if (!session) throw new ValidationError(`Kampf-Session "${sessionId}" nicht gefunden`);
  return session;
}
