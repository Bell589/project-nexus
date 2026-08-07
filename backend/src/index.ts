import express from "express";
import cors from "cors";
import { worldsRouter } from "./routes/worlds.js";
import { charactersRouter } from "./routes/characters.js";
import { crewsRouter } from "./routes/crews.js";
import { fleetsRouter } from "./routes/fleets.js";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/worlds", worldsRouter);
app.use("/api/characters", charactersRouter);
app.use("/api/crews", crewsRouter);
app.use("/api/fleets", fleetsRouter);

app.listen(PORT, () => {
  console.log(`Project Nexus API läuft auf http://localhost:${PORT}`);
});
