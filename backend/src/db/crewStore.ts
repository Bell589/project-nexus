import type { Crew } from "../types/crew.js";

const crews = new Map<string, Crew>();

export const CrewStore = {
  all(): Crew[] {
    return Array.from(crews.values());
  },
  get(id: string): Crew | undefined {
    return crews.get(id);
  },
  save(crew: Crew): Crew {
    crews.set(crew.id, crew);
    return crew;
  },
};
