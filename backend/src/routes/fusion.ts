import { Router } from "express";
import { fuseCharacters } from "../services/fusionService.js";
import { ValidationError } from "../services/characterService.js";

export const fusionRouter = Router();

fusionRouter.post("/", (req, res) => {
  try {
    const { characterAId, characterBId, newCharacterName } = req.body;
    res.status(201).json(fuseCharacters(characterAId, characterBId, newCharacterName));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});
