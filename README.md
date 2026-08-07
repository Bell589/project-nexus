# Project Nexus — Grundgerüst

<<<<<<< HEAD
=======
Das Projekt ist ein Textbasiertes RPG Brwosegame. Es ist mein Erster Versuch und befindet sich aktuell noch im Aufbau. 
Zum Starten im Terminal einmal im ordner Backend "npm run dev" der dann im port http://localhost:3001 ausgeführt wird und im ordner Frontend "npm run dev" ebenfalls ausführen der läuft dann im browser unter http://localhost:5173 wo er auch zu öffnen ist, geht aber direkt in der IDE im Terminal Auf den link "http://localhost:5173" mit STRG und links klick öffnen. Bisher läuft das alles aber nur Local.

>>>>>>> ceb239cbbf7ccafb3acc472e15135d2d12f05e53
Monorepo (npm workspaces): `backend` (Express + TypeScript, In-Memory-Store) und
`frontend` (React + Vite + TypeScript).

## Ordnerstruktur

```
project-nexus/
├── package.json              # Root, npm workspaces
├── backend/
│   ├── src/
│   │   ├── index.ts          # Express Server Entry Point
│   │   ├── types/            # World, Faction, Character, Kampfkraft
│   │   ├── data/              # Seed-Daten: 3 Welten, 6 Fraktionen
│   │   ├── db/                 # In-Memory-Store (später durch echte DB ersetzen)
│   │   ├── services/            # Business-Logik (Charaktererstellung, Kampfkraft)
│   │   └── routes/               # /api/worlds, /api/characters
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.tsx            # State-Flow: Welt → Fraktion → Erstellung → Dashboard
    │   ├── pages/               # WorldSelect, FactionSelect, CharacterCreate, Dashboard
    │   ├── api/client.ts          # fetch-Wrapper für Backend
    │   └── types/models.ts         # Frontend-Typen (Spiegel des Backends)
    └── package.json
```

## Was ist bereits umgesetzt

- **3 Welten** (Ozeanwelt, Soul Society, Avalon) mit **6 Fraktionen**, jede mit
  eigenem Kernmacht-Label und eigenem Entwicklungspfad (Relikt-Stufen,
  Seelenwaffe/Resurrección/Complete-Stufen, Magie-Stufen) — direkt aus deinem
  Dokument übernommen.
- **Kampfkraft-System**: aggregiert aus Erfahrung, Ausrüstung, Fähigkeiten,
  Systembeherrschung, Erfolgen, Training — gewichtet, keine feste Obergrenze.
  Im Frontend trainierbar (+10 pro Klick und Komponente).
- **Kernmacht-Erwerb & Entwicklung**: Charakter startet ohne Kernmacht, muss
  erst genug Kampfkraft sammeln (Schwelle 20), dann eigenen Archetyp + Namen
  vergeben (z.B. "Relikt des Blitzes" → "Donner des Himmels"). Danach
  Stufenaufstieg gegen steigende Kampfkraft-Schwellen
  (`backend/src/types/corePowerThresholds.ts`), bis "Unbegrenzte
  Weiterentwicklung" erreicht ist.
- **Crew-System** (Ozeanwelt): Charakter gründet Crew (wird Captain) oder
  tritt bestehender Crew der eigenen Fraktion bei. Captain vergibt Rollen
  (Offizier, Kommandant, Stellvertreter, Mitglied) — komplett spielergeführt,
  keine System-Level.
- **Flotten-System** (Ozeanwelt): Crew-Captains können mehrere Crews zu einer
  Flotte zusammenschließen (Backend-Endpunkte fertig, noch ohne Frontend-UI).
- **Charaktererstellung**: Welt wählen → Fraktion wählen → Charakter anlegen.
- **API**: `GET /api/worlds`, `GET /api/worlds/:id/factions`,
  `POST /api/characters`, `GET /api/characters/:id`,
  `POST /api/characters/:id/train`,
  `POST /api/characters/:id/core-power/acquire`,
  `POST /api/characters/:id/core-power/advance`,
  `GET /api/crews`, `POST /api/crews`, `GET /api/crews/:id`,
  `POST /api/crews/:id/join`, `POST /api/crews/:id/roles`,
  `GET /api/fleets`, `POST /api/fleets`, `POST /api/fleets/:id/join`.

## Was bewusst noch fehlt (nächste Schritte)

- Persistente Datenbank (aktuell In-Memory, Daten weg bei Neustart)
- Authentifizierung / Spieler-Accounts
- Flotten-Frontend-UI (Backend fertig)
- Seelenbezirke (Soul Society), Arkanes Netzwerk (Avalon), Territorien
  (Ozeanwelt) als eigene Systeme
- Hollow-Evolution (Gillian→Adjuchas→Vasto Lorde) als eigener Ablauf statt
  generischer Stufenaufstieg
- Fusion-System (Avalon)
- Domänen-System (Soul Society)

## Installation & Start

Voraussetzung: Node.js ≥ 18.

```bash
# 1. Einmalig: alle Dependencies installieren (Root + beide Workspaces)
npm install

# 2. Backend starten (Terminal 1) — läuft auf http://localhost:3001
npm run dev:backend

# 3. Frontend starten (Terminal 2) — läuft auf http://localhost:5173
npm run dev:frontend
```

Frontend proxied `/api/*`-Requests automatisch zum Backend (siehe
`frontend/vite.config.ts`).

## API manuell testen

```bash
curl localhost:3001/api/worlds
curl localhost:3001/api/worlds/soul_society/factions
curl -X POST localhost:3001/api/characters \
  -H "Content-Type: application/json" \
  -d '{"ownerName":"Max","characterName":"Kael","worldId":"avalon","factionId":"magier"}'
```

## Build für Produktion

```bash
npm run build   # baut backend/dist und frontend/dist
```
