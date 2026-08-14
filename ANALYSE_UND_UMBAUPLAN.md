# Project Nexus — Analyse & Umbauplan

Status: **Phase 1-3 abgeschlossen (Analyse, Problemliste, Zielarchitektur). Noch kein Code geändert.**

---

## 1. Analyse des bestehenden Projekts

Aktueller Stand: Node/Express-Backend (TypeScript, In-Memory-Store) + React/Vite-Frontend.
~1000 Zeilen Daten, ~1024 Zeilen Services, ~520 Zeilen Routen, dazu Typdefinitionen und Frontend.

Bereits vorhanden und funktionsfähig:

| Bereich | Datei(en) | Zustand |
|---|---|---|
| Charakter-Grundgerüst | `types/character.ts`, `services/characterService.ts` | funktioniert |
| Kampfkraft (kein Level) | `types/kampfkraft.ts` | **entspricht bereits der Spec** — gewichtete Summe, keine Obergrenze |
| Welten/Fraktionen | `types/world.ts`, `types/faction.ts`, `data/factions.ts` | funktioniert, aber Stufennamen sind statisch pro Fraktion |
| Kernmacht-Katalog | `types/corePowerArchetype.ts`, `data/corePowerArchetypes.ts` (525 Zeilen) | **architektonischer Hauptkonflikt**, siehe Abschnitt 3 |
| Fähigkeiten-Typ (Angriff/Technik/Powerup) | `types/ability.ts` | Grundidee gut, aber an das falsche Datenmodell gekoppelt |
| Spektralritter-Pakt | `types/spektralritter.ts`, `services/spektralritterService.ts` | funktioniert strukturell, aber ebenfalls statischer Katalog statt individueller Wesen |
| Domänen (Soul Society) | `services/domainService.ts`, `data/domainRules.ts` | Grundprinzip (Regeln statt reiner Schaden) schon vorhanden |
| Kampfsystem | `services/combatService.ts` (251 Zeilen) | Session-basiert, Ressourcen-Pool (Wille/Reiatsu/Mana), Powerup-Tracking — solide Basis, braucht aber Erweiterung um Begleiter-Aktionen und individuelle Fähigkeiten |
| Crew/Flotte | `services/crewService.ts`, `services/fleetService.ts` | **entspricht bereits der Spec** — nur Spieler, keine NPC-Crews, Rollen spielerbestimmt |
| Fusion (Magier) | `services/fusionService.ts` | erzeugt aktuell einen **dauerhaften** neuen Charakter — Spec verlangt **temporäre** Fusion |
| Ränge | `Character.selfAssignedRank` | **entspricht bereits der Spec** — komplett von Kampfkraft getrennt |
| Inventar/Ausrüstung | `services/inventoryService.ts` | funktioniert, unabhängig vom Rest |
| Karte/Orte | `data/locations.ts` | vorhanden, aber nur 3 der genannten Welten (keine Spektralwelt als eigene Ebene) |
| Persistenz | `db/*Store.ts` | **reines In-Memory**, kein Neustart-sicherer Zustand |
| Esper | — | **nicht vorhanden** |
| Weltenkristalle / Äther / Cross-World | — | **nicht vorhanden** |
| Zanpakutō-/Waffen-Persönlichkeitsanalyse | — | **nicht vorhanden** |

---

## 2. Liste der vorhandenen Systeme (Bestandsaufnahme)

1. Charakter-Erstellung (Welt → Fraktion → Charakter)
2. Kampfkraft-Berechnung (6 gewichtete Komponenten)
3. Kernmacht-Erwerb: Suchen → Binden aus statischem Katalog
4. Stufenaufstieg der Kernmacht gegen Kampfkraft-Schwellen
5. Fähigkeiten-Typisierung: Angriff / Technik / Powerup (+ `requiresActivePowerup`, `resourceCost`)
6. Spektralritter-Pakt (separat von Kernmacht, eigene Stufenliste)
7. Domänen-Regelwahl (Soul Society, kosmetisch, noch nicht kampfwirksam)
8. Kampfsystem mit Sessions: HP, Ressourcen-Pool, aktive Powerups mit Dauer
9. Crew-/Flottensystem (Ozeanwelt)
10. Fraktions-Grundfähigkeiten (inkl. 3 Haki-Formen als trainierbare Skills)
11. Inventar/Ausrüstung mit Kampfkraft-Boni
12. Missionen, Karte (SVG mit Koordinaten), Gegner-Katalog
13. Fusion zweier Magier → neuer Charakter (dauerhaft)
14. Arkanes Netzwerk (Avalon, Knoten beanspruchen)

