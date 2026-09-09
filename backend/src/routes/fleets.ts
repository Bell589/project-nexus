import { Router } from "express";
import { createFleet, getFleet, joinFleet, listFleets } from "../services/fleetService.js";
import { ValidationError } from "../services/characterService.js";

export const fleetsRouter = Router();

fleetsRouter.get("/", (_req, res) => {
  res.json(listFleets());
});

fleetsRouter.post("/", (req, res) => {
  try {
    const { founderCrewId, founderCharacterId, name } = req.body;
    res.status(201).json(createFleet(founderCrewId, founderCharacterId, name));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});

fleetsRouter.get("/:id", (req, res) => {
  try {
    res.json(getFleet(req.params.id));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(404).json({ error: err.message });
      return;
    }
    throw err;
  }
});

fleetsRouter.post("/:id/join", (req, res) => {
  try {
    const { crewId, characterId } = req.body;
    res.json(joinFleet(req.params.id, crewId, characterId));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});
