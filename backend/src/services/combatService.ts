import { nanoid } from "nanoid";
import { ENEMIES } from "../data/enemies.js";
import { ITEMS } from "../data/items.js";
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
import { getUnlockedKarmaAbilities } from "../data/karmaAbilities.js";

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
  // P0: Charakter-LP sind persistent. Combat übernimmt exakt currentHp/maxHp statt eigene LP zu erfinden.
  const characterMaxHp = character.maxHp ?? Math.max(100, character.stats.lp * 10);
  const enemyMaxHp = Math.round(enemy.kampfkraft * HP_PER_KAMPFKRAFT) + 30;
  // Dasselbe gilt für die weltabhängige Energie: Character ist die Source of Truth.
  const characterResourceMax = character.energy.max;

  const session: CombatSession = {
    id: nanoid(),
    characterId,
    enemyId,
    characterHp: Math.min(characterMaxHp, Math.max(0, character.currentHp)),
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
    ritterHp: 0,
    ritterMaxHp: 0,
    ritterEnergy: 0,
    ritterEnergyMax: 0,
    ritterDefeated: false,
    ritterFusionMode: null,
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
  const activeKarma=character.karmaStates.find(k=>k.active); if(activeKarma) pool.push(...getUnlockedKarmaAbilities(activeKarma.progressPct));
  // Der Ritter ist ein beschwörbarer NPC - seine Fähigkeiten sind erst nach
  // Beschwörung nutzbar, nicht schon ab Kampfstart.
  // Spektralritter-Fähigkeiten gehören dem beschworenen Ritter und niemals dem Magier.
  // Sie werden ausschließlich über ritter_technik ausgeführt.
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

  if(action === "clan_power_aktivieren") {
    if(character.worldId!=="avalon" || !["mage-horus-lineage","mage-ra-lineage"].includes(character.clanId??"")) throw new ValidationError("Keine spielbare göttliche Clanaktivierung verfügbar.");
    const key=character.clanId==="mage-horus-lineage"?"mage-horus-eye":"mage-ra-magic"; const prog=character.abilityProgress.find(a=>a.abilityId===key);
    if(!prog || prog.stageIndex<1) throw new ValidationError("Trainiere diese Clankraft zuerst mindestens bis zur Grundform.");
    const cost=15;if(session.characterResource<cost)throw new ValidationError(`Nicht genug ${session.resourceLabel} (${cost} benötigt).`);session.characterResource-=cost;
    const horus=character.clanId==="mage-horus-lineage";session.activePowerup={name:horus?"Augen des Horus":"Auge des Ra",roundsRemaining:5,damageBonusPct:horus ? .12 : .32,incomingReductionPct:horus ? .22 : .08,upkeepCost:horus?5:7};
    session.round++;session.log.push({round:session.round,characterAction:action,enemyAction:"verteidigung",damageToEnemy:0,damageToCharacter:0,abilityUsed:session.activePowerup.name,note:horus?"Magische Strukturen, Bewegungen und Schwachpunkte werden sichtbar.":"Sonnenenergie verstärkt deine offensive Magie."});character.energy.current=Math.round(session.characterResource);CharacterStore.save(character);return CombatSessionStore.save(session);
  }

  if (action === "powerup_deaktivieren") {
    if (!session.activePowerup && !session.activeDojutsu) throw new ValidationError("Kein aktiver Zustand zum Deaktivieren.");
    const names=[session.activePowerup?.name,session.activeDojutsu?.name].filter(Boolean).join(" / ");
    session.activePowerup=null; session.activeDojutsu=null; session.round+=1;
    session.log.push({round:session.round,characterAction:action,enemyAction:"verteidigung",damageToEnemy:0,damageToCharacter:0,abilityUsed:names||null,note:`${names} deaktiviert.`});
    character.energy.current=Math.max(0,Math.min(character.energy.max,Math.round(session.characterResource))); CharacterStore.save(character);
    return CombatSessionStore.save(session);
  }

  if (action === "item") {
    const item=ITEMS.find(i=>i.id===abilityName && i.slot==="verbrauchsgut") as any;
    if(!item) throw new ValidationError("Verbrauchsitem unbekannt.");
    const slot=character.inventory.find(i=>i.itemId===item.id); if(!slot?.quantity) throw new ValidationError("Dieses Item befindet sich nicht im Inventar.");
    if(item.healHp) session.characterHp=Math.min(session.characterMaxHp,session.characterHp+item.healHp);
    if(item.restoreEnergy) session.characterResource=Math.min(session.characterResourceMax,session.characterResource+item.restoreEnergy);
    slot.quantity--; if(slot.quantity<=0) character.inventory=character.inventory.filter(i=>i!==slot);
    session.round+=1; session.log.push({round:session.round,characterAction:action,enemyAction:"verteidigung",damageToEnemy:0,damageToCharacter:0,abilityUsed:item.name,note:`${item.name} eingesetzt.`});
    character.currentHp=Math.round(session.characterHp); character.energy.current=Math.round(session.characterResource); CharacterStore.save(character); return CombatSessionStore.save(session);
  }

  if(action==="ritter_teilfusion" || action==="ritter_vollfusion") {
    if(!session.ritterSummoned || session.ritterHp<=0 || !character.spektralritterPact) throw new ValidationError("Beschwöre zuerst deinen Spektralritter.");
    const requiredStage=action==="ritter_teilfusion"?3:4;
    if(character.spektralritterPact.stageIndex<requiredStage) throw new ValidationError(action==="ritter_teilfusion"?"Teilverschmelzung ist im Pakt noch nicht gemeistert.":"Vollverschmelzung ist im Pakt noch nicht gemeistert.");
    const cost=action==="ritter_teilfusion"?25:40;if(session.characterResource<cost)throw new ValidationError(`Nicht genug ${session.resourceLabel} für die Verschmelzung.`);
    session.characterResource-=cost;session.ritterFusionMode=action==="ritter_teilfusion"?"partial":"full";session.ritterSummoned=false;session.round++;
    session.log.push({round:session.round,characterAction:action,enemyAction:"verteidigung",damageToEnemy:0,damageToCharacter:0,abilityUsed:character.spektralritterPact.generatedName,note:session.ritterFusionMode==="partial"?"Teilverschmelzung: Magier und Ritter handeln nun als eine Einheit mit gemeinsamem Moveset.":"Vollverschmelzung: Die Rittermanifestation wird zur vollständigen Rüstung/Form des Magiers."});
    character.energy.current=Math.round(session.characterResource);CharacterStore.save(character);return CombatSessionStore.save(session);
  }

  if(action==="ritter_technik") {
    if(!session.ritterSummoned || session.ritterHp<=0 || !character.spektralritterPact) throw new ValidationError("Beschwöre zuerst deinen Spektralritter.");
    const ability=character.spektralritterPact.individualAbilities.find(a=>a.name===abilityName);
    if(!ability) throw new ValidationError("Diese Technik gehört nicht zu deinem Spektralritter.");
    const cost=Math.max(5,abilityResourceCost(ability));
    if(session.ritterEnergy<cost) throw new ValidationError(`Der Spektralritter hat nicht genug eigene Energie (${session.ritterEnergy}/${cost}).`);
    session.ritterEnergy-=cost;
    const damage=randomVariance(getKampfkraft(character)*(.32+(ability.kind==="angriff"?.12:.2)),false);
    session.enemyHp=Math.max(0,session.enemyHp-damage);session.round++;
    session.log.push({round:session.round,characterAction:action,enemyAction:"verteidigung",damageToEnemy:Math.round(damage),damageToCharacter:0,abilityUsed:ability.name,note:`${character.spektralritterPact.generatedName} setzt ${ability.name} als eigene Aktion ein. Ritterkosten: ${cost}.`});
    if(session.enemyHp<=0)session.status="gewonnen";return CombatSessionStore.save(session);
  }

  if(action==="ritter_angriff") {
    if(!session.ritterSummoned || session.ritterHp<=0 || !character.spektralritterPact) throw new ValidationError("Kein kampffähiger Spektralritter beschworen.");
    const damage=randomVariance(getKampfkraft(character)*.28,false);session.enemyHp=Math.max(0,session.enemyHp-damage);session.round++;
    session.log.push({round:session.round,characterAction:action,enemyAction:"verteidigung",damageToEnemy:Math.round(damage),damageToCharacter:0,abilityUsed:character.spektralritterPact.generatedName,note:"Dein Spektralritter handelt in seinem eigenen Zug."});
    if(session.enemyHp<=0)session.status="gewonnen";return CombatSessionStore.save(session);
  }

  // -- Ritter beschwören: eigene Aktion, kein Schaden, macht ihn danach steuerbar --
  if (action === "ritter_beschwoeren") {
    if (!character.spektralritterPact) {
      throw new ValidationError("Charakter hat keinen Spektralritter-Pakt - nichts zu beschwören");
    }
    if (session.ritterSummoned) throw new ValidationError("Der Ritter ist bereits beschworen");
    if (session.ritterDefeated) throw new ValidationError("Der Ritter wurde in diesem Kampf bereits besiegt und kann nicht erneut beschworen werden.");
    const cost = 20;
    if (session.characterResource < cost) {
      throw new ValidationError(`Nicht genug ${session.resourceLabel} zum Beschwören (${session.characterResource}/${cost}).`);
    }
    session.characterResource -= cost;
    session.ritterSummoned = true;
    session.ritterMaxHp = Math.max(80, Math.round(getKampfkraft(character)*1.4)); session.ritterHp=session.ritterMaxHp; session.ritterEnergyMax=Math.max(60,Math.round(character.energy.max*.75)); session.ritterEnergy=session.ritterEnergyMax;
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

  if (session.activePowerup?.upkeepCost) {
    if(session.characterResource < session.activePowerup.upkeepCost){ session.log.push({round:session.round,characterAction:action,enemyAction:"verteidigung",damageToEnemy:0,damageToCharacter:0,abilityUsed:session.activePowerup.name,note:`${session.activePowerup.name} bricht wegen fehlender ${session.resourceLabel} zusammen.`}); session.activePowerup=null; }
    else session.characterResource -= session.activePowerup.upkeepCost;
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
    const hakiCost = hakiMode === "dominanz" ? 18 : 10;
    if (session.characterResource < hakiCost) throw new ValidationError(`Nicht genug Willenskraft für Haki (${hakiCost} benötigt).`);
    session.characterResource -= hakiCost;
  }

  const fusionMultiplier=session.ritterFusionMode==="full"?1.45:session.ritterFusionMode==="partial"?1.22:1;
  const characterPower = getKampfkraft(character)*fusionMultiplier;
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
    else if(usedJutsu.effect==="defense"){session.dodgePrepared=true; session.characterHp=Math.min(session.characterMaxHp,session.characterHp+(usedJutsu.id==="senju-regeneration"?20:0)); note=`${usedJutsu.name} stabilisiert deine Verteidigung${usedJutsu.id==="senju-regeneration"?" und Vitalität":""}.`;}
    else {const eyePrecision=session.activeDojutsu?.id==="byakugan"?1.2:1;damageToEnemy=randomVariance(characterPower*((usedJutsu.damage??25)/100)*(1+(st.mastery/300))*eyePrecision,guaranteedHits);note=`${character.characterName} setzt ${usedJutsu.name} ein.`;}
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
        upkeepCost: Math.max(2, Math.round(abilityResourceCost(usedAbility) * 0.2)),
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
    damageToEnemy = 0;
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

  // Trefferprüfung kommt vor Krit: Genauigkeit und Wahrnehmung sind echte Kampfwerte.
  if(damageToEnemy>0 && !guaranteedHits){
    const perception=session.activeDojutsu?8+session.activeDojutsu.stageIndex*3:(session.activePowerup?.name==="Augen des Horus"?12:0);
    const hitChance=Math.min(.95,Math.max(.35,.62+(character.stats.genauigkeit+perception-enemyPower*.08)/100));
    if(Math.random()>hitChance){damageToEnemy=0;note+=(note?" ":"")+"Der Angriff verfehlt.";}
    else {const critChance=Math.min(.35,.05+character.stats.genauigkeit/250);if(Math.random()<critChance){damageToEnemy*=1.5;note+=(note?" ":"")+"Kritischer Treffer!";}}
  }

  let rawEnemyDamage =
    enemyAction === "angriff"
      ? randomVariance(enemyPower * 0.22, false)
      : enemyAction === "spezialfaehigkeit"
        ? randomVariance(enemyPower * 0.4, false)
        : randomVariance(enemyPower * 0.05, false);

  const enemyHitChance=Math.min(.92,Math.max(.4,.64+(enemyPower*.08-character.stats.geschwindigkeit*.35)/100));
  if(Math.random()>enemyHitChance){rawEnemyDamage=0;note+=(note?" ":"")+"Der gegnerische Angriff verfehlt.";}
  if (session.enemyAccuracyDebuffRounds>0) { rawEnemyDamage*=0.72; session.enemyAccuracyDebuffRounds--; }
  if(session.ritterSummoned && session.ritterHp>0 && Math.random()<.28){session.ritterHp=Math.max(0,session.ritterHp-rawEnemyDamage);note+=(note?" ":"")+`Der Gegner trifft deinen Spektralritter (${Math.round(rawEnemyDamage)} Schaden).`;rawEnemyDamage=0;if(session.ritterHp<=0){session.ritterSummoned=false;session.ritterDefeated=true;note+=" Der Ritter ist für diesen Kampf besiegt und kann nicht erneut beschworen werden.";}}
  if (action === "ausweichen" || session.dodgePrepared) {
    const perceptionBonus=(session.activeDojutsu?.id==="sharingan" ? 0.08*session.activeDojutsu.stageIndex : session.activeDojutsu?.id==="byakugan" ? 0.12 : 0) + (session.activePowerup?.name==="Augen des Horus"?.14:0);
    const dodgeChance=Math.min(.8,.18+character.stats.geschwindigkeit/(character.stats.geschwindigkeit+Math.max(1,enemyPower))*.35+perceptionBonus);
    if(Math.random()<dodgeChance){rawEnemyDamage=0;note+=(note?" ":"")+"Du liest den Angriff und weichst erfolgreich aus.";} else note+=(note?" ":"")+"Das Ausweichmanöver reicht nicht vollständig."; session.dodgePrepared=false;
  }
  if (action === "verteidigung") { rawEnemyDamage *= enemyAction === "spezialfaehigkeit" ? 0.65 : 0.4; }
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
