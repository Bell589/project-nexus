import type { Location } from "../types/location.js";

export const LOCATIONS: Location[] = [
  // Ozeanwelt
  { id: "insel-sturmklippe", worldId: "ozeanwelt", name: "Sturmklippe", type: "insel", description: "Umkämpfte Insel an gefährlicher Strömung.", x: 20, y: 30 },
  { id: "insel-goldbucht", worldId: "ozeanwelt", name: "Goldbucht", type: "insel", description: "Reiche Handelsinsel, oft Ziel von Kopfgeldjägern.", x: 55, y: 60 },
  { id: "marine-hq", worldId: "ozeanwelt", name: "Marine-Hauptquartier", type: "hauptquartier", description: "Sitz der Weltregierung und der Fünf Weisen.", x: 80, y: 25 },

  // Soul Society
  { id: "seelenbezirk-1", worldId: "soul_society", name: "Seelenbezirk 1", type: "seelenbezirk", description: "Kann gereinigt, verteidigt, korrumpiert oder zurückerobert werden.", x: 30, y: 40 },
  { id: "seelenbezirk-2", worldId: "soul_society", name: "Seelenbezirk 2", type: "seelenbezirk", description: "Von Hollow-Aktivität bedroht.", x: 60, y: 20 },
  { id: "seelenbezirk-3", worldId: "soul_society", name: "Seelenbezirk 3", type: "seelenbezirk", description: "Unruhiges Grenzgebiet mit hoher Hollow-Aktivität.", x: 75, y: 65 },

  // Avalon (ägyptisch-magisch inspiriert)
  { id: "obelisk-des-blitzes", worldId: "avalon", name: "Obelisk des Blitzes", type: "ort_der_macht", description: "Ort der Macht in der Wüste — hier kann Blitzmagie erlernt werden.", x: 15, y: 20 },
  { id: "tal-der-koenige", worldId: "avalon", name: "Tal der Könige", type: "ort_der_macht", description: "Uraltes Grabstättental, Ort der Macht mit dunkler Geschichte.", x: 40, y: 75 },
  { id: "oase-der-spiegelungen", worldId: "avalon", name: "Oase der Spiegelungen", type: "ort_der_macht", description: "Ort der Macht, verbunden mit Illusionsmagie.", x: 65, y: 50 },
  { id: "pyramide-der-zeit", worldId: "avalon", name: "Pyramide der Zeit", type: "ort_der_macht", description: "Ort der Macht, verzerrter Zeitfluss im Inneren der Pyramide.", x: 25, y: 55 },
  { id: "sternenobservatorium", worldId: "avalon", name: "Sternenobservatorium von Alexandria", type: "ort_der_macht", description: "Turm und Ort der Macht zugleich, mit Blick auf die Sterne.", x: 80, y: 30 },
  { id: "leerentempel", worldId: "avalon", name: "Leerentempel", type: "ort_der_macht", description: "Tempel nahe der Spektralwelt, Ort der Macht.", x: 50, y: 15 },
  { id: "arkaner-knoten-1", worldId: "avalon", name: "Ley-Linien-Knoten Nord", type: "arkaner_knoten", description: "Teil des Arkanen Netzwerks. Kontrolle stärkt die Magie der eigenen Gemeinschaft.", x: 45, y: 35 },
  { id: "arkaner-knoten-2", worldId: "avalon", name: "Ley-Linien-Knoten Süd", type: "arkaner_knoten", description: "Teil des Arkanen Netzwerks.", x: 60, y: 80 },
  { id: "arkaner-knoten-3", worldId: "avalon", name: "Ley-Linien-Knoten Ost", type: "arkaner_knoten", description: "Teil des Arkanen Netzwerks.", x: 85, y: 60 },
  { id: "alexandria", worldId: "avalon", name: "Alexandria", type: "hauptquartier", description: "Größte Magierstadt Avalons, Sitz der Pharao-Verwaltung.", x: 35, y: 40 },
  { id: "pyramidenregion", worldId: "avalon", name: "Pyramidenregion Gizeh-Analog", type: "hauptquartier", description: "Monumentale Pyramiden, umkämpftes Herrschaftsgebiet.", x: 45, y: 65 },
  { id: "oasenstadt-siwa", worldId: "avalon", name: "Oasenstadt Siwa-Analog", type: "hauptquartier", description: "Fruchtbare Oasenstadt inmitten der Wüste.", x: 60, y: 55 },

  // Spektralwelt (übernatürliche Ebene von Avalon - hier leben Esper und Spektralritter)
  { id: "spektralwelt-schleier", worldId: "avalon", name: "Der Schleier", type: "spektralwelt_ort", description: "Übergang zwischen Avalon und der Spektralwelt. Nur Magier können ihn durchschreiten.", x: 50, y: 50 },
  { id: "spektralwelt-thron-pyrraq", worldId: "avalon", name: "Flammenthron", type: "spektralwelt_ort", description: "Ort in der Spektralwelt, an dem der Esper Pyrraq gefunden werden kann.", x: 20, y: 60 },
  { id: "spektralwelt-thron-glacia", worldId: "avalon", name: "Frostpalast", type: "spektralwelt_ort", description: "Ort in der Spektralwelt, an dem der Esper Glacia gefunden werden kann.", x: 80, y: 45 },
  { id: "spektralwelt-rittersaal", worldId: "avalon", name: "Rittersaal der Dämmerung", type: "spektralwelt_ort", description: "Hier warten Spektralritter darauf, einen Pakt zu schließen.", x: 55, y: 25 },

  // Ninja-Welt
  { id: "dorf-konohagakure", worldId: "ninja_welt", name: "Konohagakure", type: "dorf", description: "Dorf verborgen im Laub. Sitz des Hokage.", x: 25, y: 40 },
  { id: "dorf-sunagakure", worldId: "ninja_welt", name: "Sunagakure", type: "dorf", description: "Dorf verborgen im Sand. Sitz des Kazekage.", x: 65, y: 70 },
  { id: "dorf-kirigakure", worldId: "ninja_welt", name: "Kirigakure", type: "dorf", description: "Dorf verborgen im Nebel. Sitz des Mizukage.", x: 80, y: 20 },
  { id: "bijuu-sichtung-wueste", worldId: "ninja_welt", name: "Verlassene Dünen", type: "bijuu_sichtung", description: "Hier wurden zuletzt Bijū-Chakra-Spuren gesichtet.", x: 55, y: 80 },
  { id: "bijuu-sichtung-wald", worldId: "ninja_welt", name: "Verbotener Wald", type: "bijuu_sichtung", description: "Ein Bijū streift angeblich durch dieses Waldgebiet.", x: 15, y: 20 },
  { id: "otsutsuki-sichtung-krater", worldId: "ninja_welt", name: "Einschlagkrater", type: "otsutsuki_sichtung", description: "Ein Otsutsuki soll aus diesem Krater aufgetaucht sein.", x: 40, y: 55 },
  { id: "trainingsfeld-clans", worldId: "ninja_welt", name: "Clan-Trainingsfelder", type: "dorf", description: "Hier trainieren die großen Shinobi-Clans ihre Techniken.", x: 30, y: 60 },
];
