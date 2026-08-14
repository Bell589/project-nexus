# Project Nexus

Monorepo (npm workspaces): `backend` (Express + TypeScript, In-Memory-Store) und
`frontend` (React + Vite + TypeScript).

Ausführliche Architektur-Analyse und Umbauplan: siehe `ANALYSE_UND_UMBAUPLAN.md`.

## Ordnerstruktur

```
project-nexus/
├── backend/src/
│   ├── index.ts
│   ├── types/            # Character, World, Faction, Ability, UniquePower, CombatSession, ...
│   ├── data/              # Seed-Daten: Welten, Fraktionen, Unique-Power-Origins, Gegner, ...
│   ├── db/                  # In-Memory-Store
│   ├── services/              # Business-Logik
│   └── routes/                 # /api/*
└── frontend/src/
    ├── App.tsx
    ├── pages/, components/
    ├── api/client.ts
    └── types/models.ts        # Spiegel des Backends
```

## Kernprinzip: Unique Power ist individuell generiert, kein Fixkatalog

Der wichtigste architektonische Punkt: `UniquePowerOrigin`
(`types/uniquePower.ts`, `data/uniquePowerOrigins.ts`) ist nur **Kategorie +
Möglichkeitsraum** (Element-/Varianten-Pool, Namens-Bausteine,
Fähigkeiten-Pool je Stufen-Tier). Die tatsächliche Ausprägung eines
Charakters (`UniquePowerInstance`, gespeichert in `Character.uniquePower`)
wird bei Erwerb und jedem Stufenaufstieg individuell generiert
(`services/uniquePowerGenerationService.ts`): zufällige Variante, generierter
Name, zufällige Teilmenge aus dem Fähigkeiten-Pool je Stufe. **Zwei
Charaktere mit demselben Ursprung (z.B. beide "Elementar-Relikt") können
unterschiedliche Varianten, Namen und Fähigkeiten bekommen.**

Ablauf: `POST /:id/core-power/search` würfelt eine Instanz und zeigt sie
(bindet noch nichts) → `POST /:id/core-power/acquire` mit exakt dieser
Instanz im Body bindet sie dauerhaft (keine erneute Zufallsziehung — Fund
und Bindung sind identisch, das ist getestet).

Deckt aktuell ab: Ozeanwelt (Elementar-/Tier-/Übermenschliches Relikt, je 4-6
Varianten mit vollem Fähigkeiten-Pool), Soul Society (Zanpakutō, Resurrección,
Complete) und Avalon (Unique Magie) — alle 5 Fraktionen sind vollständig
verdrahtet und getestet. Soul Society/Avalon-Pools sind bewusst noch mit
geringerer Content-Tiefe angelegt als die Ozeanwelt (weniger Kandidaten pro
Tier/Variante) — die Mechanik ist identisch, nur der Umfang wächst noch.

## Kampfsystem

- Rundenbasierte Sessions (`services/combatService.ts`): HP, Aktionen
  (Angriff, Verteidigung, Spezialfähigkeit, Flucht).
- **Ressourcen-Pool statt Kombo-Punkte**: Wille (Ozeanwelt), Reiatsu (Soul
  Society), Mana (Avalon). Kosten skalieren nach Fähigkeits-Art (Powerup 30,
  Technik 20, Angriff-Fähigkeit 15). Die Basis-Aktion "Angriff" ist kostenlos.
- Fähigkeiten unterscheiden **Angriff / Technik / Powerup**
  (`types/ability.ts`). Powerups wirken nicht als Schaden, sondern als
  mehrrundiger Buff (Schadensbonus, Schadensreduktion, ggf. Leben-Bonus),
  sofort ab der Aktivierungsrunde. Manche Techniken sind nur nutzbar, während
  ein bestimmtes Powerup aktiv ist (`requiresActivePowerup`).
- Domänen-Regeln (Soul Society) sind aktuell nur Anzeige, noch nicht
  kampfmechanisch verankert.
- Spektralritter-Begleiteraktionen (eigener Zug im Kampf) sind noch nicht
  umgesetzt — Pakt-Fähigkeiten laufen aktuell über denselben
  Spezialfähigkeit-Pool wie die eigene Kernmacht.

## Weitere Systeme

- Crew-/Flottensystem (Ozeanwelt): nur Spieler, keine NPC-Crews, Rollen
  spielerbestimmt.
- Inventar & Ausrüstung, Missionen, Karte (SVG mit Koordinaten), Fähigkeiten
  (inkl. 3 Haki-Formen für Piraten/Marine: Wahrnehmung, Verstärkung,
  Dominanz).
- Arkanes Netzwerk (Avalon, Knoten beanspruchen).
- Fusion zweier Magier (aktuell dauerhaft, siehe "Bewusst noch offen").

## Installation & Start

```bash
npm install
npm run dev:backend    # Terminal 1, Port 3001
npm run dev:frontend   # Terminal 2, Port 5173
```

## Bewusst noch offen (siehe ANALYSE_UND_UMBAUPLAN.md, Abschnitt 3/9)

- **Persistenz**: weiterhin In-Memory, bewusst zurückgestellt.
- **Esper-System**: komplett neu, noch nicht gebaut (exakt 9, global
  eindeutig, drittes Verschmelzungssystem neben Ritter/Magier).
- **Weltenkristalle / Äther / Cross-World-Gameplay**: noch nicht gebaut.
- **Magierfusion ist noch dauerhaft** statt temporär (Spec verlangt
  zeitgebundene Fusion) — `services/fusionService.ts` erzeugt aktuell einen
  dauerhaften neuen Charakter.
- **Zanpakutō-Persönlichkeits-/Kampfstil-Quiz**: noch nicht gebaut, Variante
  wird aktuell zufällig statt durch Spielerentscheidungen bestimmt.
- **Spektralritter** laufen noch über den alten Fixkatalog
  (`data/spektralritter.ts`), noch nicht auf das Origin/Instance-Muster
  umgezogen.
- **Spektralwelt** als eigene vierte Ebene existiert noch nicht separat.
- Content-Tiefe der Soul-Society-/Avalon-Pools ist geringer als die der
  Ozeanwelt (weniger Fähigkeiten-Kandidaten pro Tier/Variante).
