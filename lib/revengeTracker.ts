// Revenge Tracker - Track which bots beat you and get bonus for beating them back

export interface RevengeTarget {
  botId: string;
  botName: string;
  timesLostTo: number;
  lastLoss: string;
  revengeComplete: boolean;
}

export interface RevengeState {
  targets: RevengeTarget[];
  revengesCompleted: number;
  currentBounty: number; // Bonus tokens for next revenge
}

const REVENGE_KEY = 'guts_revenge';
const BASE_BOUNTY = 10;
const BOUNTY_PER_LOSS = 5;

export function loadRevengeState(): RevengeState {
  if (typeof window === 'undefined') {
    return { targets: [], revengesCompleted: 0, currentBounty: 0 };
  }
  try {
    const data = localStorage.getItem(REVENGE_KEY);
    return data ? JSON.parse(data) : { targets: [], revengesCompleted: 0, currentBounty: 0 };
  } catch {
    return { targets: [], revengesCompleted: 0, currentBounty: 0 };
  }
}

export function saveRevengeState(state: RevengeState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(REVENGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save revenge state:', e);
  }
}

export function recordLossToBot(botId: string, botName: string): RevengeState {
  const state = loadRevengeState();

  const existing = state.targets.find(t => t.botId === botId);
  if (existing) {
    existing.timesLostTo += 1;
    existing.lastLoss = new Date().toISOString();
    existing.revengeComplete = false;
  } else {
    state.targets.push({
      botId,
      botName,
      timesLostTo: 1,
      lastLoss: new Date().toISOString(),
      revengeComplete: false,
    });
  }

  // Calculate bounty
  state.currentBounty = state.targets
    .filter(t => !t.revengeComplete)
    .reduce((sum, t) => sum + BASE_BOUNTY + (t.timesLostTo * BOUNTY_PER_LOSS), 0);

  saveRevengeState(state);
  return state;
}

export function checkRevenge(botId: string): { isRevenge: boolean; bounty: number; target: RevengeTarget | null } {
  const state = loadRevengeState();
  const target = state.targets.find(t => t.botId === botId && !t.revengeComplete);

  if (!target) return { isRevenge: false, bounty: 0, target: null };

  const bounty = BASE_BOUNTY + (target.timesLostTo * BOUNTY_PER_LOSS);
  return { isRevenge: true, bounty, target };
}

export function completeRevenge(botId: string): { bounty: number; state: RevengeState } {
  const state = loadRevengeState();
  const target = state.targets.find(t => t.botId === botId && !t.revengeComplete);

  if (!target) return { bounty: 0, state };

  const bounty = BASE_BOUNTY + (target.timesLostTo * BOUNTY_PER_LOSS);
  target.revengeComplete = true;
  state.revengesCompleted += 1;

  // Recalculate current bounty
  state.currentBounty = state.targets
    .filter(t => !t.revengeComplete)
    .reduce((sum, t) => sum + BASE_BOUNTY + (t.timesLostTo * BOUNTY_PER_LOSS), 0);

  saveRevengeState(state);
  return { bounty, state };
}

export function getActiveRevengeTargets(): RevengeTarget[] {
  const state = loadRevengeState();
  return state.targets.filter(t => !t.revengeComplete);
}

export function getTopRevengeTarget(): RevengeTarget | null {
  const targets = getActiveRevengeTargets();
  if (targets.length === 0) return null;
  return targets.sort((a, b) => b.timesLostTo - a.timesLostTo)[0];
}
