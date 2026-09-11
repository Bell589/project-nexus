import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Ability, Character, CombatAction, CombatSession, Enemy } from "../types/models";

function HpBar({ label, hp, maxHp }: { label: string; hp: number; maxHp: number }) {
  const pct = Math.max(0, Math.min(100, (hp / maxHp) * 100));
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 13, marginBottom: 2 }}>
        {label}: {Math.round(hp)} / {maxHp}
      </div>
      <div style={{ background: "#eee", borderRadius: 4, height: 10, overflow: "hidden" }}>
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: pct > 50 ? "#2a7" : pct > 20 ? "#e90" : "#c33",
            transition: "width 0.2s",
          }}
        />
      </div>
    </div>
  );
}

function ResourceBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 13, marginBottom: 2 }}>
        {label}: {Math.round(value)} / {max}
      </div>
      <div style={{ background: "#eee", borderRadius: 4, height: 8, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "#66c", transition: "width 0.2s" }} />
      </div>
    </div>
  );
}

function abilityCost(a: Ability): number {
  if (a.resourceCost !== undefined) return a.resourceCost;
  if (a.kind === "powerup") return 30;
  if (a.kind === "technik") return 20;
  return 15;
}

function abilityUsable(a: Ability, session: CombatSession): { usable: boolean; reason?: string } {
  const cost = abilityCost(a);
  if (a.requiresActivePowerup && session.activePowerup?.name !== a.requiresActivePowerup) {
    return { usable: false, reason: `erfordert "${a.requiresActivePowerup}" aktiv` };
  }
  if (session.characterResource < cost) {
    return { usable: false, reason: `zu wenig ${session.resourceLabel} (${cost} nötig)` };
  }
  return { usable: true };
}

const ACTIONS: { id: CombatAction; label: string }[] = [
  { id: "angriff", label: "Angriff" },
  { id: "verteidigung", label: "Block / Verteidigung" },
  { id: "ausweichen", label: "Ausweichen" },
  { id: "spezialfaehigkeit", label: "Spezialfähigkeit" },
  { id: "flucht", label: "Flucht" },
];

