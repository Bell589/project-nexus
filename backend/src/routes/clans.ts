import { Router } from "express";
import { joinClan, listClans, searchNinjutsuWithClanBonus } from "../services/clanService.js";
import { ValidationError } from "../services/characterService.js";
import { advanceClanTraining } from "../services/clanTrainingService.js";

export const clansRouter = Router();

clansRouter.get("/", (req, res) => {
  res.json(listClans(req.query.worldId as import("../types/world.js").WorldId | undefined));
});

clansRouter.post("/:id/join", (req, res) => {
  try {
    const { characterId } = req.body;
    res.json(joinClan(characterId, req.params.id));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});

clansRouter.post("/ninjutsu-search", (req, res) => {
  try {
    const { characterId } = req.body;
    res.json(searchNinjutsuWithClanBonus(characterId));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});


clansRouter.post("/training/:pathId", (req, res) => {
  try {
    res.json(advanceClanTraining(req.body.characterId, req.params.pathId));
  } catch (err) {
    if (err instanceof ValidationError) { res.status(400).json({ error: err.message }); return; }
    throw err;
  }
});
