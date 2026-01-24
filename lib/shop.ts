// Shop items and pricing

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number; // in tokens
  type: 'avatar' | 'theme' | 'effect' | 'vip';
  value: string; // emoji for avatar, theme id for theme, etc.
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface TokenPackage {
  id: string;
  name: string;
  tokens: number;
  price: number; // in USD cents
  bonus: number; // bonus tokens
  popular?: boolean;
  stripePriceId?: string;
}

// Token packages for purchase
export const TOKEN_PACKAGES: TokenPackage[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    tokens: 1000,
    price: 499, // $4.99
    bonus: 0,
  },
  {
    id: 'popular',
    name: 'Popular Pack',
    tokens: 2500,
    price: 999, // $9.99
    bonus: 250,
    popular: true,
  },
  {
    id: 'value',
    name: 'Value Pack',
    tokens: 6000,
    price: 1999, // $19.99
    bonus: 1000,
  },
  {
    id: 'whale',
    name: 'High Roller',
    tokens: 15000,
    price: 4999, // $49.99
    bonus: 3000,
  },
];

// Avatar items
export const AVATAR_SHOP: ShopItem[] = [
  // Common (50 tokens)
  { id: 'av_cool', name: 'Cool Dude', description: 'Classic cool look', price: 50, type: 'avatar', value: '😎', icon: '😎', rarity: 'common' },
  { id: 'av_sunglasses', name: 'Shades', description: 'Too cool for school', price: 50, type: 'avatar', value: '🕶️', icon: '🕶️', rarity: 'common' },
  { id: 'av_fire', name: 'On Fire', description: 'Blazing hot player', price: 50, type: 'avatar', value: '🔥', icon: '🔥', rarity: 'common' },
  { id: 'av_star', name: 'Star Player', description: 'Rising star', price: 50, type: 'avatar', value: '⭐', icon: '⭐', rarity: 'common' },

  // Rare (150 tokens)
  { id: 'av_crown', name: 'Royal Crown', description: 'Rule the table', price: 150, type: 'avatar', value: '👑', icon: '👑', rarity: 'rare' },
  { id: 'av_diamond', name: 'Diamond', description: 'Precious player', price: 150, type: 'avatar', value: '💎', icon: '💎', rarity: 'rare' },
  { id: 'av_rocket', name: 'Rocket', description: 'To the moon!', price: 150, type: 'avatar', value: '🚀', icon: '🚀', rarity: 'rare' },
  { id: 'av_ghost', name: 'Ghost', description: 'Spooky player', price: 150, type: 'avatar', value: '👻', icon: '👻', rarity: 'rare' },

  // Epic (400 tokens)
  { id: 'av_alien', name: 'Alien', description: 'Out of this world', price: 400, type: 'avatar', value: '👽', icon: '👽', rarity: 'epic' },
  { id: 'av_robot', name: 'Robot', description: 'Calculated moves', price: 400, type: 'avatar', value: '🤖', icon: '🤖', rarity: 'epic' },
  { id: 'av_ninja', name: 'Ninja', description: 'Silent but deadly', price: 400, type: 'avatar', value: '🥷', icon: '🥷', rarity: 'epic' },
  { id: 'av_wizard', name: 'Wizard', description: 'Magical plays', price: 400, type: 'avatar', value: '🧙', icon: '🧙', rarity: 'epic' },

  // Legendary (1000 tokens)
  { id: 'av_dragon', name: 'Dragon', description: 'Legendary beast', price: 1000, type: 'avatar', value: '🐉', icon: '🐉', rarity: 'legendary' },
  { id: 'av_unicorn', name: 'Unicorn', description: 'Mythical player', price: 1000, type: 'avatar', value: '🦄', icon: '🦄', rarity: 'legendary' },
  { id: 'av_phoenix', name: 'Phoenix', description: 'Rise from the ashes', price: 1000, type: 'avatar', value: '🔱', icon: '🔱', rarity: 'legendary' },
];

