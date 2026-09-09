import type { WorldId } from "./world.js";
export interface OriginDefinition { id:string; worldId:WorldId; raceIds:string[]; factionIds?:string[]; name:string; description:string; steps:{id:string; title:string; description:string; rewardStatPoints?:number; rewardSkillPoints?:number; rewardGold?:number}[]; }
export interface ShopDefinition { id:string; worldId:WorldId; locationId:string; name:string; itemIds:string[]; }
export interface MarketplaceListing { id:string; sellerCharacterId:string; itemId:string; quantity:number; pricePerItem:number; createdAt:string; }
export type OrganizationPermission = "CREATE_MISSIONS"|"MANAGE_MISSION_REWARDS"|"TARGET_PLAYERS"|"MANAGE_MEMBERS"|"MANAGE_STORAGE"|"DECLARE_WAR"|"MANAGE_TREASURY";
export interface PlayerOrganization { id:string; worldId:WorldId; type:string; name:string; founderCharacterId:string; leaderCharacterId:string; viceLeaderCharacterId:string|null; members:{characterId:string; role:string; permissions:OrganizationPermission[]}[]; treasuryGold:number; storage:{itemId:string;quantity:number}[]; diplomacy:{organizationId:string; state:"alliance"|"neutral"|"hostile"|"war"|"peace"}[]; createdAt:string; }
export interface TravelResult { characterId:string; fromLocationId:string|null; toLocationId:string; encounter:{kind:"enemy"|"trainer"|"event"|"none"; id?:string; message:string}; }
