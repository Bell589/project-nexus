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

- **3 Welten** mit **6 Fraktionen**, eigene Kernmacht-Pfade.
- **Kampfkraft-System**: 6 gewichtete Komponenten, per Ausrüstung boostbar.
- **Kernmacht ist jetzt katalogbasiert statt frei eintippbar**: Relikte
  (Ozeanwelt), Zanpakutō/Resurrección-Formen/Complete-Typen (Soul Society je
  Fraktion), Magie-Schulen (Avalon) kommen aus einem festen Katalog
  (`backend/src/data/corePowerArchetypes.ts`). Ablauf: "Suchen" liefert einen
  zufälligen Kandidaten aus dem Katalog der eigenen Welt/Fraktion, "Binden"
  fixiert ihn (nur ein optionaler persönlicher Name bleibt frei wählbar,
  passend zum Doku-Beispiel "Relikt des Blitzes" → "Donner des Himmels").
  Jede Stufe schaltet vordefinierte, im Katalog hinterlegte Fähigkeiten frei
  statt generischer Text-Notizen.
- **Spektralritter-System (neu, Avalon)**: eigener Katalog
  (`backend/src/data/spektralritter.ts`), unabhängig von der einzigartigen
  Magie. Ablauf: suchen → Pakt schließen → Stufenaufstieg (Vertrag →
  Resonanz → Rüstung → Teilverschmelzung → Vollständige Verschmelzung →
  Unbegrenzte Weiterentwicklung), jede Stufe mit vordefinierten Fähigkeiten.
- **Katalog-Endpunkte** zum Nachschlagen: `GET /api/catalogs/core-power-archetypes?worldId=&factionId=`, `GET /api/catalogs/spektralritter`.
- **Crew-/Flotten-System** (Ozeanwelt): gründen, beitreten, Rollen vergeben.
- **Inventar & Ausrüstung**, **Fähigkeiten**, **Missionen**.
- **Kampfsystem mit Sessions**: Rundenkampf mit HP, Aktionen (Angriff,
  Verteidigung, Spezialfähigkeit, Flucht) und Kombo-Zähler — Spezialfähigkeit
  braucht Kombo 2+ und eine erworbene Kernmacht, Verteidigung reduziert
  eingehenden Schaden um 60%, Flucht hat kraftabhängige Erfolgschance.
- **Karte als SVG**: Orte mit Koordinaten, anklickbar, Detailpanel.
- **Arkanes Netzwerk** (Avalon): arkane Knoten beanspruchen, stärkerer Magier
  kann schwächeren verdrängen.
- **Domänen** (Soul Society, Shinigami): ab Seelenwaffen-Stufe "Domäne" eine
  Regel aus dem Domänen-Katalog aktivieren (aktuell nur Anzeige, noch nicht
  mechanisch im Kampf verankert).
- **Fusion** (Avalon, Magier): zwei Charaktere verschmelzen zu einem neuen,
  kombinierte Kampfkraft/Fähigkeiten/Kernmacht, Ausgangscharaktere markiert
  als fusioniert.
- **Startseite**, **Navileiste** mit dynamischen Tabs je Welt (Crew nur
  Ozeanwelt, Fusion nur Avalon).

## Was bewusst noch fehlt / vereinfacht ist

- Persistente Datenbank (aktuell In-Memory)
- Authentifizierung / Spieler-Accounts
- Domänen-Regeln wirken noch nicht mechanisch im Kampfsystem (nur Anzeige)
- "Finden" ist aktuell ein reiner Zufalls-Pull aus dem Katalog, nicht an
  Standorte auf der Karte gekoppelt (z.B. Magie eigentlich ortsgebunden an
  "Orte der Macht" — aktuell global suchbar)
- Kein Uniqueness-Constraint: mehrere Charaktere können denselben Archetyp
  oder Spektralritter finden/binden
- Kampf-Sessions gehen bei Backend-Neustart verloren (wie der Rest der
  In-Memory-Daten)
- Item-Shop/Drops statt manueller `inventory/add`-Testroute
- Esper (die 9 höchsten Wesen der Spektralwelt) noch nicht implementiert

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
