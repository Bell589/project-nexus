import type { CombatSession } from "../types/combatSession.js";

const sessions = new Map<string, CombatSession>();

export const CombatSessionStore = {
  get(id: string): CombatSession | undefined {
    return sessions.get(id);
  },
  save(session: CombatSession): CombatSession {
    sessions.set(session.id, session);
    return session;
  },
};
