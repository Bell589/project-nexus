import type { Account, Session } from "../types/account.js";

const accounts = new Map<string, Account>();
const sessions = new Map<string, Session>();

export const AccountStore = {
  save(account: Account) { accounts.set(account.id, account); return account; },
  get(id: string) { return accounts.get(id); },
  byUsername(username: string) {
    const normalized = username.trim().toLowerCase();
    return [...accounts.values()].find((a) => a.username === normalized);
  },
};

export const SessionStore = {
  save(session: Session) { sessions.set(session.token, session); return session; },
  get(token: string) { return sessions.get(token); },
  delete(token: string) { sessions.delete(token); },
};
