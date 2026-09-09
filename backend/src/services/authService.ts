import { createHash, timingSafeEqual } from "node:crypto";
import { nanoid } from "nanoid";
import { AccountStore, SessionStore } from "../db/accountStore.js";
import type { Account, PublicAccount } from "../types/account.js";
import { ValidationError } from "./characterService.js";

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

function publicAccount(account: Account): PublicAccount {
  const { passwordHash: _passwordHash, ...safe } = account;
  return safe;
}

export function register(username: string, displayName: string, password: string) {
  const normalized = username?.trim().toLowerCase();
  if (!normalized || normalized.length < 3) throw new ValidationError("Benutzername muss mindestens 3 Zeichen haben");
  if (!displayName?.trim()) throw new ValidationError("Anzeigename darf nicht leer sein");
  if (!password || password.length < 6) throw new ValidationError("Passwort muss mindestens 6 Zeichen haben");
  if (AccountStore.byUsername(normalized)) throw new ValidationError("Benutzername ist bereits vergeben");

  const account = AccountStore.save({
    id: nanoid(), username: normalized, displayName: displayName.trim(),
    passwordHash: hashPassword(password), createdAt: new Date().toISOString(),
  });
  return createSession(account);
}

export function login(username: string, password: string) {
  const account = AccountStore.byUsername(username ?? "");
  if (!account) throw new ValidationError("Benutzername oder Passwort ist falsch");
  const actual = Buffer.from(account.passwordHash);
  const expected = Buffer.from(hashPassword(password ?? ""));
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    throw new ValidationError("Benutzername oder Passwort ist falsch");
  }
  return createSession(account);
}

function createSession(account: Account) {
  const session = SessionStore.save({ token: nanoid(32), accountId: account.id, createdAt: new Date().toISOString() });
  return { token: session.token, account: publicAccount(account) };
}

export function getAccountForToken(token: string) {
  const session = SessionStore.get(token);
  if (!session) throw new ValidationError("Sitzung ist ungültig oder nach Server-Neustart abgelaufen");
  const account = AccountStore.get(session.accountId);
  if (!account) throw new ValidationError("Account nicht gefunden");
  return publicAccount(account);
}

export function logout(token: string) { SessionStore.delete(token); }
