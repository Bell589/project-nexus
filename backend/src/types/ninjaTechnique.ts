export type NinjaTechniqueCategory = "grundjutsu"|"ninjutsu"|"katon"|"suiton"|"raiton"|"fuuton"|"doton"|"taijutsu"|"genjutsu"|"clan"|"dojutsu"|"summon"|"kekkei_genkai"|"verboten"|"jinchuriki"|"karma"|"meister";
export interface NinjaTechniqueDefinition {
 id:string; name:string; description:string; category:NinjaTechniqueCategory; element?:string; clanRestriction?:string[]; acquisitionMethod:"ACADEMY"|"TRAINING"|"CLAN_TRAINING"|"MASTER_TRAINING"|"COPY"|"PROGRESSION"; baseCost:number; damage?:number; effect?:"damage"|"genjutsu"|"defense"|"dodge"|"utility"; copyable:boolean; trainable:boolean; requiredMastery?:number; requiredDojutsuStage?:number; requiredStateId?:string; hidden?:boolean;
}
export interface NinjaTechniqueState { techniqueId:string; mastery:number; learned:boolean; analysisPct:number; seenCount:number; copied:boolean; }
export interface DojutsuState { definitionId:"sharingan"|"byakugan"; name:string; awakened:boolean; stageIndex:number; mastery:number; activeOutsideCombat:boolean; personalAbilityIds:string[]; developmentLog:string[]; }
