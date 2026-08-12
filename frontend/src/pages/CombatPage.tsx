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

const ACTIONS: { id: CombatAction; label: string }[] = [
  { id: "angriff", label: "Angriff" },
  { id: "verteidigung", label: "Verteidigung" },
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

  async function act(action: CombatAction, abilityName?: string) {
    if (!session) return;
    setBusy(true);
    setError(null);
    try {
      const updated = await api.combatAction(session.id, action, abilityName);
      setSession(updated);
      if (updated.status === "gewonnen") {
        const character = await api.getCharacter(session.characterId);
        onUpdated(character);
      }
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
    const abilityPool: Ability[] = [
      ...(character.corePower?.unlockedAbilities ?? []),
      ...(character.spektralritterPact?.unlockedAbilities ?? []),
    ];
    return (
      <section>
        <h2>Kampf: {enemy?.name ?? session.enemyId}</h2>
        {error && <p style={{ color: "crimson" }}>{error}</p>}
        <HpBar label={character.characterName} hp={session.characterHp} maxHp={session.characterMaxHp} />
        <HpBar label={enemy?.name ?? "Gegner"} hp={session.enemyHp} maxHp={session.enemyMaxHp} />
        {session.activePowerup && (
          <p style={{ fontSize: 13, background: "#fff3e0", borderRadius: 6, padding: "6px 10px" }}>
            Powerup aktiv: <strong>{session.activePowerup.name}</strong> (noch{" "}
            {session.activePowerup.roundsRemaining} Runde(n) — +
            {Math.round(session.activePowerup.damageBonusPct * 100)}% Schaden, -
            {Math.round(session.activePowerup.incomingReductionPct * 100)}% erlittener Schaden)
          </p>
        )}
        <p style={{ fontSize: 13, color: "#777" }}>
          Kombo: {session.comboCount} (Fähigkeiten ab Kombo 2, benötigt Kernmacht oder
          Spektralritter-Pakt)
        </p>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          {ACTIONS.filter((a) => a.id !== "spezialfaehigkeit").map((a) => (
            <button key={a.id} disabled={busy} onClick={() => act(a.id)}>
              {a.label}
            </button>
          ))}
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
              {abilityPool.map((a) => (
                <option key={a.name} value={a.name}>
                  {a.kind === "powerup" ? "⚡" : a.kind === "technik" ? "✦" : "⚔"} {a.name}
                </option>
              ))}
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
