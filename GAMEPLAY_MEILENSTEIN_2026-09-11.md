# Projekt Nexus – Gameplay-Meilenstein 2026-09-11

## Ziel
Dieser Stand baut auf der aktuellen neuen Nexus-Version auf. Keine Datenbank, keine Level, keine Parallelarchitektur. Fokus: Charakter → Training → Mission → Reise → Kampf → Fähigkeit → Power-Up → Progression.

## P0: 100-LP-Fehler
Ursache war eine doppelte Source-of-Truth: `Character.currentHp` existierte, `CombatService.startCombat()` berechnete `characterMaxHp` und `characterResourceMax` aber erneut aus Stats/Kampfkraft. Zusätzlich wurde `currentHp` bei Charaktererstellung fest mit 100 initialisiert und Ruhe/Heilung verwendeten wieder eigene Formeln.

Behoben:
- `Character.maxHp` ist jetzt persistenter Maximalwert.
- Combat übernimmt exakt `currentHp`, `maxHp`, `energy.current`, `energy.max`.
- Kampfaktionen schreiben LP/Energie sofort zurück.
- Ruhe und Heilitems verwenden `maxHp`.
- LP-Stattraining synchronisiert `maxHp`.

## Gemeinsames Combat
Spielbar/integriert:
- normaler Angriff
- Block als aktive Aktion (kein eigener Angriff; Spezialtechniken brechen stärker durch)
- Dodge als aktive Aktion
- Hit-Check vor Crit; Genauigkeit/Wahrnehmung/Speed wirken mit
- Spezialfähigkeit / Technik
- Jutsu
- Item im Kampf
- Power-Up aktivieren und manuell deaktivieren
- laufende Power-Up-Kosten
- Flucht
- Dōjutsu-Aktivierung
- Haki als Modifier auf Aktionen
- Spektralritter beschwören + eigener Ritter-Angriff

## Ninja
Vorhandener Uchiha/Sharingan-Slice bleibt erhalten und wurde ergänzt.

Neu:
- Hyūga: Byakugan-Potenzial → Clantraining → Erwachen → Aktivierung im Combat.
- Byakugan verändert Wahrnehmung/Dodge und Präzision.
- Jūken und Hakkeshō Kaiten als nicht kopierbare Clan-Techniken.
- Senju: Vitalstrom + Regenerationsfokus als echter trainierbarer Clan-Content.
- Karma-Fähigkeiten werden im Combat-Pool berücksichtigt.
- Jinchūriki-Power-Ups bleiben über den gemeinsamen Power-Up-Mechanismus nutzbar.

Offen:
- vollständige Mangekyō-Personalisierung, Kamui-Positionssystem, Susanoo als eigener Combatant/Schutzkörper, vollständige Bijū-Suchkette.

## Ozeanwelt
Neu/tiefer integriert:
- Haki-Meistertraining ist kein normaler Startskill: Origin muss abgeschlossen sein und der Charakter muss an Goldbucht oder Marine-HQ sein.
- Kenbunshoku kostet Willenskraft und verstärkt aktive Verteidigung/Wahrnehmung.
- Busoshoku kostet Willenskraft und verstärkt offensive Aktionen.
- Haoshoku ist zusätzlich an Erfolge gebunden.
- Combat-UI bietet eigene Haki-Aktionen.
- Relikt-Suche ist an erforschbare Inseln gebunden; kein ortsunabhängiges globales Dropdown mehr.
- bestehende Logia-/Zoan-/Paramecia-artige Relikt-Power-Ups nutzen gemeinsame aktive Combat-States.
- zusätzliche Gegner und Missionen ergänzt.

Offen:
- echte Schiffswerte/Seereise-Events, vollständige Logia-Intangibility mit Haki-Counter, Bounty-Automatisierung.

## Soul Society
- Shinigami-Progressionsanzeige verwendet jetzt Versiegelt → Shikai → Shikai-Meisterschaft → Bankai → Sphäre/Domänen-Meisterschaft.
- vorhandene Zanpakutō-Power-Ups sind echte Combat-Aktionen mit Ressourcenkosten, Unterhalt, sichtbarem State und Deaktivierung.
- Hollow-Resurrección bleibt im selben Core-Power-System; Suche erfordert Origin + mindestens eine abgeschlossene Jagd/Mission.
- zusätzliche Soul-Gegner und Missionen ergänzt.

