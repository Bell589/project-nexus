import type { UniquePowerOrigin, AbilityTemplate } from "../types/uniquePower.js";

function t(
  name: string,
  kind: AbilityTemplate["kind"],
  description: string,
  tier: string,
  opts?: Partial<AbilityTemplate>
): AbilityTemplate {
  return { name, kind, description, tier, ...opts };
}

// ============ OZEANWELT: ELEMENTAR-RELIKT (Logia-artig) ============
// Stufen: Relikt, Synchronisation, Resonanz, Erwachen, Mythische Manifestation, Unbegrenzt
const ELEMENTAR_RELIKT: UniquePowerOrigin = {
  id: "origin-elementar-relikt",
  worldId: "ozeanwelt",
  factionIds: ["piraten", "marine"],
  category: "Elementar-Relikt",
  variantPool: ["Blitz", "Feuer", "Eis", "Schatten", "Licht", "Wind"],
  namePrefixPool: ["Rai", "En", "Hyou", "Yami", "Hika", "Kaze"],
  nameSuffixPool: ["un", "ja", "sen", "getsu", "ryuu", "sho"],
  description: "Ein Relikt, das den Träger mit einem Element verschmelzen lässt.",
  stageDefinitions: [
    { name: "Relikt", tier: "basis", abilityCount: 2, isPowerupStage: false },
    { name: "Synchronisation", tier: "vertieft", abilityCount: 1, isPowerupStage: false },
    { name: "Resonanz", tier: "fortgeschritten", abilityCount: 2, isPowerupStage: false },
    { name: "Erwachen", tier: "erwacht", abilityCount: 2, isPowerupStage: true },
    { name: "Mythische Manifestation", tier: "meisterschaft", abilityCount: 1, isPowerupStage: false },
    { name: "Unbegrenzte Weiterentwicklung", tier: "frei", abilityCount: 0, isPowerupStage: false },
  ],
  abilityPool: [
    // Blitz
    t("Blitzschlag", "angriff", "Ein scharfer Blitzstoß direkt auf den Gegner.", "basis", { variant: "Blitz" }),
    t("Elektrische Aura", "technik", "Ein leichtes elektrisches Feld um den Körper.", "basis", { variant: "Blitz" }),
    t("Blitzsprint", "angriff", "Blitzschneller Nahkampfangriff aus der Bewegung.", "vertieft", { variant: "Blitz" }),
    t("Gewitterwolke", "technik", "Zieht Gewitterwolken heran - taktischer Vorteil durch schlechte Sicht.", "vertieft", { variant: "Blitz" }),
    t("Donnerklinge", "technik", "Verstärkt die Waffe mit Blitzenergie.", "fortgeschritten", { variant: "Blitz" }),
    t("Kettenblitz", "angriff", "Ein Blitz, der zwischen mehreren Punkten hin- und herspringt.", "fortgeschritten", { variant: "Blitz" }),
    t("Elementform: Blitz", "powerup", "Dauerhafte Verwandlung in reinen Blitz - mehr Kraft, Tempo, Widerstand.", "erwacht", {
      variant: "Blitz",
      powerup: { rounds: 3, damageBonusPct: 0.35, incomingReductionPct: 0.5, speedNote: "+Tempo-Vorteil", hpBonusFlat: 25 },
    }),
    t("Entladungssturm", "angriff", "Nur in Elementform wirkbar - Kettenreaktion aus Blitzen.", "erwacht", {
      variant: "Blitz",
      requiresActivePowerup: "Elementform: Blitz",
    }),
    t("Zorn des Blitzes", "angriff", "Verheerender Blitzsturm in mythischer Form.", "meisterschaft", { variant: "Blitz" }),

    // Feuer
    t("Feuerstoß", "angriff", "Ein Stoß konzentrierter Flammen.", "basis", { variant: "Feuer" }),
    t("Hitzeschild", "technik", "Ein schützender Hitzeschleier.", "basis", { variant: "Feuer" }),
    t("Flammensprint", "angriff", "Rascher Angriff, von Flammen angetrieben.", "vertieft", { variant: "Feuer" }),
    t("Hitzewelle", "technik", "Erhitzt die Luft - der Gegner ermüdet schneller.", "vertieft", { variant: "Feuer" }),
    t("Aschewirbel", "technik", "Wirbelnde Glut schränkt Sicht und Fläche ein.", "fortgeschritten", { variant: "Feuer" }),
    t("Feuerpeitsche", "angriff", "Eine Peitsche aus flüssiger Glut.", "fortgeschritten", { variant: "Feuer" }),
    t("Elementform: Feuer", "powerup", "Dauerhafte Verwandlung in reines Feuer - mehr Kraft, Tempo, Widerstand.", "erwacht", {
      variant: "Feuer",
      powerup: { rounds: 3, damageBonusPct: 0.35, incomingReductionPct: 0.5, hpBonusFlat: 25 },
    }),
    t("Feuersbrunst", "angriff", "Nur in Elementform wirkbar - alles verzehrende Flammenwoge.", "erwacht", {
      variant: "Feuer",
      requiresActivePowerup: "Elementform: Feuer",
    }),
    t("Herz der Flamme", "angriff", "Explosive Entladung in mythischer Flammenform.", "meisterschaft", { variant: "Feuer" }),

    // Eis
    t("Frostschlag", "angriff", "Ein vereisender Schlag.", "basis", { variant: "Eis" }),
    t("Kälteschutz", "technik", "Ein Kälteschild aus dünnem Eis.", "basis", { variant: "Eis" }),
    t("Eissprint", "angriff", "Gleitschnelle Bewegung über Eisbahnen.", "vertieft", { variant: "Eis" }),
    t("Frostnebel", "technik", "Ein Nebel, der die Sicht des Gegners einschränkt.", "vertieft", { variant: "Eis" }),
    t("Eissplitter", "angriff", "Ein Hagel scharfer Eissplitter.", "fortgeschritten", { variant: "Eis" }),
    t("Frostpanzer", "technik", "Vorübergehende Verhärtung der Haut zu Eis.", "fortgeschritten", { variant: "Eis" }),
    t("Elementform: Eis", "powerup", "Dauerhafte Verwandlung in reines Eis - mehr Kraft, Tempo, Widerstand.", "erwacht", {
      variant: "Eis",
      powerup: { rounds: 3, damageBonusPct: 0.3, incomingReductionPct: 0.55, hpBonusFlat: 25 },
    }),
    t("Ewiger Winter", "angriff", "Nur in Elementform wirkbar - alles gefriert.", "erwacht", {
      variant: "Eis",
      requiresActivePowerup: "Elementform: Eis",
    }),
    t("Herz des Frosts", "angriff", "Verheerender Eissturm in mythischer Form.", "meisterschaft", { variant: "Eis" }),

    // Schatten
    t("Schattengriff", "angriff", "Ein Griff aus verdichteter Dunkelheit.", "basis", { variant: "Schatten" }),
    t("Tarnung", "technik", "Verschmelzung mit dem Schatten für kurze Zeit.", "basis", { variant: "Schatten" }),
    t("Schattenschritt", "angriff", "Teleportartige Bewegung durch Schatten.", "vertieft", { variant: "Schatten" }),
    t("Dunkelnebel", "technik", "Verdunkelt das Umfeld, erschwert Zielen.", "vertieft", { variant: "Schatten" }),
    t("Schattenklingen", "angriff", "Mehrere Klingen aus reiner Dunkelheit.", "fortgeschritten", { variant: "Schatten" }),
    t("Furchtaura", "technik", "Strahlt eine einschüchternde Dunkelheit aus.", "fortgeschritten", { variant: "Schatten" }),
    t("Elementform: Schatten", "powerup", "Dauerhafte Verwandlung in reine Dunkelheit.", "erwacht", {
      variant: "Schatten",
      powerup: { rounds: 3, damageBonusPct: 0.3, incomingReductionPct: 0.5, hpBonusFlat: 20 },
    }),
    t("Finsternisriss", "angriff", "Nur in Elementform wirkbar - ein Riss verschluckt den Gegner kurzzeitig.", "erwacht", {
      variant: "Schatten",
      requiresActivePowerup: "Elementform: Schatten",
    }),
    t("Herz der Finsternis", "angriff", "Alles verschlingende Dunkelheit in mythischer Form.", "meisterschaft", { variant: "Schatten" }),

    // Licht
    t("Lichtstoß", "angriff", "Ein Stoß gebündelten Lichts.", "basis", { variant: "Licht" }),
    t("Blendschutz", "technik", "Ein schützender Lichtschleier.", "basis", { variant: "Licht" }),
    t("Lichtsprint", "angriff", "Lichtschnelle Bewegung.", "vertieft", { variant: "Licht" }),
    t("Gleißender Blitz", "technik", "Blendet den Gegner kurzzeitig.", "vertieft", { variant: "Licht" }),
    t("Strahlenkranz", "angriff", "Ein Kranz aus Lichtklingen.", "fortgeschritten", { variant: "Licht" }),
    t("Reinigendes Licht", "technik", "Vertreibt Illusionen und Täuschung.", "fortgeschritten", { variant: "Licht" }),
    t("Elementform: Licht", "powerup", "Dauerhafte Verwandlung in reines Licht.", "erwacht", {
      variant: "Licht",
      powerup: { rounds: 3, damageBonusPct: 0.35, incomingReductionPct: 0.45, hpBonusFlat: 25 },
    }),
    t("Sonnenexplosion", "angriff", "Nur in Elementform wirkbar - gleißende Explosion.", "erwacht", {
      variant: "Licht",
      requiresActivePowerup: "Elementform: Licht",
    }),
    t("Herz der Sonne", "angriff", "Verheerende Lichtdetonation in mythischer Form.", "meisterschaft", { variant: "Licht" }),

    // Wind
    t("Windklinge", "angriff", "Eine scharfe Luftklinge.", "basis", { variant: "Wind" }),
    t("Luftpolster", "technik", "Federt einen Sturz oder Treffer ab.", "basis", { variant: "Wind" }),
    t("Windsprint", "angriff", "Windschnelle Bewegung.", "vertieft", { variant: "Wind" }),
    t("Sturmböe", "technik", "Eine Böe, die den Gegner aus dem Gleichgewicht bringt.", "vertieft", { variant: "Wind" }),
    t("Wirbelsturm", "angriff", "Ein kleiner, kontrollierter Tornado.", "fortgeschritten", { variant: "Wind" }),
    t("Druckwelle", "technik", "Eine Welle verdichteter Luft.", "fortgeschritten", { variant: "Wind" }),
    t("Elementform: Wind", "powerup", "Dauerhafte Verwandlung in reinen Wind.", "erwacht", {
      variant: "Wind",
      powerup: { rounds: 3, damageBonusPct: 0.3, incomingReductionPct: 0.45, speedNote: "+Tempo-Vorteil", hpBonusFlat: 20 },
    }),
    t("Orkan", "angriff", "Nur in Elementform wirkbar - ein verheerender Orkan.", "erwacht", {
      variant: "Wind",
      requiresActivePowerup: "Elementform: Wind",
    }),
    t("Herz des Sturms", "angriff", "Alles verwüstender Sturm in mythischer Form.", "meisterschaft", { variant: "Wind" }),
  ],
};

