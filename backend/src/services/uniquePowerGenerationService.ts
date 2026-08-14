import { nanoid } from "nanoid";
import type { UniquePowerOrigin, UniquePowerInstance, AbilityTemplate } from "../types/uniquePower.js";
import type { Ability } from "../types/ability.js";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function templateToAbility(template: AbilityTemplate): Ability {
  return {
    name: template.name,
    kind: template.kind,
    description: template.description,
    powerup: template.powerup,
    resourceCost: template.resourceCost,
    requiresActivePowerup: template.requiresActivePowerup,
  };
}

/**
 * Zieht `count` Fähigkeiten aus dem Pool für einen bestimmten Tier+Variante,
 * ohne bereits besessene zu wiederholen. Falls die Stufe ein Powerup
 * garantieren soll, wird sichergestellt, dass mindestens eine gezogene
 * Fähigkeit vom Typ "powerup" ist.
 */
function drawAbilities(
  origin: UniquePowerOrigin,
  tier: string,
  variant: string,
  count: number,
  mustIncludePowerup: boolean,
  alreadyOwned: string[]
): Ability[] {
  if (count <= 0) return [];

  const candidates = origin.abilityPool.filter(
    (a) => a.tier === tier && (!a.variant || a.variant === variant) && !alreadyOwned.includes(a.name)
  );

  const powerups = shuffle(candidates.filter((a) => a.kind === "powerup"));
  const rest = shuffle(candidates.filter((a) => a.kind !== "powerup"));

  const picked: AbilityTemplate[] = [];
  if (mustIncludePowerup && powerups.length > 0) {
    picked.push(powerups[0]);
  }

  const remainingPool = shuffle([...powerups.slice(picked.length), ...rest]);
  for (const candidate of remainingPool) {
    if (picked.length >= count) break;
    picked.push(candidate);
  }

  return picked.slice(0, count).map(templateToAbility);
}

/**
 * Erzeugt eine individuelle Ausprägung aus einer Origin. Zwei Aufrufe mit
 * derselben Origin (und ggf. sogar derselben Variante) können unterschiedliche
 * Namen, Varianten und Fähigkeits-Teilmengen liefern - das ist gewollt.
 */
export function generateUniquePower(origin: UniquePowerOrigin): UniquePowerInstance {
  const variant = origin.variantPool[Math.floor(Math.random() * origin.variantPool.length)];
  const prefix = origin.namePrefixPool[Math.floor(Math.random() * origin.namePrefixPool.length)];
  const suffix = origin.nameSuffixPool[Math.floor(Math.random() * origin.nameSuffixPool.length)];
  const generatedName = `${prefix}${suffix}`;

  const stage0 = origin.stageDefinitions[0];
  const abilities = drawAbilities(origin, stage0.tier, variant, stage0.abilityCount, stage0.isPowerupStage, []);

  return {
    originId: origin.id,
    category: origin.category,
    variant,
    generatedName,
    stageIndex: 0,
    individualAbilities: abilities,
    developmentLog: [
      `${generatedName} (${origin.category}: ${variant}) gefunden - Startfähigkeiten: ${abilities.map((a) => a.name).join(", ") || "keine"}`,
    ],
  };
}

export function advanceUniquePower(
  instance: UniquePowerInstance,
  origin: UniquePowerOrigin
): UniquePowerInstance {
  const nextStageIndex = instance.stageIndex + 1;
  const stageDef = origin.stageDefinitions[nextStageIndex];
  if (!stageDef) {
    throw new Error("Keine weitere Stufe in dieser Origin definiert");
  }

  const alreadyOwned = instance.individualAbilities.map((a) => a.name);
  const newAbilities = drawAbilities(
    origin,
    stageDef.tier,
    instance.variant,
    stageDef.abilityCount,
    stageDef.isPowerupStage,
    alreadyOwned
  );

  return {
    ...instance,
    stageIndex: nextStageIndex,
    individualAbilities: [...instance.individualAbilities, ...newAbilities],
    developmentLog: [
      ...instance.developmentLog,
      `Stufe "${stageDef.name}" erreicht${newAbilities.length ? ` - neu: ${newAbilities.map((a) => a.name).join(", ")}` : ""}`,
    ],
  };
}

export { nanoid as generateInstanceId };
