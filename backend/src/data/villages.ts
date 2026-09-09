export interface VillageTemplate {
  id: string;
  name: string;
  kageTitle: string;
}

export const VILLAGE_TEMPLATES: VillageTemplate[] = [
  { id: "dorf-konohagakure", name: "Konohagakure", kageTitle: "Hokage" },
  { id: "dorf-sunagakure", name: "Sunagakure", kageTitle: "Kazekage" },
  { id: "dorf-kirigakure", name: "Kirigakure", kageTitle: "Mizukage" },
];
