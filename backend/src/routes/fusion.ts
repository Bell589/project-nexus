import { Router } from "express";
import { dissolveFusion, fuseCharacters, getFusionState } from "../services/fusionService.js";
import { ValidationError } from "../services/characterService.js";

export const fusionRouter = Router();

fusionRouter.post("/", (req, res) => {
  try {
    const { characterAId, characterBId, fusedName } = req.body;
    res.status(201).json(fuseCharacters(characterAId, characterBId, fusedName));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});

fusionRouter.get("/:id", (req, res) => {
  try {
    res.json(getFusionState(req.params.id));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(404).json({ error: err.message });
      return;
    }
    throw err;
  }
});

fusionRouter.post("/:id/dissolve", (req, res) => {
  try {
    res.json(dissolveFusion(req.params.id));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});
