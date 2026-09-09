import { Router } from "express";
import { activateEncounter, despawnEncounter, listActiveEncounters, listEncounterDefinitions } from "../services/worldEncounterService.js";
import { ValidationError } from "../services/characterService.js";
import type { WorldId } from "../types/world.js";
export const worldEncountersRouter = Router();
worldEncountersRouter.get("/definitions", (req, res) => res.json(listEncounterDefinitions(req.query.worldId as WorldId | undefined)));
worldEncountersRouter.get("/active", (req, res) => res.json(listActiveEncounters(req.query.worldId as WorldId | undefined)));
worldEncountersRouter.post("/:definitionId/activate", (req, res) => { try { res.status(201).json(activateEncounter(req.params.definitionId, req.body?.locationId)); } catch (e) { if (e instanceof ValidationError) { res.status(400).json({error:e.message}); return; } throw e; } });
worldEncountersRouter.delete("/:definitionId", (req, res) => { try { despawnEncounter(req.params.definitionId); res.status(204).end(); } catch (e) { if (e instanceof ValidationError) { res.status(400).json({error:e.message}); return; } throw e; } });
