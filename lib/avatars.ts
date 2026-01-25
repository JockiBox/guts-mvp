// Avatar Customization System for GUTS

export type AvatarPartType =
  | 'base'       // Base character skin/body
  | 'hair'       // Hair style
  | 'eyes'       // Eye style
  | 'mouth'      // Mouth/expression
  | 'hat'        // Hats and headwear
  | 'glasses'    // Glasses and eyewear
  | 'accessory'  // Necklaces, earrings, etc
  | 'outfit'     // Full body outfits
  | 'background' // Background effect
  | 'frame';     // Frame around avatar

export interface AvatarItem {
  id: string;
  type: AvatarPartType;
  name: string;
  description: string;
  emoji: string;      // Preview emoji
  cost: number;       // Token cost
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlockLevel?: number; // VIP level required to purchase
  colors?: string[];   // Available colors for this item
  isDefault?: boolean; // Free default items
}

export interface PlayerAvatar {
  base: string;
  hair?: string;
  eyes?: string;
  mouth?: string;
  hat?: string;
  glasses?: string;
  accessory?: string;
  outfit?: string;
  background?: string;
  frame?: string;
  colors: Record<string, string>; // Part ID -> color
}

// Default avatar configuration
export const DEFAULT_AVATAR: PlayerAvatar = {
  base: 'base_default',
  eyes: 'eyes_default',
  mouth: 'mouth_default',
  colors: {},
};

