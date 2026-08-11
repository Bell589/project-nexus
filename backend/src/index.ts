import express from "express";
import cors from "cors";
import { worldsRouter } from "./routes/worlds.js";
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

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
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

app.listen(PORT, () => {
  console.log(`Project Nexus API läuft auf http://localhost:${PORT}`);
});
