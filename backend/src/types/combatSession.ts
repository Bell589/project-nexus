export type CombatAction = "angriff" | "verteidigung" | "spezialfaehigkeit" | "flucht";
export type CombatStatus = "laufend" | "gewonnen" | "verloren" | "geflohen";

export interface CombatRoundLog {
  round: number;
  characterAction: CombatAction;
  enemyAction: CombatAction;
  damageToEnemy: number;
  damageToCharacter: number;
  note: string;
}

export interface CombatSession {
  id: string;
  characterId: string;
  enemyId: string;
  characterHp: number;
  characterMaxHp: number;
  enemyHp: number;
  enemyMaxHp: number;
  comboCount: number;
  round: number;
  status: CombatStatus;
  log: CombatRoundLog[];
  createdAt: string;
}
