import { Router } from "express";
import { getAccountForToken, login, logout, register } from "../services/authService.js";
import { ValidationError } from "../services/characterService.js";

export const authRouter = Router();
const tokenFrom = (header?: string) => header?.startsWith("Bearer ") ? header.slice(7) : "";
const fail = (res: any, err: unknown) => {
  if (err instanceof ValidationError) { res.status(400).json({ error: err.message }); return true; }
  return false;
};

authRouter.post("/register", (req, res) => {
  try { res.status(201).json(register(req.body.username, req.body.displayName, req.body.password)); }
  catch (err) { if (!fail(res, err)) throw err; }
});
authRouter.post("/login", (req, res) => {
  try { res.json(login(req.body.username, req.body.password)); }
  catch (err) { if (!fail(res, err)) throw err; }
});
authRouter.get("/me", (req, res) => {
  try { res.json(getAccountForToken(tokenFrom(req.headers.authorization))); }
  catch (err) { if (!fail(res, err)) throw err; }
});
authRouter.post("/logout", (req, res) => {
  logout(tokenFrom(req.headers.authorization)); res.status(204).end();
});
