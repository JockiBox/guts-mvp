// Wallet System - Inventory for signed-in users only

export type ItemCategory = 'power_up' | 'avatar' | 'card_back' | 'sound_pack' | 'taunt' | 'theme' | 'special';

export interface WalletItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ItemCategory;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  price: number;
  owned: number;
  equipped?: boolean;
}

export interface Wallet {
  items: WalletItem[];
  equippedAvatar: string | null;
  equippedCardBack: string | null;
  equippedSoundPack: string | null;
  luckyNumber: number | null;
}

// All purchasable items in the game
export const SHOP_ITEMS: Omit<WalletItem, 'owned' | 'equipped'>[] = [
  // Avatars
  { id: 'avatar_cool', name: 'Cool Cat', description: 'Sunglasses and chill vibes', icon: '😎', category: 'avatar', rarity: 'common', price: 50 },
  { id: 'avatar_fire', name: 'Hot Shot', description: 'On fire!', icon: '🔥', category: 'avatar', rarity: 'common', price: 50 },
  { id: 'avatar_money', name: 'Money Bags', description: 'All about the tokens', icon: '🤑', category: 'avatar', rarity: 'rare', price: 150 },
  { id: 'avatar_devil', name: 'Little Devil', description: 'Devilishly good', icon: '😈', category: 'avatar', rarity: 'rare', price: 150 },
  { id: 'avatar_alien', name: 'Alien', description: 'Out of this world', icon: '👽', category: 'avatar', rarity: 'epic', price: 300 },
  { id: 'avatar_robot', name: 'Robot', description: 'Beep boop', icon: '🤖', category: 'avatar', rarity: 'epic', price: 300 },
  { id: 'avatar_crown', name: 'Royalty', description: 'Born to rule', icon: '👑', category: 'avatar', rarity: 'legendary', price: 500 },
  { id: 'avatar_diamond', name: 'Diamond', description: 'Shine bright', icon: '💎', category: 'avatar', rarity: 'legendary', price: 500 },

  // Card Backs
  { id: 'cards_flame', name: 'Flame Cards', description: 'Hot deck!', icon: '🔥', category: 'card_back', rarity: 'common', price: 75 },
  { id: 'cards_ocean', name: 'Ocean Cards', description: 'Cool and calm', icon: '🌊', category: 'card_back', rarity: 'common', price: 75 },
  { id: 'cards_galaxy', name: 'Galaxy Cards', description: 'Cosmic style', icon: '🌌', category: 'card_back', rarity: 'rare', price: 200 },
  { id: 'cards_gold', name: 'Gold Cards', description: 'Pure luxury', icon: '✨', category: 'card_back', rarity: 'epic', price: 400 },
  { id: 'cards_skull', name: 'Skull Cards', description: 'Death dealer', icon: '💀', category: 'card_back', rarity: 'rare', price: 200 },
  { id: 'cards_rainbow', name: 'Rainbow Cards', description: 'Lucky colors', icon: '🌈', category: 'card_back', rarity: 'legendary', price: 600 },

  // Sound Packs
  { id: 'sound_casino', name: 'Vegas Casino', description: 'Classic casino sounds', icon: '🎰', category: 'sound_pack', rarity: 'common', price: 100 },
  { id: 'sound_arcade', name: 'Retro Arcade', description: '8-bit bleeps and bloops', icon: '👾', category: 'sound_pack', rarity: 'rare', price: 200 },
  { id: 'sound_lofi', name: 'Lo-Fi Chill', description: 'Relaxing beats', icon: '🎧', category: 'sound_pack', rarity: 'rare', price: 200 },
  { id: 'sound_hiphop', name: 'Hip-Hop', description: 'Fresh beats', icon: '🎤', category: 'sound_pack', rarity: 'epic', price: 350 },

  // Taunts
  { id: 'taunt_laugh', name: 'Evil Laugh', description: 'MWAHAHAHA!', icon: '😂', category: 'taunt', rarity: 'common', price: 25 },
  { id: 'taunt_cry', name: 'Cry Baby', description: 'Boo hoo!', icon: '😭', category: 'taunt', rarity: 'common', price: 25 },
  { id: 'taunt_flex', name: 'Flex', description: 'Show off those muscles', icon: '💪', category: 'taunt', rarity: 'common', price: 25 },
  { id: 'taunt_money', name: 'Money Rain', description: 'Make it rain!', icon: '💸', category: 'taunt', rarity: 'rare', price: 75 },
  { id: 'taunt_mic', name: 'Mic Drop', description: 'Drop the mic!', icon: '🎤', category: 'taunt', rarity: 'rare', price: 75 },
  { id: 'taunt_crown', name: 'Crown Me', description: 'Bow down!', icon: '👑', category: 'taunt', rarity: 'epic', price: 150 },
  { id: 'taunt_skull', name: 'RIP', description: 'Rest in pieces', icon: '💀', category: 'taunt', rarity: 'epic', price: 150 },
  { id: 'taunt_explosion', name: 'Mind Blown', description: 'BOOM!', icon: '🤯', category: 'taunt', rarity: 'legendary', price: 250 },
];

