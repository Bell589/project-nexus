# Projekt Nexus – Gameplay-Tiefe / Ninja Vertical Slice (09.09.2026)

## Tatsächlich umgesetzt
- Ninja-Techniken sind jetzt eigene datengetriebene Gameplay-Definitionen mit Kategorie, Element, Kosten, Erwerbsweg, Copy-Regel, State-Lock und Mastery.
- Academy-Origin lernt echte Grundtechniken: Bunshin/Henge, danach Kawarimi/Shurikenjutsu.
- Fähigkeiten-Seite wurde für Ninja in einen spielerischen Trainingsbereich umgebaut: Jutsu-Karten, Chakra-Kosten, Mastery, Sperrgründe, Clantraining, Sharingan-Entwicklung und analysierte Techniken.
- Uchiha startet nicht mit fertigem Sharingan: Clantraining -> Potenzial -> Erwachen -> 1/2/3 Tomoe -> Mangekyō-Teststufe.
- Sharingan besitzt eigenen State und Mastery und ersetzt für den Uchiha-Flow die alte zufällige generische Dōjutsu-Suche.
- Combat: Sharingan-Aktivierung ist eine echte Aktion, kostet 12 Chakra, hat 4 Chakra Unterhalt/Runde und ist sichtbar.
- Combat: Dodge ist eine echte Aktion; Speed und Sharingan-Wahrnehmung beeinflussen die Chance, aber sie ist gedeckelt.
- Combat: Block bleibt eigene Aktion und reduziert eingehenden Schaden.
- Gelernte Ninja-Jutsu sind im Combat auswählbar, verbrauchen Chakra und erhöhen bei Nutzung Mastery.
- Genjutsu-Grundlage: Kasumi/Sharingan-Genjutsu stören gegnerische Trefferleistung für mehrere Runden.
- Sharingan analysiert gegnerische Spezialtechniken; Analysefortschritt, Seen-Count und Copy-Status werden gespeichert.
- Copy respektiert `copyable`; Chidori ist kopierbar, Sharingan-Genjutsu nicht.
- Vollständig analysierte kopierbare Meistertechnik kann anschließend über Training gelernt werden.
- Charakterprofil zeigt Dōjutsu-Entwicklung/Mastery statt nur technische Flags.
- Combat synchronisiert Charakter nach jeder Aktion, damit Chakra/Mastery ohne Reload sichtbar werden.

## Testcontent
Basic: Bunshin, Kawarimi, Henge, Shurikenjutsu. Katon: Gōkakyū, Hōsenka. Genjutsu: Kasumi + Sharingan-Genjutsu. Meister: Rasengan, Chidori. Mangekyō-Testtechnik: Amaterasu als nicht kopierbare, state-locked Entwicklungsfähigkeit.

## Automatisierte Tests ergänzt
`backend/src/tests/ninjaVerticalSlice.test.ts`: Academy-Unlock, Sharingan-Potenzial/Erwachen/Aktivierung, Chakra-Kosten, State-Lock, Copy vs. nicht-copyable sowie Block/Dodge-Aktion. `npm test` wurde im Backend-Script ergänzt.

## Nicht als fertig behauptet
- Academy-Abschluss ist noch nicht zwingend an einen konkreten Prüfungskampf gekoppelt.
- Travel entdeckt Meister aktuell nur als Encounter-Feedback; persistente Trainer-Discovery/Trainingsbeziehung ist noch nicht vollständig verbunden.
- Enemy-Jutsu besitzen noch kein vollständiges eigenes KI-Moveset; die Sharingan-Analyse hängt derzeit an gegnerischen Spezialaktionen und Test-Technikzuordnung.
- Mangekyō-Personalabilities, Amaterasu-DOT, Kamui und Susanoo sind noch nicht vollständig mechanisch umgesetzt.
- Byakugan ist noch nicht als gleich tiefer zweiter Dōjutsu-Vertical-Slice umgesetzt.
- Missionen sind noch nicht durchgehend objektivbasiert (Kill/Travel/Use-Ability).
- Variable Energieinvestition und Summon-Zweitaktionen bleiben offen.

## Build/Test-Hinweis
Die Umgebung enthält keine installierten Projektabhängigkeiten. Der globale TypeScript-Check findet deshalb erwartbar fehlende Module (`express`, `react`, `nanoid` usw.). Nach Herausfiltern dieser Dependency-/React-Typfehler wurden für die neu ergänzten Backend-Dateien keine weiteren TypeScript-Fehler gemeldet. Ein echter `npm test`/`npm run build` kann erst nach `npm install` vollständig ausgeführt werden.
