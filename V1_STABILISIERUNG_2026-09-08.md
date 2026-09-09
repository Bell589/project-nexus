# Projekt Nexus – V1 Stabilisierung 08.09.2026

## Behoben / ergänzt
- Statpunkte und Skillpunkte technisch getrennt.
- Doppelte Charakternamen werden blockiert.
- Jeder neue Charakter startet an einem gültigen Ort seiner Welt.
- Reise-RNG wählt für frühe Charaktere keine extremen Weltboss-/Endgame-Gegner mehr.
- Persistente LP-Grundlage ergänzt; Kampf übernimmt LP/Energie und speichert den Zustand zurück.
- Niederlage lässt den Charakter bei 0 LP, aber Rasten heilt LP und Energie vollständig – keine permanente Sackgasse.
- Siege geben zusätzlich eine kleine Goldbelohnung.
- Missionen geben Gold; einmalige Mission-Rewards bleiben durch completedMissionIds geschützt.
- Ninja-Welt besitzt jetzt frühe Missionen und normale Gegner; Soul Society und Avalon zusätzliche Starter-Gegner.
- Heiltrank heilt tatsächlich LP statt dauerhaft Kampfkraft zu schenken.
- Energie-Essenz als zugängliches Regenerationsitem ergänzt.
- Spielerorganisationen: doppelte Namen und parallele Mitgliedschaften blockiert.
- DEV-API ist in NODE_ENV=production deaktiviert; DEV-Sidebar nur in Vite-DEV sichtbar.
- Combat-Frontend synchronisiert Charakter nach Sieg, Niederlage und Flucht.
- Spektralritter-Beschwörung ist im Combat-Frontend erreichbar.
- Keine Merge-Konfliktmarker gefunden.

## Bereits vorhanden und beibehalten
Account/Login, vier Welten, Race/Clan-Trennung, Origins, Stats, Energie, Unique Powers,
Clantraining, Dōjutsu, Zanpakutō, Karma, Bijū/Jinchūriki, Esper, Spektralritter,
Missionen, Reisen, Encounters, Shop, Marketplace, Spielerorganisationen, Regionen,
Dörfer, Crews/Flotten, Sidebar und World-Event-Grundlagen.

## Noch nicht als vollständig abgenommen
Die Spezifikation verlangt u.a. Direct Trade, Organisationslager mit Entnahme/Permissions,
Leader-Missionen mit reservierter Kasse, vollständige Territory-Gruppenschlachten,
Wanted/PvP-Automatik, vollständige Summon-Zweitaktionen, Dodge als eigene Combat-Aktion,
variable Energieinvestition in der laufenden Kampfengine und umfangreiche automatisierte Tests.
Diese Punkte wurden nicht als fertig markiert, wenn die aktuelle Architektur sie nur vorbereitet.

## Build/Test
Ein `npm install` wurde in der Ausführungsumgebung versucht, konnte innerhalb des Tool-Zeitlimits
nicht vollständig abgeschlossen werden. Daher wird kein erfolgreicher Full-Build behauptet.
Statische Konsistenzprüfung: keine Konfliktmarker; kritische neue Daten/Typen/Guards vorhanden.
Lokal bitte `npm install` und danach `npm run build` ausführen.
