export type AbilityKind = "angriff" | "technik" | "powerup";

export interface PowerupEffect {
  /** Wie viele Runden die Wirkung anhält */
  rounds: number;
  /** Bonus auf eigenen Schaden während der Wirkung, z.B. 0.5 = +50% */
  damageBonusPct: number;
  /** Reduktion erlittenen Schadens während der Wirkung, 1 = komplette Immunität */
  incomingReductionPct: number;
  /** Optionaler Flavor-Hinweis, z.B. "+Tempo-Vorteil" */
  speedNote?: string;
  /** Einmaliger Leben-Bonus bei Aktivierung (z.B. "mehr Leben" bei Verwandlung) */
  hpBonusFlat?: number;
}

export interface Ability {
  name: string;
  kind: AbilityKind;
  description: string;
  /** Nur gesetzt wenn kind === "powerup" */
  powerup?: PowerupEffect;
  /** Kostet Ressource (Wille/Reiatsu/Mana je Welt) bei Einsatz im Kampf */
  resourceCost?: number;
  /** Nur einsetzbar, während dieser Powerup-Name aktiv ist (z.B. Domänen-Techniken) */
  requiresActivePowerup?: string;
}
