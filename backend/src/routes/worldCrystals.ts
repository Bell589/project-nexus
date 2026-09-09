import { Router } from "express";
import { destabilizeCrystal, listCrossWorldEvents, listCrystals, stabilizeCrystal } from "../services/worldCrystalService.js";
import { ValidationError } from "../services/characterService.js";

export const worldCrystalsRouter = Router();

worldCrystalsRouter.get("/", (_req, res) => {
  res.json(listCrystals());
});

worldCrystalsRouter.post("/:id/stabilize", (req, res) => {
  try {
    const { characterId } = req.body;
    res.json(stabilizeCrystal(req.params.id, characterId));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});

worldCrystalsRouter.post("/:id/destabilize", (req, res) => {
  try {
    const { amount } = req.body;
    res.json(destabilizeCrystal(req.params.id, amount ?? 10));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});

worldCrystalsRouter.get("/events/all", (_req, res) => {
  res.json(listCrossWorldEvents());
});
