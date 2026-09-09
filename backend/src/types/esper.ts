import type { AbilityTemplate } from "./uniquePower.js";

export interface EsperOrigin {
  id: string;
  name: string; // fester, einzigartiger Name - NICHT generiert (es gibt nur genau diesen einen)
  element: string;
  description: string;
  abilityPool: AbilityTemplate[];
  /** Tier-Name der Stufe, an der Dominus freigeschaltet wird */
  dominusTier: string;
}

export const ESPER_STAGES = ["Pakt", "Resonanz", "Manifestation", "Verschmelzung", "Finale Form"];

export interface EsperPact {
  esperId: string;
  esperName: string;
  stageIndex: number;
  individualAbilities: import("./ability.js").Ability[];
  developmentLog: string[];
}