export function CombatPage({
  character,
  onUpdated,
}: {
  character: Character;
  onUpdated: (c: Character) => void;
}) {
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [session, setSession] = useState<CombatSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.getEnemies(character.id).then(setEnemies).catch((e) => setError(e.message));
  }, [character.id]);

  async function start(enemyId: string) {
    setBusy(true);
    setError(null);
    try {
      setSession(await api.startCombat(enemyId, character.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setBusy(false);
    }
  }

  async function act(action: CombatAction, abilityName?: string, hakiMode?: "verstaerkung"|"dominanz"|"wahrnehmung") {
    if (!session) return;
    setBusy(true);
    setError(null);
    try {
      const updated = await api.combatAction(session.id, action, abilityName, hakiMode);
      setSession(updated);
      const refreshed = await api.getCharacter(session.characterId);
      onUpdated(refreshed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setBusy(false);
    }
  }

  if (session && session.status !== "laufend") {
    return (
      <section>
        <h2>Kampf</h2>
        <div
          style={{
            border: `1px solid ${session.status === "gewonnen" ? "#2a7" : "#c33"}`,
            borderRadius: 8,
            padding: 16,
          }}
        >
          <strong>
            {session.status === "gewonnen" && "Sieg!"}
            {session.status === "verloren" && "Niederlage."}
            {session.status === "geflohen" && "Geflohen."}
          </strong>
          <RoundLog session={session} />
          <button style={{ marginTop: 12 }} onClick={() => setSession(null)}>
            Zurück zur Gegnerliste
          </button>
        </div>
      </section>
    );
  }

  if (session) {
    const enemy = enemies.find((e) => e.id === session.enemyId);
    const karma=character.karmaStates.find(k=>k.active);
    const karmaAbilities:Ability[]=karma?[
      ...(karma.progressPct>=10?[{name:"Karma-Chakra-Kontrolle",kind:"technik" as const,description:"Verbesserte Chakra-Kontrolle durch Karma."}]:[]),
      ...(karma.progressPct>=50?[{name:"Karma-Raumriss",kind:"powerup" as const,description:"Raum-Zeit-Kraft des Karma.",powerup:{rounds:2,damageBonusPct:.3,incomingReductionPct:.3}}]:[]),
      ...(karma.progressPct>=75?[{name:"Karma-Körperverstärkung",kind:"powerup" as const,description:"Fortgeschrittene Karma-Transformation.",powerup:{rounds:3,damageBonusPct:.5,incomingReductionPct:.4}}]:[])]:[];
    const abilityPool: Ability[] = [
      ...(character.uniquePower?.individualAbilities ?? []),
      ...(character.spektralritterPact?.individualAbilities ?? []),
      ...(character.esperPact?.individualAbilities ?? []),
      ...(character.jinchuriki?.individualAbilities ?? []),
      ...karmaAbilities,
    ];
    const learnedJutsu = character.ninjaTechniques.filter(s=>s.learned);
    return (
      <section>
        <h2>Kampf: {enemy?.name ?? session.enemyId}</h2>
        {error && <p style={{ color: "crimson" }}>{error}</p>}
        <HpBar label={character.characterName} hp={session.characterHp} maxHp={session.characterMaxHp} />
        <HpBar label={enemy?.name ?? "Gegner"} hp={session.enemyHp} maxHp={session.enemyMaxHp} />
        <ResourceBar
          label={session.resourceLabel}
          value={session.characterResource}
          max={session.characterResourceMax}
        />
        {session.activeDojutsu&&<div style={{padding:"8px 10px",border:"1px solid #b33",borderRadius:8,marginBottom:10}}><b>{session.activeDojutsu.name} aktiv</b> · {session.activeDojutsu.stageIndex===4?"Mangekyō":`${session.activeDojutsu.stageIndex} Tomoe`} · Unterhalt {session.activeDojutsu.upkeepCost} Chakra/Runde</div>}
        {session.ritterMaxHp? <HpBar label="Spektralritter" hp={session.ritterHp??0} maxHp={session.ritterMaxHp}/>:null}
        {session.enemyAccuracyDebuffRounds? <p>Gegnerische Wahrnehmung gestört: {session.enemyAccuracyDebuffRounds} Runde(n)</p>:null}
        {session.activePowerup && (
          <p style={{ fontSize: 13, background: "#fff3e0", borderRadius: 6, padding: "6px 10px" }}>
            Powerup aktiv: <strong>{session.activePowerup.name}</strong> (noch{" "}
            {session.activePowerup.roundsRemaining} Runde(n) — +
            {Math.round(session.activePowerup.damageBonusPct * 100)}% Schaden, -
            {Math.round(session.activePowerup.incomingReductionPct * 100)}% erlittener Schaden{session.activePowerup.upkeepCost?` · Unterhalt ${session.activePowerup.upkeepCost} ${session.resourceLabel}/Runde`:""})
          </p>
        )}
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          {ACTIONS.filter((a) => a.id !== "spezialfaehigkeit").map((a) => (
            <button key={a.id} disabled={busy} onClick={() => act(a.id)}>
              {a.label}
            </button>
          ))}
          {character.worldId==="ozeanwelt"&&character.skills.some(s=>s.name.includes("Busoshoku")&&s.level>0)&&<button disabled={busy||session.characterResource<10} onClick={()=>act("angriff",undefined,"verstaerkung")}>Angriff + Busoshoku (10 Wille)</button>}
          {character.worldId==="ozeanwelt"&&character.skills.some(s=>s.name.includes("Kenbunshoku")&&s.level>0)&&<button disabled={busy||session.characterResource<10} onClick={()=>act("verteidigung",undefined,"wahrnehmung")}>Block + Kenbunshoku (10 Wille)</button>}
          {character.worldId==="ozeanwelt"&&character.skills.some(s=>s.name.includes("Haoshoku")&&s.level>0)&&<button disabled={busy||session.characterResource<18} onClick={()=>act("angriff",undefined,"dominanz")}>Angriff + Haoshoku (18 Wille)</button>}
          {character.worldId==="avalon"&&["mage-horus-lineage","mage-ra-lineage"].includes(character.clanId??"")&&!session.activePowerup&&<button disabled={busy||session.characterResource<15} onClick={()=>act("clan_power_aktivieren")}>{character.clanId==="mage-horus-lineage"?"Augen des Horus":"Auge des Ra"} aktivieren</button>}
          {character.dojutsuState?.awakened&&!session.activeDojutsu&&<button disabled={busy||session.characterResource<12} onClick={()=>act("dojutsu_aktivieren")}>{character.dojutsuState.name} aktivieren (12 Chakra)</button>}
          {(session.activeDojutsu||session.activePowerup)&&<button disabled={busy} onClick={()=>act("powerup_deaktivieren")}>Aktiven Zustand deaktivieren</button>}
          {character.inventory.filter(i=>["heiltrank","energie-essenz"].includes(i.itemId)&&i.quantity>0).map(i=><button key={i.itemId} disabled={busy} onClick={()=>act("item",i.itemId)}>Item: {i.itemId} ({i.quantity})</button>)}
          {learnedJutsu.length>0&&<select disabled={busy} defaultValue="" onChange={e=>{if(e.target.value)act("jutsu",e.target.value);e.target.value=""}}><option value="" disabled>Jutsu wählen...</option>{learnedJutsu.map(st=>{const known=({bunshin:["Bunshin no Jutsu",8],kawarimi:["Kawarimi no Jutsu",10],henge:["Henge no Jutsu",6],shurikenjutsu:["Shurikenjutsu",4],goukakyuu:["Katon: Gōkakyū no Jutsu",18],housenka:["Katon: Hōsenka",22],"genjutsu-kasumi":["Kasumi-Genjutsu",16],rasengan:["Rasengan",28],chidori:["Chidori",30],"sharingan-genjutsu":["Sharingan: Genjutsu",20],amaterasu:["Amaterasu",45],juuken:["Jūken",14],"hakkeshou-kaiten":["Hakkeshō Kaiten",24],"senju-vitalstrom":["Senju: Vitalstrom",16],"senju-regeneration":["Senju: Regenerationsfokus",20]} as Record<string,[string,number]>)[st.techniqueId];if(!known)return null;const needsEye=["sharingan-genjutsu","amaterasu","juuken","hakkeshou-kaiten"].includes(st.techniqueId);const locked=needsEye&&!session.activeDojutsu;return <option key={st.techniqueId} value={st.techniqueId} disabled={locked||session.characterResource<known[1]}>{known[0]} ({known[1]} Chakra){locked?" — benötigt aktives Dōjutsu":""}</option>})}</select>}
          {character.spektralritterPact && !session.ritterSummoned && <button disabled={busy} onClick={()=>act("ritter_beschwoeren")}>Knight beschwören</button>}
          {session.ritterSummoned&&<button disabled={busy} onClick={()=>act("ritter_angriff")}>Spektralritter: eigener Angriff</button>}
          {abilityPool.length > 0 && (
            <select
              disabled={busy}
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) act("spezialfaehigkeit", e.target.value);
                e.target.value = "";
              }}
            >
              <option value="" disabled>
                Fähigkeit wählen...
              </option>
              {abilityPool.map((a) => {
                const { usable, reason } = abilityUsable(a, session);
                const kindIcon = a.kind === "powerup" ? "⚡" : a.kind === "technik" ? "✦" : "⚔";
                return (
                  <option key={a.name} value={a.name} disabled={!usable}>
                    {kindIcon} {a.name} ({abilityCost(a)} {session.resourceLabel})
                    {!usable ? ` — ${reason}` : ""}
                  </option>
                );
              })}
            </select>
          )}
        </div>
        <RoundLog session={session} />
      </section>
    );
  }

  return (
    <section>
      <h2>Kampf</h2>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <div style={{ display: "grid", gap: 12 }}>
        {enemies.map((enemy) => (
          <div key={enemy.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
            <strong>{enemy.name}</strong> — Kampfkraft {enemy.kampfkraft}
            <p style={{ margin: "4px 0" }}>{enemy.description}</p>
            <button disabled={busy} onClick={() => start(enemy.id)}>
              Angreifen
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function RoundLog({ session }: { session: CombatSession }) {
  return (
    <div style={{ marginTop: 12, fontSize: 13, color: "#555" }}>
      {session.log
        .slice()
        .reverse()
        .map((r) => (
          <div key={r.round} style={{ padding: "4px 0", borderTop: "1px solid #eee" }}>
            Runde {r.round}: Du ({r.characterAction}
            {r.abilityUsed ? `: ${r.abilityUsed}` : ""}) → {r.damageToEnemy} Schaden &middot; Gegner (
            {r.enemyAction}) → {r.damageToCharacter} Schaden {r.note !== "-" ? `— ${r.note}` : ""}
          </div>
        ))}
    </div>
  );
}
