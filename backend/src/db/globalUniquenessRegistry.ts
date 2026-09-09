/**
 * Generisches Register für Dinge, die weltweit nur EINMAL vergeben sein
 * dürfen (9 Esper, 9 Bijū, einzigartige Otsutsuki). Ein Key kann nur einem
 * Charakter gleichzeitig gehören. Getrennte Namespaces (category) verhindern
 * Kollisionen zwischen z.B. Esper-IDs und Bijū-IDs.
 */
const bindings = new Map<string, string>(); // `${category}:${entityId}` -> characterId
const consumed = new Set<string>(); // `${category}:${entityId}` -> dauerhaft verbraucht (z.B. besiegte Otsutsuki)

function key(category: string, entityId: string): string {
  return `${category}:${entityId}`;
}

export const GlobalUniquenessRegistry = {
  getBoundTo(category: string, entityId: string): string | undefined {
    return bindings.get(key(category, entityId));
  },
  isConsumed(category: string, entityId: string): boolean {
    return consumed.has(key(category, entityId));
  },
  bind(category: string, entityId: string, characterId: string) {
    bindings.set(key(category, entityId), characterId);
  },
  /** Gibt eine Bindung frei, z.B. wenn ein Bijū nach Baryon Mode wieder frei wird. */
  release(category: string, entityId: string) {
    bindings.delete(key(category, entityId));
  },
  markConsumed(category: string, entityId: string) {
    consumed.add(key(category, entityId));
  },
  allBindingsFor(category: string): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [k, v] of bindings.entries()) {
      if (k.startsWith(`${category}:`)) result[k.slice(category.length + 1)] = v;
    }
    return result;
  },
};
