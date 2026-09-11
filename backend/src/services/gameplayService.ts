import { nanoid } from "nanoid";
import { CharacterStore } from "../db/memoryStore.js";
import { MarketplaceStore, OrganizationStore } from "../db/economyStore.js";
import { LOCATIONS } from "../data/locations.js";
import { ITEMS } from "../data/items.js";
import { ORIGINS } from "../data/origins.js";
import { ENEMIES } from "../data/enemies.js";
import { MASTER_TRAINERS } from "../data/trainers.js";
import { ValidationError } from "./characterService.js";
import type { Character } from "../types/character.js";
import type { MarketplaceListing, PlayerOrganization, OrganizationPermission, TravelResult } from "../types/gameplay.js";

const get=(id:string)=>{const c=CharacterStore.get(id);if(!c)throw new ValidationError("Charakter nicht gefunden");return c};
export function getOrigins(worldId?:string){return ORIGINS.filter(o=>!worldId||o.worldId===worldId)}
export function advanceOrigin(characterId:string):Character {
 const c=get(characterId); const def=ORIGINS.find(o=>o.id===c.origin.originId); if(!def)throw new ValidationError("Origin nicht gefunden");
 if(c.origin.status==="completed") return c;
 const step=def.steps[c.origin.stepIndex]; if(!step){c.origin.status="completed";return CharacterStore.save(c)}
 c.origin.completedStepIds.push(step.id); c.origin.stepIndex++;
 if(c.worldId==="ninja_welt"){ const unlocks=step.id==="grundlagen"?["bunshin","henge"]:step.id==="pruefung"?["kawarimi","shurikenjutsu"]:[]; for(const techniqueId of unlocks){if(!c.ninjaTechniques.some(x=>x.techniqueId===techniqueId))c.ninjaTechniques.push({techniqueId,mastery:10,learned:true,analysisPct:0,seenCount:0,copied:false});}}
 c.skillPoints += step.rewardSkillPoints??0; c.gold += step.rewardGold??0;
 const points=step.rewardStatPoints??0; if(points)c.statPoints+=points;
 if(c.origin.stepIndex>=def.steps.length)c.origin.status="completed"; else c.origin.status="in_progress";
 return CharacterStore.save(c);
}
export function spendStatPoint(characterId:string, stat:keyof Character["stats"]):Character {
 const c=get(characterId); if(c.statPoints<1)throw new ValidationError("Keine freien Statpunkte"); if(!(stat in c.stats))throw new ValidationError("Ungültiger Stat");
 c.statPoints--; c.stats[stat]+=1; c.energy.max=energyMax(c); if(c.energy.current>c.energy.max)c.energy.current=c.energy.max; c.maxHp=maxHp(c); if(c.currentHp>c.maxHp)c.currentHp=c.maxHp; return CharacterStore.save(c);
}
export function trainMastery(characterId:string, abilityId:string):Character {
 const c=get(characterId); const a=c.abilityProgress.find(x=>x.abilityId===abilityId); if(!a)throw new ValidationError("Fähigkeit ist nicht gelernt");
 const mastery=(a as any).mastery??0; (a as any).mastery=Math.min(100,mastery+5); a.developmentLog.push(`Beherrschung auf ${(a as any).mastery}% trainiert`); return CharacterStore.save(c);
}
export function rest(characterId:string):Character { const c=get(characterId); c.maxHp=maxHp(c); c.energy.current=c.energy.max; c.currentHp=c.maxHp; return CharacterStore.save(c); }
export function travel(characterId:string,toLocationId:string):TravelResult {
 const c=get(characterId); const loc=LOCATIONS.find(l=>l.id===toLocationId&&l.worldId===c.worldId); if(!loc)throw new ValidationError("Ort gehört nicht zur Welt");
 const from=c.currentLocationId; c.currentLocationId=loc.id; CharacterStore.save(c);
 const roll=Math.random(); let encounter:TravelResult["encounter"]={kind:"none",message:"Die Reise verläuft ruhig."};
 if(roll<.18){const maxRecommended=Math.max(30, c.stats.kraft+c.stats.verteidigung+c.stats.power); const e=ENEMIES.filter(x=>x.worldId===c.worldId && x.kampfkraft<=maxRecommended*2);const x=e[Math.floor(Math.random()*e.length)];if(x)encounter={kind:"enemy",id:x.id,message:`Du entdeckst ${x.name}. Du entscheidest selbst, ob du kämpfst.`};}
 else if(roll<.28){const ts=MASTER_TRAINERS.filter(t=>t.worldId===c.worldId&&t.possibleLocationIds.includes(loc.id));const t=ts[Math.floor(Math.random()*ts.length)];if(t)encounter={kind:"trainer",id:t.id,message:`Ein besonderer Meister ist hier: ${t.name}. Das schaltet nur Trainingszugang frei.`};}
 else if(roll<.36) encounter={kind:"event",message:"Du bemerkst Gerüchte und ungewöhnliche Spuren in der Umgebung."};
 return {characterId:c.id,fromLocationId:from,toLocationId:loc.id,encounter};
}
export function listMarketplace(){return [...MarketplaceStore.values()]}
export function createListing(characterId:string,itemId:string,quantity:number,pricePerItem:number):MarketplaceListing {
 const c=get(characterId); if(quantity<1||pricePerItem<1)throw new ValidationError("Ungültige Menge/Preis"); const slot=c.inventory.find(i=>i.itemId===itemId); if(!slot||slot.quantity<quantity)throw new ValidationError("Item nicht ausreichend vorhanden");
 const item:any=ITEMS.find(i=>i.id===itemId); if(!item)throw new ValidationError("Item unbekannt"); if(item.bound===true||item.tradeable===false||item.marketplaceAllowed===false)throw new ValidationError("Item ist nicht handelbar");
 slot.quantity-=quantity;if(slot.quantity===0)c.inventory=c.inventory.filter(i=>i!==slot); CharacterStore.save(c);
 const l={id:nanoid(),sellerCharacterId:c.id,itemId,quantity,pricePerItem,createdAt:new Date().toISOString()}; MarketplaceStore.set(l.id,l);return l;
}
export function buyListing(characterId:string,listingId:string):Character {
 const buyer=get(characterId); const l=MarketplaceStore.get(listingId); if(!l)throw new ValidationError("Angebot nicht gefunden"); if(l.sellerCharacterId===buyer.id)throw new ValidationError("Eigenes Angebot");
 const total=l.quantity*l.pricePerItem;if(buyer.gold<total)throw new ValidationError("Nicht genug Gold"); const seller=get(l.sellerCharacterId); buyer.gold-=total;seller.gold+=total;
 const slot=buyer.inventory.find(i=>i.itemId===l.itemId);if(slot)slot.quantity+=l.quantity;else buyer.inventory.push({itemId:l.itemId,quantity:l.quantity});
 CharacterStore.save(buyer);CharacterStore.save(seller);MarketplaceStore.delete(l.id);return buyer;
}
const leaderPerms:OrganizationPermission[]=["CREATE_MISSIONS","MANAGE_MISSION_REWARDS","TARGET_PLAYERS","MANAGE_MEMBERS","MANAGE_STORAGE","DECLARE_WAR","MANAGE_TREASURY"];
export function listOrganizations(worldId?:string){return [...OrganizationStore.values()].filter(o=>!worldId||o.worldId===worldId)}
export function createOrganization(characterId:string,name:string,type:string):PlayerOrganization {
 const c=get(characterId); if(!name.trim())throw new ValidationError("Name fehlt"); if(c.organizationMemberships.length>0)throw new ValidationError("Charakter ist bereits Mitglied einer Spielerorganisation"); if([...OrganizationStore.values()].some(x=>x.name.toLowerCase()===name.trim().toLowerCase()))throw new ValidationError("Organisationsname bereits vergeben"); const o={id:nanoid(),worldId:c.worldId,type,name:name.trim(),founderCharacterId:c.id,leaderCharacterId:c.id,viceLeaderCharacterId:null,members:[{characterId:c.id,role:"leader",permissions:[...leaderPerms]}],treasuryGold:0,storage:[],diplomacy:[],createdAt:new Date().toISOString()}; OrganizationStore.set(o.id,o); c.organizationMemberships.push({organizationId:o.id,roleId:"leader",joinedAt:new Date().toISOString()});CharacterStore.save(c);return o;
}
export function joinOrganization(characterId:string,organizationId:string):PlayerOrganization {
 const c=get(characterId),o=OrganizationStore.get(organizationId);if(!o||o.worldId!==c.worldId)throw new ValidationError("Organisation nicht verfügbar");if(c.organizationMemberships.length>0&&!c.organizationMemberships.some(m=>m.organizationId===o.id))throw new ValidationError("Charakter ist bereits Mitglied einer anderen Spielerorganisation");if(!o.members.some(m=>m.characterId===c.id))o.members.push({characterId:c.id,role:"member",permissions:[]});if(!c.organizationMemberships.some(m=>m.organizationId===o.id))c.organizationMemberships.push({organizationId:o.id,roleId:"member",joinedAt:new Date().toISOString()});CharacterStore.save(c);return o;
}
export function depositTreasury(characterId:string,organizationId:string,amount:number){const c=get(characterId),o=OrganizationStore.get(organizationId);if(!o)throw new ValidationError("Organisation fehlt");if(amount<1||c.gold<amount)throw new ValidationError("Ungültiger Betrag");if(!o.members.some(m=>m.characterId===c.id))throw new ValidationError("Kein Mitglied");c.gold-=amount;o.treasuryGold+=amount;CharacterStore.save(c);return o}
export function energyMax(c:Character){return Math.max(100,c.stats.power*10)}
export function maxHp(c:Character){return Math.max(100,c.stats.lp*10)}

