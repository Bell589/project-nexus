import { Router } from "express";
import { WORLDS } from "../data/worlds.js";
import { FACTIONS } from "../data/factions.js";

export const worldsRouter = Router();

worldsRouter.get("/", (_req, res) => {
  res.json(WORLDS);
});

worldsRouter.get("/:worldId/factions", (req, res) => {
  const factions = FACTIONS.filter((f) => f.worldId === req.params.worldId);
  res.json(factions);
});