// All available avatar items
export const AVATAR_ITEMS: AvatarItem[] = [
  // === BASE SKINS ===
  { id: 'base_default', type: 'base', name: 'Classic', description: 'The classic look', emoji: '😊', cost: 0, rarity: 'common', isDefault: true },
  { id: 'base_cool', type: 'base', name: 'Cool Cat', description: 'Too cool for school', emoji: '😎', cost: 100, rarity: 'common' },
  { id: 'base_royal', type: 'base', name: 'Royal', description: 'Born to rule', emoji: '👑', cost: 500, rarity: 'rare' },
  { id: 'base_robot', type: 'base', name: 'Robot', description: 'Beep boop', emoji: '🤖', cost: 750, rarity: 'epic' },
  { id: 'base_alien', type: 'base', name: 'Alien', description: 'Out of this world', emoji: '👽', cost: 1000, rarity: 'legendary' },
  { id: 'base_ghost', type: 'base', name: 'Ghost', description: 'Spooky player', emoji: '👻', cost: 666, rarity: 'epic' },
  { id: 'base_devil', type: 'base', name: 'Devil', description: 'Feeling devilish', emoji: '😈', cost: 999, rarity: 'legendary' },

  // === HAIR STYLES ===
  { id: 'hair_none', type: 'hair', name: 'Bald', description: 'Clean and simple', emoji: '🧑‍🦲', cost: 0, rarity: 'common', isDefault: true },
  { id: 'hair_spiky', type: 'hair', name: 'Spiky', description: 'Edgy look', emoji: '🦔', cost: 50, rarity: 'common' },
  { id: 'hair_curly', type: 'hair', name: 'Curly', description: 'Natural curls', emoji: '🦱', cost: 50, rarity: 'common' },
  { id: 'hair_long', type: 'hair', name: 'Long', description: 'Flowing locks', emoji: '💇', cost: 75, rarity: 'uncommon' },
  { id: 'hair_mohawk', type: 'hair', name: 'Mohawk', description: 'Punk rock', emoji: '🎸', cost: 150, rarity: 'rare' },
  { id: 'hair_afro', type: 'hair', name: 'Afro', description: 'Big and bold', emoji: '🌟', cost: 100, rarity: 'uncommon' },
  { id: 'hair_fire', type: 'hair', name: 'Fire Hair', description: 'Hot headed', emoji: '🔥', cost: 500, rarity: 'legendary' },

  // === EYES ===
  { id: 'eyes_default', type: 'eyes', name: 'Normal', description: 'Regular eyes', emoji: '👀', cost: 0, rarity: 'common', isDefault: true },
  { id: 'eyes_heart', type: 'eyes', name: 'Heart Eyes', description: 'Feeling the love', emoji: '😍', cost: 100, rarity: 'uncommon' },
  { id: 'eyes_star', type: 'eyes', name: 'Star Eyes', description: 'Starstruck', emoji: '🤩', cost: 150, rarity: 'rare' },
  { id: 'eyes_money', type: 'eyes', name: 'Money Eyes', description: 'Cha-ching!', emoji: '🤑', cost: 300, rarity: 'epic' },
  { id: 'eyes_laser', type: 'eyes', name: 'Laser Eyes', description: 'Pew pew', emoji: '👁️‍🗨️', cost: 750, rarity: 'legendary' },
  { id: 'eyes_anime', type: 'eyes', name: 'Anime Eyes', description: 'Kawaii!', emoji: '✨', cost: 200, rarity: 'rare' },

  // === MOUTH ===
  { id: 'mouth_default', type: 'mouth', name: 'Normal', description: 'Regular smile', emoji: '😊', cost: 0, rarity: 'common', isDefault: true },
  { id: 'mouth_grin', type: 'mouth', name: 'Big Grin', description: 'Extra happy', emoji: '😁', cost: 50, rarity: 'common' },
  { id: 'mouth_smirk', type: 'mouth', name: 'Smirk', description: 'Feeling smug', emoji: '😏', cost: 75, rarity: 'uncommon' },
  { id: 'mouth_fangs', type: 'mouth', name: 'Fangs', description: 'Vampire vibes', emoji: '🧛', cost: 200, rarity: 'rare' },
  { id: 'mouth_gold', type: 'mouth', name: 'Gold Teeth', description: 'Blinged out', emoji: '💰', cost: 500, rarity: 'epic' },

  // === HATS ===
  { id: 'hat_none', type: 'hat', name: 'None', description: 'No hat', emoji: '❌', cost: 0, rarity: 'common', isDefault: true },
  { id: 'hat_cap', type: 'hat', name: 'Baseball Cap', description: 'Casual style', emoji: '🧢', cost: 100, rarity: 'common' },
  { id: 'hat_tophat', type: 'hat', name: 'Top Hat', description: 'Fancy gentleman', emoji: '🎩', cost: 250, rarity: 'rare' },
  { id: 'hat_crown', type: 'hat', name: 'Crown', description: 'Royalty', emoji: '👑', cost: 1000, rarity: 'legendary' },
  { id: 'hat_cowboy', type: 'hat', name: 'Cowboy', description: 'Yeehaw!', emoji: '🤠', cost: 200, rarity: 'uncommon' },
  { id: 'hat_wizard', type: 'hat', name: 'Wizard Hat', description: 'Magical', emoji: '🧙', cost: 400, rarity: 'epic' },
  { id: 'hat_halo', type: 'hat', name: 'Halo', description: 'Angelic', emoji: '😇', cost: 500, rarity: 'epic' },
  { id: 'hat_horns', type: 'hat', name: 'Devil Horns', description: 'Devilish', emoji: '😈', cost: 500, rarity: 'epic' },
  { id: 'hat_party', type: 'hat', name: 'Party Hat', description: 'Celebration time', emoji: '🥳', cost: 150, rarity: 'uncommon' },

  // === GLASSES ===
  { id: 'glasses_none', type: 'glasses', name: 'None', description: 'No glasses', emoji: '❌', cost: 0, rarity: 'common', isDefault: true },
  { id: 'glasses_cool', type: 'glasses', name: 'Sunglasses', description: 'So cool', emoji: '🕶️', cost: 100, rarity: 'common' },
  { id: 'glasses_nerd', type: 'glasses', name: 'Nerd Glasses', description: 'Intellectual', emoji: '🤓', cost: 75, rarity: 'common' },
  { id: 'glasses_monocle', type: 'glasses', name: 'Monocle', description: 'Distinguished', emoji: '🧐', cost: 300, rarity: 'rare' },
  { id: 'glasses_3d', type: 'glasses', name: '3D Glasses', description: 'Retro cool', emoji: '👓', cost: 150, rarity: 'uncommon' },
  { id: 'glasses_vr', type: 'glasses', name: 'VR Headset', description: 'Future gamer', emoji: '🥽', cost: 500, rarity: 'epic' },

  // === ACCESSORIES ===
  { id: 'acc_none', type: 'accessory', name: 'None', description: 'No accessory', emoji: '❌', cost: 0, rarity: 'common', isDefault: true },
  { id: 'acc_earring', type: 'accessory', name: 'Earring', description: 'Simple bling', emoji: '💎', cost: 100, rarity: 'common' },
  { id: 'acc_necklace', type: 'accessory', name: 'Gold Chain', description: 'Iced out', emoji: '📿', cost: 300, rarity: 'rare' },
  { id: 'acc_cigar', type: 'accessory', name: 'Cigar', description: 'High roller', emoji: '🚬', cost: 400, rarity: 'epic' },
  { id: 'acc_microphone', type: 'accessory', name: 'Microphone', description: 'Ready to perform', emoji: '🎤', cost: 200, rarity: 'uncommon' },
  { id: 'acc_flower', type: 'accessory', name: 'Flower', description: 'Natural beauty', emoji: '🌸', cost: 100, rarity: 'common' },

  // === OUTFITS ===
  { id: 'outfit_default', type: 'outfit', name: 'Casual', description: 'Everyday look', emoji: '👕', cost: 0, rarity: 'common', isDefault: true },
  { id: 'outfit_suit', type: 'outfit', name: 'Business Suit', description: 'Professional', emoji: '🤵', cost: 300, rarity: 'rare' },
  { id: 'outfit_tux', type: 'outfit', name: 'Tuxedo', description: 'Black tie event', emoji: '🎭', cost: 500, rarity: 'epic' },
  { id: 'outfit_hoodie', type: 'outfit', name: 'Hoodie', description: 'Comfy style', emoji: '🧥', cost: 150, rarity: 'uncommon' },
  { id: 'outfit_jersey', type: 'outfit', name: 'Sports Jersey', description: 'Game day', emoji: '👚', cost: 200, rarity: 'uncommon' },
  { id: 'outfit_royal', type: 'outfit', name: 'Royal Robe', description: 'Fit for a king', emoji: '👘', cost: 1000, rarity: 'legendary' },
  { id: 'outfit_astronaut', type: 'outfit', name: 'Space Suit', description: 'To infinity!', emoji: '🧑‍🚀', cost: 750, rarity: 'epic' },
  { id: 'outfit_ninja', type: 'outfit', name: 'Ninja', description: 'Silent but deadly', emoji: '🥷', cost: 600, rarity: 'epic' },

  // === BACKGROUNDS ===
  { id: 'bg_none', type: 'background', name: 'None', description: 'No background', emoji: '❌', cost: 0, rarity: 'common', isDefault: true },
  { id: 'bg_fire', type: 'background', name: 'Fire', description: 'Burning hot', emoji: '🔥', cost: 200, rarity: 'rare' },
  { id: 'bg_sparkle', type: 'background', name: 'Sparkles', description: 'Shiny!', emoji: '✨', cost: 150, rarity: 'uncommon' },
  { id: 'bg_money', type: 'background', name: 'Money Rain', description: 'Making it rain', emoji: '💸', cost: 500, rarity: 'epic' },
  { id: 'bg_hearts', type: 'background', name: 'Hearts', description: 'Full of love', emoji: '💕', cost: 150, rarity: 'uncommon' },
  { id: 'bg_lightning', type: 'background', name: 'Lightning', description: 'Electric!', emoji: '⚡', cost: 300, rarity: 'rare' },
  { id: 'bg_rainbow', type: 'background', name: 'Rainbow', description: 'Colorful', emoji: '🌈', cost: 250, rarity: 'rare' },
  { id: 'bg_galaxy', type: 'background', name: 'Galaxy', description: 'Cosmic', emoji: '🌌', cost: 750, rarity: 'legendary' },

  // === FRAMES ===
  { id: 'frame_none', type: 'frame', name: 'None', description: 'No frame', emoji: '❌', cost: 0, rarity: 'common', isDefault: true },
  { id: 'frame_gold', type: 'frame', name: 'Gold Frame', description: 'Premium look', emoji: '🪙', cost: 300, rarity: 'rare' },
  { id: 'frame_diamond', type: 'frame', name: 'Diamond Frame', description: 'Luxury', emoji: '💎', cost: 1000, rarity: 'legendary' },
  { id: 'frame_fire', type: 'frame', name: 'Fire Frame', description: 'Hot stuff', emoji: '🔥', cost: 500, rarity: 'epic' },
  { id: 'frame_neon', type: 'frame', name: 'Neon Frame', description: 'Glow up', emoji: '💜', cost: 400, rarity: 'epic' },
  { id: 'frame_pixel', type: 'frame', name: 'Pixel Frame', description: 'Retro gaming', emoji: '🎮', cost: 250, rarity: 'rare' },
];

