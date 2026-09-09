export interface CrossWorldEvent {
  id: string;
  type: string;
  affectedWorldIds: string[];
  status: "aktiv" | "beendet";
  description: string;
  triggeredAt: string;
}
