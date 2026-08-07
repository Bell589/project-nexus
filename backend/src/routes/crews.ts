import { Router } from "express";
import {
  assignCrewRole,
  createCrew,
  getCrew,
  joinCrew,
  listCrews,
} from "../services/crewService.js";
import { ValidationError } from "../services/characterService.js";

export const crewsRouter = Router();

crewsRouter.get("/", (_req, res) => {
  res.json(listCrews());
});

crewsRouter.post("/", (req, res) => {
  try {
    const { founderCharacterId, name } = req.body;
    const crew = createCrew(founderCharacterId, name);
    res.status(201).json(crew);
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});

crewsRouter.get("/:id", (req, res) => {
  try {
    res.json(getCrew(req.params.id));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(404).json({ error: err.message });
      return;
    }
    throw err;
  }
});

crewsRouter.post("/:id/join", (req, res) => {
  try {
    const { characterId } = req.body;
    res.json(joinCrew(req.params.id, characterId));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});

crewsRouter.post("/:id/roles", (req, res) => {
  try {
    const { actingCharacterId, targetCharacterId, role } = req.body;
    res.json(assignCrewRole(req.params.id, actingCharacterId, targetCharacterId, role));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});
