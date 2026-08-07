import { Router } from "express";
import { completeMission, listMissionsForCharacter } from "../services/missionService.js";
import { ValidationError } from "../services/characterService.js";

export const missionsRouter = Router();

missionsRouter.get("/character/:characterId", (req, res) => {
  try {
    res.json(listMissionsForCharacter(req.params.characterId));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(404).json({ error: err.message });
      return;
    }
    throw err;
  }
});

missionsRouter.post("/:missionId/complete", (req, res) => {
  try {
    const { characterId } = req.body;
    res.json(completeMission(characterId, req.params.missionId));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});
