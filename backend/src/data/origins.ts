import type { OriginDefinition } from "../types/gameplay.js";
export const ORIGINS: OriginDefinition[] = [
 {id:"origin_ninja_academy",worldId:"ninja_welt",raceIds:["ninja-human"],name:"Ninja-Akademie",description:"Fester Einstieg in Grundlagen, Dorf und Missionen.",steps:[
  {id:"grundlagen",title:"Grundlagen",description:"Chakra, Bewegung und grundlegende Techniken.",rewardStatPoints:3},
  {id:"pruefung",title:"Abschlussprüfung",description:"Schließe die Akademie ab.",rewardSkillPoints:2,rewardGold:250}]},
 {id:"origin_soul-shinigami_academy",worldId:"soul_society",raceIds:["soul-shinigami"],name:"Shinigami-Akademie",description:"Ausbildung vor dem Eintritt in eine Einheit.",steps:[
  {id:"seelenlehre",title:"Seelenlehre",description:"Grundlagen von Reiatsu und Kampf.",rewardStatPoints:3},
  {id:"graduierung",title:"Graduierung",description:"Schließe die Akademie ab.",rewardSkillPoints:2,rewardGold:250}]},
 {id:"origin_soul-hollow",worldId:"soul_society",raceIds:["soul-hollow"],name:"Erwachen als Hollow",description:"Vom schwachen Hollow zur offenen Jagd.",steps:[
  {id:"erwachen",title:"Erwachen",description:"Lerne deine neue Existenz kennen.",rewardStatPoints:3},
  {id:"erste_jagd",title:"Erste Jagd",description:"Überlebe die ersten Begegnungen.",rewardSkillPoints:2,rewardGold:150}]},
 {id:"origin_mage",worldId:"avalon",raceIds:["mage-divine-descendant"],name:"Magische Ausbildung",description:"Magie, Äther, Geschichte, Kampf und Clan-Grundlagen.",steps:[
  {id:"aether",title:"Äther-Grundlagen",description:"Lerne Äther und normale Magie.",rewardStatPoints:3},
  {id:"abschluss",title:"Abschluss",description:"Beende die Grundausbildung.",rewardSkillPoints:2,rewardGold:250}]},
 {id:"origin_ocean",worldId:"ozeanwelt",raceIds:["ocean-human","ocean-fishman","ocean-giant"],name:"Insel-Ursprung",description:"Neutraler Start; lerne Marine und Piraten kennen.",steps:[
  {id:"insel",title:"Heimatinsel",description:"Erkunde den Startort und beide Wege.",rewardStatPoints:3},
  {id:"entscheidung",title:"Der eigene Weg",description:"Bereite deinen Weg auf See vor.",rewardSkillPoints:2,rewardGold:250}]}
];
