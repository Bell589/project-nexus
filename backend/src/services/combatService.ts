import { nanoid } from "nanoid";
import { ENEMIES } from "../data/enemies.js";
import { CharacterStore } from "../db/memoryStore.js";
import { CombatSessionStore } from "../db/combatSessionStore.js";
import { ValidationError } from "./characterService.js";
import { getKampfkraft } from "./characterService.js";
import type { Character } from "../types/character.js";
import type { Enemy } from "../types/enemy.js";
import type { CombatAction, CombatSession } from "../types/combatSession.js";

export function listEnemiesForCharacter(characterId: string): Enemy[] {
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);
  return ENEMIES.filter((e) => e.worldId === character.worldId);
}

const HP_PER_KAMPFKRAFT = 3;

export function startCombat(characterId: string, enemyId: string): CombatSession {
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);

  const enemy = ENEMIES.find((e) => e.id === enemyId);
  if (!enemy) throw new ValidationError(`Gegner "${enemyId}" nicht gefunden`);
  if (enemy.worldId !== character.worldId) {
    throw new ValidationError("Gegner gehört nicht zur Welt des Charakters");
  }

  const characterMaxHp = Math.round(getKampfkraft(character) * HP_PER_KAMPFKRAFT) + 30;
  const enemyMaxHp = Math.round(enemy.kampfkraft * HP_PER_KAMPFKRAFT) + 30;

  const session: CombatSession = {
    id: nanoid(),
    characterId,
    enemyId,
    characterHp: characterMaxHp,
    characterMaxHp,
    enemyHp: enemyMaxHp,
    enemyMaxHp,
    comboCount: 0,
    round: 0,
    status: "laufend",
    log: [],
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

function unlockedAbilityPool(character: Character): { name: string; stageIndex: number }[] {
  const pool: { name: string; stageIndex: number }[] = [];
  if (character.corePower) {
    for (const name of character.corePower.unlockedAbilities) {
      pool.push({ name, stageIndex: character.corePower.stageIndex });
    }
  }
  if (character.spektralritterPact) {
    for (const name of character.spektralritterPact.unlockedAbilities) {
      pool.push({ name, stageIndex: character.spektralritterPact.stageIndex });
    }
  }
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

  let usedAbilityStageIndex = 0;

  if (action === "spezialfaehigkeit") {
    const pool = unlockedAbilityPool(character);
    if (pool.length === 0) {
      throw new ValidationError(
        "Spezialfähigkeit erfordert eine erworbene Kernmacht oder einen Spektralritter-Pakt mit freigeschalteten Fähigkeiten"
      );
    }
    if (session.comboCount < 2) {
      throw new ValidationError(
        `Spezialfähigkeit braucht Kombo 2+ (aktuell ${session.comboCount}). Erst mehrfach angreifen.`
      );
    }
    const match = pool.find((p) => p.name === abilityName);
    if (!match) {
      throw new ValidationError(
        `abilityName muss eine freigeschaltete Fähigkeit sein. Verfügbar: ${pool.map((p) => p.name).join(", ")}`
      );
    }
    usedAbilityStageIndex = match.stageIndex;
  }

  const characterPower = getKampfkraft(character);
  const enemyPower = enemy.kampfkraft;
  const enemyAction = pickEnemyAction();

  let damageToEnemy = 0;
  let damageToCharacter = 0;
  let note = "";

  // Schaden des Charakters
  if (action === "angriff") {
    damageToEnemy = randomVariance(characterPower * 0.22);
    session.comboCount += 1;
  } else if (action === "spezialfaehigkeit") {
    const stageBonus = 1 + usedAbilityStageIndex * 0.15; // stärkere Stufen treffen härter
    damageToEnemy = randomVariance(characterPower * 0.45 * stageBonus);
    session.comboCount = 0;
    note = `"${abilityName}" entfesselt! `;
  } else if (action === "verteidigung") {
    damageToEnemy = randomVariance(characterPower * 0.05); // kleiner Konter
    session.comboCount = 0;
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
    session.comboCount = 0;
  }

  // Schaden des Gegners (reduziert falls Charakter sich verteidigt)
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
  damageToCharacter = rawEnemyDamage;

  session.enemyHp = Math.max(0, session.enemyHp - damageToEnemy);
  session.characterHp = Math.max(0, session.characterHp - damageToCharacter);
  session.round += 1;

  session.log.push({
    round: session.round,
    characterAction: action,
    enemyAction,
    damageToEnemy: Math.round(damageToEnemy),
    damageToCharacter: Math.round(damageToCharacter),
    abilityUsed: action === "spezialfaehigkeit" ? abilityName ?? null : null,
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

