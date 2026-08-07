import { Router } from "express";
import {
  createCharacter,
  getCharacter,
  getKampfkraft,
  listCharacters,
  ValidationError,
} from "../services/characterService.js";
import { acquireCorePower, advanceCorePowerStage } from "../services/corePowerService.js";
import { trainComponent } from "../services/trainingService.js";

export const charactersRouter = Router();

charactersRouter.get("/", (_req, res) => {
  res.json(listCharacters());
});

charactersRouter.post("/", (req, res) => {
  try {
    const character = createCharacter(req.body);
    res.status(201).json(character);
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});

charactersRouter.get("/:id", (req, res) => {
  try {
    const character = getCharacter(req.params.id);
    res.json({ ...character, kampfkraft: getKampfkraft(character) });
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(404).json({ error: err.message });
      return;
    }
    throw err;
  }
});

charactersRouter.post("/:id/train", (req, res) => {
  try {
    const { component, amount } = req.body;
    const character = trainComponent(req.params.id, component, amount);
    res.json({ ...character, kampfkraft: getKampfkraft(character) });
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});

charactersRouter.post("/:id/core-power/acquire", (req, res) => {
  try {
    const { archetype, name } = req.body;
    const character = acquireCorePower({ characterId: req.params.id, archetype, name });
    res.json({ ...character, kampfkraft: getKampfkraft(character) });
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});

charactersRouter.post("/:id/core-power/advance", (req, res) => {
  try {
    const character = advanceCorePowerStage(req.params.id);
    res.json({ ...character, kampfkraft: getKampfkraft(character) });
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});

