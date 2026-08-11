import { Router } from "express";
import {
  getCombatSession,
  listEnemiesForCharacter,
  performAction,
  startCombat,
} from "../services/combatService.js";
import { ValidationError } from "../services/characterService.js";

export const combatRouter = Router();

combatRouter.get("/enemies/character/:characterId", (req, res) => {
  try {
    res.json(listEnemiesForCharacter(req.params.characterId));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(404).json({ error: err.message });
      return;
    }
    throw err;
  }
});

combatRouter.post("/:enemyId/start", (req, res) => {
  try {
    const { characterId } = req.body;
    res.status(201).json(startCombat(characterId, req.params.enemyId));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});

combatRouter.get("/session/:sessionId", (req, res) => {
  try {
    res.json(getCombatSession(req.params.sessionId));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(404).json({ error: err.message });
      return;
    }
    throw err;
  }
});

combatRouter.post("/session/:sessionId/action", (req, res) => {
  try {
    const { action, abilityName } = req.body;
    res.json(performAction(req.params.sessionId, action, abilityName));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});