Offen:
- persönliche Fluchtechnik als eigenes regelbasiertes Subsystem; Bankai-Inhalte der einzelnen Zanpakutō sollten noch expliziter auf Kampfregeln statt Zahlen spezialisiert werden; Hollow-Evolutionsquests.

## Avalon / Magierwelt
- Horus- und Ra-Arbeitsclans sind für die Alpha bei Charaktererstellung spielbar; andere göttliche Clans bleiben bewusst deaktiviert/offen.
- Clantraining bleibt datengetrieben.
- Augen des Horus: nach Clantraining als Combat-State aktivierbar; verbessert Wahrnehmung/Schwachpunktanalyse/Dodge und kostet Äther pro Runde.
- Auge des Ra: offensiver Combat-State mit höheren Ätherkosten.
- Ancient/Unique-Magic-Suche ist nur an Orten der Macht möglich.
- Spektralritter: Beschwörung erzeugt eigene LP; Gegner können den Ritter treffen; Ritter hat einen eigenen Angriffszug; bei 0 LP ist er für den Kampf entfernt.
- bestehende Fusion bleibt erhalten.
- zusätzliche Gegner und Missionen ergänzt.

Offen:
- vollständiges Ritter-Energie-/Moveset-System, Teil-/Voll-/Erwacht-Fusion tiefer differenzieren, persistente Discovery-Hinweise, Esper-Suchflow ohne DEV-Aktivierung.

## Frontend
Überarbeitet:
- Dashboard zeigt LP/maxLP zusätzlich zu Energie.
- Charakterprofil zeigt persistente LP/maxLP.
- Combat zeigt LP/Energie, aktive Dōjutsu/Power-Ups, Unterhaltskosten, Ritter-LP, Haki-Aktionen, Items, Deaktivierung und Ritterzug.
- Training/Fähigkeiten zeigt weltenspezifische Bereiche statt nur technische Grundskills.
- Ninja-Training zeigt Hyūga/Senju zusätzlich zu Uchiha.
- Missionen zeigen Missionsorte und sperren Abschluss, wenn der Charakter nicht dort ist.

## Content
Ergänzt wurden zusätzliche frühe/mittlere Gegner und Missionen für alle vier Welten. Mehrere neue Missionen sind an Orte bzw. Fraktionen gekoppelt, damit Reisen nicht nur kosmetisch ist.

## Tests / Build
Neu: `backend/src/tests/gameplayMilestone.test.ts` mit Tests für:
- exakte LP/maxLP-Übernahme
- exakte Energieübernahme
- Persistenz nach Combat-Aktion
- Combat-Heilitem + maxHP-Cap
- Haki-Training + Willenskraftverbrauch
- Byakugan/Jūken-State-Lock
- Power-Up Aktivierung/Ressource/Deaktivierung

Zusätzlich bleiben die vorhandenen Ninja-Vertical-Slice-Tests bestehen.

Ausführungsstatus in dieser Umgebung:
- Node-Syntaxprüfung aller geänderten Backend-TS-Dateien: erfolgreich.
- TSX/TS-Parserprüfung der geänderten Frontend-Dateien über TypeScript `transpileModule`: erfolgreich.
- Vollständiges `npm install` konnte in der Sandbox nicht beendet werden (Timeout/abgebrochene Dependencies).
- Daher konnten `npm test`, Backend-Build und Vite-Frontend-Build hier nicht seriös als erfolgreich bestätigt werden.

Lokal ausführen:
```bash
npm install
npm test -w backend
npm run build
```

## Bewusst nicht als „fertig“ verkauft
Dieser Meilenstein macht alle vier Welten deutlich spielbarer, erfüllt aber nicht jede langfristige Mechanik vollständig. Insbesondere Mission-Objectives mit echtem Kill-/Collect-Fortschritt, persistente Discovery-Spawns, tiefere Bankai-/Resurrección-Regeln, vollständige Mangekyō-Systeme, komplexe Beschwörungs-KI und Schiffssysteme bleiben Folgearbeit.