const WALLET_KEY = 'guts_wallet';

export function getDefaultWallet(): Wallet {
  return {
    items: [],
    equippedAvatar: null,
    equippedCardBack: null,
    equippedSoundPack: null,
    luckyNumber: null,
  };
}

export function loadWallet(): Wallet {
  if (typeof window === 'undefined') return getDefaultWallet();
  try {
    const data = localStorage.getItem(WALLET_KEY);
    return data ? { ...getDefaultWallet(), ...JSON.parse(data) } : getDefaultWallet();
  } catch {
    return getDefaultWallet();
  }
}

export function saveWallet(wallet: Wallet): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WALLET_KEY, JSON.stringify(wallet));
  } catch (e) {
    console.error('Failed to save wallet:', e);
  }
}

export function purchaseItem(itemId: string, currentTokens: number): { success: boolean; newTokens: number; wallet: Wallet } {
  const shopItem = SHOP_ITEMS.find(i => i.id === itemId);
  if (!shopItem) {
    return { success: false, newTokens: currentTokens, wallet: loadWallet() };
  }

  if (currentTokens < shopItem.price) {
    return { success: false, newTokens: currentTokens, wallet: loadWallet() };
  }

  const wallet = loadWallet();
  const existingItem = wallet.items.find(i => i.id === itemId);

  if (existingItem) {
    existingItem.owned += 1;
  } else {
    wallet.items.push({ ...shopItem, owned: 1 });
  }

  saveWallet(wallet);
  return { success: true, newTokens: currentTokens - shopItem.price, wallet };
}

export function equipItem(itemId: string, category: ItemCategory): Wallet {
  const wallet = loadWallet();
  const item = wallet.items.find(i => i.id === itemId);

  if (!item || item.owned < 1) return wallet;

  // Unequip previous
  wallet.items.forEach(i => {
    if (i.category === category) i.equipped = false;
  });

  item.equipped = true;

  switch (category) {
    case 'avatar':
      wallet.equippedAvatar = itemId;
      break;
    case 'card_back':
      wallet.equippedCardBack = itemId;
      break;
    case 'sound_pack':
      wallet.equippedSoundPack = itemId;
      break;
  }

  saveWallet(wallet);
  return wallet;
}

export function setLuckyNumber(num: number): Wallet {
  const wallet = loadWallet();
  wallet.luckyNumber = num >= 2 && num <= 14 ? num : null;
  saveWallet(wallet);
  return wallet;
}

export function addItemToWallet(itemId: string, count: number = 1): Wallet {
  const wallet = loadWallet();
  const shopItem = SHOP_ITEMS.find(i => i.id === itemId);
  if (!shopItem) return wallet;

  const existingItem = wallet.items.find(i => i.id === itemId);
  if (existingItem) {
    existingItem.owned += count;
  } else {
    wallet.items.push({ ...shopItem, owned: count });
  }

  saveWallet(wallet);
  return wallet;
}

export function getOwnedItems(category?: ItemCategory): WalletItem[] {
  const wallet = loadWallet();
  const items = wallet.items.filter(i => i.owned > 0);
  return category ? items.filter(i => i.category === category) : items;
}

export function hasItem(itemId: string): boolean {
  const wallet = loadWallet();
  const item = wallet.items.find(i => i.id === itemId);
  return item ? item.owned > 0 : false;
}
