import { Router } from "express";
import { CORE_POWER_ARCHETYPES } from "../data/corePowerArchetypes.js";
import { SPEKTRALRITTER } from "../data/spektralritter.js";

export const catalogsRouter = Router();

catalogsRouter.get("/core-power-archetypes", (req, res) => {
  const { worldId, factionId } = req.query;
  let list = CORE_POWER_ARCHETYPES;
  if (worldId) list = list.filter((a) => a.worldId === worldId);
  if (factionId) list = list.filter((a) => a.factionIds.includes(String(factionId)));
  res.json(list);
});

catalogsRouter.get("/spektralritter", (_req, res) => {
  res.json(SPEKTRALRITTER);
});