export function listShopItems(){return ITEMS.map((i:any)=>({price:i.price??100,tradeable:i.tradeable??true,marketplaceAllowed:i.marketplaceAllowed??true,bound:i.bound??false,unique:i.unique??false,organizationStorageAllowed:i.organizationStorageAllowed??true,rarity:i.rarity??"common",category:i.category??(i.slot==="waffe"?"weapon":i.slot==="verbrauchsgut"?"consumable":"equipment"),...i}))}
export function buyShopItem(characterId:string,itemId:string,quantity:number):Character {const c=get(characterId);const item:any=listShopItems().find(i=>i.id===itemId);if(!item)throw new ValidationError("Item unbekannt");if(quantity<1)throw new ValidationError("Ungültige Menge");const cost=item.price*quantity;if(c.gold<cost)throw new ValidationError("Nicht genug Gold");c.gold-=cost;const slot=c.inventory.find(i=>i.itemId===itemId);if(slot)slot.quantity+=quantity;else c.inventory.push({itemId,quantity});return CharacterStore.save(c)}
export function devGrant(characterId:string,input:{gold?:number;skillPoints?:number;statPoints?:number;energy?:number}):Character {const c=get(characterId);const gold=Math.max(0,Number(input.gold??0)),skills=Math.max(0,Number(input.skillPoints??0)),stats=Math.max(0,Number(input.statPoints??0)),energy=Math.max(0,Number(input.energy??0));c.gold+=gold;c.skillPoints+=skills;c.statPoints+=stats;c.energy.current=Math.min(c.energy.max,c.energy.current+energy);return CharacterStore.save(c)}

export function chooseFaction(characterId:string,factionId:string):Character {
 const c=get(characterId);
 if(c.worldId!=="ozeanwelt") throw new ValidationError("Diese Fraktionsentscheidung ist aktuell nur für die Ozeanwelt vorgesehen");
 if(c.origin.status!=="completed") throw new ValidationError("Schließe zuerst deine Origin ab");
 if(!["piraten","marine"].includes(factionId)) throw new ValidationError("Wähle Piraten oder Marine");
 c.factionId=factionId; return CharacterStore.save(c);
}