---

## 3. Fehlerhafte / veraltete Systeme gegenüber der neuen Spezifikation

### 3.1 Kernkonflikt: Statischer Kernmacht-Katalog widerspricht dem Unique-Power-Prinzip

**Das ist der wichtigste Befund.**

Aktuell (`corePowerArchetypes.ts`): Ein Charakter "findet" einen von ~16 fest definierten Einträgen (z.B. `raiun` = "Raiun", Blitz-Relikt, mit exakt vordefinierten `abilitiesByStage`). **Jeder Charakter, der "Raiun" findet, bekommt identische Fähigkeiten in identischer Reihenfolge.**

Spec (Abschnitt 3, 11, 16, 29, 62) verlangt explizit das Gegenteil:

> "Zwei Spieler können beide Blitzkräfte besitzen. Sie müssen trotzdem vollkommen unterschiedliche Fähigkeiten und Entwicklungswege besitzen können."
> "Ein statischer Archetyp darf höchstens als Kategorie/Ursprung/Generator-Input dienen. Er darf NICHT die komplette individuelle Charakterentwicklung bestimmen."

**Konsequenz:** `CorePowerArchetype` muss von "fertiges, komplettes Machtpaket" zu "Ursprungs-Kategorie + Fähigkeiten-Pool als Generator-Input" umgebaut werden. Die tatsächliche Instanz pro Charakter (`Character.corePower`) muss eine **individuell generierte Ausprägung** sein: eigener Name, eigene Reihenfolge/Auswahl an Fähigkeiten, die sich aus einem größeren Möglichkeitsraum entwickelt statt eine fixe Liste abzuarbeiten.

Betrifft alle vier Unique-Systeme gleichermaßen: Relikte, Zanpakutō/Resurrección/Complete, Unique Magie, Spektralritter.

### 3.2 Zanpakutō ohne Persönlichkeits-/Kampfstil-Ermittlung

Spec Abschnitt 16 verlangt eine Art Quiz/Analyse (Persönlichkeit, Entscheidungen, Kampfstil), aus der die individuelle Waffe entsteht. Aktuell: reine Zufallsauswahl aus 3 Katalogeinträgen pro Fraktion. Muss durch einen Generierungs-Flow ersetzt werden, der Spielerentscheidungen als Eingabeparameter nimmt.

### 3.3 Bankai als "einzelner Skill" statt eigenes System

Aktuell ist "Domäne" eine Stufe mit einem Powerup + gated Techniken innerhalb der fixen Katalogliste — strukturell nah dran, aber weil sie am statischen Katalog hängt, ist sie nicht individuell erweiterbar im Sinne von Abschnitt 17/18. Muss auf das neue individuelle Unique-Power-Modell umgezogen werden, Grundprinzip (Domäne = Regeln, nicht nur Schaden) bleibt erhalten.

### 3.4 Magierfusion erzeugt dauerhaften Charakter

Spec Abschnitt 44: "Die Fusion erzeugt einen neuen, **temporären** mächtigen Magier." Aktuell (`fusionService.ts`): legt einen dauerhaft in `CharacterStore` gespeicherten neuen Charakter an, Ursprungscharaktere werden über `fusedInto` stillgelegt. Muss zu einem **kampf-/zeitgebundenen** Zustand umgebaut werden (ähnlich einem Powerup auf Charakterpaar-Ebene, kein separater dauerhafter Store-Eintrag).

### 3.5 Drei Fusionsarten nicht sauber getrennt

Aktuell existiert nur Magier+Magier (Fusion) und Magier+Ritter (Spektralritter-Pakt-Verschmelzung, als Teil des Pakt-Stufensystems). Magier+Esper (Espermanifestation) fehlt komplett. Spec fordert explizit drei **technisch getrennte** Systeme (Abschnitt 45). Aktuell sind Ritterverschmelzung und Kernmacht-Fortschritt im selben `Ability`/`activePowerup`-Mechanismus verankert — das ist für Ritter ok, muss für Esper als eigener, strukturell identischer aber unabhängiger Pfad ergänzt werden.