// Theme items
export const THEME_SHOP: ShopItem[] = [
  { id: 'theme_neon', name: 'Neon Nights', description: 'Cyberpunk glow', price: 200, type: 'theme', value: 'neon', icon: '🌃', rarity: 'rare' },
  { id: 'theme_gold', name: 'Golden Luxury', description: 'Rich and elegant', price: 300, type: 'theme', value: 'gold', icon: '🏆', rarity: 'rare' },
  { id: 'theme_ocean', name: 'Ocean Deep', description: 'Calm blue vibes', price: 200, type: 'theme', value: 'ocean', icon: '🌊', rarity: 'rare' },
  { id: 'theme_fire', name: 'Inferno', description: 'Burning hot', price: 400, type: 'theme', value: 'fire', icon: '🔥', rarity: 'epic' },
  { id: 'theme_galaxy', name: 'Galaxy', description: 'Cosmic adventure', price: 600, type: 'theme', value: 'galaxy', icon: '🌌', rarity: 'epic' },
  { id: 'theme_diamond', name: 'Diamond Elite', description: 'Ultimate luxury', price: 1500, type: 'theme', value: 'diamond', icon: '💠', rarity: 'legendary' },
];

// Win effects
export const EFFECT_SHOP: ShopItem[] = [
  { id: 'fx_confetti', name: 'Confetti Burst', description: 'Celebrate wins!', price: 100, type: 'effect', value: 'confetti', icon: '🎊', rarity: 'common' },
  { id: 'fx_fireworks', name: 'Fireworks', description: 'Light up the sky', price: 200, type: 'effect', value: 'fireworks', icon: '🎆', rarity: 'rare' },
  { id: 'fx_lightning', name: 'Lightning Strike', description: 'Electric victories', price: 300, type: 'effect', value: 'lightning', icon: '⚡', rarity: 'rare' },
  { id: 'fx_rainbow', name: 'Rainbow', description: 'Colorful celebration', price: 400, type: 'effect', value: 'rainbow', icon: '🌈', rarity: 'epic' },
  { id: 'fx_explosion', name: 'Explosion', description: 'Massive wins', price: 500, type: 'effect', value: 'explosion', icon: '💥', rarity: 'epic' },
  { id: 'fx_money', name: 'Money Rain', description: 'Cash falling from sky', price: 800, type: 'effect', value: 'money', icon: '💸', rarity: 'legendary' },
];

// VIP packages
export const VIP_PACKAGES: ShopItem[] = [
  {
    id: 'vip_bronze',
    name: 'Bronze VIP',
    description: '+5% daily bonus, bronze badge',
    price: 500,
    type: 'vip',
    value: '1',
    icon: '🥉',
    rarity: 'rare',
  },
  {
    id: 'vip_silver',
    name: 'Silver VIP',
    description: '+10% daily bonus, silver badge',
    price: 1500,
    type: 'vip',
    value: '2',
    icon: '🥈',
    rarity: 'epic',
  },
  {
    id: 'vip_gold',
    name: 'Gold VIP',
    description: '+20% daily bonus, gold badge',
    price: 5000,
    type: 'vip',
    value: '3',
    icon: '🥇',
    rarity: 'legendary',
  },
];

// Get all shop items
export function getAllShopItems(): ShopItem[] {
  return [...AVATAR_SHOP, ...THEME_SHOP, ...EFFECT_SHOP, ...VIP_PACKAGES];
}

// Check if user owns item
export function ownsItem(unlockedItems: string[], itemId: string): boolean {
  return unlockedItems.includes(itemId);
}

// Get rarity color
export function getRarityColor(rarity: ShopItem['rarity']): string {
  switch (rarity) {
    case 'common': return '#94a3b8';
    case 'rare': return '#3b82f6';
    case 'epic': return '#a855f7';
    case 'legendary': return '#fbbf24';
    default: return '#94a3b8';
  }
}

// Get rarity gradient
export function getRarityGradient(rarity: ShopItem['rarity']): string {
  switch (rarity) {
    case 'common': return 'linear-gradient(135deg, #64748b, #475569)';
    case 'rare': return 'linear-gradient(135deg, #3b82f6, #2563eb)';
    case 'epic': return 'linear-gradient(135deg, #a855f7, #7c3aed)';
    case 'legendary': return 'linear-gradient(135deg, #fbbf24, #f59e0b, #fbbf24)';
    default: return 'linear-gradient(135deg, #64748b, #475569)';
  }
}

// Format price
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

// Daily reward structure
export const DAILY_REWARDS = [
  { day: 1, tokens: 10, icon: '🎁' },
  { day: 2, tokens: 15, icon: '🎁' },
  { day: 3, tokens: 20, icon: '🎁' },
  { day: 4, tokens: 25, icon: '🎁' },
  { day: 5, tokens: 30, icon: '🎁' },
  { day: 6, tokens: 35, icon: '🎁' },
  { day: 7, tokens: 50, icon: '🏆' }, // Bonus day
];

// Calculate total tokens in a package
export function getPackageTotal(pkg: TokenPackage): number {
  return pkg.tokens + pkg.bonus;
}
