import { nanoid } from "nanoid";
import { ENEMIES } from "../data/enemies.js";
import { DOMAIN_RULES } from "../data/domainRules.js";
import { CharacterStore } from "../db/memoryStore.js";
import { CombatSessionStore } from "../db/combatSessionStore.js";
import { ValidationError } from "./characterService.js";
import { getKampfkraft } from "./characterService.js";
import type { Character } from "../types/character.js";
import type { Enemy } from "../types/enemy.js";
import type { Ability } from "../types/ability.js";
import type { CombatAction, CombatSession, HakiMode } from "../types/combatSession.js";
import type { WorldId } from "../types/world.js";
import { techniqueById } from "../data/ninjaTechniques.js";
import { recordTechniqueSeen } from "./ninjaProgressionService.js";

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
  ninja_welt: "Chakra",
};

// Haki-Skillnamen -> welcher Modus damit möglich ist (Ozeanwelt)
const HAKI_SKILL_BY_MODE: Record<HakiMode, string> = {
  verstaerkung: "Verstärkung (Busoshoku)",
  dominanz: "Dominanz (Haoshoku)",
  wahrnehmung: "Wahrnehmung (Kenbunshoku)",
};

function abilityResourceCost(ability: Ability): number {
  if (ability.resourceCost !== undefined) return ability.resourceCost;
  if (ability.kind === "powerup") return 30;
  if (ability.kind === "technik") return 20;
  return 15;
}

