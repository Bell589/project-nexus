export interface DomainRule {
  id: string;
  name: string;
  description: string;
}

export const DOMAIN_RULES: DomainRule[] = [
  { id: "teleportation-verboten", name: "Teleportation verboten", description: "Niemand innerhalb der Domäne kann sich teleportieren." },
  { id: "heilung-deaktiviert", name: "Heilung deaktiviert", description: "Heileffekte wirken innerhalb der Domäne nicht." },
  { id: "fliegen-unmoeglich", name: "Fliegen unmöglich", description: "Fliegen ist innerhalb der Domäne nicht möglich." },
  { id: "illusionen-aufgehoben", name: "Illusionen aufgehoben", description: "Alle Illusionen werden innerhalb der Domäne aufgedeckt." },
  { id: "magie-doppelte-kosten", name: "Magie doppelte Kosten", description: "Magiewirkung kostet innerhalb der Domäne doppelt so viel." },
  { id: "schwerthiebe-garantiert", name: "Schwerthiebe treffen garantiert", description: "Schwerthiebe können innerhalb der Domäne nicht mehr verfehlt werden." },
];
