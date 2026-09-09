import { Router } from "express";
import { activateBaryonMode, advanceJinchuriki, fightAndSealBijuu, listAvailableBijuu } from "../services/jinchurikiService.js";
import { ValidationError } from "../services/characterService.js";

export const bijuuRouter = Router();

bijuuRouter.get("/available", (_req, res) => {
  res.json(listAvailableBijuu());
});

bijuuRouter.post("/:bijuuId/fight-and-seal", (req, res) => {
  try {
    const { characterId } = req.body;
    res.json(fightAndSealBijuu(characterId, req.params.bijuuId));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});

bijuuRouter.post("/advance", (req, res) => {
  try {
    const { characterId } = req.body;
    res.json(advanceJinchuriki(characterId));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});

bijuuRouter.post("/baryon-mode", (req, res) => {
  try {
    const { characterId } = req.body;
    res.json(activateBaryonMode(characterId));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});
