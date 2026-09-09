import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Character, Item } from "../types/models";

export function InventoryPage({
  character,
  onUpdated,
}: {
  character: Character;
  onUpdated: (c: Character) => void;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    api.getItems().then(setItems).catch((e) => setError(e.message));
  }, []);

  function itemName(itemId: string) {
    return items.find((i) => i.id === itemId)?.name ?? itemId;
  }

  async function equip(itemId: string) {
    setBusy(itemId);
    setError(null);
    try {
      onUpdated(await api.equipItem(character.id, itemId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setBusy(null);
    }
  }

  async function unequip(slot: "waffe" | "ruestung" | "accessoire") {
    setBusy(slot);
    setError(null);
    try {
      onUpdated(await api.unequipItem(character.id, slot));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setBusy(null);
    }
  }

  async function use(itemId: string) {
    setBusy(itemId);
    setError(null);
    try {
      onUpdated(await api.useConsumable(character.id, itemId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setBusy(null);
    }
  }

  return (
    <section>
      <h2>Inventar &amp; Ausrüstung</h2>
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <h3>Ausgerüstet</h3>
          <ul>
            {(["waffe", "ruestung", "accessoire"] as const).map((slot) => (
              <li key={slot} style={{ marginBottom: 6 }}>
                <strong>{slot}:</strong>{" "}
                {character.equipped[slot] ? (
                  <>
                    {itemName(character.equipped[slot]!)}{" "}
                    <button disabled={busy === slot} onClick={() => unequip(slot)}>
                      Ablegen
                    </button>
                  </>
                ) : (
                  "leer"
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Rucksack</h3>
          {character.inventory.length === 0 && <p style={{ color: "#777" }}>Leer.</p>}
          <ul>
            {character.inventory.map((slot) => {
              const item = items.find((i) => i.id === slot.itemId);
              return (
                <li key={slot.itemId} style={{ marginBottom: 6 }}>
                  {itemName(slot.itemId)} x{slot.quantity}
                  {item?.slot === "verbrauchsgut" ? (
                    <button
                      style={{ marginLeft: 8 }}
                      disabled={busy === slot.itemId}
                      onClick={() => use(slot.itemId)}
                    >
                      Benutzen
                    </button>
                  ) : (
                    <button
                      style={{ marginLeft: 8 }}
                      disabled={busy === slot.itemId}
                      onClick={() => equip(slot.itemId)}
                    >
                      Ausrüsten
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