function hakiSkillLevel(character: Character, mode: HakiMode): number {
  const skillName = HAKI_SKILL_BY_MODE[mode];
  return character.skills.find((s) => s.name === skillName)?.level ?? 0;
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
  const characterMaxHp = Math.max(character.stats.lp * 10, Math.round(kampfkraft * HP_PER_KAMPFKRAFT) + 30);
  const enemyMaxHp = Math.round(enemy.kampfkraft * HP_PER_KAMPFKRAFT) + 30;
  const characterResourceMax = Math.round(kampfkraft * RESOURCE_PER_KAMPFKRAFT) + RESOURCE_BASE;

  const session: CombatSession = {
    id: nanoid(),
    characterId,
    enemyId,
    characterHp: Math.min(characterMaxHp, Math.max(1, character.currentHp)),
    characterMaxHp,
    enemyHp: enemyMaxHp,
    enemyMaxHp,
    resourceLabel: RESOURCE_LABELS[character.worldId],
    characterResource: Math.min(characterResourceMax, character.energy.current),
    characterResourceMax,
    round: 0,
    status: "laufend",
    log: [],
    activePowerup: null,
    // Domäne gilt für den ganzen Kampf, falls der Charakter (Soul Society) eine gewählt hat
    activeDomainRuleId: character.activeDomainRuleId,
    ritterSummoned: false,
    activeDojutsu: null,
    dodgePrepared: false,
    enemyAccuracyDebuffRounds: 0,
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

function randomVariance(base: number, guaranteedMax: boolean): number {
  if (guaranteedMax) return base * 1.2; // "Schwerthiebe treffen garantiert" - kein Verfehlen, volle Wucht
  return base * (0.8 + Math.random() * 0.4); // ±20%
}

function unlockedAbilityPool(character: Character, ritterSummoned: boolean): Ability[] {
  const pool: Ability[] = [];
  if (character.uniquePower) pool.push(...character.uniquePower.individualAbilities);
  if (character.esperPact) pool.push(...character.esperPact.individualAbilities);
  if (character.jinchuriki) pool.push(...character.jinchuriki.individualAbilities);
  if (character.doujutsu) pool.push(...character.doujutsu.individualAbilities);
  // Der Ritter ist ein beschwörbarer NPC - seine Fähigkeiten sind erst nach
  // Beschwörung nutzbar, nicht schon ab Kampfstart.
  if (character.spektralritterPact && ritterSummoned) {
    pool.push(...character.spektralritterPact.individualAbilities);
  }
  return pool;
}

/**
 * "Normale" Grundfertigkeiten aus trainierten Fraktions-Skills (Schwertkampf,
 * Waffenkampf, Taijutsu...) - unabhängig von Relikt/Zanpakutō/Magie nutzbar.
 * Für Shinigami gilt: Schwertkampf-Fertigkeiten sind erst nutzbar, sobald die
 * erste Freisetzung (Manifestation/Shikai) aktiv ist oder war - vorher nur
 * der versiegelte Grundschnitt aus dem Zanpakutō-Pool selbst.
 */
function grundfertigkeitOptions(character: Character, everHadManifestation: boolean): string[] {
  const trained = character.skills.filter((s) => s.level >= 1).map((s) => s.name);
  if (character.worldId === "soul_society" && character.factionId === "shinigami") {
    if (!everHadManifestation) {
      return trained.filter((s) => s !== "Schwertkampf");
    }
  }
  return trained;
}

export function performAction(
  sessionId: string,
  action: CombatAction,
  abilityName?: string,
  hakiMode?: HakiMode
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

  const domainRule = session.activeDomainRuleId ? DOMAIN_RULES.find((r) => r.id === session.activeDomainRuleId) : undefined;
  const healingDisabled = domainRule?.id === "heilung-deaktiviert";
  const fleeingBlocked = domainRule?.id === "teleportation-verboten" || domainRule?.id === "fliegen-unmoeglich";
  const guaranteedHits = domainRule?.id === "schwerthiebe-garantiert";

  // -- Ritter beschwören: eigene Aktion, kein Schaden, macht ihn danach steuerbar --
  if (action === "ritter_beschwoeren") {
    if (!character.spektralritterPact) {
      throw new ValidationError("Charakter hat keinen Spektralritter-Pakt - nichts zu beschwören");
    }
    if (session.ritterSummoned) {
      throw new ValidationError("Der Ritter ist bereits beschworen");
    }
    const cost = 20;
    if (session.characterResource < cost) {
      throw new ValidationError(`Nicht genug ${session.resourceLabel} zum Beschwören (${session.characterResource}/${cost}).`);
    }
    session.characterResource -= cost;
    session.ritterSummoned = true;
    session.round += 1;
  session.log.push({
      round: session.round,
      characterAction: action,
      enemyAction: "angriff",
      damageToEnemy: 0,
      damageToCharacter: 0,
      abilityUsed: null,
      note: `${character.spektralritterPact.generatedName} wurde beschworen und ist ab jetzt steuerbar.`,
    });
    return CombatSessionStore.save(session);
  }

  if (session.activeDojutsu) {
    if (session.characterResource < session.activeDojutsu.upkeepCost) { session.activeDojutsu = null; }
    else session.characterResource -= session.activeDojutsu.upkeepCost;
  }

  if (action === "dojutsu_aktivieren") {
    const d=character.dojutsuState; if(!d?.awakened) throw new ValidationError("Dein Dōjutsu ist noch nicht erwacht.");
    if(session.activeDojutsu) throw new ValidationError(`${d.name} ist bereits aktiv.`);
    const cost=12; if(session.characterResource<cost) throw new ValidationError(`Du benötigst ${cost} Chakra zur Aktivierung.`);
    session.characterResource-=cost; session.activeDojutsu={id:d.definitionId,name:d.name,stageIndex:d.stageIndex,upkeepCost:4};
    const retaliation=randomVariance(enemy.kampfkraft*.18,false); session.characterHp=Math.max(0,session.characterHp-retaliation);
    session.round+=1; session.log.push({round:session.round,characterAction:action,enemyAction:"angriff",damageToEnemy:0,damageToCharacter:Math.round(retaliation),abilityUsed:d.name,note:`${character.characterName} aktiviert ${d.name}. Stufe ${d.stageIndex}; 4 Chakra Unterhalt pro Runde.`});
    character.currentHp=Math.round(session.characterHp); character.energy.current=Math.round(session.characterResource); if(session.characterHp<=0)session.status="verloren"; CharacterStore.save(character); return CombatSessionStore.save(session);
  }

  if (action === "flucht" && fleeingBlocked) {
    throw new ValidationError(`Die Domänen-Regel "${domainRule?.name}" verbietet Fliehen/Teleportation in diesem Kampf.`);
  }

  let usedAbility: Ability | null = null;
  let usedGrundfertigkeit: string | null = null;
  let usedJutsu: ReturnType<typeof techniqueById> = undefined;

  if (action === "jutsu") {
    const t=techniqueById(abilityName??""); if(!t)throw new ValidationError("Jutsu unbekannt.");
    const st=character.ninjaTechniques.find(x=>x.techniqueId===t.id); if(!st?.learned)throw new ValidationError("Dieses Jutsu wurde noch nicht gelernt.");
    if(t.requiredStateId && session.activeDojutsu?.id!==t.requiredStateId)throw new ValidationError(`Du benötigst ein aktives ${t.requiredStateId}.`);
    if(t.requiredDojutsuStage && (session.activeDojutsu?.stageIndex??0)<t.requiredDojutsuStage)throw new ValidationError(`Deine Dōjutsu-Stufe reicht für ${t.name} noch nicht aus.`);
    if(session.characterResource<t.baseCost)throw new ValidationError(`Nicht genügend Chakra (${t.baseCost} benötigt).`); session.characterResource-=t.baseCost; usedJutsu=t;
  } else if (action === "spezialfaehigkeit") {
    const pool = unlockedAbilityPool(character, session.ritterSummoned);
    if (pool.length === 0) {
      throw new ValidationError(
        character.spektralritterPact && !session.ritterSummoned
          ? "Der Ritter muss zuerst beschworen werden (Aktion 'ritter_beschwoeren'), bevor seine Fähigkeiten nutzbar sind."
          : "Erfordert eine erworbene Unique Power, einen Esper-/Ritter-Pakt oder Jinchūriki-Status mit freigeschalteten Fähigkeiten"
      );
    }
    const match = pool.find((p) => p.name === abilityName);
    if (!match) {
      throw new ValidationError(`abilityName muss eine freigeschaltete Fähigkeit sein. Verfügbar: ${pool.map((p) => p.name).join(", ")}`);
    }
    if (match.requiresActivePowerup && session.activePowerup?.name !== match.requiresActivePowerup) {
      throw new ValidationError(`"${match.name}" erfordert die aktive Verwandlung/Domäne "${match.requiresActivePowerup}".`);
    }
    if (healingDisabled && match.name.toLowerCase().includes("heil")) {
      throw new ValidationError(`Die Domänen-Regel "${domainRule?.name}" deaktiviert Heileffekte in diesem Kampf.`);
    }
    const cost = abilityResourceCost(match);
    if (session.characterResource < cost) {
      throw new ValidationError(`Nicht genug ${session.resourceLabel} (${session.characterResource}/${cost} benötigt).`);
    }
    session.characterResource -= cost;
    usedAbility = match;
  } else if (action === "grundfertigkeit") {
    const options = grundfertigkeitOptions(character, hasEverHadManifestation(character));
    if (!options.includes(abilityName ?? "")) {
      throw new ValidationError(
        options.length > 0
          ? `abilityName muss eine trainierte Grundfertigkeit sein. Verfügbar: ${options.join(", ")}`
          : "Keine trainierten Grundfertigkeiten vorhanden - erst über Fähigkeiten-Training freischalten."
      );
    }
    usedGrundfertigkeit = abilityName!;
  }

  if (hakiMode) {
    if (character.worldId !== "ozeanwelt") {
      throw new ValidationError("Haki gibt es nur in der Ozeanwelt");
    }
    if (action !== "angriff" && action !== "verteidigung" && action !== "grundfertigkeit") {
      throw new ValidationError("Haki verstärkt nur Angriff, Grundfertigkeit oder Verteidigung - kein eigenständiger Zug");
    }
    if ((hakiMode === "verstaerkung" || hakiMode === "dominanz") && action === "verteidigung") {
      throw new ValidationError(`${hakiMode} verstärkt nur offensive Aktionen, nicht Verteidigung`);
    }
    if (hakiMode === "wahrnehmung" && action !== "verteidigung") {
      throw new ValidationError("Wahrnehmungs-Haki wirkt nur bei der Aktion 'verteidigung'");
    }
    const level = hakiSkillLevel(character, hakiMode);
    if (level < 1) {
      throw new ValidationError(`${HAKI_SKILL_BY_MODE[hakiMode]} ist nicht trainiert - erst über Fähigkeiten-Training lernen.`);
    }
  }

  const characterPower = getKampfkraft(character);
  const enemyPower = enemy.kampfkraft;
  const enemyAction = pickEnemyAction();

  let damageToEnemy = 0;
  let damageToCharacter = 0;
  let note = "";

  const hakiLevel = hakiMode ? hakiSkillLevel(character, hakiMode) : 0;
  const hakiDamageBonus = hakiMode === "verstaerkung" ? 0.1 * hakiLevel : hakiMode === "dominanz" ? 0.2 * hakiLevel : 0;
  const hakiIncomingReduction = hakiMode === "wahrnehmung" ? 0.1 * hakiLevel : 0;

  if (action === "ausweichen") { session.dodgePrepared=true; note="Du konzentrierst dich vollständig auf die nächste Ausweichbewegung.";
  } else if (action === "jutsu" && usedJutsu) {
    const st=character.ninjaTechniques.find(x=>x.techniqueId===usedJutsu!.id)!; st.mastery=Math.min(100,st.mastery+2);
    if(usedJutsu.effect==="genjutsu"){session.enemyAccuracyDebuffRounds=2;note=`${usedJutsu.name} verzerrt die Wahrnehmung des Gegners.`;}
    else if(usedJutsu.effect==="dodge"){session.dodgePrepared=true;note=`${usedJutsu.name} bereitet ein Ausweichmanöver vor.`;}
    else {damageToEnemy=randomVariance(characterPower*((usedJutsu.damage??25)/100)*(1+(st.mastery/300)),guaranteedHits);note=`${character.characterName} setzt ${usedJutsu.name} ein.`;}
  } else if (action === "angriff") {
    const activeDamageBonus = (session.activePowerup ? session.activePowerup.damageBonusPct : 0) + hakiDamageBonus;
    damageToEnemy = randomVariance(characterPower * 0.22 * (1 + activeDamageBonus), guaranteedHits);
    if (hakiMode) note = `Mit ${HAKI_SKILL_BY_MODE[hakiMode]} verstärkter Angriff. `;
  } else if (action === "grundfertigkeit") {
    const activeDamageBonus = session.activePowerup ? session.activePowerup.damageBonusPct : 0;
    damageToEnemy = randomVariance(characterPower * 0.18 * (1 + activeDamageBonus), guaranteedHits);
    note = `Grundfertigkeit "${usedGrundfertigkeit}" eingesetzt.`;
  } else if (action === "spezialfaehigkeit" && usedAbility) {
    if (usedAbility.kind === "powerup" && usedAbility.powerup) {
      session.activePowerup = {
        name: usedAbility.name,
        roundsRemaining: usedAbility.powerup.rounds,
        damageBonusPct: usedAbility.powerup.damageBonusPct,
        incomingReductionPct: usedAbility.powerup.incomingReductionPct,
      };
      if (usedAbility.powerup.hpBonusFlat && !healingDisabled) {
        session.characterHp = Math.min(session.characterMaxHp, session.characterHp + usedAbility.powerup.hpBonusFlat);
      }
      damageToEnemy = 0;
      note = `Powerup aktiviert: "${usedAbility.name}" - ${usedAbility.description}`;
    } else {
      const activeDamageBonus = session.activePowerup ? session.activePowerup.damageBonusPct : 0;
      const stageMultiplier = usedAbility.kind === "angriff" ? 0.5 : 0.35;
      damageToEnemy = randomVariance(characterPower * stageMultiplier * (1 + activeDamageBonus), guaranteedHits);
      note = `"${usedAbility.name}" eingesetzt - ${usedAbility.description}`;
    }
  } else if (action === "verteidigung") {
    const activeDamageBonus = session.activePowerup ? session.activePowerup.damageBonusPct : 0;
    damageToEnemy = randomVariance(characterPower * 0.05 * (1 + activeDamageBonus), false);
    if (hakiMode === "wahrnehmung") note = `Wahrnehmungs-Haki aktiv - erhöhte Ausweichchance. `;
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
      character.currentHp = Math.max(1, Math.round(session.characterHp));
      character.energy.current = Math.max(0, Math.min(character.energy.max, Math.round(session.characterResource)));
      CharacterStore.save(character);
      return CombatSessionStore.save(session);
    }
    note = "Flucht fehlgeschlagen! ";
  }

  let rawEnemyDamage =
    enemyAction === "angriff"
      ? randomVariance(enemyPower * 0.22, false)
      : enemyAction === "spezialfaehigkeit"
        ? randomVariance(enemyPower * 0.4, false)
        : randomVariance(enemyPower * 0.05, false);

  if (session.enemyAccuracyDebuffRounds>0) { rawEnemyDamage*=0.72; session.enemyAccuracyDebuffRounds--; }
  if (action === "ausweichen" || session.dodgePrepared) {
    const perceptionBonus=session.activeDojutsu?.id==="sharingan" ? 0.08*session.activeDojutsu.stageIndex : 0;
    const dodgeChance=Math.min(.8,.18+character.stats.geschwindigkeit/(character.stats.geschwindigkeit+Math.max(1,enemyPower))*.35+perceptionBonus);
    if(Math.random()<dodgeChance){rawEnemyDamage=0;note+=(note?" ":"")+"Du liest den Angriff und weichst erfolgreich aus.";} else note+=(note?" ":"")+"Das Ausweichmanöver reicht nicht vollständig."; session.dodgePrepared=false;
  }
  if (action === "verteidigung") { rawEnemyDamage *= 0.4; }
  if (action === "flucht") {
    rawEnemyDamage *= 1.5;
  }
  const activeIncomingReduction = (session.activePowerup ? session.activePowerup.incomingReductionPct : 0) + hakiIncomingReduction;
  rawEnemyDamage *= 1 - Math.min(1, activeIncomingReduction);
  damageToCharacter = rawEnemyDamage;

  session.enemyHp = Math.max(0, session.enemyHp - damageToEnemy);
  session.characterHp = Math.max(0, session.characterHp - damageToCharacter);
  session.round += 1;

  if (session.activePowerup) {
    session.activePowerup.roundsRemaining -= 1;
    if (session.activePowerup.roundsRemaining <= 0) {
      session.activePowerup = null;
    }
  }

  if(enemyAction==="spezialfaehigkeit" && session.activeDojutsu?.id==="sharingan"){ const enemyTechnique=enemy.id==="ninja-rogue"?"chidori":"shurikenjutsu"; recordTechniqueSeen(character,enemyTechnique,session.activeDojutsu.stageIndex); const t=techniqueById(enemyTechnique); note+=(note?" ":"")+`Sharingan analysiert ${t?.name??"die gegnerische Technik"}.`; }

  session.log.push({
    round: session.round,
    characterAction: action,
    enemyAction,
    damageToEnemy: Math.round(damageToEnemy),
    damageToCharacter: Math.round(damageToCharacter),
    abilityUsed: usedJutsu?.name ?? usedAbility?.name ?? usedGrundfertigkeit,
    note: note || "-",
  });

  character.currentHp = Math.max(0, Math.round(session.characterHp));
  character.energy.current = Math.max(0, Math.min(character.energy.max, Math.round(session.characterResource)));
  if (session.enemyHp <= 0) {
    session.status = "gewonnen";
    character.gold += Math.max(20, Math.round(enemy.kampfkraft * 2));
    for (const [key, value] of Object.entries(enemy.rewardComponents)) {
      const k = key as keyof Character["kampfkraftComponents"];
      character.kampfkraftComponents[k] += value ?? 0;
    }
    CharacterStore.save(character);
  } else if (session.characterHp <= 0) {
    session.status = "verloren";
  }
  CharacterStore.save(character);
  return CombatSessionStore.save(session);
}

/** Prüft, ob der Charakter jemals die erste Zanpakutō-Freisetzung erreicht hat (Stufe >= 1). */
function hasEverHadManifestation(character: Character): boolean {
  if (character.factionId !== "shinigami") return true;
  return (character.uniquePower?.stageIndex ?? 0) >= 1;
}

export function getCombatSession(sessionId: string): CombatSession {
  const session = CombatSessionStore.get(sessionId);
  if (!session) throw new ValidationError(`Kampf-Session "${sessionId}" nicht gefunden`);
  return session;
}
