export type CombatAction = "angriff" | "verteidigung" | "spezialfaehigkeit" | "flucht";
export type CombatStatus = "laufend" | "gewonnen" | "verloren" | "geflohen";

export interface CombatRoundLog {
  round: number;
  characterAction: CombatAction;
  enemyAction: CombatAction;
  damageToEnemy: number;
  damageToCharacter: number;
  abilityUsed: string | null;
  note: string;
}

export interface ActivePowerup {
  name: string;
  roundsRemaining: number;
  damageBonusPct: number;
  incomingReductionPct: number;
}

export interface CombatSession {
  id: string;
  characterId: string;
  enemyId: string;
  characterHp: number;
  characterMaxHp: number;
  enemyHp: number;
  enemyMaxHp: number;
  resourceLabel: string; // "Wille" | "Reiatsu" | "Mana" je nach Welt
  characterResource: number;
  characterResourceMax: number;
  round: number;
  status: CombatStatus;
  log: CombatRoundLog[];
  activePowerup: ActivePowerup | null;
  createdAt: string;
}
