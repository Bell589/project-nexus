export function Home({ onStart }: { onStart: () => void }) {
  return (
    <section style={{ textAlign: "center", padding: "48px 0" }}>
      <h1 style={{ fontSize: 40, marginBottom: 8 }}>Project Nexus</h1>
      <p style={{ maxWidth: 520, margin: "0 auto 24px", color: "#555" }}>
        Vor Urzeiten existierte nur eine einzige Welt. Durch den Bruch zerriss sie in mehrere
        Dimensionen. Heute öffnen sich die Barrieren wieder — wähle deine Hauptwelt und erschaffe
        einen Charakter, dessen Macht und Geschichte einzigartig sind.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 32, fontSize: 14, color: "#777" }}>
        <span>🌊 Ozeanwelt</span>
        <span>⚔ Soul Society</span>
        <span>🔮 Avalon</span>
      </div>
      <button onClick={onStart} style={{ padding: "12px 28px", fontSize: 16, cursor: "pointer" }}>
        Charakter erstellen
      </button>
    </section>
  );
}
