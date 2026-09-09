import { Router } from "express";
import { UNIQUE_POWER_ORIGINS } from "../data/uniquePowerOrigins.js";
import { ESPERS } from "../data/espers.js";
import { BIJUU } from "../data/bijuu.js";
import { OTSUTSUKI } from "../data/otsutsuki.js";
import { ZANPAKUTO_QUIZ } from "../data/zanpakutoQuiz.js";

export const catalogsRouter = Router();

catalogsRouter.get("/unique-power-origins", (req, res) => {
  const { worldId, factionId } = req.query;
  let list = UNIQUE_POWER_ORIGINS;
  if (worldId) list = list.filter((o) => o.worldId === worldId);
  if (factionId) list = list.filter((o) => o.factionIds.includes(String(factionId)));
  res.json(list);
});

catalogsRouter.get("/espers", (_req, res) => {
  res.json(ESPERS);
});

catalogsRouter.get("/bijuu", (_req, res) => {
  res.json(BIJUU);
});

catalogsRouter.get("/otsutsuki", (_req, res) => {
  res.json(OTSUTSUKI);
});


catalogsRouter.get("/zanpakuto-quiz", (_req, res) => {
  res.json(ZANPAKUTO_QUIZ.map((q) => ({ id: q.id, question: q.question, options: q.options.map((o) => ({ label: o.label })) })));
});
