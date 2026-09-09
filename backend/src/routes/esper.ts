import { Router } from "express";
import { attemptEsperPact, advanceEsperPact, listAvailableEspers } from "../services/esperService.js";
import { ValidationError } from "../services/characterService.js";

export const esperRouter = Router();

esperRouter.get("/available", (_req, res) => {
  res.json(listAvailableEspers());
});

esperRouter.post("/:esperId/attempt-pact", (req, res) => {
  try {
    const { characterId } = req.body;
    res.json(attemptEsperPact(characterId, req.params.esperId));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});

esperRouter.post("/advance", (req, res) => {
  try {
    const { characterId } = req.body;
    res.json(advanceEsperPact(characterId));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});
