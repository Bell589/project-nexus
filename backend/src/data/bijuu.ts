import type { AbilityTemplate } from "../types/uniquePower.js";

export interface BijuuOrigin {
  id: string;
  name: string; // fester, einzigartiger Name - eigene Kreation, nicht aus bestehendem IP übernommen
  theme: string;
  description: string;
  abilityPool: AbilityTemplate[];
}

function t(name: string, kind: AbilityTemplate["kind"], description: string, tier: string, opts?: Partial<AbilityTemplate>): AbilityTemplate {
  return { name, kind, description, tier, ...opts };
}

export const BIJUU_STAGES = ["Teilzugriff", "Chakra-Modus", "Stärkere Transformation", "Vollständige Manifestation"];

// Exakt 9 Bijū, weltweit einzigartig. Eigene, originale Namen/Themen.
export const BIJUU: BijuuOrigin[] = [
  { id: "bijuu-1", name: "Sabaku", theme: "Sand", description: "Ein-Schwanz-Bijū der Wüsten." },
  { id: "bijuu-2", name: "Nekomata", theme: "Katzenfeuer", description: "Zwei-Schwänze-Bijū der Katzenflamme." },
  { id: "bijuu-3", name: "Kairyu", theme: "Meeresschlange", description: "Drei-Schwänze-Bijū der Tiefsee." },
  { id: "bijuu-4", name: "Enko", theme: "Affenfeuer", description: "Vier-Schwänze-Bijū des rasenden Feuers." },
  { id: "bijuu-5", name: "Umauma", theme: "Delfin-Pferd", description: "Fünf-Schwänze-Bijū des Nebels." },
  { id: "bijuu-6", name: "Namekuji", theme: "Säureschnecke", description: "Sechs-Schwänze-Bijū des ätzenden Schleims." },
  { id: "bijuu-7", name: "Kabuto-Mushi", theme: "Käferschwarm", description: "Sieben-Schwänze-Bijū des Insektenschwarms." },
  { id: "bijuu-8", name: "Ushi-Oni", theme: "Ochsen-Tintenfisch", description: "Acht-Schwänze-Bijū der rohen Kraft." },
  { id: "bijuu-9", name: "Kitsune-Kami", theme: "Neun Schwänze", description: "Neun-Schwänze-Bijū, das stärkste aller Bijū." },
].map((b, i) => ({
  ...b,
  abilityPool: [
    t(`${b.name}-Chakra-Anbindung`, "technik", `Erster Zugriff auf das Chakra von ${b.name}.`, "teilzugriff"),
    t(`${b.name}-Modus`, "powerup", `Dauerhafter Chakra-Modus - Körper wird teilweise vom Chakra ${b.name}s durchdrungen.`, "chakra_modus", {
      powerup: { rounds: 4, damageBonusPct: 0.4 + i * 0.02, incomingReductionPct: 0.35, hpBonusFlat: 30 },
    }),
    t(`Verstärkte Transformation: ${b.name}`, "powerup", `Tiefere Transformation - Körperform nähert sich ${b.name} an.`, "staerkere_transformation", {
      powerup: { rounds: 4, damageBonusPct: 0.6 + i * 0.02, incomingReductionPct: 0.45, hpBonusFlat: 45, speedNote: "+Tempo-Vorteil" },
    }),
    t(`Vollständige Manifestation: ${b.name}`, "powerup", `Volle Bijū-Form - immense, aber schwer kontrollierbare Macht.`, "vollstaendige_manifestation", {
      powerup: { rounds: 3, damageBonusPct: 0.9 + i * 0.03, incomingReductionPct: 0.5, hpBonusFlat: 60 },
    }),
    t(`${b.name}-Sturmangriff`, "angriff", `Nur in voller Manifestation wirkbar.`, "vollstaendige_manifestation", {
      requiresActivePowerup: `Vollständige Manifestation: ${b.name}`,
    }),
  ],
}));
