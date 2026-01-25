'use client';

// Guest token management using localStorage
const GUEST_TOKENS_KEY = 'guts_guest_tokens';
const GUEST_LAST_CLAIM_KEY = 'guts_guest_last_claim';
const GUEST_STARTING_TOKENS = 100; // Guests start with 100 tokens

interface GuestTokenData {
  tokens: number;
  lastClaim: string; // ISO date string
}

// Get today's date as YYYY-MM-DD
function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

// Check if user already claimed today
export function hasClaimedToday(): boolean {
  if (typeof window === 'undefined') return false;
  const lastClaim = localStorage.getItem(GUEST_LAST_CLAIM_KEY);
  return lastClaim === getTodayDate();
}

// Get guest tokens (persistent - no daily reset for guests)
export function getGuestTokens(): number {
  if (typeof window === 'undefined') return GUEST_STARTING_TOKENS;

  const stored = localStorage.getItem(GUEST_TOKENS_KEY);
  if (stored) {
    return parseInt(stored, 10);
  }

  // First time playing - give starting tokens
  localStorage.setItem(GUEST_TOKENS_KEY, GUEST_STARTING_TOKENS.toString());
  return GUEST_STARTING_TOKENS;
}

// Update guest tokens
export function setGuestTokens(tokens: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GUEST_TOKENS_KEY, Math.max(0, tokens).toString());
}

// Deduct tokens from guest
export function deductGuestTokens(amount: number): boolean {
  const current = getGuestTokens();
  if (current < amount) return false;
  setGuestTokens(current - amount);
  return true;
}

// Add tokens to guest (from winnings)
export function addGuestTokens(amount: number): void {
  const current = getGuestTokens();
  setGuestTokens(current + amount);
}

// Check if guest can play (has tokens)
export function canGuestPlay(ante: number = 1): boolean {
  return getGuestTokens() >= ante;
}

// Get guest stats for display
export function getGuestStats(): { tokens: number; isNewDay: boolean; canPlay: boolean } {
  const tokens = getGuestTokens();
  const lastClaim = localStorage.getItem(GUEST_LAST_CLAIM_KEY);
  const isNewDay = lastClaim !== getTodayDate();

  return {
    tokens,
    isNewDay,
    canPlay: tokens > 0,
  };
}
