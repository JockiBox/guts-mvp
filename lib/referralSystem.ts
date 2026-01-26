// Referral System

export interface ReferralData {
  referralCode: string;
  referrals: string[]; // User IDs who used this code
  tokensEarned: number;
  referredBy?: string; // Who referred this user
}

const STORAGE_KEY = 'guts_referral_data';
const REFERRAL_REWARD = 100; // Tokens for each referral
const REFEREE_BONUS = 50; // Bonus tokens for person who was referred

// Generate a unique referral code
export function generateReferralCode(userId: string): string {
  const prefix = userId.substring(0, 4).toUpperCase();
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `GUTS-${prefix}-${suffix}`;
}

export function loadReferralData(): ReferralData | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveReferralData(data: ReferralData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function initializeReferralData(userId: string): ReferralData {
  const data: ReferralData = {
    referralCode: generateReferralCode(userId),
    referrals: [],
    tokensEarned: 0,
  };
  saveReferralData(data);
  return data;
}

export function getOrCreateReferralCode(userId: string): string {
  let data = loadReferralData();
  if (!data) {
    data = initializeReferralData(userId);
  }
  return data.referralCode;
}

// Record a new referral (called when someone uses this user's code)
export function recordReferral(referredUserId: string): { tokensEarned: number } {
  const data = loadReferralData();
  if (!data) return { tokensEarned: 0 };

  if (!data.referrals.includes(referredUserId)) {
    data.referrals.push(referredUserId);
    data.tokensEarned += REFERRAL_REWARD;
    saveReferralData(data);
    return { tokensEarned: REFERRAL_REWARD };
  }

  return { tokensEarned: 0 };
}

// Mark that this user was referred by someone
export function setReferredBy(referrerCode: string): void {
  const data = loadReferralData();
  if (data && !data.referredBy) {
    data.referredBy = referrerCode;
    saveReferralData(data);
  }
}

export function getReferralStats(): {
  code: string;
  totalReferrals: number;
  tokensEarned: number;
  shareUrl: string;
} {
  const data = loadReferralData();
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://gutsthegame.com';

  return {
    code: data?.referralCode || 'GUTS-XXXX-XXXX',
    totalReferrals: data?.referrals.length || 0,
    tokensEarned: data?.tokensEarned || 0,
    shareUrl: `${baseUrl}?ref=${data?.referralCode || ''}`,
  };
}

export function getRefereeBonus(): number {
  return REFEREE_BONUS;
}

export function getReferralReward(): number {
  return REFERRAL_REWARD;
}

// Generate share text for various platforms
export function getShareText(code: string): {
  twitter: string;
  whatsapp: string;
  generic: string;
} {
  const url = `https://gutsthegame.com?ref=${code}`;

  return {
    twitter: `Join me on GUTS - the high-stakes 2-card poker game! Use my code ${code} for bonus tokens! 🃏🔥 ${url}`,
    whatsapp: `Hey! Try GUTS - it's a super fun card game. Use my referral code ${code} and we both get free tokens! ${url}`,
    generic: `Play GUTS with me! Use code ${code} for bonus tokens: ${url}`,
  };
}

// Copy referral link to clipboard
export async function copyReferralLink(code: string): Promise<boolean> {
  const url = `https://gutsthegame.com?ref=${code}`;
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}
