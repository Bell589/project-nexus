import { Router } from "express";
import { claimArcaneNode, getArcaneNodeControllers } from "../services/arcaneNetworkService.js";
import { ValidationError } from "../services/characterService.js";

export const arcaneNetworkRouter = Router();

arcaneNetworkRouter.get("/controllers", (_req, res) => {
  res.json(getArcaneNodeControllers());
});

arcaneNetworkRouter.post("/:locationId/claim", (req, res) => {
  try {
    const { characterId } = req.body;
    res.json(claimArcaneNode(characterId, req.params.locationId));
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});
