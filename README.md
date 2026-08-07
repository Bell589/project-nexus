# Project Nexus — Grundgerüst

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

- **3 Welten** mit **6 Fraktionen**, eigene Kernmacht-Pfade (Relikt-, Seelenwaffe/Resurrección/Complete-, Magie-Stufen).
- **Kampfkraft-System**: 6 gewichtete Komponenten, keine feste Obergrenze, per Ausrüstung boostbar.
- **Kernmacht-Erwerb & Stufenaufstieg** gegen steigende Kampfkraft-Schwellen.
- **Crew-/Flotten-System** (Ozeanwelt): gründen, beitreten, Rollen vergeben, Flotten bilden.
- **Inventar & Ausrüstung**: Item-Katalog, ausrüsten/ablegen, Verbrauchsgüter benutzen — Ausrüstungsboni fließen in Kampfkraft ein.
- **Fähigkeiten**: Fraktions-Grundfähigkeiten trainierbar, Stufe gedeckelt durch Fähigkeiten-Kampfkraft.
- **Karte**: Orte pro Welt (Inseln, Seelenbezirke, Orte der Macht, Ley-Linien-Knoten) — aktuell Listendarstellung, keine echte Grafik.
- **Missionen**: pro Welt, mit Mindest-Kampfkraft und Belohnungen (Kampfkraft-Komponenten + optional Item).
- **Kampfsystem**: vereinfachtes PvE gegen Gegner-Katalog, Sieg-Chance aus Kampfkraft-Verhältnis, kein Aktions-/Kombosystem.
- **Startseite** mit Pitch + Einstieg, **Navileiste** mit Tabs (Übersicht, Inventar, Fähigkeiten, Karte, Missionen, Kampf, Crew).

## Was bewusst noch fehlt (nächste Schritte)

- Persistente Datenbank (aktuell In-Memory)
- Authentifizierung / Spieler-Accounts
- Echtes Kampfsystem mit Aktionen/Kombos statt Wahrscheinlichkeits-Roll
- Echte Kartengrafik/Koordinaten statt Listenansicht
- Hollow-Evolution, Domänen-System, Arkanes Netzwerk als eigene interaktive Systeme
- Fusion-System (Avalon)
- Item-Shop/Drops statt manueller `inventory/add`-Testroute

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
