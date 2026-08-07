import { Router } from "express";
import { fightEnemy, listEnemiesForCharacter } from "../services/combatService.js";
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

combatRouter.post("/:enemyId/fight", (req, res) => {
  try {
    const { characterId } = req.body;
    res.json(fightEnemy(characterId, req.params.enemyId));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});
