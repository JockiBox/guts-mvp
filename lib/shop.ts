// Shop items and pricing

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number; // in tokens
  type: 'avatar' | 'theme' | 'effect' | 'vip' | 'powerup';
  value: string; // emoji for avatar, theme id for theme, powerup type for powerups, etc.
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  quantity?: number; // For powerup packs
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

// Token packages for purchase - WICKED DEALS
export const TOKEN_PACKAGES: TokenPackage[] = [
  {
    id: 'starter',
    name: 'Rookie Stack',
    tokens: 1000,
    price: 499, // $4.99
    bonus: 0,
  },
  {
    id: 'popular',
    name: 'Hustler Bundle',
    tokens: 2500,
    price: 999, // $9.99
    bonus: 250,
    popular: true,
  },
  {
    id: 'value',
    name: 'Shark Tank',
    tokens: 6000,
    price: 1999, // $19.99
    bonus: 1000,
  },
  {
    id: 'whale',
    name: 'Whale Vault',
    tokens: 15000,
    price: 4999, // $49.99
    bonus: 3000,
  },
];

// Avatar items - WICKED COOL COLLECTION
export const AVATAR_SHOP: ShopItem[] = [
  // Common (50 tokens) - Cool Starters
  { id: 'av_cool', name: 'Ice Cold', description: 'Cooler than your bluffs', price: 50, type: 'avatar', value: '😎', icon: '😎', rarity: 'common' },
  { id: 'av_sunglasses', name: 'Night Owl', description: 'Plays in the shadows', price: 50, type: 'avatar', value: '🕶️', icon: '🕶️', rarity: 'common' },
  { id: 'av_fire', name: 'Hotshot', description: 'Every hand is fire', price: 50, type: 'avatar', value: '🔥', icon: '🔥', rarity: 'common' },
  { id: 'av_star', name: 'Rising Star', description: 'Future GOAT', price: 50, type: 'avatar', value: '⭐', icon: '⭐', rarity: 'common' },
  { id: 'av_lightning', name: 'Thunder', description: 'Strikes fast', price: 75, type: 'avatar', value: '⚡', icon: '⚡', rarity: 'common' },

  // Rare (150 tokens) - Prestigious
  { id: 'av_crown', name: 'King Slayer', description: 'Dethroned the best', price: 150, type: 'avatar', value: '👑', icon: '👑', rarity: 'rare' },
  { id: 'av_diamond', name: 'Diamond Hands', description: 'Never folds', price: 150, type: 'avatar', value: '💎', icon: '💎', rarity: 'rare' },
  { id: 'av_rocket', name: 'Moon Mission', description: 'Bankroll to infinity', price: 150, type: 'avatar', value: '🚀', icon: '🚀', rarity: 'rare' },
  { id: 'av_ghost', name: 'Phantom', description: 'Haunts the table', price: 150, type: 'avatar', value: '👻', icon: '👻', rarity: 'rare' },
  { id: 'av_skull', name: 'Death Dealer', description: 'Cards of doom', price: 200, type: 'avatar', value: '💀', icon: '💀', rarity: 'rare' },
  { id: 'av_clown', name: 'Wild Card', description: 'Unpredictable chaos', price: 175, type: 'avatar', value: '🤡', icon: '🤡', rarity: 'rare' },

  // Epic (400 tokens) - Legendary Status
  { id: 'av_alien', name: 'Xenomorph', description: 'From planet Bluffton', price: 400, type: 'avatar', value: '👽', icon: '👽', rarity: 'epic' },
  { id: 'av_robot', name: 'Terminator', description: 'Ill be back... for your tokens', price: 400, type: 'avatar', value: '🤖', icon: '🤖', rarity: 'epic' },
  { id: 'av_ninja', name: 'Shadow Assassin', description: 'Strikes without warning', price: 400, type: 'avatar', value: '🥷', icon: '🥷', rarity: 'epic' },
  { id: 'av_wizard', name: 'Archmage', description: 'Master of card magic', price: 400, type: 'avatar', value: '🧙', icon: '🧙', rarity: 'epic' },
  { id: 'av_vampire', name: 'Blood Lord', description: 'Drains your stack', price: 500, type: 'avatar', value: '🧛', icon: '🧛', rarity: 'epic' },
  { id: 'av_demon', name: 'Hellspawn', description: 'Made a deal for luck', price: 550, type: 'avatar', value: '😈', icon: '😈', rarity: 'epic' },
  { id: 'av_samurai', name: 'Ronin Master', description: 'Way of the card', price: 450, type: 'avatar', value: '⚔️', icon: '⚔️', rarity: 'epic' },
  { id: 'av_pirate', name: 'Dread Pirate', description: 'Plunders pots', price: 450, type: 'avatar', value: '🏴‍☠️', icon: '🏴‍☠️', rarity: 'epic' },

  // Legendary (1000 tokens) - ULTRA RARE
  { id: 'av_dragon', name: 'Dragon Emperor', description: 'Fire and fury', price: 1000, type: 'avatar', value: '🐉', icon: '🐉', rarity: 'legendary' },
  { id: 'av_unicorn', name: 'Mythic Beast', description: 'Impossibly lucky', price: 1000, type: 'avatar', value: '🦄', icon: '🦄', rarity: 'legendary' },
  { id: 'av_phoenix', name: 'Phoenix Rising', description: 'Reborn from every loss', price: 1000, type: 'avatar', value: '🦅', icon: '🦅', rarity: 'legendary' },
  { id: 'av_kraken', name: 'Kraken', description: 'Tentacles of terror', price: 1200, type: 'avatar', value: '🐙', icon: '🐙', rarity: 'legendary' },
  { id: 'av_god', name: 'Card God', description: 'Mortals tremble', price: 1500, type: 'avatar', value: '⚡', icon: '⚡', rarity: 'legendary' },
  { id: 'av_reaper', name: 'Soul Reaper', description: 'Collects losing souls', price: 1500, type: 'avatar', value: '💀', icon: '💀', rarity: 'legendary' },
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

// Pause token packages
export const PAUSE_TOKEN_PACKAGES: ShopItem[] = [
  { id: 'pause_1', name: 'Pause Token', description: '15 sec to think, taunt, use power-ups', price: 50, type: 'powerup', value: 'pause_1', icon: '⏸️', rarity: 'common', quantity: 1 },
  { id: 'pause_3', name: 'Pause Pack (3)', description: '3 pause tokens - 20% savings', price: 120, type: 'powerup', value: 'pause_3', icon: '⏸️', rarity: 'rare', quantity: 3 },
  { id: 'pause_10', name: 'Pause Bundle (10)', description: '10 pause tokens - best value!', price: 350, type: 'powerup', value: 'pause_10', icon: '⏸️', rarity: 'epic', quantity: 10 },
];

// Power-up packages
export const POWERUP_PACKAGES: ShopItem[] = [
  // Starter packs
  { id: 'pu_peek_3', name: 'Ghost Peek x3', description: 'See one ghost card before deciding', price: 25, type: 'powerup', value: 'peek', icon: '👁️', rarity: 'common', quantity: 3 },
  { id: 'pu_swap_3', name: 'Card Swap x3', description: 'Exchange one card with the deck', price: 50, type: 'powerup', value: 'swap', icon: '🔄', rarity: 'common', quantity: 3 },
  { id: 'pu_lucky_3', name: 'Lucky Draw x3', description: 'Redraw one of your cards', price: 40, type: 'powerup', value: 'lucky_draw', icon: '🍀', rarity: 'common', quantity: 3 },

  // Value packs
  { id: 'pu_double_5', name: 'Double Down x5', description: 'Double winnings if you win', price: 100, type: 'powerup', value: 'double_down', icon: '💰', rarity: 'rare', quantity: 5 },
  { id: 'pu_shield_5', name: 'Shield x5', description: 'Protect from matching pot once', price: 120, type: 'powerup', value: 'shield', icon: '🛡️', rarity: 'rare', quantity: 5 },
  { id: 'pu_reveal_3', name: 'Mind Read x3', description: 'Force opponent to show cards early', price: 90, type: 'powerup', value: 'reveal', icon: '🔮', rarity: 'epic', quantity: 3 },

  // Premium packs
  { id: 'pu_freeze_3', name: 'Ghost Freeze x3', description: 'Prevent ghost hand from being added', price: 100, type: 'powerup', value: 'freeze', icon: '❄️', rarity: 'epic', quantity: 3 },
  { id: 'pu_third_3', name: 'Third Card x3', description: 'Get 3 cards, drop 1, play best 2', price: 130, type: 'powerup', value: 'third_card', icon: '🃏', rarity: 'legendary', quantity: 3 },

  // Mega bundles
  { id: 'pu_starter_bundle', name: 'Starter Bundle', description: '2 of each common powerup (6 total)', price: 80, type: 'powerup', value: 'bundle_starter', icon: '📦', rarity: 'rare', quantity: 6 },
  { id: 'pu_pro_bundle', name: 'Pro Bundle', description: '2 of each rare/epic powerup (8 total)', price: 250, type: 'powerup', value: 'bundle_pro', icon: '🎁', rarity: 'epic', quantity: 8 },
  { id: 'pu_ultimate_bundle', name: 'Ultimate Bundle', description: '3 of EVERY powerup (24 total)', price: 500, type: 'powerup', value: 'bundle_ultimate', icon: '💎', rarity: 'legendary', quantity: 24 },

  // Random mystery boxes
  { id: 'pu_mystery_common', name: 'Mystery Box', description: 'Random common/rare powerup', price: 20, type: 'powerup', value: 'mystery_common', icon: '❓', rarity: 'common', quantity: 1 },
  { id: 'pu_mystery_rare', name: 'Premium Mystery', description: 'Random rare/epic powerup', price: 60, type: 'powerup', value: 'mystery_rare', icon: '🎲', rarity: 'rare', quantity: 1 },
  { id: 'pu_mystery_epic', name: 'Legendary Mystery', description: 'Random epic/legendary powerup', price: 100, type: 'powerup', value: 'mystery_epic', icon: '🌟', rarity: 'epic', quantity: 1 },
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
