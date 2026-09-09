import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { Notice, Panel, buttonRowStyle } from "../components/Panel";
import type { Character, ClanDefinition, DiscoveryDefinition, MasterTrainerDefinition, UniquePowerInstance } from "../types/models";

export function ProgressionPage({ character, onUpdated }: { character: Character; onUpdated: (c: Character) => void }) {
  const [clans, setClans] = useState<ClanDefinition[]>([]);
  const [trainers, setTrainers] = useState<MasterTrainerDefinition[]>([]);
  const [discoveries, setDiscoveries] = useState<DiscoveryDefinition[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [foundDoujutsu, setFoundDoujutsu] = useState<UniquePowerInstance | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.getClansForWorld(character.worldId), api.getMasterTrainers(character.worldId), api.getDiscoveries(character.worldId)])
      .then(([c, t, d]) => { setClans(c); setTrainers(t); setDiscoveries(d); })
      .catch((e) => setError(e instanceof Error ? e.message : "Progressionsdaten konnten nicht geladen werden"));
  }, [character.worldId]);

  const clan = useMemo(() => clans.find((c) => c.id === character.clanId) ?? null, [clans, character.clanId]);
  const progressFor = (pathId: string) => character.abilityProgress.find((p) => p.abilityId === pathId && p.sourceType === "clan");

  async function train(pathId: string) {
    setError(null); setMessage(null);
    try { const updated = await api.advanceClanTraining(pathId, character.id); onUpdated(updated); setMessage("Clantraining erfolgreich fortgesetzt."); }
    catch (e) { setError(e instanceof Error ? e.message : "Training fehlgeschlagen"); }
  }


  async function searchDoujutsu() { setError(null); try { setFoundDoujutsu(await api.searchDoujutsu(character.id)); } catch (e) { setError(e instanceof Error ? e.message : "Dōjutsu-Suche fehlgeschlagen"); } }
  async function bindDoujutsu() { if (!foundDoujutsu) return; setError(null); try { const updated = await api.acquireDoujutsu(character.id, foundDoujutsu); onUpdated(updated); setFoundDoujutsu(null); setMessage("Dōjutsu erworben."); } catch (e) { setError(e instanceof Error ? e.message : "Dōjutsu-Erwerb fehlgeschlagen"); } }
  async function baryon() { setError(null); try { const result = await api.activateBaryonMode(character.id); onUpdated(result.character); setMessage(result.message); } catch (e) { setError(e instanceof Error ? e.message : "Spezialmodus nicht verfügbar"); } }
  async function reincarnate() { setError(null); try { const result = await api.activateOtsutsukiReincarnation(character.id); onUpdated(result.character); setMessage(result.message); } catch (e) { setError(e instanceof Error ? e.message : "Reinkarnation nicht verfügbar"); } }

  async function advanceSpecial(kind: "dojutsu" | "esper" | "jinchuriki") {
    setError(null); setMessage(null);
    try {
      const updated = kind === "dojutsu" ? await api.advanceDoujutsu(character.id) : kind === "esper" ? await api.advanceEsperPact(character.id) : await api.advanceJinchuriki(character.id);
      onUpdated(updated); setMessage("Entwicklung erfolgreich fortgesetzt.");
    } catch (e) { setError(e instanceof Error ? e.message : "Entwicklung fehlgeschlagen"); }
  }

  return <section>
    <h2>Progression & Training</h2>
    <p>Fähigkeiten werden nach Herkunft getrennt entwickelt. Kampfkraft allein verleiht keine seltenen Spezialfähigkeiten.</p>
    {message && <Notice>{message}</Notice>}{error && <Notice error>{error}</Notice>}

    <Panel title="Clan & Blutlinie">
      {!clan ? <p>Kein dauerhafter Clan. Seltene oder temporäre Blutlinien werden separat geführt.</p> : <>
        <p><strong>{clan.name}</strong> {clan.placeholder ? "· Entwicklungs-Platzhalter" : ""}</p><p>{clan.description}</p>
        {clan.abilityPaths.length === 0 && <p>Für diesen Clan sind noch keine Trainingspfade definiert.</p>}
        {clan.abilityPaths.map((path) => { const progress = progressFor(path.id); const stage = progress ? path.stages[progress.stageIndex] : "noch nicht begonnen"; return <div key={path.id} style={{borderTop:"1px solid #eee",paddingTop:10,marginTop:10}}>
          <strong>{path.name}</strong><p>{path.description}</p><p>Aktuelle Stufe: <strong>{stage}</strong> · Erwerb: Clantraining</p>
          <button onClick={() => train(path.id)}>{progress ? "Training fortsetzen" : "Training beginnen"}</button>
        </div>; })}
      </>}
      {character.temporaryLineages.filter(l=>l.active).map(l=><p key={l.id}>Temporäre Blutlinie: <strong>{l.clanId}</strong> · Quelle: {l.sourceType}/{l.sourceId}{typeof l.progressPct==="number"?` · ${l.progressPct}%`:""}</p>)}
    </Panel>

    <Panel title="Spezialentwicklungen">
      {character.dojutsuState && <div><strong>Dōjutsu:</strong> {character.dojutsuState.name} · {character.dojutsuState.awakened ? `Stufe ${character.dojutsuState.stageIndex}` : "Potenzial"} · Mastery {character.dojutsuState.mastery}%<p>Training und Entwicklung erfolgen im Fähigkeiten-Bereich.</p></div>}
      {character.esperPact && <div style={{marginTop:10}}><strong>Esper-Pakt:</strong> {character.esperPact.esperName} · Stufe {character.esperPact.stageIndex + 1}<div style={buttonRowStyle}><button onClick={()=>advanceSpecial("esper")}>Pakt vertiefen</button></div></div>}
      {character.jinchuriki && <div style={{marginTop:10}}><strong>Jinchūriki:</strong> {character.jinchuriki.bijuuName} · Stufe {character.jinchuriki.stageIndex + 1}<div style={buttonRowStyle}><button onClick={()=>advanceSpecial("jinchuriki")}>Bindung trainieren</button><button onClick={baryon}>Extremen Spezialmodus versuchen</button></div></div>}
      {character.karmaStates.filter(k=>k.active).map(k=><div key={k.otsutsukiId} style={{marginTop:10}}><strong>Karma:</strong> {k.otsutsukiId} · {k.progressPct}% · {k.unlockedAbilityIds.length} freigeschaltete Fähigkeiten<div style={buttonRowStyle}><button onClick={reincarnate}>Reinkarnation / Transformation versuchen</button></div></div>)}
      {!character.doujutsu && !character.esperPact && !character.jinchuriki && character.karmaStates.filter(k=>k.active).length===0 && <p>Noch keine besondere Entwicklungsbindung aktiv.</p>}
    </Panel>

    <Panel title="Seltene Meister" muted>
      {trainers.length === 0 ? <p>Für diese Welt sind noch keine Meisterdaten angelegt.</p> : trainers.map(t=><div key={t.id} style={{marginBottom:14}}><strong>{t.name}</strong><p>{t.description}</p><small>Lehrt: {t.abilityIds.join(", ") || "noch offen"} · Mindest-Kampfkraft: {t.requirements.minKampfkraft ?? "offen"} · Spawnchance: {t.spawnChance ?? "noch nicht gebalanced"}</small></div>)}
      <Notice>Das eigentliche Finden, Ansprechen und Absolvieren von Meisterprüfungen ist als nächster Logikbaustein vorbereitet, aber noch nicht simuliert.</Notice>
    </Panel>

    <Panel title="Entdeckungen & Suche" muted>
      {discoveries.length === 0 ? <p>Keine Discovery-Einträge für diese Welt.</p> : discoveries.map(d=><div key={d.id} style={{marginBottom:14}}><strong>{d.targetType}: {d.targetId}</strong><p>Seltenheit: {d.rarity} · Erwerb: {d.acquisitionMethod}</p>{d.discoveryHints.length>0 && <p>Hinweise: {d.discoveryHints.join(" · ")}</p>}</div>)}
    </Panel>
  </section>;
}
