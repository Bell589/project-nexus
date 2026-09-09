export interface RegionEvent {
  timestamp: string;
  message: string;
}

export interface RegionControl {
  locationId: string;
  /** Aktueller Herrscher - null wenn unbeansprucht */
  rulerCharacterId: string | null;
  /** Ist der Herrscher aktuell vor Ort? Beeinflusst Angriffs-/Belagerungschancen */
  rulerPresent: boolean;
  /** Belagerungsfortschritt 0-100. Bei 100 wechselt die Kontrolle. */
  siegeProgress: number;
  /** Charaktere, die den aktuellen Herrscher aktiv unterstützen/verteidigen */
  defenderCharacterIds: string[];
  eventLog: RegionEvent[];
}