### 3.6 Esper-System fehlt vollständig

Keine Datei, kein Store, keine Unique-Constraint-Logik. Muss komplett neu gebaut werden inkl. globaler Eindeutigkeitsprüfung (serverweit, nicht pro Charakter).

### 3.7 Spektralwelt nicht als eigene Ebene modelliert

Aktuell taucht "Spektralwelt" nur implizit über Spektralritter/Avalon auf. Spec (Abschnitt 4, 27) verlangt sie als eigenständige vierte Welt/Ebene, eng mit Avalon verbunden (Esper, Spektralritter, Prüfungen leben dort).

### 3.8 Weltenkristalle / Äther / Cross-World-System fehlen vollständig

Keine Datenstrukturen, keine Services. Komplettneubau nötig (Abschnitt 46-50).

### 3.9 Domäne/Regeln nicht kampfwirksam

`activeDomainRuleId` (Regelauswahl wie "Teleportation verboten") ist bisher rein kosmetisch, nicht in `combatService.ts` verankert. Spec verlangt echte Regelwirkung im Kampf.

### 3.10 Persistenz

Reines In-Memory (`Map`-basierte Stores). Spec Abschnitt 55: "Ein Neustart darf die Unique Power nicht neu generieren." Das ist ein **direkter Konflikt mit der bisherigen Projektentscheidung**, zunächst ohne Datenbank zu arbeiten (aus früheren Absprachen in diesem Chat). Ich weise das hier bewusst als offenen Punkt aus, statt eigenmächtig zu entscheiden — siehe Abschnitt 10.

### 3.11 Was NICHT verändert werden muss (bereits konform)

- Kampfkraft-Berechnung (keine Level, gewichtete Summe)
- Ränge getrennt von Kampfkraft (`selfAssignedRank`)
- Hollow-Evolution (`corePower.stageIndex`) getrennt von Hollow-Rang (`selfAssignedRank`) — technisch bereits zwei unabhängige Felder
- Crew nur durch Spieler, keine Solo-/NPC-Crew
- Piraten/Marine besitzen identisches Machtsystem, unterscheiden sich nur organisatorisch
- Domänen-Grundprinzip (Regeln statt reiner Schaden)
- Kampfsystem-Grundgerüst (Sessions, Ressourcen-Pool, Powerup-Tracking mit Dauer) — bleibt als technische Basis erhalten, wird nur an das neue individuelle Fähigkeitsmodell angeschlossen

---

## 4. Zielarchitektur

### Kernidee: Ursprung (statisch) vs. Ausprägung (individuell generiert)

```
UniquePowerOrigin (statisch, Katalog/Generator-Input)
    id, worldId, factionIds, category ("Elementar-Relikt", "Zanpakutō", "Unique Magie", ...)
    elementPool: string[]           // z.B. ["Blitz","Feuer","Eis",...] — Auswahlraum, nicht fixe Zuordnung
    abilityPool: AbilityTemplate[]  // Möglichkeitsraum, aus dem individuell gezogen/entwickelt wird
    stageDefinitions: StageDefinition[]  // Struktur der Entwicklung (Namen der Stufen), OHNE feste Fähigkeitszuordnung

UniquePowerInstance (individuell, persistiert am Charakter)
    originId: string                 // Referenz auf Kategorie
    generatedName: string            // individuell generiert/gewählt bei Erwerb
    element: string                  // aus elementPool gezogen bei Erwerb (Resonanz)
    stageIndex: number
    individualAbilities: Ability[]   // wächst individuell — bei jedem Stufenaufstieg wird aus
                                      // abilityPool + Spielstil-Gewichtung eine Teilmenge gezogen/
                                      // freigeschaltet, nicht die immer gleiche fixe Liste
    developmentLog: string[]         // Historie der individuellen Entwicklung (für "meine Macht ist
                                      // meine eigene Geschichte")
```

