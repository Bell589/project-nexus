import { Router } from "express";
import { attackRegion, claimRegion, joinDefense, listRegions, rebel, setPresence } from "../services/regionService.js";
import { ValidationError } from "../services/characterService.js";

export const regionsRouter = Router();

regionsRouter.get("/", (req, res) => {
  const { worldId } = req.query;
  res.json(listRegions(worldId ? String(worldId) : undefined));
});

regionsRouter.post("/:locationId/claim", (req, res) => {
  try {
    const { characterId } = req.body;
    res.json(claimRegion(characterId, req.params.locationId));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});

regionsRouter.post("/:locationId/presence", (req, res) => {
  try {
    const { characterId, present } = req.body;
    res.json(setPresence(characterId, req.params.locationId, present));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});

regionsRouter.post("/:locationId/join-defense", (req, res) => {
  try {
    const { characterId } = req.body;
    res.json(joinDefense(characterId, req.params.locationId));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});

regionsRouter.post("/:locationId/attack", (req, res) => {
  try {
    const { characterId } = req.body;
    res.json(attackRegion(characterId, req.params.locationId));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});

regionsRouter.post("/:locationId/rebel", (req, res) => {
  try {
    const { characterId } = req.body;
    res.json(rebel(characterId, req.params.locationId));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});
