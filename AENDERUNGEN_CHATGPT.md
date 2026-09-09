# Project Nexus – Konzeptumbau 04.09.2026

## Weiterverwendet
- Kampfkraft, Combat, Items/Inventar, Locations, Missionen und Training
- UniquePowerInstance / individuelle Powers
- bestehende Bijū-, Esper-, Ōtsutsuki-, Spektralritter-, Clan- und Region-Systeme
- GlobalUniquenessRegistry für einzigartige Bindungen
- temporäres In-Memory Account-/Session-System

## Neu / strukturell geändert
- Character trennt Welt, Rasse, Clan, Fraktion, Organisationen, Titel/Ränge und temporäre Blutlinien.
- Rassenkatalog für alle vier Welten.
- Weltübergreifendes, datengetriebenes Clanmodell.
- Ninja-Clans geben nur Potenzial; Clan-Fähigkeiten werden nicht automatisch vergeben.
- Clan-Trainingsfortschritt wird in `abilityProgress` gespeichert.
- Magier-Clans sind Arbeitsnamen und aktuell nicht als finale Charakterwahl aktiviert.
- Ability-Erwerbsarten: SEARCH, MASTER_TRAINING, CLAN_TRAINING, PACT, WORLD_ENCOUNTER, PROGRESSION, EVENT, STORY, SPECIAL_REWARD.
- Generische Datenmodelle für Organisationen, Trainer, Discoveries, Pacts und World Encounters.
- Bijū, Ōtsutsuki und Esper sind nur verfügbar, wenn ihre World-Encounter-Instanz aktiv ist.
- Spektralritter/Magical Knights benötigen eine aktive Weltbegegnung; erfolgreiche Pakte werden zusätzlich im generischen `pacts`-Feld gespiegelt.
- Karma ist quellenspezifisch (`karmaStates`) und erzeugt eine temporäre Blutlinie, ohne den normalen Clan zu überschreiben.
- Rassen- und Clan-Auswahl in der Charaktererstellung ergänzt.
- Ninja-Welt im Frontend-WorldId ergänzt.
- Temporäres Account-/Login-System wieder vollständig mit Frontend/API/Backend verbunden.

## Bewusst offen
- endgültige Magierrassen- und Clan-Namen
- endgültige Esper-/Götter-Lore
- Spawnwahrscheinlichkeiten (`null` = noch nicht gebalanced)
- endgültige Kriegs-/Territory-Regeln
- vollständige Master-NPC-, Discovery- und allgemeine Pact-Gameplay-Loops
- Datenbank/Persistenz

## Prüfungen
- Backend TypeScript: erfolgreich
- Frontend TypeScript: erfolgreich
- Backend Runtime-Smoke-Test: `/health`, Progression-Kataloge und World-Encounter-Aktivierung erfolgreich
- Vollständiger Vite-Bundle-Schritt konnte in der Linux-Ausführungsumgebung nicht abgeschlossen werden, da die hochgeladene Windows-`node_modules`-Kopie das Linux-spezifische optionale Rollup-Paket nicht enthält. Das ist kein TypeScript-Fehler. Lokal nach `npm install` sollte `npm run build` den Bundle-Schritt mit den passenden Windows-Abhängigkeiten ausführen.

## Frontend-Ausbau 2026-09-04

Der sichtbare Spielstand wurde an die bereits vorhandenen Backend-Systeme angenähert.

Neu/erweitert im Frontend:
- Navigation für Progression, Weltereignisse, Gebiete und Organisationen.
- Ninja-Dorf inklusive Beitritt und serverseitig geprüften Rangaktionen.
- Clan-Trainingspfade mit Anzeige des getrennten Ability-Progress.
- Anzeige temporärer Blutlinien/Karma und spezieller Entwicklungsbindungen.
- Dōjutsu-Suche, Erwerb und Weiterentwicklung.
- Esper-, Bijū- und Ōtsutsuki-Begegnungen über aktive World Encounters.
- Entwicklungs-Spawnsteuerung für World Encounters, solange Spawnchancen noch bewusst offen sind.
- Weltenkristalle im Frontend.
- Regionskontrolle: beanspruchen, Anwesenheit, Verteidigung, Angriff, Rebellion und Ereignislog.
- Organisationskatalog pro Welt.
- Flottenverwaltung in der bestehenden Crew-Oberfläche.
- Zanpakutō-Quiz als datengetriebene Frontend-Oberfläche; Quizdaten kommen über `/api/catalogs/zanpakuto-quiz`.
- Wiederherstellung des temporären Login-Tokens nach Frontend-Reload.

Bewusst weiterhin nicht final implementiert:
- automatische Encounter-Spawnwahrscheinlichkeiten / Spawn-Timer,
- vollständiger Meister-NPC-Dialog-, Prüfungs- und Trainingsablauf,
- vollständige Discovery-Suche mit Hinweiskette, Reise und Fundzustand,
- finale Kriegs-/Belagerungsregeln,
- finale Magier-Clan- und Esper/Götter-Lore,
- persistente Datenbank.

Prüfung:
- Backend TypeScript: erfolgreich.
- Frontend TypeScript: erfolgreich.
- Backend Runtime-Smoke-Test (`/health`, Progression, World Encounters, Zanpakutō-Quiz): erfolgreich.
- Vite-Bundle in dieser Linux-Arbeitsumgebung nicht möglich, weil die ursprünglichen Windows-node_modules das Linux-Rollup-Optional-Binary nicht enthalten. Lokal `npm install` und danach `npm run build` ausführen.


## 07.09.2026 – V1 Ausbau
Siehe `V1_STATUS_2026-09-07.md`. Ergänzt wurden Stats/Energie/Gold/Origin, Travel, Mastery-Grundlage, Shop, globaler Marktplatz, Spielerorganisationen/Kasse, DEV-Hilfen und die zugehörigen Frontend-Seiten.


## 07.09.2026 – Cleanup + Sidebar
- provisorische V1-Parallelstruktur bereinigt
- neue Sidebar/Topbar und einheitliches Dark-RPG-Layout
- Charaktererstellung ohne vorgezogene Fraktionswahl
- neutraler Ozean-Start mit Fraktionsentscheidung nach Origin
- TypeScript Backend/Frontend erfolgreich geprüft
- Backend-Smoke-Test erfolgreich