Das ersetzt `CorePowerArchetype` (bleibt strukturell ähnlich, wird aber zu `UniquePowerOrigin` mit Pool statt Fixliste) und erweitert `Character.corePower` (wird zu `Character.uniquePower: UniquePowerInstance`).

Gleiches Muster für: Relikte, Zanpakutō, Resurrección, Complete, Unique Magie, Spektralritter-Wesen (der Ritter selbst wird ebenfalls aus einem Pool individuell gezogen statt aus 3 fixen Katalogeinträgen), später Esper (mit zusätzlicher globaler Uniqueness-Schicht).

### Drei getrennte Verschmelzungssysteme (Avalon)

```
RitterVerschmelzung   — an Character.spektralritterPact gebunden (bestehendes Muster, wird an
                         neues UniquePowerInstance-Modell für den Ritter selbst angepasst)
EsperVerschmelzung    — neu: Character.esperPact, referenziert globalen EsperRegistry-Eintrag
Magierfusion          — neu: KEIN dauerhafter Character-Store-Eintrag mehr, sondern ein
                         zeitlich/kampfgebundener FusionState (ähnlich activePowerup, aber auf
                         Paar-Ebene), der nach Kampf/Zeitablauf wieder auflöst
```

### Esper-Registry (globale Eindeutigkeit)

```
EsperRegistry (Server-weiter Singleton-Store, NICHT pro Charakter)
    9 feste Einträge (Ifrit, Shiva, Odin, Leviathan, Titan, Ramuh, Phoenix, Alexander, Bahamut)
    jeder Eintrag: boundToCharacterId: string | null
    claimEsper(characterId, esperId) prüft serverweit: bereits vergeben? → Ablehnung
```

### Spektralwelt als vierte Welt

`WorldId` erweitert um `"spektralwelt"`. Eigene Orte (Prüfungsstätten, Esper-Fundorte), aber kein eigenes Fraktionssystem — nur über Avalon/Magier betretbar (Zugriffsprüfung auf Charakterebene, nicht als eigene wählbare Startwelt).

### Weltenkristalle & Cross-World (neues, unabhängiges System)

```
WorldCrystal { id, worldId, name, stability: number, connectedCrystalIds: string[] }
CrossWorldEvent { id, type, affectedWorldIds: string[], status }
```
Technisch komplett getrennt von Character-/Kampf-Logik, nur lose über `worldId`-Referenzen verbunden — geringes Risiko für bestehenden Code.

### Domänen-Regeln kampfwirksam machen

`CombatSession` bekommt `activeDomainRule: DomainRule | null`, `combatService.performAction` prüft die Regel vor Schadensberechnung (z.B. "Heilung deaktiviert" blockt Heil-Powerups, "Fliehen unmöglich" blockt Flucht-Aktion).

---

## 5. Datenmodelle (Kernänderungen im Überblick)

| Bisher | Wird zu | Grund |
|---|---|---|
| `CorePowerArchetype` (fixe `abilitiesByStage: Ability[][]`) | `UniquePowerOrigin` (Pool statt Fixliste, `elementPool`, `abilityPool`, `stageDefinitions`) | Abschnitt 3.1 |
| `Character.corePower: CorePower` | `Character.uniquePower: UniquePowerInstance` (mit `generatedName`, `individualAbilities`, `developmentLog`) | Abschnitt 3.1 |
| `Spektralritter` (fixer Katalog, 3 Einträge) | `SpektralritterOrigin` (Pool von Persönlichkeiten/Rollen: Angreifer/Tank/Kontrolle/Support/Mobilität/Spezialist) + individuell gezogene `SpektralritterInstance` | Abschnitt 3.1, 35 |
| `Character.spektralritterPact` | bleibt strukturell, referenziert neu `SpektralritterInstance` statt fixen Katalogeintrag | — |
| — | `Character.esperPact: EsperPactInstance \| null` (neu) | Abschnitt 37-43 |
| — | `EsperRegistry` (globaler Store, 9 Einträge) | Abschnitt 39, 56 |
| `fusionService` (dauerhafter Store-Eintrag) | `FusionState` (temporär, an Kampf-/Zeitfenster gebunden, kein `CharacterStore.save`) | Abschnitt 3.4 |
| `WorldId` (3 Werte) | 4 Werte (+ `spektralwelt`) | Abschnitt 3.7 |
| — | `WorldCrystal`, `CrossWorldEvent` (neu) | Abschnitt 3.8 |
| `CombatSession.activePowerup` (einzelner Slot) | bleibt, ergänzt um `activeDomainRule` und Unterstützung für Begleiter-Aktionen (Ritter-eigener Zug, aus dem vorherigen Regelwerk dieses Chats bereits gefordert) | Abschnitt 3.9 |
| In-Memory `Map`-Stores | siehe Abschnitt 10 (offener Punkt) | Abschnitt 3.10 |