// ============ OZEANWELT: TIER-RELIKT (Zoan-artig) ============
const TIER_RELIKT: UniquePowerOrigin = {
  id: "origin-tier-relikt",
  worldId: "ozeanwelt",
  factionIds: ["piraten", "marine"],
  category: "Tier-Relikt",
  variantPool: ["Drache", "Phönix", "Wolf", "Kraken"],
  namePrefixPool: ["Long", "Suza", "Fen", "Kra"],
  nameSuffixPool: ["ryuu", "ku", "rir", "ken"],
  description: "Ein Relikt, das den Träger in ein mächtiges Tier verwandeln kann. Mensch-Form → Tier-Form → Hybrid-Form.",
  stageDefinitions: [
    { name: "Relikt", tier: "mensch", abilityCount: 1, isPowerupStage: false },
    { name: "Synchronisation", tier: "mensch-vertieft", abilityCount: 1, isPowerupStage: false },
    { name: "Resonanz", tier: "tierform", abilityCount: 1, isPowerupStage: true },
    { name: "Erwachen", tier: "hybridform", abilityCount: 2, isPowerupStage: true },
    { name: "Mythische Manifestation", tier: "meisterschaft", abilityCount: 1, isPowerupStage: false },
    { name: "Unbegrenzte Weiterentwicklung", tier: "frei", abilityCount: 0, isPowerupStage: false },
  ],
  abilityPool: [
    // Drache
    t("Klauenhieb (Mensch-Form)", "angriff", "Verstärkter Nahkampfschlag, noch in menschlicher Gestalt.", "mensch", { variant: "Drache" }),
    t("Schuppenpanzer (Mensch-Form)", "technik", "Teilverhärtung der Haut zu Drachenschuppen.", "mensch-vertieft", { variant: "Drache" }),
    t("Tier-Form: Drache", "powerup", "Vollständige, dauerhafte Verwandlung - mehr Leben, Kraft, Tempo.", "tierform", {
      variant: "Drache",
      powerup: { rounds: 4, damageBonusPct: 0.3, incomingReductionPct: 0.3, hpBonusFlat: 20 },
    }),
    t("Hybrid-Form: Drache", "powerup", "Verschmelzung von Mensch und Drache - volle Kontrolle bei maximaler Kraft.", "hybridform", {
      variant: "Drache",
      powerup: { rounds: 4, damageBonusPct: 0.55, incomingReductionPct: 0.45, speedNote: "+Tempo-Vorteil (Flug)", hpBonusFlat: 35 },
    }),
    t("Drachenzorn", "angriff", "Nur in Hybrid-Form wirkbar - Klauenhieb mit Feueratem kombiniert.", "hybridform", {
      variant: "Drache",
      requiresActivePowerup: "Hybrid-Form: Drache",
    }),
    t("Himmelsdrache", "angriff", "Verheerender Atemangriff in der Hybrid-Form.", "meisterschaft", { variant: "Drache" }),

    // Phönix
    t("Federklinge (Mensch-Form)", "angriff", "Scharfe, glühende Federn als Wurfwaffen.", "mensch", { variant: "Phönix" }),
    t("Selbstheilende Wunde (Mensch-Form)", "technik", "Leichte Regeneration durch Phönixasche.", "mensch-vertieft", { variant: "Phönix" }),
    t("Tier-Form: Phönix", "powerup", "Vollständige, dauerhafte Verwandlung - mehr Leben, Kraft, Tempo.", "tierform", {
      variant: "Phönix",
      powerup: { rounds: 4, damageBonusPct: 0.3, incomingReductionPct: 0.3, hpBonusFlat: 20 },
    }),
    t("Hybrid-Form: Phönix", "powerup", "Verschmelzung von Mensch und Phönix.", "hybridform", {
      variant: "Phönix",
      powerup: { rounds: 4, damageBonusPct: 0.5, incomingReductionPct: 0.4, speedNote: "+Tempo-Vorteil (Flug)", hpBonusFlat: 40 },
    }),
    t("Aschewiedergeburt-Sturm", "technik", "Nur in Hybrid-Form wirkbar - Heilung und Flächenangriff zugleich.", "hybridform", {
      variant: "Phönix",
      requiresActivePowerup: "Hybrid-Form: Phönix",
    }),
    t("Ewige Flamme", "angriff", "Verheerende Feuersäule in der Hybrid-Form.", "meisterschaft", { variant: "Phönix" }),

    // Wolf
    t("Reißzahn (Mensch-Form)", "angriff", "Ein schneller, präziser Biss-Schlag.", "mensch", { variant: "Wolf" }),
    t("Geschärfte Sinne (Mensch-Form)", "technik", "Verbesserte Wahrnehmung von Bewegung und Geruch.", "mensch-vertieft", { variant: "Wolf" }),
    t("Tier-Form: Wolf", "powerup", "Vollständige, dauerhafte Verwandlung - mehr Leben, Kraft, Tempo.", "tierform", {
      variant: "Wolf",
      powerup: { rounds: 4, damageBonusPct: 0.3, incomingReductionPct: 0.25, speedNote: "+Tempo-Vorteil", hpBonusFlat: 20 },
    }),
    t("Hybrid-Form: Wolf", "powerup", "Verschmelzung von Mensch und Wolf.", "hybridform", {
      variant: "Wolf",
      powerup: { rounds: 4, damageBonusPct: 0.5, incomingReductionPct: 0.35, speedNote: "+Tempo-Vorteil", hpBonusFlat: 30 },
    }),
    t("Rudelfrenzy", "angriff", "Nur in Hybrid-Form wirkbar - eine Serie unaufhaltsamer Bisse.", "hybridform", {
      variant: "Wolf",
      requiresActivePowerup: "Hybrid-Form: Wolf",
    }),
    t("Mondheulen", "angriff", "Verheerender Flächenangriff in Hybrid-Form.", "meisterschaft", { variant: "Wolf" }),

    // Kraken
    t("Tentakelpeitsche (Mensch-Form)", "angriff", "Ein einzelner Tentakel-Ansatz greift an.", "mensch", { variant: "Kraken" }),
    t("Tintenwolke (Mensch-Form)", "technik", "Kleine Tintenwolke zur Deckung.", "mensch-vertieft", { variant: "Kraken" }),
    t("Tier-Form: Kraken", "powerup", "Vollständige, dauerhafte Verwandlung - mehr Leben, Kraft, Tempo.", "tierform", {
      variant: "Kraken",
      powerup: { rounds: 4, damageBonusPct: 0.3, incomingReductionPct: 0.35, hpBonusFlat: 25 },
    }),
    t("Hybrid-Form: Kraken", "powerup", "Verschmelzung von Mensch und Kraken - mehrere Tentakel gleichzeitig.", "hybridform", {
      variant: "Kraken",
      powerup: { rounds: 4, damageBonusPct: 0.5, incomingReductionPct: 0.5, hpBonusFlat: 35 },
    }),
    t("Tiefseegriff", "angriff", "Nur in Hybrid-Form wirkbar - alle Tentakel greifen gleichzeitig.", "hybridform", {
      variant: "Kraken",
      requiresActivePowerup: "Hybrid-Form: Kraken",
    }),
    t("Leviathanschlag", "angriff", "Verheerender Flächenschlag in Hybrid-Form.", "meisterschaft", { variant: "Kraken" }),
  ],
};

