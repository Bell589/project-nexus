export interface OtsutsukiOrigin {
  id: string;
  name: string; // eigene Kreation, kein bestehendes IP
  description: string;
  kampfkraft: number; // Schwierigkeit
  karmaGrant: number; // wie viel Karma % beim Sieg gewährt wird
}

export const OTSUTSUKI: OtsutsukiOrigin[] = [
  {
    id: "otsutsuki-vael",
    name: "Vael",
    description: "Ein uralter Wanderer zwischen den Dimensionen, gehüllt in Schatten.",
    kampfkraft: 400,
    karmaGrant: 40,
  },
  {
    id: "otsutsuki-nyxara",
    name: "Nyxara",
    description: "Eine Entität, die ganze Landstriche mit Chakra-Fäulnis überzieht.",
    kampfkraft: 500,
    karmaGrant: 35,
  },
  {
    id: "otsutsuki-kaion",
    name: "Kaion",
    description: "Der letzte bekannte Otsutsuki, dessen Karma alle vorherigen übersteigt.",
    kampfkraft: 650,
    karmaGrant: 30,
  },
];
