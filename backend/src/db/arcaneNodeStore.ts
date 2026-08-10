/** locationId -> characterId */
const controllers = new Map<string, string>();

export const ArcaneNodeStore = {
  getController(locationId: string): string | undefined {
    return controllers.get(locationId);
  },
  setController(locationId: string, characterId: string) {
    controllers.set(locationId, characterId);
  },
  allControllers(): Record<string, string> {
    return Object.fromEntries(controllers.entries());
  },
};
