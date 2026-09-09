import type { Ability } from "../types/ability.js";

export interface KarmaThreshold {
  threshold: number;
  ability: Ability;
}

export const KARMA_ABILITIES: KarmaThreshold[] = [
  {
    threshold: 10,
    ability: { name: "Karma-Chakra-Kontrolle", kind: "technik", description: "Verbesserte Chakra-Kontrolle durch beginnendes Karma." },
  },
  {
    threshold: 25,
    ability: { name: "Karma-Auge", kind: "technik", description: "Eine besondere Augenfähigkeit erwacht durch das Karma." },
  },
  {
    threshold: 50,
    ability: {
      name: "Karma-Raumriss",
      kind: "powerup",
      description: "Kurzzeitige Raum-Zeit-Fähigkeit durch fortgeschrittenes Karma.",
      powerup: { rounds: 2, damageBonusPct: 0.3, incomingReductionPct: 0.3, hpBonusFlat: 15 },
    },
  },
  {
    threshold: 75,
    ability: {
      name: "Karma-Körperverstärkung",
      kind: "powerup",
      description: "Massive körperliche Verstärkung durch fast vollständiges Karma.",
      powerup: { rounds: 3, damageBonusPct: 0.5, incomingReductionPct: 0.4, hpBonusFlat: 30 },
    },
  },
  {
    threshold: 100,
    ability: { name: "Otsutsuki-Technik", kind: "angriff", description: "Eine Technik, entlehnt aus vollständigem Otsutsuki-Karma." },
  },
];

export function getUnlockedKarmaAbilities(karmaPct: number): Ability[] {
  return KARMA_ABILITIES.filter((k) => karmaPct >= k.threshold).map((k) => k.ability);
}
