import { Router } from "express";
import { WORLDS } from "../data/worlds.js";
import { FACTIONS } from "../data/factions.js";
import { LOCATIONS } from "../data/locations.js";
import { RACES } from "../data/races.js";
import { CLANS } from "../data/clans.js";

export const worldsRouter = Router();

worldsRouter.get("/", (_req, res) => {
  res.json(WORLDS);
});

worldsRouter.get("/:worldId/factions", (req, res) => {
  const factions = FACTIONS.filter((f) => f.worldId === req.params.worldId);
  res.json(factions);
});

worldsRouter.get("/:worldId/locations", (req, res) => {
  const locations = LOCATIONS.filter((l) => l.worldId === req.params.worldId);
  res.json(locations);
});

worldsRouter.get("/:worldId/races", (req, res) => res.json(RACES.filter((r) => r.worldId === req.params.worldId)));
worldsRouter.get("/:worldId/clans", (req, res) => res.json(CLANS.filter((c) => c.worldId === req.params.worldId)));
