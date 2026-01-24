'use client';

// Tournament mode - elimination bracket system

export interface TournamentPlayer {
  id: string;
  name: string;
  avatar?: string;
  isHuman: boolean;
  eliminated: boolean;
  wins: number;
  position?: number; // Final placement
}

export interface TournamentRound {
  roundNumber: number;
  playersRemaining: number;
  completed: boolean;
}

export interface TournamentState {
  active: boolean;
  players: TournamentPlayer[];
  currentRound: number;
  totalRounds: number;
  rounds: TournamentRound[];
  champion: TournamentPlayer | null;
  startedAt: string | null;
}

const TOURNAMENT_KEY = 'guts_tournament';

export function getInitialTournamentState(): TournamentState {
  return {
    active: false,
    players: [],
    currentRound: 0,
    totalRounds: 0,
    rounds: [],
    champion: null,
    startedAt: null,
  };
}

export function loadTournamentState(): TournamentState {
  if (typeof window === 'undefined') return getInitialTournamentState();
  try {
    const data = localStorage.getItem(TOURNAMENT_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error loading tournament:', e);
  }
  return getInitialTournamentState();
}

export function saveTournamentState(state: TournamentState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TOURNAMENT_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving tournament:', e);
  }
}

export function clearTournamentState(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOURNAMENT_KEY);
}

// Calculate rounds needed for player count
export function calculateRounds(playerCount: number): number {
  // Each round eliminates ~half the players
  return Math.ceil(Math.log2(playerCount));
}

// Create a new tournament
export function createTournament(playerNames: string[], humanName: string = 'You'): TournamentState {
  const players: TournamentPlayer[] = [
    {
      id: 'human',
      name: humanName,
      isHuman: true,
      eliminated: false,
      wins: 0,
    },
    ...playerNames.map((name, i) => ({
      id: `ai-${i}`,
      name,
      isHuman: false,
      eliminated: false,
      wins: 0,
    })),
  ];

  const totalRounds = calculateRounds(players.length);
  const rounds: TournamentRound[] = [];

  let remaining = players.length;
  for (let i = 1; i <= totalRounds; i++) {
    rounds.push({
      roundNumber: i,
      playersRemaining: remaining,
      completed: false,
    });
    remaining = Math.ceil(remaining / 2);
  }

  const state: TournamentState = {
    active: true,
    players,
    currentRound: 1,
    totalRounds,
    rounds,
    champion: null,
    startedAt: new Date().toISOString(),
  };

  saveTournamentState(state);
  return state;
}

// Eliminate a player
export function eliminatePlayer(state: TournamentState, playerId: string): TournamentState {
  const remaining = state.players.filter(p => !p.eliminated && p.id !== playerId);
  const position = remaining.length + 1;

  const newState: TournamentState = {
    ...state,
    players: state.players.map(p =>
      p.id === playerId ? { ...p, eliminated: true, position } : p
    ),
  };

  // Check if round is complete (only 1 or few players left for next stage)
  const stillPlaying = newState.players.filter(p => !p.eliminated).length;
  const targetForRound = Math.ceil(state.players.length / Math.pow(2, state.currentRound));

  if (stillPlaying <= targetForRound || stillPlaying <= 1) {
    newState.rounds = newState.rounds.map(r =>
      r.roundNumber === state.currentRound ? { ...r, completed: true } : r
    );

    if (stillPlaying > 1) {
      newState.currentRound++;
    }
  }

  // Check for champion
  if (stillPlaying === 1) {
    const winner = newState.players.find(p => !p.eliminated);
    if (winner) {
      newState.champion = { ...winner, position: 1 };
      newState.active = false;
    }
  }

  saveTournamentState(newState);
  return newState;
}

// Record a win
export function recordWin(state: TournamentState, playerId: string): TournamentState {
  const newState: TournamentState = {
    ...state,
    players: state.players.map(p =>
      p.id === playerId ? { ...p, wins: p.wins + 1 } : p
    ),
  };
  saveTournamentState(newState);
  return newState;
}

// Get round name
export function getRoundName(round: number, totalRounds: number): string {
  const remaining = totalRounds - round + 1;
  if (remaining === 1) return 'Finals';
  if (remaining === 2) return 'Semifinals';
  if (remaining === 3) return 'Quarterfinals';
  return `Round ${round}`;
}

// Get players still in tournament
export function getActiveTournamentPlayers(state: TournamentState): TournamentPlayer[] {
  return state.players.filter(p => !p.eliminated);
}
