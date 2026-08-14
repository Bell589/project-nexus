import type { WorldId } from "./world.js";
import type { Ability, AbilityKind } from "./ability.js";

/**
 * Ein Eintrag im Fähigkeiten-Möglichkeitsraum einer Origin. Wird bei der
 * Generierung/Weiterentwicklung individuell gezogen - KEINE feste
 * Zuordnung "jeder mit diesem Ursprung bekommt genau diese Fähigkeit".
 */
export interface AbilityTemplate {
  name: string;
  kind: AbilityKind;
  description: string;
  /** Stufen-Tier, muss zu StageDefinition.tier passen (z.B. "basis", "erwacht") */
  tier: string;
  /** Falls gesetzt: nur ziehbar, wenn die Instanz genau diese Variante (Element/Rolle/...) hat */
  variant?: string;
  powerup?: Ability["powerup"];
  resourceCost?: number;
  requiresActivePowerup?: string;
}

export interface StageDefinition {
  /** Anzeigename der Stufe - bleibt konsistent mit faction.corePowerStages */
  name: string;
  tier: string;
  /** Wie viele Fähigkeiten aus dem Pool bei Erreichen dieser Stufe gezogen werden */
  abilityCount: number;
  /** Ob mindestens eine gezogene Fähigkeit vom Typ "powerup" sein muss */
  isPowerupStage: boolean;
}

/**
 * Statischer Ursprung/Kategorie - dient NUR als Generator-Input (Kategorie,
 * Möglichkeitsraum), NICHT als fertiges Machtpaket. Ersetzt schrittweise
 * CorePowerArchetype (siehe ANALYSE_UND_UMBAUPLAN.md, Abschnitt 3.1/5).
 */
export interface UniquePowerOrigin {
  id: string;
  worldId: WorldId;
  factionIds: string[];
  /** z.B. "Elementar-Relikt", "Zanpakutō", "Unique Magie", "Spektralritter" */
  category: string;
  /** Auswahlraum für die individuelle Ausprägung (Element/Rolle/Waffentyp/...) */
  variantPool: string[];
  namePrefixPool: string[];
  nameSuffixPool: string[];
  abilityPool: AbilityTemplate[];
  stageDefinitions: StageDefinition[];
  description: string;
}

/**
 * Individuell generierte, persistente Ausprägung eines Charakters.
 * Zwei Charaktere mit derselben Origin UND derselben variant können
 * trotzdem unterschiedliche individualAbilities besitzen (zufällige
 * Teilmenge aus dem Pool je Stufe statt Fixliste).
 */
export interface UniquePowerInstance {
  originId: string;
  category: string;
  variant: string;
  generatedName: string;
  stageIndex: number;
  individualAbilities: Ability[];
  /** Historie der individuellen Entwicklung - "meine Macht ist meine eigene Geschichte" */
  developmentLog: string[];
}
