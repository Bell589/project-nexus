export type CombatAction =
  | "angriff"
  | "verteidigung"
  | "spezialfaehigkeit"
  | "flucht"
  | "grundfertigkeit"
  | "ritter_beschwoeren"
  | "ausweichen"
  | "dojutsu_aktivieren"
  | "jutsu"
  | "item"
  | "powerup_deaktivieren"
  | "clan_power_aktivieren"
  | "ritter_angriff"
  | "ritter_technik"
  | "ritter_teilfusion"
  | "ritter_vollfusion";
export type CombatStatus = "laufend" | "gewonnen" | "verloren" | "geflohen";
export type HakiMode = "verstaerkung" | "dominanz" | "wahrnehmung";

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
  upkeepCost?: number;
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
  /** Domänen-Regel, die für die Dauer des Kampfes gilt (Soul Society) */
  activeDomainRuleId: string | null;
  /** Ob der Spektralritter beschworen wurde - erst danach nutzbar/steuerbar */
  ritterSummoned: boolean;
  ritterHp: number;
  ritterMaxHp: number;
  ritterEnergy: number;
  ritterEnergyMax: number;
  ritterDefeated: boolean;
  ritterFusionMode: "partial" | "full" | null;
  activeDojutsu: { id:string; name:string; stageIndex:number; upkeepCost:number } | null;
  dodgePrepared: boolean;
  enemyAccuracyDebuffRounds: number;
  createdAt: string;
}
