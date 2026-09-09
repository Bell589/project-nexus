# Project Nexus – aktueller V1-Status (07.09.2026)

## Aufgeräumt
- provisorische `v1*`-Dateinamen entfernt und in Gameplay-Struktur überführt
- leere npm/Shell-Artefakte entfernt
- alte Planungs-/Zwischenstatusdateien entfernt
- veraltete Quincy-Reste aus aktiven Daten entfernt
- keine Datenbank eingeführt; In-Memory-Struktur bleibt bestehen

## Frontend
- neue responsive Sidebar mit Gruppen für Charakter, Welt, Politik und Wirtschaft
- weltabhängige Sidebar-Einträge für Dorf, Crew/Flotte und Knight-Fusion
- Topbar mit Kampfkraft, Energie und Gold
- einheitliches Dark-RPG-Grundlayout
- Login, Charakterauswahl, Weltwahl und Charaktererstellung optisch überarbeitet
- Charaktererstellung folgt jetzt Welt → Rasse → Clan → Charakter → Origin
- Ozeanwelt startet neutral; Pirat/Marine wird nach Origin gewählt
- bestehende Seiten für Fähigkeiten, Training, Inventar, Missionen, Reisen, Events, Combat, Gebiete, Organisationen, Shop und Marktplatz bleiben erreichbar

## Backend / Gameplay
- bestehende Combat-, Unique-Power-, Clan-, Esper-, Bijū-, Karma-, Spektralritter-, Village-, Region-, Crew-/Fleet- und Encounter-Systeme bleiben erhalten
- Gameplay-Routen für Origin, Stats, Mastery, Reisen, Shop, Marktplatz, Organisationen, DEV-Hilfen und Ozean-Fraktionsentscheidung
- Gold, Energie, Stats, Origin, Wanted-State und Ability-Mastery bleiben Teil des Character-Modells

## Validierung
- Backend TypeScript: erfolgreich
- Frontend TypeScript: erfolgreich
- Backend-Smoke-Test: `/health`, Welten, Origins und Ozean-Origin → Piratenwahl erfolgreich
- Vite-Bundle konnte in der Arbeitsumgebung nicht vollständig laufen, weil die verfügbaren Abhängigkeiten aus dem ursprünglichen Windows-Projekt stammen und das Linux-Rollup-Binary fehlt. Lokal nach sauberem `npm install` ausführen: `npm run build`.

## Bewusst noch offen
Die im Konzept ausdrücklich offenen Punkte bleiben offen: finale Esper/Götter-Lore, endgültiger Magierrassenname, finale ägyptische Clanmagien, komplette Hollow-Hierarchie, finale Balanceformeln, vollständige Grid-Kampfengine und endgültige Kriegsbalance.
