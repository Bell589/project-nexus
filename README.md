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
- **Fähigkeiten unterscheiden Angriff / Technik / Powerup**, jede mit fester
  Beschreibung (`backend/src/types/ability.ts`). Powerups wirken nicht als
  direkter Schaden, sondern als Buff über mehrere Runden (Schadensbonus +
  reduzierter/immunisierter erlittener Schaden), sofort ab der
  Aktivierungsrunde.
- **Tier-Relikte** folgen jetzt fest der Reihenfolge Mensch-Form → Tier-Form
  (Powerup) → Hybrid-Form (Powerup, Bankai-Äquivalent). **Elementar-Relikte**
  bekommen bei "Erwachen" ein Powerup (Elementform: 1 Runde unantastbar, ggf.
  Tempo-Bonus). **Übermenschliche Relikte** (neue dritte Relikt-Kategorie,
  z.B. "Kalypso", "Aetherion") haben stattdessen einen extrem starken
  Finisher-Angriff statt einer Verwandlung.
- **Shinigami-Stufen umbenannt**: "Manifestation" ist jetzt die erste
  Freisetzungsstufe (Shikai-Äquivalent, Powerup), "Domäne" erst beim vollen
  Release (Bankai-Äquivalent, Powerup + neue Technik gleichzeitig).
- **Hollow Resurrección** und **Quincy Complete** sind jetzt selbst Powerups
  (Transformation) statt reiner Text-Notizen.
- **Magia Erebea** (Avalon): bei "Meisterschaft" der einzigartigen Magie
  schaltet sich zusätzlich ein Powerup frei, das den Anwender vollständig in
  sein Element hüllt, plus eine neue extrem starke Technik.
- **Spektralritter-Pakt**: "Rüstung" ist jetzt die Kraft-Teilungsstufe
  (Powerup, Shikai-Äquivalent) + neue Technik, "Vollständige Verschmelzung"
  das volle Erwachen (Powerup, extrem stark).
- **6 stärkere Testgegner** (300-500 Kampfkraft) über alle 3 Welten, um
  Spezialfähigkeiten wirklich zu fordern.
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
- Esper (die 9 höchsten Wesen der Spektralwelt) - Pakt-System ist
  architektonisch vorbereitet (gleiche Mechanik wie Spektralritter, nur
  stärker), aber noch nicht mit eigenem Katalog umgesetzt
- Fusion zwischen zwei bereits "erwachten" Magiern (nach Magia Erebea) als
  eigener, stärkerer Fusionspfad - aktuelle Fusion ist noch stufenunabhängig
- Die separate Domänen-**Regel**-Auswahl (Teleportation verboten, Heilung
  deaktiviert, ...) ist weiterhin nur Anzeige, nicht im Kampf verankert. Die
  Domäne-**Fähigkeit** selbst (Powerup mit Schaden/Schutz-Buff) wirkt jetzt
  aber mechanisch im Kampf.
- "Finden" ist ein reiner Zufalls-Pull aus dem Katalog, nicht an
  Standorte auf der Karte gekoppelt
- Kein Uniqueness-Constraint: mehrere Charaktere können denselben Archetyp
  oder Spektralritter finden/binden
- Kampf-Sessions gehen bei Backend-Neustart verloren (wie der Rest der
  In-Memory-Daten)
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