// Get items by type
export function getItemsByType(type: AvatarPartType): AvatarItem[] {
  return AVATAR_ITEMS.filter(item => item.type === type);
}

// Get item by ID
export function getItemById(id: string): AvatarItem | undefined {
  return AVATAR_ITEMS.find(item => item.id === id);
}

// Get default items
export function getDefaultItems(): AvatarItem[] {
  return AVATAR_ITEMS.filter(item => item.isDefault);
}

// Calculate total value of an avatar configuration
export function getAvatarValue(avatar: PlayerAvatar): number {
  let total = 0;
  const parts = [avatar.base, avatar.hair, avatar.eyes, avatar.mouth, avatar.hat, avatar.glasses, avatar.accessory, avatar.outfit, avatar.background, avatar.frame];
  for (const partId of parts) {
    if (partId) {
      const item = getItemById(partId);
      if (item) total += item.cost;
    }
  }
  return total;
}

// Local storage key for guest avatar
const GUEST_AVATAR_KEY = 'guts_guest_avatar';
const GUEST_OWNED_ITEMS_KEY = 'guts_guest_owned_items';

// Load guest avatar from localStorage
export function loadGuestAvatar(): PlayerAvatar {
  if (typeof window === 'undefined') return DEFAULT_AVATAR;
  try {
    const data = localStorage.getItem(GUEST_AVATAR_KEY);
    return data ? JSON.parse(data) : DEFAULT_AVATAR;
  } catch {
    return DEFAULT_AVATAR;
  }
}

