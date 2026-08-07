export type GameView =
  | "overview"
  | "inventory"
  | "skills"
  | "map"
  | "missions"
  | "combat"
  | "crew";

const TABS: { id: GameView; label: string }[] = [
  { id: "overview", label: "Übersicht" },
  { id: "inventory", label: "Inventar" },
  { id: "skills", label: "Fähigkeiten" },
  { id: "map", label: "Karte" },
  { id: "missions", label: "Missionen" },
  { id: "combat", label: "Kampf" },
];

export function Navbar({
  active,
  onChange,
  showCrewTab,
}: {
  active: GameView;
  onChange: (view: GameView) => void;
  showCrewTab: boolean;
}) {
  const tabs = showCrewTab ? [...TABS, { id: "crew" as GameView, label: "Crew" }] : TABS;

  return (
    <nav
      style={{
        display: "flex",
        gap: 4,
        borderBottom: "1px solid #ddd",
        marginBottom: 20,
        flexWrap: "wrap",
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            padding: "8px 14px",
            border: "none",
            borderBottom: active === tab.id ? "2px solid #222" : "2px solid transparent",
            background: "transparent",
            fontWeight: active === tab.id ? 600 : 400,
            cursor: "pointer",
          }}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
