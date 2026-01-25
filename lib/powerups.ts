// Power-ups System for GUTS

export type PowerUpType =
  | 'peek'        // See one ghost card
  | 'double_down' // Double winnings if you win
  | 'shield'      // Protect from matching pot once
  | 'swap'        // Exchange one of your cards with deck
  | 'reveal'      // Force one opponent to show cards early
  | 'freeze'      // Prevent ghost hand from being added
  | 'lucky_draw'  // Redraw one of your cards
  | 'third_card'  // Get 3 cards, drop 1, play with best 2

export interface PowerUp {
  type: PowerUpType;
  name: string;
  description: string;
  icon: string;
  cost: number; // Token cost to purchase
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const POWER_UPS: Record<PowerUpType, PowerUp> = {
  peek: {
    type: 'peek',
    name: 'Ghost Peek',
    description: 'See one ghost card before deciding',
    icon: '👁️',
    cost: 10,
    rarity: 'common',
  },
  double_down: {
    type: 'double_down',
    name: 'Double Down',
    description: 'Double your winnings if you win this round',
    icon: '💰',
    cost: 25,
    rarity: 'rare',
  },
  shield: {
    type: 'shield',
    name: 'Shield',
    description: 'Protect yourself from matching the pot if you lose',
    icon: '🛡️',
    cost: 30,
    rarity: 'rare',
  },
  swap: {
    type: 'swap',
    name: 'Card Swap',
    description: 'Exchange one of your cards with the top of the deck',
    icon: '🔄',
    cost: 20,
    rarity: 'common',
  },
  reveal: {
    type: 'reveal',
    name: 'Mind Read',
    description: 'Force one opponent to reveal their cards early',
    icon: '🔮',
    cost: 35,
    rarity: 'epic',
  },
  freeze: {
    type: 'freeze',
    name: 'Ghost Freeze',
    description: 'Prevent a ghost hand from being added this round',
    icon: '❄️',
    cost: 40,
    rarity: 'epic',
  },
  lucky_draw: {
    type: 'lucky_draw',
    name: 'Lucky Draw',
    description: 'Redraw one of your cards for a chance at something better',
    icon: '🍀',
    cost: 15,
    rarity: 'common',
  },
  third_card: {
    type: 'third_card',
    name: 'Third Card',
    description: 'Get 3 cards instead of 2, then drop 1 to play with the best 2',
    icon: '🃏',
    cost: 50,
    rarity: 'legendary',
  },
};

// Player's power-up inventory
export interface PowerUpInventory {
  [key: string]: number; // PowerUpType -> count
}

const STORAGE_KEY = 'guts_powerups';

export function loadPowerUpInventory(): PowerUpInventory {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function savePowerUpInventory(inventory: PowerUpInventory): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
  } catch (e) {
    console.error('Failed to save power-ups:', e);
  }
}

export function purchasePowerUp(type: PowerUpType, currentTokens: number): { success: boolean; newTokens: number; inventory: PowerUpInventory } {
  const powerUp = POWER_UPS[type];
  if (currentTokens < powerUp.cost) {
    return { success: false, newTokens: currentTokens, inventory: loadPowerUpInventory() };
  }

  const inventory = loadPowerUpInventory();
  inventory[type] = (inventory[type] || 0) + 1;
  savePowerUpInventory(inventory);

  return { success: true, newTokens: currentTokens - powerUp.cost, inventory };
}

export function consumePowerUp(type: PowerUpType): boolean {
  const inventory = loadPowerUpInventory();
  if (!inventory[type] || inventory[type] <= 0) {
    return false;
  }

  inventory[type] -= 1;
  savePowerUpInventory(inventory);
  return true;
}

export function getPowerUpCount(type: PowerUpType): number {
  const inventory = loadPowerUpInventory();
  return inventory[type] || 0;
}
