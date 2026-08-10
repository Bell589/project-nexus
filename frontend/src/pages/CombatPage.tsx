import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Character, CombatAction, CombatSession, Enemy } from "../types/models";

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

  async function act(action: CombatAction) {
    if (!session) return;
    setBusy(true);
    setError(null);
    try {
      const updated = await api.combatAction(session.id, action);
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
    return (
      <section>
        <h2>Kampf: {enemy?.name ?? session.enemyId}</h2>
        {error && <p style={{ color: "crimson" }}>{error}</p>}
        <HpBar label={character.characterName} hp={session.characterHp} maxHp={session.characterMaxHp} />
        <HpBar label={enemy?.name ?? "Gegner"} hp={session.enemyHp} maxHp={session.enemyMaxHp} />
        <p style={{ fontSize: 13, color: "#777" }}>
          Kombo: {session.comboCount} (Spezialfähigkeit ab Kombo 2, benötigt Kernmacht)
        </p>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {ACTIONS.map((a) => (
            <button key={a.id} disabled={busy} onClick={() => act(a.id)}>
              {a.label}
            </button>
          ))}
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
            Runde {r.round}: Du ({r.characterAction}) → {r.damageToEnemy} Schaden &middot; Gegner (
            {r.enemyAction}) → {r.damageToCharacter} Schaden {r.note !== "-" ? `— ${r.note}` : ""}
          </div>
        ))}
    </div>
  );
}
