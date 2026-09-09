import type { FusionState } from "../types/fusionState.js";

const states = new Map<string, FusionState>();

export const FusionStateStore = {
  get(id: string): FusionState | undefined {
    return states.get(id);
  },
  save(state: FusionState): FusionState {
    states.set(state.id, state);
    return state;
  },
};