// ============ OZEANWELT: ÜBERMENSCHLICHES RELIKT (Paramecia-artig) ============
const UEBERMENSCHLICHES_RELIKT: UniquePowerOrigin = {
  id: "origin-uebermenschliches-relikt",
  worldId: "ozeanwelt",
  factionIds: ["piraten", "marine"],
  category: "Übermenschliches Relikt",
  variantPool: ["Schwerkraft", "Bindung", "Raum", "Zeit"],
  namePrefixPool: ["Kaly", "Aethe", "Vor", "Chro"],
  nameSuffixPool: ["pso", "rion", "tex", "nia"],
  description: "Ein Relikt, das keine Verwandlung, sondern extrem starke Fähigkeiten bietet - wirkt auch auf anorganische Gegenstände.",
  stageDefinitions: [
    { name: "Relikt", tier: "basis", abilityCount: 1, isPowerupStage: false },
    { name: "Synchronisation", tier: "vertieft", abilityCount: 1, isPowerupStage: false },
    { name: "Resonanz", tier: "fortgeschritten", abilityCount: 1, isPowerupStage: false },
    { name: "Erwachen", tier: "erwacht", abilityCount: 2, isPowerupStage: true },
    { name: "Mythische Manifestation", tier: "meisterschaft", abilityCount: 1, isPowerupStage: false },
    { name: "Unbegrenzte Weiterentwicklung", tier: "frei", abilityCount: 0, isPowerupStage: false },
  ],
  abilityPool: [
    // Schwerkraft
    t("Schweredruck", "angriff", "Erhöht lokal die Schwerkraft und drückt den Gegner nieder.", "basis", { variant: "Schwerkraft" }),
    t("Schwerelosigkeit", "technik", "Hebt kurzzeitig die Schwerkraft um sich selbst auf.", "vertieft", { variant: "Schwerkraft" }),
    t("Objektbindung", "technik", "Hebt anorganische Gegenstände an und schleudert sie als Waffen.", "fortgeschritten", { variant: "Schwerkraft" }),
    t("Erwachen: Schwerefeld", "powerup", "Dauerhaftes Feld, das Angriffe in der Nähe verlangsamt und verstärkt.", "erwacht", {
      variant: "Schwerkraft",
      powerup: { rounds: 3, damageBonusPct: 0.4, incomingReductionPct: 0.4, hpBonusFlat: 20 },
    }),
    t("Kollaps", "angriff", "Nur bei aktivem Schwerefeld wirkbar - kollabierendes Gravitationsfeld.", "erwacht", {
      variant: "Schwerkraft",
      requiresActivePowerup: "Erwachen: Schwerefeld",
    }),
    t("Singularität", "angriff", "Krasser Finisher - zieht alles im Umkreis zu einem Punkt zusammen.", "meisterschaft", { variant: "Schwerkraft" }),

    // Bindung
    t("Kettenschlag", "angriff", "Peitschenartiger Schlag aus Energieketten.", "basis", { variant: "Bindung" }),
    t("Fesselgriff", "technik", "Bindet die Bewegung des Gegners kurzzeitig.", "vertieft", { variant: "Bindung" }),
    t("Materiefesseln", "technik", "Bindet anorganische Gegenstände und lenkt sie als Geschosse um.", "fortgeschritten", { variant: "Bindung" }),
    t("Erwachen: Kettensturm", "powerup", "Dauerhafter Sturm aus tausend Ketten.", "erwacht", {
      variant: "Bindung",
      powerup: { rounds: 3, damageBonusPct: 0.4, incomingReductionPct: 0.4, hpBonusFlat: 20 },
    }),
    t("Verurteilung", "angriff", "Nur bei aktivem Kettensturm wirkbar - alle Ketten schließen sich gleichzeitig.", "erwacht", {
      variant: "Bindung",
      requiresActivePowerup: "Erwachen: Kettensturm",
    }),
    t("Ewige Fessel", "angriff", "Krasser Finisher - bindet den Gegner vollständig.", "meisterschaft", { variant: "Bindung" }),

    // Raum
    t("Raumriss", "angriff", "Ein kleiner Riss verschiebt einen Treffer unvorhersehbar.", "basis", { variant: "Raum" }),
    t("Kurzteleport", "technik", "Kurze, unvorhersehbare Ortsverschiebung.", "vertieft", { variant: "Raum" }),
    t("Objektverschiebung", "technik", "Verschiebt anorganische Gegenstände in der Umgebung als Hindernisse.", "fortgeschritten", { variant: "Raum" }),
    t("Erwachen: Raumfeld", "powerup", "Dauerhaftes Feld, das Distanzen im Kampf verzerrt.", "erwacht", {
      variant: "Raum",
      powerup: { rounds: 3, damageBonusPct: 0.35, incomingReductionPct: 0.5, hpBonusFlat: 20 },
    }),
    t("Faltung", "angriff", "Nur bei aktivem Raumfeld wirkbar - faltet den Raum um den Gegner.", "erwacht", {
      variant: "Raum",
      requiresActivePowerup: "Erwachen: Raumfeld",
    }),
    t("Dimensionsriss", "angriff", "Krasser Finisher - reißt die Realität kurzzeitig auf.", "meisterschaft", { variant: "Raum" }),

    // Zeit
    t("Zeitstich", "angriff", "Ein Angriff, der die gegnerische Reaktion leicht verzögert.", "basis", { variant: "Zeit" }),
    t("Kurzer Rückspul", "technik", "Setzt die letzten Sekunden der eigenen Bewegung zurück.", "vertieft", { variant: "Zeit" }),
    t("Objektalterung", "technik", "Lässt anorganische Gegenstände in der Umgebung schnell altern/zerfallen.", "fortgeschritten", { variant: "Zeit" }),
    t("Erwachen: Zeitfeld", "powerup", "Dauerhaftes Feld, das die eigene Wahrnehmung von Zeit verändert.", "erwacht", {
      variant: "Zeit",
      powerup: { rounds: 3, damageBonusPct: 0.35, incomingReductionPct: 0.45, speedNote: "+Tempo-Vorteil", hpBonusFlat: 20 },
    }),
    t("Stillstand", "angriff", "Nur bei aktivem Zeitfeld wirkbar - friert den Gegner kurz ein.", "erwacht", {
      variant: "Zeit",
      requiresActivePowerup: "Erwachen: Zeitfeld",
    }),
    t("Zeitkollaps", "angriff", "Krasser Finisher - lässt die Zeit um den Gegner kollabieren.", "meisterschaft", { variant: "Zeit" }),
  ],
};

