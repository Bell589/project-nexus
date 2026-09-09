import { OTSUTSUKI } from "../data/otsutsuki.js";
import { CharacterStore } from "../db/memoryStore.js";
import { GlobalUniquenessRegistry } from "../db/globalUniquenessRegistry.js";
import { getKampfkraft, ValidationError } from "./characterService.js";
import { getUnlockedKarmaAbilities } from "../data/karmaAbilities.js";
import { despawnEntityEncounter, isEntityEncounterActive } from "./worldEncounterService.js";
import type { Character } from "../types/character.js";
import type { OtsutsukiOrigin } from "../data/otsutsuki.js";
const CATEGORY = "otsutsuki";
function requireShinobi(characterId: string): Character { const c=CharacterStore.get(characterId); if(!c) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`); if(c.worldId!=="ninja_welt") throw new ValidationError("Nur Charaktere der Ninja-Welt können Otsutsuki herausfordern"); return c; }
export function listAvailableOtsutsuki(): OtsutsukiOrigin[] { return OTSUTSUKI.filter((o)=>isEntityEncounterActive("otsutsuki", o.id) && !GlobalUniquenessRegistry.isConsumed(CATEGORY,o.id)); }
export function fightOtsutsuki(characterId:string, otsutsukiId:string): Character {
  const character=requireShinobi(characterId); const o=OTSUTSUKI.find(x=>x.id===otsutsukiId); if(!o) throw new ValidationError(`Otsutsuki "${otsutsukiId}" nicht gefunden`);
  if(!isEntityEncounterActive("otsutsuki", otsutsukiId)) throw new ValidationError(`${o.name} ist aktuell nicht als Weltbegegnung erschienen.`);
  if(GlobalUniquenessRegistry.isConsumed(CATEGORY,otsutsukiId)) throw new ValidationError(`${o.name} wurde bereits besiegt und existiert nicht mehr.`);
  const kk=getKampfkraft(character), chance=Math.min(.8, kk/(kk+o.kampfkraft)); if(Math.random()>=chance) throw new ValidationError(`${o.name} wurde nicht besiegt. Ein erneuter Versuch ist möglich.`);
  if(GlobalUniquenessRegistry.isConsumed(CATEGORY,otsutsukiId)) throw new ValidationError(`${o.name} wurde soeben von einem anderen Charakter besiegt.`);
  GlobalUniquenessRegistry.markConsumed(CATEGORY,otsutsukiId); despawnEntityEncounter("otsutsuki", otsutsukiId);
  if(!character.defeatedOtsutsukiIds.includes(otsutsukiId)) character.defeatedOtsutsukiIds.push(otsutsukiId);
  let karma=character.karmaStates.find(k=>k.otsutsukiId===otsutsukiId);
  if(!karma){ karma={otsutsukiId,progressPct:0,active:true,lineageId:`lineage-${otsutsukiId}`,unlockedAbilityIds:[],developmentLog:[]}; character.karmaStates.push(karma); }
  karma.progressPct=Math.min(100,karma.progressPct+o.karmaGrant); karma.active=true; karma.unlockedAbilityIds=getUnlockedKarmaAbilities(karma.progressPct).map(a=>a.id??a.name);
  karma.developmentLog.push(`Karma von ${o.name}: ${karma.progressPct}%.`);
  const lineageId=`lineage-${otsutsukiId}`; const existing=character.temporaryLineages.find(l=>l.id===lineageId);
  if(existing){ existing.active=true; existing.progressPct=karma.progressPct; existing.grantedAbilityIds=[...karma.unlockedAbilityIds]; }
  else character.temporaryLineages.push({id:lineageId,sourceType:"karma",sourceId:otsutsukiId,clanId:"otsutsuki-temporary-lineage",active:true,progressPct:karma.progressPct,grantedAbilityIds:[...karma.unlockedAbilityIds],acquiredAt:new Date().toISOString()});
  character.karmaPct=Math.max(0,...character.karmaStates.filter(k=>k.active).map(k=>k.progressPct));
  return CharacterStore.save(character);
}
export interface ReincarnationResult { character: Character; message: string; }
export function activateOtsutsukiReincarnation(characterId:string):ReincarnationResult {
  const c=requireShinobi(characterId); const karma=c.karmaStates.find(k=>k.active&&k.progressPct>=100); if(!karma) throw new ValidationError(`Volle Otsutsuki-Reinkarnation erfordert ein aktives Karma mit 100% (aktuell max. ${c.karmaPct}%).`);
  karma.active=false; karma.progressPct=0; karma.unlockedAbilityIds=[]; karma.developmentLog.push("Reinkarnationszustand ausgelöst; Karma anschließend deaktiviert.");
  const lineage=c.temporaryLineages.find(l=>l.sourceType==="karma"&&l.sourceId===karma.otsutsukiId); if(lineage){lineage.active=false;lineage.progressPct=0;lineage.grantedAbilityIds=[];}
  c.karmaPct=Math.max(0,...c.karmaStates.filter(k=>k.active).map(k=>k.progressPct)); CharacterStore.save(c);
  return {character:c,message:"Otsutsuki-artige Reinkarnation/Transformation wurde ausgelöst. Die genaue Endmechanik bleibt bewusst offen; das zugehörige Karma und seine temporäre Blutlinie sind jetzt deaktiviert."};
}
