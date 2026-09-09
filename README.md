# Project Nexus

Monorepo (npm workspaces): `backend` (Express + TypeScript, In-Memory-Store) und
`frontend` (React + Vite + TypeScript).

Architektur-Analyse und Umbauplan (Ausgangspunkt für den großen Umbau):
siehe `ANALYSE_UND_UMBAUPLAN.md`.

## Installation & Start

```bash
npm install

# 2. Backend starten (Terminal 1) — läuft auf http://localhost:3001
npm run dev:backend

# 3. Frontend starten (Terminal 2) — läuft auf http://localhost:5173
npm run dev:frontend
```

## Kernprinzip: Unique Power ist individuell generiert, kein Fixkatalog

`UniquePowerOrigin` (`types/uniquePower.ts`, `data/uniquePowerOrigins.ts`) ist
nur **Kategorie + Möglichkeitsraum** (Varianten-Pool, Namens-Bausteine,
Fähigkeiten-Pool je Stufen-Tier) - niemals ein fertiges Machtpaket. Die
tatsächliche Ausprägung eines Charakters (`UniquePowerInstance`) wird bei
Erwerb und jedem Stufenaufstieg individuell generiert
(`services/uniquePowerGenerationService.ts`): zufällige Variante, generierter
Name, zufällige Teilmenge aus dem Fähigkeiten-Pool. Zwei Charaktere mit
demselben Ursprung können unterschiedlich ausfallen - getestet.

Diese eine Engine wird für **alle** Unique-Power-Systeme wiederverwendet
(Core-Engine-Prinzip): Ozeanwelt-Relikte, Zanpakutō/Resurrección/Complete,
Avalon-Magie, Spektralritter, Ninjutsu-Stile und Dōjutsu laufen alle über
denselben Mechanismus, nur mit unterschiedlichen Daten-Pools.

Ablauf: `POST /:id/core-power/search` würfelt eine Instanz (bindet nichts) →
`POST /:id/core-power/acquire` mit exakt dieser Instanz im Body bindet sie
dauerhaft. Fund und Bindung sind nachweislich identisch (getestet, dazu gab
es einen Bugfix in einer früheren Iteration).

## Vier Welten

**Ozeanwelt** (Piraten/Marine, identisches Machtsystem) — Elementar-/Tier-/
Übermenschliche Relikte, 3 Haki-Formen als lernbare Skills.

**Soul Society** (Shinigami/Hollow/Quincy) — Zanpakutō (mit
Persönlichkeits-Quiz), Resurrección, Complete. Domäne ist die höchste
Freisetzungsstufe, danach nur noch domänengebundene Techniken.

**Avalon** (Magier) — Unique Magie inkl. Magia Erebea, Spektralritter (viele
individuelle, 6 Rollen: Angreifer/Tank/Kontrolle/Support/Mobilität/
Spezialist), **Esper** (exakt 9, weltweit eindeutig, Pakt→Resonanz→
Manifestation→Verschmelzung→Finale Form, inkl. Dominus), Magierfusion
(temporärer Zustand, erzeugt keinen dauerhaften neuen Charakter mehr).

**Ninja-Welt** (Shinobi) — Ninjutsu-Stile (Katon/Suiton/Raiton/Doton/Fuuton),
Dōjutsu als separates Parallelsystem, **Bijū** (exakt 9, weltweit eindeutig,
müssen bekämpft und versiegelt werden), **Jinchūriki**-Entwicklung,
**Baryon Mode** (unumkehrbar - Bijū geht dauerhaft verloren, wird wieder
frei), **Otsutsuki** (einzigartige, verbrauchbare Weltbosse) mit **Karma**-
Fortschritt (0-100%, schaltet gestaffelt Fähigkeiten frei) und **100%-
Reinkarnation** (unumkehrbar - Karma wird danach auf 0 zurückgesetzt).

Alle Namen (Esper, Bijū, Otsutsuki) sind eigene Kreationen, bewusst NICHT aus
bestehendem IP (Final Fantasy, Naruto) übernommen.

## Weltweite Eindeutigkeit

`db/globalUniquenessRegistry.ts` - generischer, Server-weiter Store
(kategorisiert, nicht pro Charakter). Esper und Bijū nutzen ihn für
Bindungen (ein Wesen gehört max. einem Charakter), Otsutsuki nutzt ihn für
"verbraucht" (nach Sieg dauerhaft aus der Welt entfernt). Alles getestet:
Doppelvergabe schlägt nachweislich fehl, Baryon Mode gibt den Bijū
nachweislich wieder frei.

## Kampfsystem

- Ressourcen-Pool statt Kombo-Punkte: **Wille** (Ozeanwelt), **Reiatsu**
  (Soul Society), **Mana** (Avalon), **Chakra** (Ninja-Welt) - technisch
  getrennt, nicht gegeneinander verrechenbar.
- Fähigkeiten unterscheiden Angriff / Technik / Powerup. Powerups wirken als
  mehrrundiger Buff, nicht als Schaden, sofort ab der Aktivierungsrunde.

## Bewusst noch offen / vereinfacht