export const UNIQUE_POWER_ORIGINS: UniquePowerOrigin[] = [
  ELEMENTAR_RELIKT,
  TIER_RELIKT,
  UEBERMENSCHLICHES_RELIKT,
];

// ============ SOUL SOCIETY: ZANPAKUTŌ (Schinigami) — Platzhaltertiefe, volle Ausarbeitung folgt in Schritt 4 ============
const ZANPAKUTOU: UniquePowerOrigin = {
  id: "origin-zanpakutou",
  worldId: "soul_society",
  factionIds: ["shinigami"],
  category: "Zanpakutō",
  variantPool: ["Feuer", "Eis", "Wind"],
  namePrefixPool: ["En", "Hyou", "Kaze"],
  nameSuffixPool: ["raku", "ga", "tsuki"],
  description: "Eine individuelle Seelenwaffe, die den Willen ihres Trägers manifestiert.",
  stageDefinitions: [
    { name: "Versiegelt", tier: "basis", abilityCount: 1, isPowerupStage: false },
    { name: "Manifestation", tier: "erste_freisetzung", abilityCount: 1, isPowerupStage: true },
    { name: "Resonanz", tier: "vertieft", abilityCount: 1, isPowerupStage: false },
    { name: "Domäne", tier: "volles_release", abilityCount: 2, isPowerupStage: true },
    { name: "Domänen-Meisterschaft", tier: "domaenentechnik", abilityCount: 1, isPowerupStage: false },
    { name: "Unbegrenzte Weiterentwicklung", tier: "frei", abilityCount: 0, isPowerupStage: false },
  ],
  abilityPool: [
    t("Grundschnitt", "angriff", "Einfacher, versiegelter Klingenhieb.", "basis"),
    t("Manifestation: Feuer entfesselt", "powerup", "Erste Freisetzung - die Klinge entflammt.", "erste_freisetzung", {
      variant: "Feuer",
      powerup: { rounds: 3, damageBonusPct: 0.25, incomingReductionPct: 0.2 },
    }),
    t("Manifestation: Eis entfesselt", "powerup", "Erste Freisetzung - die Klinge vereist.", "erste_freisetzung", {
      variant: "Eis",
      powerup: { rounds: 3, damageBonusPct: 0.25, incomingReductionPct: 0.2 },
    }),
    t("Manifestation: Wind entfesselt", "powerup", "Erste Freisetzung - Wind umgibt die Klinge.", "erste_freisetzung", {
      variant: "Wind",
      powerup: { rounds: 3, damageBonusPct: 0.25, incomingReductionPct: 0.2, speedNote: "+Tempo-Vorteil" },
    }),
    t("Flammenresonanz", "technik", "Vertiefte Verbindung, präzisere Feuertechniken.", "vertieft", { variant: "Feuer" }),
    t("Eisresonanz", "technik", "Vertiefte Verbindung, präzisere Eistechniken.", "vertieft", { variant: "Eis" }),
    t("Sturmresonanz", "technik", "Vertiefte Verbindung, präzisere Windtechniken.", "vertieft", { variant: "Wind" }),
    t("Domäne: Aschefeld", "powerup", "Höchste Form - Sphäre mit fester Regel (Heilung deaktiviert).", "volles_release", {
      variant: "Feuer",
      powerup: { rounds: 3, damageBonusPct: 0.45, incomingReductionPct: 0.35, hpBonusFlat: 20 },
    }),
    t("Domäne: Ewiger Winter", "powerup", "Höchste Form - Sphäre mit fester Regel (Fliehen unmöglich).", "volles_release", {
      variant: "Eis",
      powerup: { rounds: 3, damageBonusPct: 0.45, incomingReductionPct: 0.35, hpBonusFlat: 20 },
    }),
    t("Domäne: Wirbelfeld", "powerup", "Höchste Form - Sphäre mit fester Regel (Fernangriffe abgelenkt).", "volles_release", {
      variant: "Wind",
      powerup: { rounds: 3, damageBonusPct: 0.45, incomingReductionPct: 0.35, hpBonusFlat: 20 },
    }),
    t("Domänen-Finisher: Ascheklinge", "technik", "Nur innerhalb der Domäne wirkbar.", "volles_release", {
      variant: "Feuer",
      requiresActivePowerup: "Domäne: Aschefeld",
    }),
    t("Domänen-Finisher: Frostsplitter", "technik", "Nur innerhalb der Domäne wirkbar.", "volles_release", {
      variant: "Eis",
      requiresActivePowerup: "Domäne: Ewiger Winter",
    }),
    t("Domänen-Finisher: Schneidender Sturm", "technik", "Nur innerhalb der Domäne wirkbar.", "volles_release", {
      variant: "Wind",
      requiresActivePowerup: "Domäne: Wirbelfeld",
    }),
    t("Domänen-Technik: Vulkanausbruch", "angriff", "Weitere Domänen-Technik, keine neue Freisetzung.", "domaenentechnik", {
      variant: "Feuer",
      requiresActivePowerup: "Domäne: Aschefeld",
    }),
    t("Domänen-Technik: Gletschersturz", "angriff", "Weitere Domänen-Technik, keine neue Freisetzung.", "domaenentechnik", {
      variant: "Eis",
      requiresActivePowerup: "Domäne: Ewiger Winter",
    }),
    t("Domänen-Technik: Tornadowand", "angriff", "Weitere Domänen-Technik, keine neue Freisetzung.", "domaenentechnik", {
      variant: "Wind",
      requiresActivePowerup: "Domäne: Wirbelfeld",
    }),
  ],
};

