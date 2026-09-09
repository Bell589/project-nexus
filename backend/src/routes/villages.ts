import { Router } from "express";
import { joinVillage, listVillages, promote } from "../services/villageService.js";
import { ValidationError } from "../services/characterService.js";

export const villagesRouter = Router();

villagesRouter.get("/", (_req, res) => {
  res.json(listVillages());
});

villagesRouter.post("/:id/join", (req, res) => {
  try {
    const { characterId } = req.body;
    res.json(joinVillage(req.params.id, characterId));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});

villagesRouter.post("/:id/promote", (req, res) => {
  try {
    const { actingCharacterId, targetCharacterId, rank } = req.body;
    res.json(promote(req.params.id, actingCharacterId, targetCharacterId, rank));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});
