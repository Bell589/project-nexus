import { Router } from "express";
import { activateOtsutsukiReincarnation, fightOtsutsuki, listAvailableOtsutsuki } from "../services/otsutsukiService.js";
import { getUnlockedKarmaAbilities } from "../data/karmaAbilities.js";
import { ValidationError } from "../services/characterService.js";

export const otsutsukiRouter = Router();

otsutsukiRouter.get("/available", (_req, res) => {
  res.json(listAvailableOtsutsuki());
});

otsutsukiRouter.post("/:otsutsukiId/fight", (req, res) => {
  try {
    const { characterId } = req.body;
    res.json(fightOtsutsuki(characterId, req.params.otsutsukiId));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});

otsutsukiRouter.get("/karma-abilities/:karmaPct", (req, res) => {
  res.json(getUnlockedKarmaAbilities(Number(req.params.karmaPct)));
});

otsutsukiRouter.post("/reincarnation", (req, res) => {
  try {
    const { characterId } = req.body;
    res.json(activateOtsutsukiReincarnation(characterId));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});
