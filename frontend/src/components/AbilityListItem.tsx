import type { Ability } from "../types/models";

const KIND_STYLE: Record<Ability["kind"], { label: string; color: string }> = {
  angriff: { label: "Angriff", color: "#c33" },
  technik: { label: "Technik", color: "#66c" },
  powerup: { label: "Powerup", color: "#e90" },
};

export function AbilityListItem({ ability }: { ability: Ability }) {
  const style = KIND_STYLE[ability.kind];
  return (
    <li style={{ marginBottom: 6 }}>
      <span
        style={{
          fontSize: 11,
          color: "#fff",
          background: style.color,
          borderRadius: 4,
          padding: "1px 6px",
          marginRight: 6,
        }}
      >
        {style.label}
      </span>
      <strong>{ability.name}</strong>
      <div style={{ fontSize: 13, color: "#666" }}>{ability.description}</div>
      {ability.powerup && (
        <div style={{ fontSize: 12, color: "#999" }}>
          {ability.powerup.rounds} Runde(n) &middot; +{Math.round(ability.powerup.damageBonusPct * 100)}%
          Schaden &middot; -{Math.round(ability.powerup.incomingReductionPct * 100)}% erlittener Schaden
          {ability.powerup.speedNote ? ` · ${ability.powerup.speedNote}` : ""}
        </div>
      )}
    </li>
  );
}