// ============ AVALON: UNIQUE MAGIE — Platzhaltertiefe, volle Ausarbeitung folgt in Schritt 5 ============
const UNIQUE_MAGIE: UniquePowerOrigin = {
  id: "origin-unique-magie",
  worldId: "avalon",
  factionIds: ["magier"],
  category: "Unique Magie",
  variantPool: ["Blitz", "Illusion", "Zeit"],
  namePrefixPool: ["Rai", "Kagami", "Chronos"],
  nameSuffixPool: ["ten", "-Jutsu", "-Magie"],
  description: "Eine an einem Ort der Macht gefundene, individuelle Magie.",
  stageDefinitions: [
    { name: "Grundfähigkeiten (Ort der Macht gefunden)", tier: "basis", abilityCount: 2, isPowerupStage: false },
    { name: "Vertiefte Technik", tier: "vertieft", abilityCount: 1, isPowerupStage: false },
    { name: "Erweiterte Technik", tier: "fortgeschritten", abilityCount: 1, isPowerupStage: false },
    { name: "Meisterschaft", tier: "magia_erebea", abilityCount: 2, isPowerupStage: true },
    { name: "Unbegrenzte Weiterentwicklung", tier: "frei", abilityCount: 0, isPowerupStage: false },
  ],
  abilityPool: [
    t("Blitzschlag", "angriff", "Ein gezielter Blitzstrahl.", "basis", { variant: "Blitz" }),
    t("Blitzbewegung", "technik", "Kurzzeitige Blitzgeschwindigkeit zur Fortbewegung.", "basis", { variant: "Blitz" }),
    t("Trugbild", "angriff", "Erschafft ein täuschendes Abbild als Ablenkung.", "basis", { variant: "Illusion" }),
    t("Stimmenwurf", "technik", "Wirft die eigene Stimme, um zu verwirren.", "basis", { variant: "Illusion" }),
    t("Zeitlupenfeld", "angriff", "Verlangsamt den Gegner spürbar.", "basis", { variant: "Zeit" }),
    t("Kurzer Rückspul", "technik", "Setzt die letzten Sekunden der Bewegung zurück.", "basis", { variant: "Zeit" }),
    t("Raiten Hoho", "powerup", "Vertiefte Bewegungstechnik - Körper nimmt Blitzeigenschaften an.", "vertieft", {
      variant: "Blitz",
      powerup: { rounds: 2, damageBonusPct: 0.2, incomingReductionPct: 0.15, speedNote: "+Tempo-Vorteil" },
    }),
    t("Spiegelschritt", "technik", "Teleportartige Bewegung durch Spiegelillusionen.", "vertieft", { variant: "Illusion" }),
    t("Zeitsprung", "technik", "Kurzer, unvorhersehbarer Ortswechsel in der Zeit.", "vertieft", { variant: "Zeit" }),
    t("Raiten Sōsō", "powerup", "Erweiterte, stärkere Blitzmanifestation als Raiten Hoho.", "fortgeschritten", {
      variant: "Blitz",
      powerup: { rounds: 3, damageBonusPct: 0.35, incomingReductionPct: 0.25, speedNote: "+Tempo-Vorteil" },
    }),
    t("Doppelgänger-Konstrukt", "angriff", "Erschafft einen kämpfenden Doppelgänger.", "fortgeschritten", { variant: "Illusion" }),
    t("Zeitschleife", "angriff", "Wiederholt einen Angriff mehrfach in Folge.", "fortgeschritten", { variant: "Zeit" }),
    t("Magia Erebea: Blitzform", "powerup", "Verbotene Verstärkung - Anwender wird von Blitzmagie durchdrungen.", "magia_erebea", {
      variant: "Blitz",
      powerup: { rounds: 3, damageBonusPct: 0.5, incomingReductionPct: 0.4, speedNote: "+Tempo-Vorteil", hpBonusFlat: 20 },
    }),
    t("Blitzkaiser", "angriff", "Neue, extrem starke Technik - nur in Magia Erebea wirkbar.", "magia_erebea", {
      variant: "Blitz",
      requiresActivePowerup: "Magia Erebea: Blitzform",
    }),
    t("Magia Erebea: Illusionsform", "powerup", "Verbotene Verstärkung - Anwender verschmilzt mit der Illusion.", "magia_erebea", {
      variant: "Illusion",
      powerup: { rounds: 3, damageBonusPct: 0.4, incomingReductionPct: 0.55, hpBonusFlat: 15 },
    }),
    t("Realitätsriss", "angriff", "Neue, extrem starke Technik - nur in Magia Erebea wirkbar.", "magia_erebea", {
      variant: "Illusion",
      requiresActivePowerup: "Magia Erebea: Illusionsform",
    }),
    t("Magia Erebea: Zeitform", "powerup", "Verbotene Verstärkung - Anwender existiert leicht außerhalb der Zeit.", "magia_erebea", {
      variant: "Zeit",
      powerup: { rounds: 3, damageBonusPct: 0.4, incomingReductionPct: 0.45, speedNote: "+Tempo-Vorteil", hpBonusFlat: 20 },
    }),
    t("Zeitstillstand", "angriff", "Neue, extrem starke Technik - nur in Magia Erebea wirkbar.", "magia_erebea", {
      variant: "Zeit",
      requiresActivePowerup: "Magia Erebea: Zeitform",
    }),
  ],
};

