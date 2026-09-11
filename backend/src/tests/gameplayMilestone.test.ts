import test from "node:test";
import assert from "node:assert/strict";
import { createCharacter } from "../services/characterService.js";
import { CharacterStore } from "../db/memoryStore.js";
import { startCombat, performAction } from "../services/combatService.js";
import { addItem } from "../services/inventoryService.js";
import { advanceOrigin } from "../services/gameplayService.js";
import { trainSkill } from "../services/skillService.js";
import { clanTrainByakugan, awakenByakugan, trainNinjaTechnique } from "../services/ninjaProgressionService.js";

function make(worldId:"ninja_welt"|"ozeanwelt"|"soul_society"|"avalon", clanId:string|null=null, factionId?:string){
 return createCharacter({ownerName:"milestone",characterName:`T-${worldId}-${Math.random()}`,worldId,raceId:worldId==="ninja_welt"?"ninja-human":worldId==="ozeanwelt"?"ocean-human":worldId==="avalon"?"mage-divine-descendant":"soul-shinigami",clanId,factionId:factionId??(worldId==="ninja_welt"?"shinobi":worldId==="ozeanwelt"?"neutral_ocean":worldId==="avalon"?"magier":"shinigami")});
}

test("P0: Combat übernimmt persistente LP/maxLP und Energie exakt",()=>{
 const c=make("ninja_welt"); c.stats.lp=62;c.maxHp=620;c.currentHp=540;c.energy.max=275;c.energy.current=231;CharacterStore.save(c);
 const f=startCombat(c.id,"ninja-bandit");assert.equal(f.characterMaxHp,620);assert.equal(f.characterHp,540);assert.equal(f.characterResourceMax,275);assert.equal(f.characterResource,231);
});

test("Combat schreibt LP und Energie nach Aktion zurück",()=>{
 const c=make("ninja_welt");c.maxHp=300;c.currentHp=260;c.energy.max=180;c.energy.current=150;CharacterStore.save(c);
 const f=startCombat(c.id,"ninja-bandit");const r=performAction(f.id,"verteidigung");const saved=CharacterStore.get(c.id)!;assert.equal(saved.currentHp,Math.round(r.characterHp));assert.equal(saved.energy.current,Math.round(r.characterResource));
});

test("Combat-Item heilt nur bis maxHP und verbraucht Inventar",()=>{
 const c=make("ninja_welt");c.maxHp=180;c.currentHp=160;CharacterStore.save(c);addItem(c.id,"heiltrank",1);const f=startCombat(c.id,"ninja-bandit");const r=performAction(f.id,"item","heiltrank");assert.equal(r.characterHp,180);assert.equal(CharacterStore.get(c.id)!.inventory.some(i=>i.itemId==="heiltrank"),false);
});

test("Ocean: Haki ist Training + Willenskraft-Mechanik",()=>{
 const c=make("ozeanwelt");advanceOrigin(c.id);let x=advanceOrigin(c.id);x.factionId="piraten";x.kampfkraftComponents.faehigkeiten=30;x.currentLocationId="insel-goldbucht";CharacterStore.save(x);x=trainSkill(c.id,"Verstärkung (Busoshoku)");assert.equal(x.skills.some(s=>s.name.includes("Busoshoku")),true);const f=startCombat(c.id,"kleiner-pirat");const before=f.characterResource;const r=performAction(f.id,"angriff",undefined,"verstaerkung");assert.ok(r.characterResource<=before-10);
});

test("Hyūga: Potenzial -> Byakugan -> state-locked Jūken",()=>{
 const c=make("ninja_welt","clan-hyuga");clanTrainByakugan(c.id);clanTrainByakugan(c.id);let x=awakenByakugan(c.id);assert.equal(x.dojutsuState?.definitionId,"byakugan");x=trainNinjaTechnique(c.id,"juuken");const f=startCombat(c.id,"ninja-bandit");assert.throws(()=>performAction(f.id,"jutsu","juuken"),/aktives byakugan/i);const eye=performAction(f.id,"dojutsu_aktivieren");const hit=performAction(eye.id,"jutsu","juuken");assert.equal(hit.log.at(-1)?.abilityUsed,"Jūken");
});

test("Power-Up ist aktivierbar, sichtbar, kostet Ressource und deaktivierbar",()=>{
 const c=make("soul_society");c.uniquePower={originId:"test",category:"Zanpakutō",variant:"Test",generatedName:"Testklinge",stageIndex:1,developmentLog:[],individualAbilities:[{name:"Shikai: Test",kind:"powerup",description:"Test-Release",resourceCost:20,powerup:{rounds:3,damageBonusPct:.2,incomingReductionPct:.2}}]};CharacterStore.save(c);const f=startCombat(c.id,"hollow-streuner");const r=performAction(f.id,"spezialfaehigkeit","Shikai: Test");assert.equal(r.activePowerup?.name,"Shikai: Test");assert.ok(r.characterResource<f.characterResourceMax);const off=performAction(r.id,"powerup_deaktivieren");assert.equal(off.activePowerup,null);
});
