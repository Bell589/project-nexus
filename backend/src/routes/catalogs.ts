import { Router } from "express";
import { UNIQUE_POWER_ORIGINS } from "../data/uniquePowerOrigins.js";
import { SPEKTRALRITTER } from "../data/spektralritter.js";

export const catalogsRouter = Router();

catalogsRouter.get("/unique-power-origins", (req, res) => {
  const { worldId, factionId } = req.query;
  let list = UNIQUE_POWER_ORIGINS;
  if (worldId) list = list.filter((o) => o.worldId === worldId);
  if (factionId) list = list.filter((o) => o.factionIds.includes(String(factionId)));
  res.json(list);
});

catalogsRouter.get("/spektralritter", (_req, res) => {
  res.json(SPEKTRALRITTER);
});