UNIQUE_POWER_ORIGINS.push(ZANPAKUTOU, UNIQUE_MAGIE);

// ============ SOUL SOCIETY: RESURRECCIÓN (Hollow) — Platzhaltertiefe, volle Ausarbeitung folgt später ============
const RESURRECCION: UniquePowerOrigin = {
  id: "origin-resurreccion",
  worldId: "soul_society",
  factionIds: ["hollow"],
  category: "Resurrección",
  variantPool: ["Schakal", "Skorpion"],
  namePrefixPool: ["Lobo", "Escor"],
  nameSuffixPool: [" Sombrío", "pión de Sangre"],
  description: "Eine individuelle Transformationsform, die sich aus der Existenz-Evolution eines Hollow entwickelt.",
  stageDefinitions: [
    { name: "Hollow", tier: "basis", abilityCount: 1, isPowerupStage: false },
    { name: "Gillian", tier: "gillian", abilityCount: 1, isPowerupStage: false },
    { name: "Adjuchas", tier: "adjuchas", abilityCount: 1, isPowerupStage: false },
    { name: "Vasto Lorde", tier: "vasto_lorde", abilityCount: 1, isPowerupStage: false },
    { name: "Resurrección: Einzigartige Form", tier: "resurreccion", abilityCount: 1, isPowerupStage: true },
    { name: "Optionale zweite Form", tier: "zweite_form", abilityCount: 1, isPowerupStage: false },
    { name: "Unbegrenzte Weiterentwicklung", tier: "frei", abilityCount: 0, isPowerupStage: false },
  ],
  abilityPool: [
    t("Cero (Grundform)", "angriff", "Ein Energiestrahl aus konzentriertem Hollow-Reiatsu.", "basis"),
    t("Gillian-Masse", "technik", "Rohe, ungerichtete Kraftentladung.", "gillian"),
    t("Adjuchas-Bewusstsein", "technik", "Klarerer Verstand erlaubt gezieltere Angriffe.", "adjuchas"),
    t("Vasto-Lorde-Kraft", "angriff", "Massiv gesteigerte körperliche Wucht.", "vasto_lorde"),
    t("Resurrección: Schakalform", "powerup", "Dauerhafte Transformation - reißende Geschwindigkeit und Instinkt.", "resurreccion", {
      variant: "Schakal",
      powerup: { rounds: 4, damageBonusPct: 0.4, incomingReductionPct: 0.35, speedNote: "+Tempo-Vorteil", hpBonusFlat: 30 },
    }),
    t("Resurrección: Skorpionform", "powerup", "Dauerhafte Transformation - gepanzerter Chitinkörper.", "resurreccion", {
      variant: "Skorpion",
      powerup: { rounds: 4, damageBonusPct: 0.3, incomingReductionPct: 0.5, hpBonusFlat: 35 },
    }),
    t("Zweite Form: Rudelfrenzy", "angriff", "Optionale zweite Form - Serie unaufhaltsamer Angriffe.", "zweite_form", { variant: "Schakal" }),
    t("Zweite Form: Giftschwarm", "angriff", "Optionale zweite Form - Welle giftiger Stachel.", "zweite_form", { variant: "Skorpion" }),
  ],
};