- **Persistenz**: weiterhin In-Memory, wie abgesprochen zurückgestellt.
- **Esperverschmelzung als dritter, technisch komplett eigener Fusionstyp**
  ist nur teilweise umgesetzt: Der Esper-Pakt selbst existiert vollständig
  (Suche, Prüfung, Stufenaufstieg, Dominus), aber es gibt noch keine
  dedizierte "Espermanifestation"-Kampfmechanik getrennt von der normalen
  Powerup-Nutzung.
- **Ritterverschmelzung** läuft über denselben generischen
  Spezialfähigkeit-Pool wie die Hauptmacht - eine dedizierte
  Begleiter-Aktion (eigener Zug des Ritters im Kampf) ist noch nicht gebaut.
- **Otsutsuki-Kampf** ist ein abstrakter Erfolgswurf (wie Esper-Prüfung),
  kein waffenscheinliches Kampf-Session-Duell.
- **Frontend-UI** für Esper/Bijū/Otsutsuki/Weltenkristalle/Dōjutsu/
  Zanpakutō-Quiz ist nur über die API getestet, es gibt noch keine
  dedizierten React-Seiten dafür (Backend-Priorität wie in der Analyse
  festgelegt: 1. Datenmodell 2. Backend 3. Persistenz 4. Spiellogik 5. API
  6. Frontend 7. UI 8. Content).
- Content-Tiefe ist unterschiedlich: Ozeanwelt am tiefsten ausgearbeitet,
  Soul Society/Avalon/Ninja-Welt mit weniger Fähigkeiten-Kandidaten pro
  Tier/Variante (Mechanik identisch, Umfang wächst noch).
- Otsutsuki/Bijū-Weltkarten-Erscheinung ist aktuell ein einfacher
  "verfügbar ja/nein"-Zustand, keine echte geografische Karten-Integration.

## Update: Kampfmechanik-Fixes + Dörfer/Clans/Waffen (aktuellste Runde)

**Getestet und bestätigt funktionierend:**
- **Haki im Kampf** (Ozeanwelt): `hakiMode` (verstaerkung/dominanz/wahrnehmung) auf Angriff/Verteidigung, prüft trainierten Skill-Level, verweigert ohne Training. Getestet: Angriff mit Verstärkung liefert mehr Schaden als ohne.
- **Domänen-Regeln jetzt kampfwirksam** (Soul Society): "Fliehen unmöglich" blockt Flucht-Aktion, "Heilung deaktiviert" blockt Heil-Powerups, "Schwerthiebe garantiert" entfernt Schadensstreuung nach oben.
- **Ritter muss beschworen werden, bevor er nutzbar ist** (Avalon): neue Aktion `ritter_beschwoeren`, Ritter-Fähigkeiten vorher nachweislich gesperrt, danach nutzbar - getestet.
- **Grundfertigkeiten unabhängig von Unique Power**: neue Aktion `grundfertigkeit` nutzt trainierte Fraktions-Skills (Schwertkampf, Waffenkampf etc.) als Basis-Angriff. Für Shinigami gilt: Schwertkampf-Grundfertigkeit ist erst nutzbar, nachdem die erste Zanpakutō-Freisetzung (Manifestation/Shikai) erreicht wurde - getestet (vorher blockiert, danach nutzbar).
- **Dörfer + Kage-System** (Ninja-Welt): 3 Dörfer (Konoha/Suna/Kiri) mit Genin→Chūnin→Jōnin→Kage-Aufstieg. Ohne amtierenden Kage kann sich jedes Mitglied schrittweise selbst hocharbeiten (Henne-Ei-Problem gefunden und gefixt). Kompletter Aufstieg bis Hokage getestet.
- **Clans** (Uchiha/Uzumaki/Senju): eigene Route `clans/ninjutsu-search` gewichtet die generierte Ninjutsu-Variante nach Clan-Vorliebe und hängt clan-exklusive Techniken an - getestet (Uchiha → Katon-Gewichtung + Uchiha-Flammentechnik bestätigt).
- **Quincy entfernt** aus `worlds.ts` (nicht mehr wählbar), gemäß neuer Spezifikation ("Soul Society = Bleach + Jujutsu Kaisen, ohne Quincy").
- **Avalon ägyptisch reflavored**: Orte umbenannt (Tal der Könige, Pyramide der Zeit, Alexandria, Oasenstadt...), Pharao als höchster Rang ergänzt.
- **Ninja-Waffen** (Kunai, Shuriken-Set, Ninja-Schwert, Kriegssense) als Items ergänzt, nutzen bestehendes Inventar-System.
- **Freie Jutsu**: Ersatzkörper-/Klon-/Transformationsjutsu als für jeden Shinobi trainierbare Skills (unabhängig von Clan/Ninjutsu-Stil).
- **Karte/Spektralwelt sichtbar**: Ninja-Welt-Orte (3 Dörfer, Bijū-/Otsutsuki-Sichtungen) und Spektralwelt-Orte (Schleier, Ritual-/Thronorte für Esper/Ritter) sind jetzt in `data/locations.ts` - erscheinen automatisch auf der bestehenden Karten-Seite, da diese generisch nach `worldId` filtert.

