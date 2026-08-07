/**
 * Kampfkraft-Schwellenwerte für die Kernmacht-Entwicklung.
 * Index 0 = Mindest-Kampfkraft, um die Kernmacht überhaupt zu erhalten
 * (Relikt finden, Prüfung bestehen, Ort der Macht finden...).
 * Jeder weitere Index = Schwelle für die nächste Stufe.
 * Danach (letzte definierte Stufe = "Unbegrenzte Weiterentwicklung"):
 * keine feste Obergrenze mehr, Fortschritt läuft weiter ohne Deckel.
 */
export const CORE_POWER_STAGE_THRESHOLDS = [20, 60, 130, 240, 400, 600];

export function stageThresholdFor(stageIndex: number): number {
  return (
    CORE_POWER_STAGE_THRESHOLDS[stageIndex] ??
    CORE_POWER_STAGE_THRESHOLDS[CORE_POWER_STAGE_THRESHOLDS.length - 1]
  );
}
