import { Router } from "express";
import { ITEMS } from "../data/items.js";

export const itemsRouter = Router();

itemsRouter.get("/", (_req, res) => {
  res.json(ITEMS.map(i => ({ price: 100, tradeable: true, marketplaceAllowed: true, bound: false, unique: false, organizationStorageAllowed: true, rarity: "common", category: i.slot === "waffe" ? "weapon" : i.slot === "verbrauchsgut" ? "consumable" : "equipment", ...i })));
});
