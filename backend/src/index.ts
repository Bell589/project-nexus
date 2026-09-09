import express from "express";
import cors from "cors";
import { worldsRouter } from "./routes/worlds.js";
import { authRouter } from "./routes/auth.js";
import { charactersRouter } from "./routes/characters.js";
import { crewsRouter } from "./routes/crews.js";
import { fleetsRouter } from "./routes/fleets.js";
import { itemsRouter } from "./routes/items.js";
import { missionsRouter } from "./routes/missions.js";
import { combatRouter } from "./routes/combat.js";
import { arcaneNetworkRouter } from "./routes/arcaneNetwork.js";
import { domainRulesRouter } from "./routes/domainRules.js";
import { fusionRouter } from "./routes/fusion.js";
import { catalogsRouter } from "./routes/catalogs.js";
import { esperRouter } from "./routes/esper.js";
import { bijuuRouter } from "./routes/bijuu.js";
import { otsutsukiRouter } from "./routes/otsutsuki.js";
import { worldCrystalsRouter } from "./routes/worldCrystals.js";
import { villagesRouter } from "./routes/villages.js";
import { clansRouter } from "./routes/clans.js";
import { regionsRouter } from "./routes/regions.js";
import { worldEncountersRouter } from "./routes/worldEncounters.js";
import { progressionCatalogRouter } from "./routes/progressionCatalog.js";
import { gameplayRouter } from "./routes/gameplay.js";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRouter);
app.use("/api/worlds", worldsRouter);
app.use("/api/characters", charactersRouter);
app.use("/api/crews", crewsRouter);
app.use("/api/fleets", fleetsRouter);
app.use("/api/items", itemsRouter);
app.use("/api/missions", missionsRouter);
app.use("/api/combat", combatRouter);
app.use("/api/arcane-network", arcaneNetworkRouter);
app.use("/api/domain-rules", domainRulesRouter);
app.use("/api/fusion", fusionRouter);
app.use("/api/catalogs", catalogsRouter);
app.use("/api/esper", esperRouter);
app.use("/api/bijuu", bijuuRouter);
app.use("/api/otsutsuki", otsutsukiRouter);
app.use("/api/world-crystals", worldCrystalsRouter);
app.use("/api/villages", villagesRouter);
app.use("/api/clans", clansRouter);
app.use("/api/regions", regionsRouter);
app.use("/api/world-encounters", worldEncountersRouter);
app.use("/api/progression", progressionCatalogRouter);
app.use("/api/gameplay", gameplayRouter);

app.listen(PORT, () => {
  console.log(`Project Nexus API läuft auf http://localhost:${PORT}`);
});
