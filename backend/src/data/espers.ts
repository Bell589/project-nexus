import type { EsperOrigin } from "../types/esper.js";
import type { AbilityTemplate } from "../types/uniquePower.js";

function t(name: string, kind: AbilityTemplate["kind"], description: string, tier: string, opts?: Partial<AbilityTemplate>): AbilityTemplate {
  return { name, kind, description, tier, ...opts };
}

// Exakt 9 Esper, weltweit einzigartig. Eigene, nicht von bestehendem IP übernommene Namen.
export const ESPERS: EsperOrigin[] = [
  {
    id: "esper-pyrraq",
    name: "Pyrraq",
    element: "Feuer",
    description: "Ein gottähnliches Wesen aus reinem Inferno.",
    dominusTier: "manifestation",
    abilityPool: [
      t("Flammenpakt", "angriff", "Erster Kontakt mit der Macht Pyrraqs.", "pakt"),
      t("Inferno-Resonanz", "technik", "Die Verbindung vertieft sich.", "resonanz"),
      t("Pyrraq-Manifestation", "powerup", "Teilweise Manifestation der Esper-Macht.", "manifestation", {
        powerup: { rounds: 3, damageBonusPct: 0.5, incomingReductionPct: 0.4, hpBonusFlat: 30 },
      }),
      t("Dominus: Höllenfeuer", "angriff", "Extrem intensive Kanalisierung von Pyrraqs Macht.", "manifestation", {
        requiresActivePowerup: "Pyrraq-Manifestation",
      }),
      t("Verschmelzung: Pyrraq", "powerup", "Vollständige Verschmelzung mit dem Esper.", "verschmelzung", {
        powerup: { rounds: 4, damageBonusPct: 0.8, incomingReductionPct: 0.55, hpBonusFlat: 50 },
      }),
      t("Finale Form: Weltenbrand", "angriff", "Beinahe weltzerstörende Fähigkeit.", "finale_form"),
    ],
  },
  {
    id: "esper-glacia",
    name: "Glacia",
    element: "Eis",
    description: "Ein gottähnliches Wesen ewigen Frosts.",
    dominusTier: "manifestation",
    abilityPool: [
      t("Frostpakt", "angriff", "Erster Kontakt mit der Macht Glacias.", "pakt"),
      t("Frost-Resonanz", "technik", "Die Verbindung vertieft sich.", "resonanz"),
      t("Glacia-Manifestation", "powerup", "Teilweise Manifestation der Esper-Macht.", "manifestation", {
        powerup: { rounds: 3, damageBonusPct: 0.45, incomingReductionPct: 0.5, hpBonusFlat: 30 },
      }),
      t("Dominus: Ewiger Winter", "angriff", "Extrem intensive Kanalisierung von Glacias Macht.", "manifestation", {
        requiresActivePowerup: "Glacia-Manifestation",
      }),
      t("Verschmelzung: Glacia", "powerup", "Vollständige Verschmelzung mit dem Esper.", "verschmelzung", {
        powerup: { rounds: 4, damageBonusPct: 0.7, incomingReductionPct: 0.65, hpBonusFlat: 50 },
      }),
      t("Finale Form: Weltenfrost", "angriff", "Beinahe weltzerstörende Fähigkeit.", "finale_form"),
    ],
  },
  {
    id: "esper-fulmar",
    name: "Fulmar",
    element: "Blitz",
    description: "Ein gottähnliches Wesen reiner Entladung.",
    dominusTier: "manifestation",
    abilityPool: [
      t("Blitzpakt", "angriff", "Erster Kontakt mit der Macht Fulmars.", "pakt"),
      t("Entladungs-Resonanz", "technik", "Die Verbindung vertieft sich.", "resonanz"),
      t("Fulmar-Manifestation", "powerup", "Teilweise Manifestation der Esper-Macht.", "manifestation", {
        powerup: { rounds: 3, damageBonusPct: 0.55, incomingReductionPct: 0.35, speedNote: "+Tempo-Vorteil", hpBonusFlat: 25 },
      }),
      t("Dominus: Himmelszorn", "angriff", "Extrem intensive Kanalisierung von Fulmars Macht.", "manifestation", {
        requiresActivePowerup: "Fulmar-Manifestation",
      }),
      t("Verschmelzung: Fulmar", "powerup", "Vollständige Verschmelzung mit dem Esper.", "verschmelzung", {
        powerup: { rounds: 4, damageBonusPct: 0.85, incomingReductionPct: 0.5, speedNote: "+Tempo-Vorteil", hpBonusFlat: 45 },
      }),
      t("Finale Form: Weltenblitz", "angriff", "Beinahe weltzerstörende Fähigkeit.", "finale_form"),
    ],
  },
  {
    id: "esper-terron",
    name: "Terron",
    element: "Erde",
    description: "Ein gottähnliches Wesen aus lebendigem Fels.",
    dominusTier: "manifestation",
    abilityPool: [
      t("Erdpakt", "angriff", "Erster Kontakt mit der Macht Terrons.", "pakt"),
      t("Fels-Resonanz", "technik", "Die Verbindung vertieft sich.", "resonanz"),
      t("Terron-Manifestation", "powerup", "Teilweise Manifestation der Esper-Macht.", "manifestation", {
        powerup: { rounds: 3, damageBonusPct: 0.4, incomingReductionPct: 0.6, hpBonusFlat: 40 },
      }),
      t("Dominus: Bebender Thron", "angriff", "Extrem intensive Kanalisierung von Terrons Macht.", "manifestation", {
        requiresActivePowerup: "Terron-Manifestation",
      }),
      t("Verschmelzung: Terron", "powerup", "Vollständige Verschmelzung mit dem Esper.", "verschmelzung", {
        powerup: { rounds: 4, damageBonusPct: 0.65, incomingReductionPct: 0.75, hpBonusFlat: 60 },
      }),
      t("Finale Form: Weltenbeben", "angriff", "Beinahe weltzerstörende Fähigkeit.", "finale_form"),
    ],
  },
  {
    id: "esper-ventaris",
    name: "Ventaris",
    element: "Wind",
    description: "Ein gottähnliches Wesen des Sturms.",
    dominusTier: "manifestation",
    abilityPool: [
      t("Windpakt", "angriff", "Erster Kontakt mit der Macht Ventaris'.", "pakt"),
      t("Sturm-Resonanz", "technik", "Die Verbindung vertieft sich.", "resonanz"),
      t("Ventaris-Manifestation", "powerup", "Teilweise Manifestation der Esper-Macht.", "manifestation", {
        powerup: { rounds: 3, damageBonusPct: 0.45, incomingReductionPct: 0.4, speedNote: "+Tempo-Vorteil", hpBonusFlat: 25 },
      }),
      t("Dominus: Orkanauge", "angriff", "Extrem intensive Kanalisierung von Ventaris' Macht.", "manifestation", {
        requiresActivePowerup: "Ventaris-Manifestation",
      }),
      t("Verschmelzung: Ventaris", "powerup", "Vollständige Verschmelzung mit dem Esper.", "verschmelzung", {
        powerup: { rounds: 4, damageBonusPct: 0.75, incomingReductionPct: 0.55, speedNote: "+Tempo-Vorteil", hpBonusFlat: 40 },
      }),
      t("Finale Form: Weltensturm", "angriff", "Beinahe weltzerstörende Fähigkeit.", "finale_form"),
    ],
  },
  {
    id: "esper-umbros",
    name: "Umbros",
    element: "Schatten",
    description: "Ein gottähnliches Wesen absoluter Dunkelheit.",
    dominusTier: "manifestation",
    abilityPool: [
      t("Schattenpakt", "angriff", "Erster Kontakt mit der Macht Umbros'.", "pakt"),
      t("Dunkel-Resonanz", "technik", "Die Verbindung vertieft sich.", "resonanz"),
      t("Umbros-Manifestation", "powerup", "Teilweise Manifestation der Esper-Macht.", "manifestation", {
        powerup: { rounds: 3, damageBonusPct: 0.5, incomingReductionPct: 0.55, hpBonusFlat: 25 },
      }),
      t("Dominus: Absolute Finsternis", "angriff", "Extrem intensive Kanalisierung von Umbros' Macht.", "manifestation", {
        requiresActivePowerup: "Umbros-Manifestation",
      }),
      t("Verschmelzung: Umbros", "powerup", "Vollständige Verschmelzung mit dem Esper.", "verschmelzung", {
        powerup: { rounds: 4, damageBonusPct: 0.75, incomingReductionPct: 0.7, hpBonusFlat: 45 },
      }),
      t("Finale Form: Weltenschatten", "angriff", "Beinahe weltzerstörende Fähigkeit.", "finale_form"),
    ],
  },
  {
    id: "esper-solaris",
    name: "Solaris",
    element: "Licht",
    description: "Ein gottähnliches Wesen reinen Lichts.",
    dominusTier: "manifestation",
    abilityPool: [
      t("Lichtpakt", "angriff", "Erster Kontakt mit der Macht Solaris'.", "pakt"),
      t("Strahl-Resonanz", "technik", "Die Verbindung vertieft sich.", "resonanz"),
      t("Solaris-Manifestation", "powerup", "Teilweise Manifestation der Esper-Macht.", "manifestation", {
        powerup: { rounds: 3, damageBonusPct: 0.5, incomingReductionPct: 0.45, hpBonusFlat: 30 },
      }),
      t("Dominus: Sonnenkorona", "angriff", "Extrem intensive Kanalisierung von Solaris' Macht.", "manifestation", {
        requiresActivePowerup: "Solaris-Manifestation",
      }),
      t("Verschmelzung: Solaris", "powerup", "Vollständige Verschmelzung mit dem Esper.", "verschmelzung", {
        powerup: { rounds: 4, damageBonusPct: 0.8, incomingReductionPct: 0.6, hpBonusFlat: 50 },
      }),
      t("Finale Form: Weltensonne", "angriff", "Beinahe weltzerstörende Fähigkeit.", "finale_form"),
    ],
  },
  {
    id: "esper-aquaris",
    name: "Aquaris",
    element: "Wasser",
    description: "Ein gottähnliches Wesen der tiefsten Meere.",
    dominusTier: "manifestation",
    abilityPool: [
      t("Flutpakt", "angriff", "Erster Kontakt mit der Macht Aquaris'.", "pakt"),
      t("Tiden-Resonanz", "technik", "Die Verbindung vertieft sich.", "resonanz"),
      t("Aquaris-Manifestation", "powerup", "Teilweise Manifestation der Esper-Macht.", "manifestation", {
        powerup: { rounds: 3, damageBonusPct: 0.4, incomingReductionPct: 0.55, hpBonusFlat: 35 },
      }),
      t("Dominus: Tsunami", "angriff", "Extrem intensive Kanalisierung von Aquaris' Macht.", "manifestation", {
        requiresActivePowerup: "Aquaris-Manifestation",
      }),
      t("Verschmelzung: Aquaris", "powerup", "Vollständige Verschmelzung mit dem Esper.", "verschmelzung", {
        powerup: { rounds: 4, damageBonusPct: 0.7, incomingReductionPct: 0.7, hpBonusFlat: 55 },
      }),
      t("Finale Form: Weltenflut", "angriff", "Beinahe weltzerstörende Fähigkeit.", "finale_form"),
    ],
  },
  {
    id: "esper-chronarch",
    name: "Chronarch",
    element: "Zeit",
    description: "Ein gottähnliches Wesen jenseits der Zeit.",
    dominusTier: "manifestation",
    abilityPool: [
      t("Zeitpakt", "angriff", "Erster Kontakt mit der Macht Chronarchs.", "pakt"),
      t("Chronos-Resonanz", "technik", "Die Verbindung vertieft sich.", "resonanz"),
      t("Chronarch-Manifestation", "powerup", "Teilweise Manifestation der Esper-Macht.", "manifestation", {
        powerup: { rounds: 3, damageBonusPct: 0.5, incomingReductionPct: 0.5, speedNote: "+Tempo-Vorteil", hpBonusFlat: 30 },
      }),
      t("Dominus: Zeitkollaps", "angriff", "Extrem intensive Kanalisierung von Chronarchs Macht.", "manifestation", {
        requiresActivePowerup: "Chronarch-Manifestation",
      }),
      t("Verschmelzung: Chronarch", "powerup", "Vollständige Verschmelzung mit dem Esper.", "verschmelzung", {
        powerup: { rounds: 4, damageBonusPct: 0.8, incomingReductionPct: 0.65, speedNote: "+Tempo-Vorteil", hpBonusFlat: 50 },
      }),
      t("Finale Form: Weltenzeit", "angriff", "Beinahe weltzerstörende Fähigkeit - stoppt die Zeit gigantischer Gebiete.", "finale_form"),
    ],
  },
];
