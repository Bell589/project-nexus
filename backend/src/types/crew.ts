export type CrewRole = "Captain" | "Offizier" | "Kommandant" | "Stellvertreter" | "Mitglied";

export interface CrewMember {
  characterId: string;
  role: CrewRole;
}

export interface Crew {
  id: string;
  name: string;
  worldId: "ozeanwelt";
  factionId: "piraten" | "marine";
  members: CrewMember[];
  fleetId: string | null;
  createdAt: string;
}
