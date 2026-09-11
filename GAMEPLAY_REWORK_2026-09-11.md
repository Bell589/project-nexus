# Projekt Nexus – Gameplay-Rework 11.09.2026

## Ziel
Dieser Durchgang korrigiert die zuletzt zu generisch gewordenen Binding-/Power-Up-Strukturen. Ninja und Spektralritter sollen ihre eigenen Spielregeln besitzen statt nur Varianten einer allgemeinen Kernmacht zu sein.

## Ninja
- Generische Kernmacht-Bindung für Ninja deaktiviert.
- Alte zufällige Dōjutsu-Bindung deaktiviert; Sharingan/Byakugan entstehen über Clantraining und Progression.
- Jeder Ninja wählt genau zwei Chakra-Naturen aus Katon, Suiton, Raiton, Fūton und Doton.
- Element-Jutsu werden nur trainierbar, wenn die passende Chakra-Natur gewählt wurde.
- Sharingan-Copy respektiert die Chakra-Natur: analysieren allein reicht bei Element-Jutsu nicht.
- Academy-/Taijutsu-/Genjutsu-/Clan-/Dōjutsu-Pfade bleiben getrennt von den Naturen.
- Elementarer Testcontent für alle fünf Grundnaturen ergänzt.

## Spektralritter
- Ein Pakt verleiht dem Magier keine Ritterfähigkeiten mehr.
- Ritterfähigkeiten wurden aus dem normalen Magier-Fähigkeitspool entfernt.
- Erst Beschwörung macht den Ritter im Kampf verfügbar.
- Ritter besitzt eigene LP und eigene Energie.
- Ritter besitzt eigenen normalen Angriff und eigene Technik-Aktion.
- Besiegter Ritter kann im selben Kampf nicht erneut beschworen werden.
- Teil- und Vollverschmelzung sind eigene Combat-Aktionen und benötigen entsprechende Paktprogression.
- Fusion wird als eigener Ritterzustand geführt, nicht als generisches Power-Up.

## Referenz N-BG
Öffentliche Websuche bestätigt die Existenz von „NBG – Naruto Browsergame“, lieferte aber keine belastbare öffentlich indexierte Dokumentation seines konkreten Chakra-Natur-/Jutsu-Lernsystems. Deshalb wurden keine unbelegten N-BG-Details kopiert. Das Rework folgt den im Nexus-Auftrag festgelegten Prinzipien und der vom Nutzer beschriebenen Zwei-Naturen-Struktur.

## Bewusst noch offen
- Beschwörungspakte der Ninja (Frösche/Schlangen usw.) als eigener vollständiger Flow.
- Mehr Jutsu pro Natur, Voraussetzungen durch Orte/Meister/Scrolls und Missionsfortschritt.
- Ritter-AI/Positionierung und vollständige unterschiedliche Ritterrollen.
- Erwachte Ritterfusion.
- Ocean und Soul benötigen weiterhin denselben tiefen Bereinigungsdurchgang.

## Buildstatus
`npm install` wurde versucht, überschritt in der Ausführungsumgebung aber das Zeitlimit. Deshalb wird kein erfolgreicher Full-Build behauptet. Teilweise erzeugte `node_modules` wurden vor dem Paketieren entfernt. Eine statische Prüfung auf Konfliktmarker und die neuen Querverweise wurde durchgeführt.
