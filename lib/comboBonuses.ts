// Combo Bonuses System - Special bonuses for achieving combos

export interface Combo {
  id: string;
  name: string;
  description: string;
  icon: string;
  bonus: number; // Token bonus
  requirement: ComboRequirement;
}

export interface ComboRequirement {
  type: 'streak' | 'specific_hand' | 'ghost_beat' | 'underdog' | 'comeback' | 'perfect_read';
  value?: number | string;
}

export const COMBOS: Combo[] = [
  // Streak combos
  { id: 'hot_hand', name: 'Hot Hand', description: 'Win 3 in a row', icon: '🔥', bonus: 15, requirement: { type: 'streak', value: 3 } },
  { id: 'on_fire', name: 'On Fire!', description: 'Win 5 in a row', icon: '🔥🔥', bonus: 40, requirement: { type: 'streak', value: 5 } },
  { id: 'unstoppable', name: 'UNSTOPPABLE!', description: 'Win 7 in a row', icon: '💎', bonus: 100, requirement: { type: 'streak', value: 7 } },
  { id: 'legendary', name: 'LEGENDARY!', description: 'Win 10 in a row', icon: '👑', bonus: 250, requirement: { type: 'streak', value: 10 } },

  // Ghost combos
  { id: 'ghost_buster', name: 'Ghost Buster', description: 'Beat a ghost hand', icon: '👻', bonus: 10, requirement: { type: 'ghost_beat', value: 1 } },
  { id: 'ghost_hunter', name: 'Ghost Hunter', description: 'Beat 3 ghosts in one session', icon: '🔫', bonus: 30, requirement: { type: 'ghost_beat', value: 3 } },
  { id: 'exorcist', name: 'The Exorcist', description: 'Beat 5 ghosts in one session', icon: '✝️', bonus: 75, requirement: { type: 'ghost_beat', value: 5 } },

  // Special hand combos
  { id: 'pair_master', name: 'Pair Master', description: 'Win 3 hands with pairs', icon: '✌️', bonus: 20, requirement: { type: 'specific_hand', value: 'pair_3' } },
  { id: 'ace_high_club', name: 'Ace High Club', description: 'Win with Ace-high 3 times', icon: '🅰️', bonus: 25, requirement: { type: 'specific_hand', value: 'ace_3' } },
  { id: 'nice', name: 'Nice!', description: 'Win with 6-9', icon: '😏', bonus: 69, requirement: { type: 'specific_hand', value: '69' } },

  // Underdog combos
  { id: 'underdog', name: 'Underdog', description: 'Win with hand value under 150', icon: '🐕', bonus: 20, requirement: { type: 'underdog', value: 150 } },
  { id: 'miracle', name: 'Miracle Win!', description: 'Win with hand value under 100', icon: '🌟', bonus: 50, requirement: { type: 'underdog', value: 100 } },

  // Comeback combos
  { id: 'comeback_kid', name: 'Comeback Kid', description: 'Win after being down to < 50 tokens', icon: '💪', bonus: 30, requirement: { type: 'comeback', value: 50 } },
  { id: 'phoenix_rise', name: 'Phoenix Rising', description: 'Win after being down to < 20 tokens', icon: '🔥', bonus: 75, requirement: { type: 'comeback', value: 20 } },

  // Perfect read
  { id: 'perfect_read', name: 'Perfect Read', description: 'Correctly drop when you would have lost', icon: '🧠', bonus: 10, requirement: { type: 'perfect_read' } },
];

export interface ComboState {
  currentStreak: number;
  sessionGhostsBeaten: number;
  sessionPairWins: number;
  sessionAceHighWins: number;
  lowestTokensThisSession: number;
  combosEarned: string[]; // Combo IDs earned this session
  totalComboBonuses: number;
}

const COMBO_KEY = 'guts_combos';

export function getDefaultComboState(): ComboState {
  return {
    currentStreak: 0,
    sessionGhostsBeaten: 0,
    sessionPairWins: 0,
    sessionAceHighWins: 0,
    lowestTokensThisSession: 999999,
    combosEarned: [],
    totalComboBonuses: 0,
  };
}

export function loadComboState(): ComboState {
  if (typeof window === 'undefined') return getDefaultComboState();
  try {
    const data = localStorage.getItem(COMBO_KEY);
    return data ? { ...getDefaultComboState(), ...JSON.parse(data) } : getDefaultComboState();
  } catch {
    return getDefaultComboState();
  }
}

export function saveComboState(state: ComboState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(COMBO_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save combo state:', e);
  }
}