---

## 6. Backend-Architektur (neue/geänderte Services)

- `uniquePowerGenerationService.ts` **(neu, zentral)** — ersetzt große Teile von `corePowerService.ts`. Nimmt `UniquePowerOrigin` + Charakterkontext (Spielstil-Signale, falls vorhanden) und erzeugt eine individuelle `UniquePowerInstance`. Wird von allen vier Welten-Systemen wiederverwendet (Ozeanwelt-Relikte, Shinigami-Zanpakutō, Hollow-Resurrección, Quincy-Complete, Avalon-Magie) — **ein** Generator statt vier Spezialfälle, aber mit welt-spezifischen `UniquePowerOrigin`-Pools.
- `zanpakutoQuizService.ts` **(neu)** — Persönlichkeits-/Kampfstil-Fragen, deren Antworten als Gewichtung in `uniquePowerGenerationService` einfließen.
- `esperService.ts` **(neu)** — Suche, Prüfung, Pakt, Verschmelzungsstufen, nutzt `EsperRegistry` für globale Eindeutigkeit.
- `esperRegistry.ts` (Store) **(neu)** — Singleton, unabhängig von `CharacterStore`.
- `magierfusionService.ts` **(umgebaut)** — löst `fusionService.ts` ab, arbeitet mit temporärem `FusionState` statt dauerhaftem Charakter.
- `worldCrystalService.ts`, `crossWorldService.ts` **(neu)**.
- `combatService.ts` **(erweitert, nicht ersetzt)** — Domänen-Regel-Prüfung, Begleiter-Aktionen (Ritter/Esper im Kampf), Anbindung an `individualAbilities` statt fixer Katalog-Fähigkeiten.
- `corePowerService.ts` **(reduziert)** — nur noch Stufenaufstieg-Orchestrierung, Fähigkeits-Erzeugung wandert zu `uniquePowerGenerationService.ts`.

Bestehende, unveränderte Services: `characterService.ts`, `crewService.ts`, `fleetService.ts`, `inventoryService.ts`, `skillService.ts`, `trainingService.ts`, `missionService.ts`, `arcaneNetworkService.ts`, `domainService.ts` (nur um Kampf-Anbindung erweitert).

## 7. Frontend-Architektur (Anpassungen)

- Neue Seiten: `EsperPage`, `SpektralweltPage`, `WorldCrystalPage` (Cross-World-Übersicht).
- `CorePowerPanel.tsx` → `UniquePowerPanel.tsx`: zeigt individuell generierten Namen + individuelle Fähigkeitsliste statt Katalog-Vorschau; "Suchen"-Button wird zu "Resonanz finden" (Generierungsprozess statt Zufallsziehung aus Fixliste).
- Neuer `ZanpakutoQuizFlow` (Mehrschritt-Formular) für Shinigami-Charaktererstellung.
- `CombatPage.tsx`: UI-Bereich für Begleiter-Aktion (Ritter/Esper-Zug) getrennt von Spieler-Aktion, sichtbar nur wenn beschworen und noch nicht vollständig verschmolzen (State-abhängige Anzeige, siehe frühere Anforderung in diesem Chat).
- Generelles UI-Prinzip (Abschnitt 58): Anzeige-Logik muss konsequent prüfen, ob eine Fähigkeit/Stufe/Option dem Charakter bereits zur Verfügung steht — teilweise schon so gebaut (z.B. Powerup-Gating über `requiresActivePowerup`), muss auf alle neuen Systeme übertragen werden.

## 8. Migrationsstrategie

