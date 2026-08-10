import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Character, DomainRule } from "../types/models";

export function DomainPanel({
  character,
  onUpdated,
}: {
  character: Character;
  onUpdated: (c: Character) => void;
}) {
  const [rules, setRules] = useState<DomainRule[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    api.getDomainRules().then(setRules).catch((e) => setError(e.message));
  }, []);

  if (character.factionId !== "shinigami") return null;

  async function select(ruleId: string) {
    setBusy(ruleId);
    setError(null);
    try {
      onUpdated(await api.selectDomainRule(character.id, ruleId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setBusy(null);
    }
  }

  const activeRule = rules.find((r) => r.id === character.activeDomainRuleId);

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, marginTop: 16 }}>
      <h3 style={{ marginTop: 0 }}>Domäne</h3>
      <p style={{ fontSize: 14, color: "#555" }}>
        Verfügbar ab Seelenwaffen-Stufe "Domäne". Eine Domänen-Regel verändert die Kampfregeln in
        deiner Nähe.
      </p>
      {activeRule && (
        <p>
          Aktive Regel: <strong>{activeRule.name}</strong> — {activeRule.description}
        </p>
      )}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <div style={{ display: "grid", gap: 6 }}>
        {rules.map((rule) => (
          <button
            key={rule.id}
            disabled={busy === rule.id}
            onClick={() => select(rule.id)}
            style={{ textAlign: "left", padding: 8 }}
          >
            <strong>{rule.name}</strong>
            <div style={{ fontSize: 12, color: "#777" }}>{rule.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
