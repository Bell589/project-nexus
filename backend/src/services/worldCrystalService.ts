import { nanoid } from "nanoid";
import { WorldCrystalStore } from "../db/worldCrystalStore.js";
import { CharacterStore } from "../db/memoryStore.js";
import { getKampfkraft, ValidationError } from "./characterService.js";
import type { WorldCrystal } from "../data/worldCrystals.js";

export function listCrystals(): WorldCrystal[] {
  return WorldCrystalStore.all();
}

/** Stabilisiert einen Weltenkristall - erfordert Mindest-Kampfkraft, erhöht Stabilität. */
export function stabilizeCrystal(crystalId: string, characterId: string): WorldCrystal {
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);

  const crystal = WorldCrystalStore.get(crystalId);
  if (!crystal) throw new ValidationError(`Weltenkristall "${crystalId}" nicht gefunden`);

  const kampfkraft = getKampfkraft(character);
  if (kampfkraft < 30) {
    throw new ValidationError(`Kampfkraft zu niedrig, um einen Weltenkristall zu stabilisieren (${kampfkraft.toFixed(0)}/30).`);
  }

  crystal.stability = Math.min(100, crystal.stability + 5);

  if (crystal.stability >= 100) {
    WorldCrystalStore.addEvent({
      id: nanoid(),
      type: "Kristallstabilisierung",
      affectedWorldIds: [crystal.worldId],
      status: "beendet",
      description: `${crystal.name} wurde vollständig stabilisiert.`,
      triggeredAt: new Date().toISOString(),
    });
  }

  return WorldCrystalStore.save(crystal);
}

/**
 * Destabilisiert einen Kristall künstlich (z.B. für Testzwecke/Content) und
 * löst dabei ein aktives Cross-World-Event aus, das mehrere Welten betrifft.
 */
export function destabilizeCrystal(crystalId: string, amount: number): WorldCrystal {
  const crystal = WorldCrystalStore.get(crystalId);
  if (!crystal) throw new ValidationError(`Weltenkristall "${crystalId}" nicht gefunden`);

  crystal.stability = Math.max(0, crystal.stability - amount);

  if (crystal.stability < 30) {
    WorldCrystalStore.addEvent({
      id: nanoid(),
      type: "Dimensionsriss",
      affectedWorldIds: [crystal.worldId, ...crystal.connectedCrystalIds.map((id) => WorldCrystalStore.get(id)?.worldId).filter(Boolean) as string[]],
      status: "aktiv",
      description: `${crystal.name} ist instabil - ein Dimensionsriss betrifft verbundene Welten.`,
      triggeredAt: new Date().toISOString(),
    });
  }

  return WorldCrystalStore.save(crystal);
}

export function listCrossWorldEvents() {
  return WorldCrystalStore.allEvents();
}