1. Bestehende `data/corePowerArchetypes.ts`-Einträge werden **nicht gelöscht**, sondern zu `UniquePowerOrigin`-Einträgen umgeformt: `abilitiesByStage` wird zu `abilityPool` (gleiche Fähigkeiten, aber als Ziehungs-Pool statt Fixliste), `properName` wird zum Default/Fallback-Namen falls Generierung fehlschlägt.
2. Bereits erzeugte Charaktere (In-Memory, gehen bei Neustart ohnehin verloren — siehe Abschnitt 10) müssen nicht migriert werden, solange keine Persistenz existiert. Sobald Persistenz kommt: einmaliges Migrationsskript, das bestehende `corePower`-Objekte in `uniquePower`-Objekte mit `developmentLog: ["Migriert aus Alt-System"]` überführt.
3. Spektralritter-Katalog analog: 3 feste Ritter werden zu Beispiel-Persönlichkeiten im Pool, aus dem individuelle Ritter gezogen werden.
4. `fusionService.ts` wird schrittweise durch `magierfusionService.ts` ersetzt; alte Route `/api/fusion` bleibt als Alias erhalten, leitet intern um (kein Breaking Change für evtl. vorhandene Testaufrufe).

## 9. Implementierungsreihenfolge (angelehnt an die vorgegebenen 15 Phasen)

1. **Datenmodelle**: `UniquePowerOrigin`, `UniquePowerInstance`, `EsperRegistry`-Typen, `WorldId` um Spektralwelt erweitern
2. **`uniquePowerGenerationService.ts`** als zentraler Generator (Kern der ganzen Umstellung)
3. Ozeanwelt auf neues Modell umziehen (Relikte) + Zanpakutō-Quiz-Grundgerüst für Soul Society vorbereiten
4. Soul Society vollständig umziehen (Zanpakutō/Resurrección/Complete + Quiz-Flow + Domäne kampfwirksam)
5. Avalon: Unique Magie auf neues Modell, Spektralritter-Pool statt Fixkatalog
6. Spektralwelt als vierte Ebene + Esper-System (Registry, Suche, Pakt, Verschmelzung)
7. Magierfusion auf temporären `FusionState` umbauen, Esperverschmelzung als drittes getrenntes System ergänzen
8. Weltenkristalle + Cross-World-Grundgerüst
9. UI-Anpassungen (alle Panels auf neues Modell, neue Seiten)
10. Tests gemäß Abschnitt 64
11. Fehlerbehebung / Politur

## 10. Risiken / mögliche Breaking Changes / offene Entscheidung

- **Persistenz-Konflikt (wichtigster offener Punkt):** Die Spec verlangt Neustart-feste Unique Powers, das Projekt lief bisher bewusst ohne Datenbank. Ich schlage vor, das jetzt zu klären, bevor ich zu bauen anfange, statt eigenmächtig eine Datenbank einzuführen oder die Anforderung zu ignorieren.
- **API-Breaking-Changes:** `/api/characters/:id` liefert künftig `uniquePower` statt `corePower` im Response — jeder bisherige Frontend-Aufruf muss angepasst werden (mache ich mit, ist eingeplant, aber zur Transparenz genannt).
- **Fusion-Verhalten ändert sich sichtbar:** Bisher erzeugte fusionierte Charaktere sind dauerhaft und über `/api/characters` abrufbar — nach dem Umbau nicht mehr. Falls bereits Testdaten darauf aufbauen, gehen die verloren (unkritisch bei In-Memory, aber relevant sobald Persistenz existiert).
- **Umfang:** Das ist der mit Abstand größte Umbau des Projekts bisher (Esper, Weltenkristalle, Cross-World, Zanpakutō-Quiz, individuelle Powergenerierung sind komplette Neubauten, nicht nur Anpassungen). Ich schlage vor, in den in Abschnitt 9 genannten Schritten vorzugehen statt alles in einem Rutsch zu liefern, damit jeder Schritt testbar bleibt.

---

**Wie soll ich weitermachen?** Ich würde mit Schritt 1+2 (Datenmodelle + zentraler Generator) anfangen, da alles andere darauf aufbaut — und vorher kurz deine Entscheidung zur Persistenzfrage (Abschnitt 10) hören, bevor ich lospatiere.