export function resetSessionCombos(): ComboState {
  const state = getDefaultComboState();
  saveComboState(state);
  return state;
}

export interface ComboCheckResult {
  combosTriggered: Combo[];
  totalBonus: number;
  state: ComboState;
}

export function checkCombos(
  won: boolean,
  handValue: number,
  isPair: boolean,
  isAceHigh: boolean,
  is69: boolean,
  beatGhost: boolean,
  currentTokens: number,
  wouldHaveLost: boolean,
  dropped: boolean
): ComboCheckResult {
  const state = loadComboState();
  const combosTriggered: Combo[] = [];
  let totalBonus = 0;

  // Track lowest tokens
  if (currentTokens < state.lowestTokensThisSession) {
    state.lowestTokensThisSession = currentTokens;
  }

  if (won) {
    // Update streak
    state.currentStreak += 1;

    // Check streak combos
    for (const combo of COMBOS.filter(c => c.requirement.type === 'streak')) {
      if (state.currentStreak === combo.requirement.value && !state.combosEarned.includes(combo.id)) {
        combosTriggered.push(combo);
        totalBonus += combo.bonus;
        state.combosEarned.push(combo.id);
      }
    }

    // Ghost beat
    if (beatGhost) {
      state.sessionGhostsBeaten += 1;
      for (const combo of COMBOS.filter(c => c.requirement.type === 'ghost_beat')) {
        if (state.sessionGhostsBeaten === combo.requirement.value && !state.combosEarned.includes(combo.id)) {
          combosTriggered.push(combo);
          totalBonus += combo.bonus;
          state.combosEarned.push(combo.id);
        }
      }
    }

    // Pair wins
    if (isPair) {
      state.sessionPairWins += 1;
      if (state.sessionPairWins === 3 && !state.combosEarned.includes('pair_master')) {
        const combo = COMBOS.find(c => c.id === 'pair_master')!;
        combosTriggered.push(combo);
        totalBonus += combo.bonus;
        state.combosEarned.push(combo.id);
      }
    }

    // Ace high wins
    if (isAceHigh && !isPair) {
      state.sessionAceHighWins += 1;
      if (state.sessionAceHighWins === 3 && !state.combosEarned.includes('ace_high_club')) {
        const combo = COMBOS.find(c => c.id === 'ace_high_club')!;
        combosTriggered.push(combo);
        totalBonus += combo.bonus;
        state.combosEarned.push(combo.id);
      }
    }

    // 6-9 combo
    if (is69 && !state.combosEarned.includes('nice')) {
      const combo = COMBOS.find(c => c.id === 'nice')!;
      combosTriggered.push(combo);
      totalBonus += combo.bonus;
      state.combosEarned.push(combo.id);
    }

    // Underdog combos
    if (handValue < 100 && !state.combosEarned.includes('miracle')) {
      const combo = COMBOS.find(c => c.id === 'miracle')!;
      combosTriggered.push(combo);
      totalBonus += combo.bonus;
      state.combosEarned.push(combo.id);
    } else if (handValue < 150 && !state.combosEarned.includes('underdog')) {
      const combo = COMBOS.find(c => c.id === 'underdog')!;
      combosTriggered.push(combo);
      totalBonus += combo.bonus;
      state.combosEarned.push(combo.id);
    }

    // Comeback combos
    if (state.lowestTokensThisSession < 20 && !state.combosEarned.includes('phoenix_rise')) {
      const combo = COMBOS.find(c => c.id === 'phoenix_rise')!;
      combosTriggered.push(combo);
      totalBonus += combo.bonus;
      state.combosEarned.push(combo.id);
    } else if (state.lowestTokensThisSession < 50 && !state.combosEarned.includes('comeback_kid')) {
      const combo = COMBOS.find(c => c.id === 'comeback_kid')!;
      combosTriggered.push(combo);
      totalBonus += combo.bonus;
      state.combosEarned.push(combo.id);
    }
  } else {
    // Reset streak on loss (if they held)
    if (!dropped) {
      state.currentStreak = 0;
    }

    // Perfect read combo - dropped when you would have lost
    if (dropped && wouldHaveLost && !state.combosEarned.includes('perfect_read')) {
      const combo = COMBOS.find(c => c.id === 'perfect_read')!;
      combosTriggered.push(combo);
      totalBonus += combo.bonus;
      state.combosEarned.push(combo.id);
    }
  }

  state.totalComboBonuses += totalBonus;
  saveComboState(state);

  return { combosTriggered, totalBonus, state };
}

export function getCurrentStreak(): number {
  return loadComboState().currentStreak;
}
