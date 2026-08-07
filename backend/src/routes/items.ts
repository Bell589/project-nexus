import { Router } from "express";
import { ITEMS } from "../data/items.js";

export const itemsRouter = Router();

itemsRouter.get("/", (_req, res) => {
  res.json(ITEMS);
});
