import type {
  World,
  Account,
  Faction,
  Character,
  Crew,
  Fleet,
  Item,
  GameLocation,
  Mission,
  Enemy,
  CombatSession,
  CombatAction,
  DomainRule,
  UniquePowerInstance,
  Spektralritter,
  RaceDefinition,
  ClanDefinition,
  OrganizationDefinition,
  MasterTrainerDefinition,
  DiscoveryDefinition,
  WorldEncounterDefinition,
  ActiveWorldEncounter,
  RegionEntry,
  RegionControl,
  Village,
  VillageRank,
  WorldCrystal,
  LegendaryEntity,
  QuizQuestion,
  OriginDefinition, TravelResult, MarketplaceListing, PlayerOrganization,
} from "../types/models";

const TOKEN_KEY = "nexus_token";
let authToken: string | null = typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_KEY) : null;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json", ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request fehlgeschlagen: ${res.status}`);
  }
  return res.json();
}

export const api = {

  getShopItems: () => request<Item[]>("/gameplay/shop"),
  buyShopItem: (characterId:string,itemId:string,quantity=1) => request<Character>("/gameplay/shop/buy",{method:"POST",body:JSON.stringify({characterId,itemId,quantity})}),
  devGrant: (characterId:string,input:{gold?:number;skillPoints?:number;statPoints?:number;energy?:number}) => request<Character>(`/gameplay/dev/characters/${characterId}/grant`,{method:"POST",body:JSON.stringify(input)}),
  chooseFaction: (characterId:string,factionId:string) => request<Character>(`/gameplay/characters/${characterId}/faction`,{method:"POST",body:JSON.stringify({factionId})}),
  getOrigins: (worldId: string) => request<OriginDefinition[]>(`/gameplay/origins?worldId=${worldId}`),
  advanceOrigin: (characterId: string) => request<Character>(`/gameplay/characters/${characterId}/origin/advance`, {method:"POST"}),
  spendStatPoint: (characterId: string, stat: string) => request<Character>(`/gameplay/characters/${characterId}/stats/spend`, {method:"POST",body:JSON.stringify({stat})}),
  trainMastery: (characterId: string, abilityId: string) => request<Character>(`/gameplay/characters/${characterId}/mastery/train`, {method:"POST",body:JSON.stringify({abilityId})}),
  rest: (characterId: string) => request<Character>(`/gameplay/characters/${characterId}/rest`, {method:"POST"}),
  travel: (characterId: string, toLocationId: string) => request<TravelResult>(`/gameplay/characters/${characterId}/travel`, {method:"POST",body:JSON.stringify({toLocationId})}),
  getMarketplace: () => request<MarketplaceListing[]>("/gameplay/marketplace"),
  createListing: (characterId:string,itemId:string,quantity:number,pricePerItem:number) => request<MarketplaceListing>("/gameplay/marketplace",{method:"POST",body:JSON.stringify({characterId,itemId,quantity,pricePerItem})}),
  buyListing: (characterId:string,listingId:string) => request<Character>(`/gameplay/marketplace/${listingId}/buy`,{method:"POST",body:JSON.stringify({characterId})}),
  getPlayerOrganizations: (worldId:string) => request<PlayerOrganization[]>(`/gameplay/organizations?worldId=${worldId}`),
  createPlayerOrganization: (characterId:string,name:string,type:string) => request<PlayerOrganization>("/gameplay/organizations",{method:"POST",body:JSON.stringify({characterId,name,type})}),
  joinPlayerOrganization: (characterId:string,organizationId:string) => request<PlayerOrganization>(`/gameplay/organizations/${organizationId}/join`,{method:"POST",body:JSON.stringify({characterId})}),
  depositTreasury: (characterId:string,organizationId:string,amount:number) => request<PlayerOrganization>(`/gameplay/organizations/${organizationId}/treasury/deposit`,{method:"POST",body:JSON.stringify({characterId,amount})}),
  setToken: (token: string | null) => { authToken = token; if (typeof window !== "undefined") { if (token) window.localStorage.setItem(TOKEN_KEY, token); else window.localStorage.removeItem(TOKEN_KEY); } },
  hasStoredToken: () => Boolean(authToken),
  register: (username: string, displayName: string, password: string) => request<{ token: string; account: Account }>("/auth/register", { method: "POST", body: JSON.stringify({ username, displayName, password }) }),
  login: (username: string, password: string) => request<{ token: string; account: Account }>("/auth/login", { method: "POST", body: JSON.stringify({ username, password }) }),
  me: () => request<Account>("/auth/me"),
  logout: () => request<void>("/auth/logout", { method: "POST" }),
  getWorlds: () => request<World[]>("/worlds"),
  getFactions: (worldId: string) => request<Faction[]>(`/worlds/${worldId}/factions`),
  getRaces: (worldId: string) => request<RaceDefinition[]>(`/worlds/${worldId}/races`),
  getClansForWorld: (worldId: string) => request<ClanDefinition[]>(`/worlds/${worldId}/clans`),
  createCharacter: (input: {
    ownerId?: string | null;
    ownerName: string;
    characterName: string;
    worldId: string;
    factionId?: string;
    raceId: string;
    clanId?: string | null;
  }) =>
    request<Character>("/characters", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  getCharacter: (id: string) => request<Character>(`/characters/${id}`),
  listCharacters: () => request<Character[]>("/characters"),

  trainComponent: (characterId: string, component: string, amount: number) =>
    request<Character>(`/characters/${characterId}/train`, {
      method: "POST",
      body: JSON.stringify({ component, amount }),
    }),

  searchCorePower: (characterId: string) =>
    request<UniquePowerInstance>(`/characters/${characterId}/core-power/search`, {
      method: "POST",
    }),

  acquireCorePower: (characterId: string, found: UniquePowerInstance) =>
    request<Character>(`/characters/${characterId}/core-power/acquire`, {
      method: "POST",
      body: JSON.stringify(found),
    }),

  advanceCorePower: (characterId: string) =>
    request<Character>(`/characters/${characterId}/core-power/advance`, {
      method: "POST",
    }),

  listCrews: () => request<Crew[]>("/crews"),
  getCrew: (id: string) => request<Crew>(`/crews/${id}`),
  createCrew: (founderCharacterId: string, name: string) =>
    request<Crew>("/crews", {
      method: "POST",
      body: JSON.stringify({ founderCharacterId, name }),
    }),
  joinCrew: (crewId: string, characterId: string) =>
    request<Crew>(`/crews/${crewId}/join`, {
      method: "POST",
      body: JSON.stringify({ characterId }),
    }),
  assignCrewRole: (crewId: string, actingCharacterId: string, targetCharacterId: string, role: string) =>
    request<Crew>(`/crews/${crewId}/roles`, {
      method: "POST",
      body: JSON.stringify({ actingCharacterId, targetCharacterId, role }),
    }),

  listFleets: () => request<Fleet[]>("/fleets"),
  createFleet: (founderCrewId: string, founderCharacterId: string, name: string) =>
    request<Fleet>("/fleets", {
      method: "POST",
      body: JSON.stringify({ founderCrewId, founderCharacterId, name }),
    }),
  joinFleet: (fleetId: string, crewId: string, characterId: string) =>
    request<Fleet>(`/fleets/${fleetId}/join`, {
      method: "POST",
      body: JSON.stringify({ crewId, characterId }),
    }),

  getItems: () => request<Item[]>("/items"),

  getLocations: (worldId: string) => request<GameLocation[]>(`/worlds/${worldId}/locations`),

  getMissions: (characterId: string) => request<Mission[]>(`/missions/character/${characterId}`),
  completeMission: (missionId: string, characterId: string) =>
    request<Character>(`/missions/${missionId}/complete`, {
      method: "POST",
      body: JSON.stringify({ characterId }),
    }),

  getEnemies: (characterId: string) => request<Enemy[]>(`/combat/enemies/character/${characterId}`),
  startCombat: (enemyId: string, characterId: string) =>
    request<CombatSession>(`/combat/${enemyId}/start`, {
      method: "POST",
      body: JSON.stringify({ characterId }),
    }),
  combatAction: (sessionId: string, action: CombatAction, abilityName?: string, hakiMode?: "verstaerkung"|"dominanz"|"wahrnehmung") =>
    request<CombatSession>(`/combat/session/${sessionId}/action`, {
      method: "POST",
      body: JSON.stringify({ action, abilityName, hakiMode }),
    }),

  getArcaneControllers: () => request<Record<string, string>>("/arcane-network/controllers"),
  claimArcaneNode: (locationId: string, characterId: string) =>
    request<Record<string, string>>(`/arcane-network/${locationId}/claim`, {
      method: "POST",
      body: JSON.stringify({ characterId }),
    }),

  getDomainRules: () => request<DomainRule[]>("/domain-rules"),
  selectDomainRule: (characterId: string, ruleId: string) =>
    request<Character>(`/characters/${characterId}/domain/select`, {
      method: "POST",
      body: JSON.stringify({ ruleId }),
    }),

  addItem: (characterId: string, itemId: string, quantity = 1) =>
    request<Character>(`/characters/${characterId}/inventory/add`, {
      method: "POST",
      body: JSON.stringify({ itemId, quantity }),
    }),
  equipItem: (characterId: string, itemId: string) =>
    request<Character>(`/characters/${characterId}/inventory/equip`, {
      method: "POST",
      body: JSON.stringify({ itemId }),
    }),
  unequipItem: (characterId: string, slot: ItemSlotName) =>
    request<Character>(`/characters/${characterId}/inventory/unequip`, {
      method: "POST",
      body: JSON.stringify({ slot }),
    }),
  useConsumable: (characterId: string, itemId: string) =>
    request<Character>(`/characters/${characterId}/inventory/use`, {
      method: "POST",
      body: JSON.stringify({ itemId }),
    }),

  trainSkill: (characterId: string, skillName: string) =>
    request<Character>(`/characters/${characterId}/skills/train`, {
      method: "POST",
      body: JSON.stringify({ skillName }),
    }),

  searchSpektralritter: (characterId: string) =>
    request<UniquePowerInstance>(`/characters/${characterId}/spektralritter/search`, {
      method: "POST",
    }),
  formPact: (characterId: string, found: UniquePowerInstance) =>
    request<Character>(`/characters/${characterId}/spektralritter/pact`, {
      method: "POST",
      body: JSON.stringify(found),
    }),
  advancePact: (characterId: string) =>
    request<Character>(`/characters/${characterId}/spektralritter/advance`, {
      method: "POST",
    }),



  // Neue Progressions- und Weltgrundlagen
  getOrganizations: (worldId?: string) => request<OrganizationDefinition[]>(`/progression/organizations${worldId ? `?worldId=${worldId}` : ""}`),
  getMasterTrainers: (worldId?: string) => request<MasterTrainerDefinition[]>(`/progression/trainers${worldId ? `?worldId=${worldId}` : ""}`),
  getDiscoveries: (worldId?: string) => request<DiscoveryDefinition[]>(`/progression/discoveries${worldId ? `?worldId=${worldId}` : ""}`),
  getEncounterDefinitions: (worldId?: string) => request<WorldEncounterDefinition[]>(`/world-encounters/definitions${worldId ? `?worldId=${worldId}` : ""}`),
  getActiveEncounters: (worldId?: string) => request<ActiveWorldEncounter[]>(`/world-encounters/active${worldId ? `?worldId=${worldId}` : ""}`),
  activateEncounter: (definitionId: string, locationId?: string) => request<ActiveWorldEncounter>(`/world-encounters/${definitionId}/activate`, { method: "POST", body: JSON.stringify({ locationId }) }),
  despawnEncounter: (definitionId: string) => request<void>(`/world-encounters/${definitionId}`, { method: "DELETE" }),

  getRegions: (worldId?: string) => request<RegionEntry[]>(`/regions${worldId ? `?worldId=${worldId}` : ""}`),
  claimRegion: (locationId: string, characterId: string) => request<RegionControl>(`/regions/${locationId}/claim`, { method: "POST", body: JSON.stringify({ characterId }) }),
  setRegionPresence: (locationId: string, characterId: string, present: boolean) => request<RegionControl>(`/regions/${locationId}/presence`, { method: "POST", body: JSON.stringify({ characterId, present }) }),
  joinRegionDefense: (locationId: string, characterId: string) => request<RegionControl>(`/regions/${locationId}/join-defense`, { method: "POST", body: JSON.stringify({ characterId }) }),
  attackRegion: (locationId: string, characterId: string) => request<RegionControl>(`/regions/${locationId}/attack`, { method: "POST", body: JSON.stringify({ characterId }) }),
  rebelRegion: (locationId: string, characterId: string) => request<RegionControl>(`/regions/${locationId}/rebel`, { method: "POST", body: JSON.stringify({ characterId }) }),

  getVillages: () => request<Village[]>("/villages"),
  joinVillage: (villageId: string, characterId: string) => request<Village>(`/villages/${villageId}/join`, { method: "POST", body: JSON.stringify({ characterId }) }),
  promoteVillageMember: (villageId: string, actingCharacterId: string, targetCharacterId: string, rank: VillageRank) => request<Village>(`/villages/${villageId}/promote`, { method: "POST", body: JSON.stringify({ actingCharacterId, targetCharacterId, rank }) }),

  joinClan: (clanId: string, characterId: string) => request<Character>(`/clans/${clanId}/join`, { method: "POST", body: JSON.stringify({ characterId }) }),
  advanceClanTraining: (pathId: string, characterId: string) => request<Character>(`/clans/training/${pathId}`, { method: "POST", body: JSON.stringify({ characterId }) }),
  searchNinjutsuWithClanBonus: (characterId: string) => request<UniquePowerInstance>("/clans/ninjutsu-search", { method: "POST", body: JSON.stringify({ characterId }) }),

  getWorldCrystals: () => request<WorldCrystal[]>("/world-crystals"),

  // Esper
  listAvailableEspers: () => request<Record<string, unknown>[]>("/esper/available"),
  attemptEsperPact: (characterId: string, esperId: string) =>
    request<Character>(`/esper/${esperId}/attempt-pact`, { method: "POST", body: JSON.stringify({ characterId }) }),
  advanceEsperPact: (characterId: string) =>
    request<Character>("/esper/advance", { method: "POST", body: JSON.stringify({ characterId }) }),

  // Bijū / Jinchūriki
  listAvailableBijuu: () => request<Record<string, unknown>[]>("/bijuu/available"),
  fightAndSealBijuu: (characterId: string, bijuuId: string) =>
    request<Character>(`/bijuu/${bijuuId}/fight-and-seal`, { method: "POST", body: JSON.stringify({ characterId }) }),
  advanceJinchuriki: (characterId: string) =>
    request<Character>("/bijuu/advance", { method: "POST", body: JSON.stringify({ characterId }) }),
  activateBaryonMode: (characterId: string) =>
    request<{ character: Character; message: string; releasedBijuu: string }>("/bijuu/baryon-mode", {
      method: "POST",
      body: JSON.stringify({ characterId }),
    }),

  // Otsutsuki / Karma
  listAvailableOtsutsuki: () => request<Record<string, unknown>[]>("/otsutsuki/available"),
  fightOtsutsuki: (characterId: string, otsutsukiId: string) =>
    request<Character>(`/otsutsuki/${otsutsukiId}/fight`, { method: "POST", body: JSON.stringify({ characterId }) }),
  activateOtsutsukiReincarnation: (characterId: string) =>
    request<{ character: Character; message: string }>("/otsutsuki/reincarnation", {
      method: "POST",
      body: JSON.stringify({ characterId }),
    }),

  getNinjaTraining: (characterId:string) => request<import("../types/models").NinjaTrainingEntry[]>(`/characters/${characterId}/ninja-training`),
  trainNinjaTechnique: (characterId:string,techniqueId:string) => request<Character>(`/characters/${characterId}/ninja-training/${techniqueId}`,{method:"POST"}),
  sharinganClanTraining: (characterId:string) => request<Character>(`/characters/${characterId}/sharingan/clan-training`,{method:"POST"}),
  awakenSharingan: (characterId:string) => request<Character>(`/characters/${characterId}/sharingan/awaken`,{method:"POST"}),
  byakuganClanTraining: (characterId:string) => request<Character>(`/characters/${characterId}/byakugan/clan-training`,{method:"POST"}),
  awakenByakugan: (characterId:string) => request<Character>(`/characters/${characterId}/byakugan/awaken`,{method:"POST"}),
  advanceSharingan: (characterId:string) => request<Character>(`/characters/${characterId}/sharingan/advance`,{method:"POST"}),

  // Dōjutsu
  searchDoujutsu: (characterId: string) =>
    request<UniquePowerInstance>(`/characters/${characterId}/doujutsu/search`, { method: "POST" }),
  acquireDoujutsu: (characterId: string, found: UniquePowerInstance) =>
    request<Character>(`/characters/${characterId}/doujutsu/acquire`, { method: "POST", body: JSON.stringify(found) }),
  advanceDoujutsu: (characterId: string) =>
    request<Character>(`/characters/${characterId}/doujutsu/advance`, { method: "POST" }),

  // Zanpakutō-Quiz
  getZanpakutoQuiz: () => request<QuizQuestion[]>("/catalogs/zanpakuto-quiz"),
  zanpakutoQuiz: (characterId: string, answers: number[]) =>
    request<UniquePowerInstance>(`/characters/${characterId}/zanpakuto-quiz`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    }),

  // Weltenkristalle
  listWorldCrystals: () => request<Record<string, unknown>[]>("/world-crystals"),
  stabilizeCrystal: (crystalId: string, characterId: string) =>
    request<Record<string, unknown>>(`/world-crystals/${crystalId}/stabilize`, {
      method: "POST",
      body: JSON.stringify({ characterId }),
    }),

  // Magierfusion (temporär)
  fuseCharactersTemp: (characterAId: string, characterBId: string, fusedName: string) =>
    request<Record<string, unknown>>("/fusion", {
      method: "POST",
      body: JSON.stringify({ characterAId, characterBId, fusedName }),
    }),
};

type ItemSlotName = "waffe" | "ruestung" | "accessoire";