// Save guest avatar to localStorage
export function saveGuestAvatar(avatar: PlayerAvatar): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GUEST_AVATAR_KEY, JSON.stringify(avatar));
  } catch (e) {
    console.error('Failed to save avatar:', e);
  }
}

// Load guest owned items from localStorage
export function loadGuestOwnedItems(): string[] {
  if (typeof window === 'undefined') return getDefaultItems().map(i => i.id);
  try {
    const data = localStorage.getItem(GUEST_OWNED_ITEMS_KEY);
    if (data) {
      return JSON.parse(data);
    }
    // Return default items if no saved data
    return getDefaultItems().map(i => i.id);
  } catch {
    return getDefaultItems().map(i => i.id);
  }
}

// Save guest owned items to localStorage
export function saveGuestOwnedItems(items: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GUEST_OWNED_ITEMS_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save owned items:', e);
  }
}

// Purchase an avatar item (guest mode)
export function purchaseGuestItem(itemId: string, currentTokens: number): { success: boolean; newTokens: number } {
  const item = getItemById(itemId);
  if (!item || currentTokens < item.cost) {
    return { success: false, newTokens: currentTokens };
  }

  const owned = loadGuestOwnedItems();
  if (!owned.includes(itemId)) {
    owned.push(itemId);
    saveGuestOwnedItems(owned);
  }

  return { success: true, newTokens: currentTokens - item.cost };
}

// Check if guest owns an item
export function guestOwnsItem(itemId: string): boolean {
  const owned = loadGuestOwnedItems();
  return owned.includes(itemId);
}

// Get rarity color
export function getRarityColor(rarity: AvatarItem['rarity']): string {
  switch (rarity) {
    case 'common': return '#94a3b8';     // Gray
    case 'uncommon': return '#22c55e';   // Green
    case 'rare': return '#3b82f6';       // Blue
    case 'epic': return '#a855f7';       // Purple
    case 'legendary': return '#f59e0b';  // Gold
  }
}

// Get rarity label
export function getRarityLabel(rarity: AvatarItem['rarity']): string {
  return rarity.charAt(0).toUpperCase() + rarity.slice(1);
}