// ============ SOUL SOCIETY: COMPLETE (Quincy) — Platzhaltertiefe, volle Ausarbeitung folgt später ============
const COMPLETE: UniquePowerOrigin = {
  id: "origin-complete",
  worldId: "soul_society",
  factionIds: ["quincy"],
  category: "Complete",
  variantPool: ["Licht", "Stille"],
  namePrefixPool: ["Licht", "Still"],
  nameSuffixPool: ["vollender", "bringer"],
  description: "Eine individuelle Waffenform, die aus verdichtetem Reishi entsteht.",
  stageDefinitions: [
    { name: "Einzigartige Waffe", tier: "basis", abilityCount: 1, isPowerupStage: false },
    { name: "Complete", tier: "complete", abilityCount: 1, isPowerupStage: true },
    { name: "Neue Fähigkeiten", tier: "neue_faehigkeiten", abilityCount: 1, isPowerupStage: false },
    { name: "Neue Formen", tier: "neue_formen", abilityCount: 1, isPowerupStage: false },
    { name: "Unbegrenzte Weiterentwicklung", tier: "frei", abilityCount: 0, isPowerupStage: false },
  ],
  abilityPool: [
    t("Reishi-Bogen", "angriff", "Grundlegender Pfeilschuss aus verdichtetem Reishi.", "basis"),
    t("Complete: Lichtform", "powerup", "Vollständige Form - der Träger wird von Licht umhüllt.", "complete", {
      variant: "Licht",
      powerup: { rounds: 4, damageBonusPct: 0.35, incomingReductionPct: 0.35, hpBonusFlat: 25 },
    }),
    t("Complete: Stilleform", "powerup", "Vollständige Form - der Träger wird lautlos und schnell.", "complete", {
      variant: "Stille",
      powerup: { rounds: 4, damageBonusPct: 0.3, incomingReductionPct: 0.35, speedNote: "+Tempo-Vorteil", hpBonusFlat: 25 },
    }),
    t("Photonenschuss", "technik", "Ein durchdringender Lichtstrahl.", "neue_faehigkeiten", { variant: "Licht" }),
    t("Lautloser Pfeil", "technik", "Ein Pfeil, der nicht wahrgenommen werden kann.", "neue_faehigkeiten", { variant: "Stille" }),
    t("Strahlenkranz", "angriff", "Ein Kranz aus Lichtklingen umkreist den Träger.", "neue_formen", { variant: "Licht" }),
    t("Schattenkranz", "angriff", "Mehrere lautlose Pfeile gleichzeitig.", "neue_formen", { variant: "Stille" }),
  ],
};

UNIQUE_POWER_ORIGINS.push(RESURRECCION, COMPLETE);