## Bewusst NICHT umgesetzt (ehrlich, aus Zeitgründen)

Die letzte Spezifikation fordert zusätzlich ein komplettes weiteres MMO-Regelwerk, das den Rahmen dieser Runde sprengt:

- **Regionen-Eroberungssystem** (Angriff/Verteidigung/Belagerung/Herrscher-Anwesenheit/Bürgerkrieg) für alle 4 Welten - nicht gebaut. Bestehendes Arkanes-Netzwerk-System (Avalon) ist der einzige Ansatz von "Gebiet beanspruchen" im Projekt.
- **King of Kings / Ring of Kings / Thron der Könige** - komplettes Endgame-Turniersystem, nicht gebaut.
- **Globaler Chat, globale/weltbezogene Ranglisten, Weltübersicht** - nicht gebaut (kein Chat-System im Projekt vorhanden).
- **Weltenwechsel-Freischaltung durch Kristall-Resonanz** - Weltenkristalle existieren (stabilisierbar), aber es gibt noch keine "Reise in andere Welt"-Mechanik, die dadurch freigeschaltet wird.
- **Cross-World-Events/Raids/Turniere** - nur ein einfacher Cross-World-Event-Log bei Kristall-Instabilität vorhanden, keine echten Multi-Welt-Kämpfe.
- **Esper-Finalform mit Weltveränderungs-Effekten, Magier-Beschwörungssystem** (eigenständige Kreaturen wie Golems/Drachen als Begleiter) - nur als Katalog-Fähigkeiten vorhanden, keine dedizierte Beschwörungs-Mechanik.
- **Frontend-UI** für Dörfer/Clans/Esper/Bijū/Otsutsuki/Weltenkristalle - weiterhin nur über die API getestet, keine dedizierten React-Seiten.

Diese Liste ist bewusst vollständig statt beschönigend, damit klar ist, worauf als nächstes priorisiert werden müsste.

## Update: Regionen-Herrschaftssystem (Eroberung, Belagerung, Bürgerkrieg)

Baut auf den bestehenden Locations auf (Inseln, Hauptquartiere, Dörfer) statt
eine Parallelstruktur zu erfinden - funktioniert dadurch sofort für alle
4 Welten. `types/region.ts`, `db/regionControlStore.ts`,
`services/regionService.ts`, Route `/api/regions`.

**Getestet, alle 4 Mechaniken bestätigt:**
- **Beanspruchen**: unbeherrschtes Gebiet wird zum Herrschaftssitz, Charakter wird Herrscher.
- **Herrscher-Anwesenheit** (`presence`-Endpunkt): Herrscher kann Gebiet verlassen.
- **Belagerung bei abwesendem Herrscher**: mehrstufig, +25% pro Erfolg, bei 100% wechselt die Kontrolle - live getestet: 25→50→75→100%, danach neuer Herrscher korrekt gesetzt und `siegeProgress` zurückgesetzt.
- **Direkter Herrscherkampf bei anwesendem Herrscher**: einmalige Entscheidungsschlacht statt Belagerung.
- **Bürgerkrieg/Verrat**: nur wer bereits im Dienst des Herrschers steht (`join-defense`) kann rebellieren, geringere Erfolgschance als offene Belagerung, aber ohne Belagerungs-Umweg - getestet: Verrat ohne Dienst korrekt blockiert, nach Beitritt erfolgreicher Umsturz.

**Bewusst nicht umgesetzt:** Kontrollpunkte/Mehrphasen-Belagerung im Detail
(aktuell ein einzelner Fortschrittswert statt mehrerer Teilziele), Spielerarmeen
als expliziter Truppenkörper (aktuell nur `defenderCharacterIds`-Liste),
Fraktionswechsel als Folge einer Rebellion, King of Kings/Ring of Kings,
globaler Chat, globale Ranglisten, Kristall-Resonanz-Weltenwechsel,
Frontend-UI für Regionen (nur API getestet).


## Konzeptbasis September 2026

Die Charakterarchitektur trennt jetzt ausdrücklich **Welt, Rasse, Clan, Fraktion, Organisation, Rang/Titel und temporäre Blutlinien/Zustände**. Fähigkeiten können ihre Erwerbsart (`SEARCH`, `MASTER_TRAINING`, `CLAN_TRAINING`, `PACT`, `WORLD_ENCOUNTER`, `PROGRESSION`, `EVENT`, `STORY`, `SPECIAL_REWARD`) und Quelle nachvollziehbar speichern.

Neue datengetriebene Grundlagen liegen u.a. in `data/races.ts`, `data/clans.ts`, `data/organizations.ts`, `data/trainers.ts`, `data/discoveries.ts` und `data/worldEncounters.ts`. Spawnchancen, finale ägyptische Clan-Namen, endgültige Esper-/Götter-Lore und Kriegsregeln sind bewusst **nicht finalisiert**; entsprechende Werte/Datensätze sind als Platzhalter bzw. `null` markiert.
