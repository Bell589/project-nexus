import { Router } from "express";
import { DOMAIN_RULES } from "../data/domainRules.js";

export const domainRulesRouter = Router();

domainRulesRouter.get("/", (_req, res) => {
  res.json(DOMAIN_RULES);
});
