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
  | 'frame'      // Frame around avatar
  | 'cardStyle'  // Card appearance (glowing, holographic, etc.)
  | 'cardBack'   // Card back design
  | 'effect'     // Special visual effects
  | 'emote'      // Emote animations
  | 'entrance';  // Entrance animation when joining

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
  cardStyle?: string;   // Card appearance
  cardBack?: string;    // Card back design
  effect?: string;      // Special visual effects
  emote?: string;       // Emote pack
  entrance?: string;    // Entrance animation
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
  { id: 'base_robot', type: 'base', name: 'Cyborg X-9', description: 'Half human, all winner', emoji: '🤖', cost: 750, rarity: 'epic' },
  { id: 'base_alien', type: 'base', name: 'Xenomorph', description: 'From planet Bluffton', emoji: '👽', cost: 1000, rarity: 'legendary' },
  { id: 'base_ghost', type: 'base', name: 'Phantom', description: 'You cant beat what you cant see', emoji: '👻', cost: 666, rarity: 'epic' },
  { id: 'base_devil', type: 'base', name: 'Inferno', description: 'Plays with fire, never burns', emoji: '😈', cost: 999, rarity: 'legendary' },
  { id: 'base_skeleton', type: 'base', name: 'Bone Daddy', description: 'All bones, no bluffs', emoji: '💀', cost: 800, rarity: 'epic' },
  { id: 'base_dragon', type: 'base', name: 'Dragon Lord', description: 'Breathes fire, spits game', emoji: '🐉', cost: 1500, rarity: 'legendary' },
  { id: 'base_unicorn', type: 'base', name: 'Unicorn', description: 'Magical and majestic', emoji: '🦄', cost: 1200, rarity: 'legendary' },
  { id: 'base_zombie', type: 'base', name: 'Undead King', description: 'Back from the grave to win', emoji: '🧟', cost: 700, rarity: 'epic' },
  { id: 'base_cat', type: 'base', name: 'Lucky Cat', description: 'Nine lives, infinite luck', emoji: '🐱', cost: 400, rarity: 'rare' },
  { id: 'base_wolf', type: 'base', name: 'Alpha Wolf', description: 'Leader of the pack', emoji: '🐺', cost: 600, rarity: 'epic' },
  { id: 'base_panda', type: 'base', name: 'Zen Panda', description: 'Calm under pressure', emoji: '🐼', cost: 350, rarity: 'rare' },
  { id: 'base_octopus', type: 'base', name: 'Kraken', description: 'Eight arms, endless tricks', emoji: '🐙', cost: 850, rarity: 'epic' },

  // === HAIR STYLES ===
  { id: 'hair_none', type: 'hair', name: 'Bald Boss', description: 'Clean and intimidating', emoji: '🧑‍🦲', cost: 0, rarity: 'common', isDefault: true },
  { id: 'hair_spiky', type: 'hair', name: 'Super Saiyan', description: 'Power level over 9000', emoji: '🦔', cost: 50, rarity: 'common' },
  { id: 'hair_curly', type: 'hair', name: 'Disco King', description: 'Groovy curls', emoji: '🦱', cost: 50, rarity: 'common' },
  { id: 'hair_long', type: 'hair', name: 'Viking Flow', description: 'Warrior locks', emoji: '💇', cost: 75, rarity: 'uncommon' },
  { id: 'hair_mohawk', type: 'hair', name: 'Punk Legend', description: 'Anarchy at the table', emoji: '🎸', cost: 150, rarity: 'rare' },
  { id: 'hair_afro', type: 'hair', name: 'Soul Power', description: 'Big hair, bigger wins', emoji: '🌟', cost: 100, rarity: 'uncommon' },
  { id: 'hair_fire', type: 'hair', name: 'Inferno Mane', description: 'Hair literally on fire', emoji: '🔥', cost: 500, rarity: 'legendary' },
  { id: 'hair_rainbow', type: 'hair', name: 'Rainbow Burst', description: 'All colors, all vibes', emoji: '🌈', cost: 400, rarity: 'epic' },
  { id: 'hair_crystal', type: 'hair', name: 'Crystal Spikes', description: 'Sharp as your game', emoji: '💎', cost: 600, rarity: 'epic' },
  { id: 'hair_tentacles', type: 'hair', name: 'Medusa', description: 'Dont look directly', emoji: '🐍', cost: 750, rarity: 'legendary' },
  { id: 'hair_cloud', type: 'hair', name: 'Cloud Nine', description: 'Floating on wins', emoji: '☁️', cost: 300, rarity: 'rare' },
  { id: 'hair_lightning', type: 'hair', name: 'Storm Striker', description: 'Electric personality', emoji: '⚡', cost: 450, rarity: 'epic' },

  // === EYES ===
  { id: 'eyes_default', type: 'eyes', name: 'Normal', description: 'Regular eyes', emoji: '👀', cost: 0, rarity: 'common', isDefault: true },
  { id: 'eyes_heart', type: 'eyes', name: 'Love Struck', description: 'In love with winning', emoji: '😍', cost: 100, rarity: 'uncommon' },
  { id: 'eyes_star', type: 'eyes', name: 'Superstar', description: 'Born famous', emoji: '🤩', cost: 150, rarity: 'rare' },
  { id: 'eyes_money', type: 'eyes', name: 'Cash Vision', description: 'Only sees profits', emoji: '🤑', cost: 300, rarity: 'epic' },
  { id: 'eyes_laser', type: 'eyes', name: 'Laser Beam', description: 'Vaporizes competition', emoji: '👁️‍🗨️', cost: 750, rarity: 'legendary' },
  { id: 'eyes_anime', type: 'eyes', name: 'Kawaii', description: 'Ultra cute attack', emoji: '✨', cost: 200, rarity: 'rare' },
  { id: 'eyes_hypnotic', type: 'eyes', name: 'Hypno Spiral', description: 'You will fold...', emoji: '🌀', cost: 500, rarity: 'epic' },
  { id: 'eyes_galaxy', type: 'eyes', name: 'Cosmic Gaze', description: 'See the universe', emoji: '🌌', cost: 600, rarity: 'epic' },
  { id: 'eyes_fire', type: 'eyes', name: 'Hellfire Eyes', description: 'Burning stare', emoji: '🔥', cost: 450, rarity: 'epic' },
  { id: 'eyes_diamond', type: 'eyes', name: 'Diamond Eyes', description: 'Precious vision', emoji: '💎', cost: 800, rarity: 'legendary' },
  { id: 'eyes_cyber', type: 'eyes', name: 'Cyber Scan', description: 'X-ray your cards', emoji: '🔴', cost: 550, rarity: 'epic' },
  { id: 'eyes_rainbow', type: 'eyes', name: 'Prism Vision', description: 'See all possibilities', emoji: '🌈', cost: 400, rarity: 'rare' },

  // === MOUTH ===
  { id: 'mouth_default', type: 'mouth', name: 'Normal', description: 'Regular smile', emoji: '😊', cost: 0, rarity: 'common', isDefault: true },
  { id: 'mouth_grin', type: 'mouth', name: 'Winner Grin', description: 'Knows something you dont', emoji: '😁', cost: 50, rarity: 'common' },
  { id: 'mouth_smirk', type: 'mouth', name: 'Poker Smirk', description: 'The ultimate bluff face', emoji: '😏', cost: 75, rarity: 'uncommon' },
  { id: 'mouth_fangs', type: 'mouth', name: 'Vampire Bite', description: 'Sucks the life from losers', emoji: '🧛', cost: 200, rarity: 'rare' },
  { id: 'mouth_gold', type: 'mouth', name: 'Diamond Grill', description: 'Mouth full of bling', emoji: '💰', cost: 500, rarity: 'epic' },
  { id: 'mouth_fire', type: 'mouth', name: 'Fire Breath', description: 'Spitting hot takes', emoji: '🔥', cost: 400, rarity: 'epic' },
  { id: 'mouth_rainbow', type: 'mouth', name: 'Rainbow Smile', description: 'Spreads joy, takes pots', emoji: '🌈', cost: 300, rarity: 'rare' },
  { id: 'mouth_skull', type: 'mouth', name: 'Skull Grin', description: 'Death smiles at all', emoji: '💀', cost: 350, rarity: 'rare' },
  { id: 'mouth_laser', type: 'mouth', name: 'Beam Blaster', description: 'Mouth laser cannon', emoji: '⚡', cost: 600, rarity: 'legendary' },

  // === HATS ===
  { id: 'hat_none', type: 'hat', name: 'None', description: 'No hat', emoji: '❌', cost: 0, rarity: 'common', isDefault: true },
  { id: 'hat_cap', type: 'hat', name: 'Snapback', description: 'Backwards = serious mode', emoji: '🧢', cost: 100, rarity: 'common' },
  { id: 'hat_tophat', type: 'hat', name: 'Gentleman', description: 'Old money energy', emoji: '🎩', cost: 250, rarity: 'rare' },
  { id: 'hat_crown', type: 'hat', name: 'Royal Crown', description: 'The ultimate flex', emoji: '👑', cost: 1000, rarity: 'legendary' },
  { id: 'hat_cowboy', type: 'hat', name: 'Outlaw', description: 'Dead or alive', emoji: '🤠', cost: 200, rarity: 'uncommon' },
  { id: 'hat_wizard', type: 'hat', name: 'Archmage', description: 'Master of card magic', emoji: '🧙', cost: 400, rarity: 'epic' },
  { id: 'hat_halo', type: 'hat', name: 'Divine Halo', description: 'Blessed by RNG gods', emoji: '😇', cost: 500, rarity: 'epic' },
  { id: 'hat_horns', type: 'hat', name: 'Demon Horns', description: 'Made a deal for luck', emoji: '😈', cost: 500, rarity: 'epic' },
  { id: 'hat_party', type: 'hat', name: 'Party King', description: 'Every win is a party', emoji: '🥳', cost: 150, rarity: 'uncommon' },
  { id: 'hat_space', type: 'hat', name: 'Space Helmet', description: 'Intergalactic champion', emoji: '🚀', cost: 600, rarity: 'epic' },
  { id: 'hat_viking', type: 'hat', name: 'Viking Helm', description: 'Pillage the pot', emoji: '⚔️', cost: 450, rarity: 'epic' },
  { id: 'hat_pirate', type: 'hat', name: 'Pirate Captain', description: 'Arr, your tokens be mine', emoji: '🏴‍☠️', cost: 400, rarity: 'epic' },
  { id: 'hat_samurai', type: 'hat', name: 'Samurai Helm', description: 'Way of the card', emoji: '⛩️', cost: 550, rarity: 'epic' },
  { id: 'hat_pharaoh', type: 'hat', name: 'Pharaoh Crown', description: 'Ancient power', emoji: '🐪', cost: 800, rarity: 'legendary' },
  { id: 'hat_flame', type: 'hat', name: 'Flame Crown', description: 'Head on fire', emoji: '🔥', cost: 700, rarity: 'legendary' },
  { id: 'hat_ice', type: 'hat', name: 'Ice Crown', description: 'Cold-blooded winner', emoji: '❄️', cost: 700, rarity: 'legendary' },

  // === GLASSES ===
  { id: 'glasses_none', type: 'glasses', name: 'None', description: 'No glasses', emoji: '❌', cost: 0, rarity: 'common', isDefault: true },
  { id: 'glasses_cool', type: 'glasses', name: 'Aviators', description: 'Top Gun vibes', emoji: '🕶️', cost: 100, rarity: 'common' },
  { id: 'glasses_nerd', type: 'glasses', name: 'Big Brain', description: 'Calculated every odd', emoji: '🤓', cost: 75, rarity: 'common' },
  { id: 'glasses_monocle', type: 'glasses', name: 'Aristocrat', description: 'I say, jolly good hand', emoji: '🧐', cost: 300, rarity: 'rare' },
  { id: 'glasses_3d', type: 'glasses', name: 'Retro 3D', description: 'Seeing in dimensions', emoji: '👓', cost: 150, rarity: 'uncommon' },
  { id: 'glasses_vr', type: 'glasses', name: 'VR Pro', description: 'Playing in the metaverse', emoji: '🥽', cost: 500, rarity: 'epic' },
  { id: 'glasses_cyber', type: 'glasses', name: 'Cyberpunk', description: 'Hacking the matrix', emoji: '🔴', cost: 600, rarity: 'epic' },
  { id: 'glasses_star', type: 'glasses', name: 'Starshades', description: 'Celebrity status', emoji: '⭐', cost: 400, rarity: 'epic' },
  { id: 'glasses_flame', type: 'glasses', name: 'Flame Shades', description: 'Too hot to handle', emoji: '🔥', cost: 450, rarity: 'epic' },
  { id: 'glasses_diamond', type: 'glasses', name: 'Diamond Shades', description: 'Blindingly rich', emoji: '💎', cost: 800, rarity: 'legendary' },
  { id: 'glasses_rainbow', type: 'glasses', name: 'Prism Shades', description: 'Seeing all the colors', emoji: '🌈', cost: 350, rarity: 'rare' },

  // === ACCESSORIES ===
  { id: 'acc_none', type: 'accessory', name: 'None', description: 'No accessory', emoji: '❌', cost: 0, rarity: 'common', isDefault: true },
  { id: 'acc_earring', type: 'accessory', name: 'Diamond Stud', description: 'Subtle flex', emoji: '💎', cost: 100, rarity: 'common' },
  { id: 'acc_necklace', type: 'accessory', name: 'Cuban Link', description: 'Heavy chains, heavy wins', emoji: '📿', cost: 300, rarity: 'rare' },
  { id: 'acc_cigar', type: 'accessory', name: 'Victory Cigar', description: 'Only for winners', emoji: '🚬', cost: 400, rarity: 'epic' },
  { id: 'acc_microphone', type: 'accessory', name: 'Hype Mic', description: 'Commentating my own wins', emoji: '🎤', cost: 200, rarity: 'uncommon' },
  { id: 'acc_flower', type: 'accessory', name: 'Lucky Flower', description: 'Blooming fortune', emoji: '🌸', cost: 100, rarity: 'common' },
  { id: 'acc_pet_dragon', type: 'accessory', name: 'Mini Dragon', description: 'Shoulder companion', emoji: '🐲', cost: 900, rarity: 'legendary' },
  { id: 'acc_pet_phoenix', type: 'accessory', name: 'Phoenix Pet', description: 'Rises from losses', emoji: '🦅', cost: 850, rarity: 'legendary' },
  { id: 'acc_floating_cards', type: 'accessory', name: 'Floating Cards', description: 'Cards orbit you', emoji: '🃏', cost: 600, rarity: 'epic' },
  { id: 'acc_magic_orb', type: 'accessory', name: 'Fortune Orb', description: 'Sees the future', emoji: '🔮', cost: 500, rarity: 'epic' },
  { id: 'acc_lightning', type: 'accessory', name: 'Thunder Aura', description: 'Crackling energy', emoji: '⚡', cost: 550, rarity: 'epic' },
  { id: 'acc_crown_jewels', type: 'accessory', name: 'Crown Jewels', description: 'Dripping in gems', emoji: '👑', cost: 750, rarity: 'legendary' },
  { id: 'acc_sword', type: 'accessory', name: 'Legendary Blade', description: 'Cuts through bluffs', emoji: '⚔️', cost: 450, rarity: 'epic' },
  { id: 'acc_wings', type: 'accessory', name: 'Angel Wings', description: 'Divine protection', emoji: '🪽', cost: 700, rarity: 'legendary' },
  { id: 'acc_demon_wings', type: 'accessory', name: 'Demon Wings', description: 'Dark power', emoji: '🦇', cost: 700, rarity: 'legendary' },

  // === OUTFITS ===
  { id: 'outfit_default', type: 'outfit', name: 'Casual', description: 'Everyday look', emoji: '👕', cost: 0, rarity: 'common', isDefault: true },
  { id: 'outfit_suit', type: 'outfit', name: 'Power Suit', description: 'Means business', emoji: '🤵', cost: 300, rarity: 'rare' },
  { id: 'outfit_tux', type: 'outfit', name: 'James Bond', description: 'Shaken, not stirred', emoji: '🎭', cost: 500, rarity: 'epic' },
  { id: 'outfit_hoodie', type: 'outfit', name: 'Hacker Hoodie', description: 'Anonymous winner', emoji: '🧥', cost: 150, rarity: 'uncommon' },
  { id: 'outfit_jersey', type: 'outfit', name: 'MVP Jersey', description: 'Hall of fame', emoji: '👚', cost: 200, rarity: 'uncommon' },
  { id: 'outfit_royal', type: 'outfit', name: 'Emperor Robe', description: 'Supreme ruler', emoji: '👘', cost: 1000, rarity: 'legendary' },
  { id: 'outfit_astronaut', type: 'outfit', name: 'Moonwalker', description: 'One small step for cards', emoji: '🧑‍🚀', cost: 750, rarity: 'epic' },
  { id: 'outfit_ninja', type: 'outfit', name: 'Shadow Ninja', description: 'Strike from darkness', emoji: '🥷', cost: 600, rarity: 'epic' },
  { id: 'outfit_samurai', type: 'outfit', name: 'Ronin Armor', description: 'Masterless warrior', emoji: '⚔️', cost: 800, rarity: 'legendary' },
  { id: 'outfit_pirate', type: 'outfit', name: 'Pirate Lord', description: 'Captain of the pot', emoji: '🏴‍☠️', cost: 650, rarity: 'epic' },
  { id: 'outfit_cyber', type: 'outfit', name: 'Neon Cyborg', description: 'Year 3000 drip', emoji: '🤖', cost: 850, rarity: 'legendary' },
  { id: 'outfit_dragon', type: 'outfit', name: 'Dragon Scale', description: 'Armored in legend', emoji: '🐉', cost: 1200, rarity: 'legendary' },
  { id: 'outfit_phoenix', type: 'outfit', name: 'Phoenix Feathers', description: 'Born from flame', emoji: '🔥', cost: 1100, rarity: 'legendary' },
  { id: 'outfit_god', type: 'outfit', name: 'Olympian Toga', description: 'Among the gods', emoji: '⚡', cost: 1500, rarity: 'legendary' },
  { id: 'outfit_vampire', type: 'outfit', name: 'Vampire Lord', description: 'Eternal winner', emoji: '🧛', cost: 700, rarity: 'epic' },
  { id: 'outfit_wizard', type: 'outfit', name: 'Grand Wizard', description: 'Supreme sorcerer', emoji: '🧙', cost: 900, rarity: 'legendary' },

  // === BACKGROUNDS ===
  { id: 'bg_none', type: 'background', name: 'None', description: 'No background', emoji: '❌', cost: 0, rarity: 'common', isDefault: true },
  { id: 'bg_fire', type: 'background', name: 'Inferno', description: 'Engulfed in flames', emoji: '🔥', cost: 200, rarity: 'rare' },
  { id: 'bg_sparkle', type: 'background', name: 'Diamond Rain', description: 'Showered in gems', emoji: '✨', cost: 150, rarity: 'uncommon' },
  { id: 'bg_money', type: 'background', name: 'Money Tornado', description: 'Cash cyclone', emoji: '💸', cost: 500, rarity: 'epic' },
  { id: 'bg_hearts', type: 'background', name: 'Love Storm', description: 'Hearts everywhere', emoji: '💕', cost: 150, rarity: 'uncommon' },
  { id: 'bg_lightning', type: 'background', name: 'Thunder Storm', description: 'Electric chaos', emoji: '⚡', cost: 300, rarity: 'rare' },
  { id: 'bg_rainbow', type: 'background', name: 'Rainbow Vortex', description: 'Prismatic power', emoji: '🌈', cost: 250, rarity: 'rare' },
  { id: 'bg_galaxy', type: 'background', name: 'Cosmic Void', description: 'Universe bends to you', emoji: '🌌', cost: 750, rarity: 'legendary' },
  { id: 'bg_matrix', type: 'background', name: 'Digital Matrix', description: 'See the code', emoji: '💻', cost: 400, rarity: 'epic' },
  { id: 'bg_vortex', type: 'background', name: 'Black Hole', description: 'Gravity of a winner', emoji: '🕳️', cost: 600, rarity: 'epic' },
  { id: 'bg_aurora', type: 'background', name: 'Northern Lights', description: 'Ethereal glow', emoji: '🌌', cost: 450, rarity: 'epic' },
  { id: 'bg_lava', type: 'background', name: 'Volcanic Eruption', description: 'Explosive energy', emoji: '🌋', cost: 500, rarity: 'epic' },
  { id: 'bg_ice', type: 'background', name: 'Frozen Realm', description: 'Sub-zero cool', emoji: '❄️', cost: 400, rarity: 'epic' },
  { id: 'bg_sakura', type: 'background', name: 'Cherry Blossoms', description: 'Peaceful power', emoji: '🌸', cost: 350, rarity: 'rare' },
  { id: 'bg_neon', type: 'background', name: 'Neon City', description: 'Cyberpunk vibes', emoji: '🌃', cost: 550, rarity: 'epic' },
  { id: 'bg_portal', type: 'background', name: 'Dimensional Rift', description: 'Reality warper', emoji: '🌀', cost: 800, rarity: 'legendary' },

  // === FRAMES ===
  { id: 'frame_none', type: 'frame', name: 'None', description: 'No frame', emoji: '❌', cost: 0, rarity: 'common', isDefault: true },
  { id: 'frame_gold', type: 'frame', name: 'Solid Gold', description: '24 karat flex', emoji: '🪙', cost: 300, rarity: 'rare' },
  { id: 'frame_diamond', type: 'frame', name: 'Diamond Encrusted', description: 'Blinding wealth', emoji: '💎', cost: 1000, rarity: 'legendary' },
  { id: 'frame_fire', type: 'frame', name: 'Ring of Fire', description: 'Burning border', emoji: '🔥', cost: 500, rarity: 'epic' },
  { id: 'frame_neon', type: 'frame', name: 'Neon Glow', description: 'Cyberpunk edge', emoji: '💜', cost: 400, rarity: 'epic' },
  { id: 'frame_pixel', type: 'frame', name: '8-Bit Legend', description: 'Retro champion', emoji: '🎮', cost: 250, rarity: 'rare' },
  { id: 'frame_lightning', type: 'frame', name: 'Thunder Border', description: 'Electrifying presence', emoji: '⚡', cost: 450, rarity: 'epic' },
  { id: 'frame_rainbow', type: 'frame', name: 'Prismatic Frame', description: 'All the colors', emoji: '🌈', cost: 350, rarity: 'rare' },
  { id: 'frame_skull', type: 'frame', name: 'Skull Border', description: 'Death dealer', emoji: '💀', cost: 400, rarity: 'epic' },
  { id: 'frame_dragon', type: 'frame', name: 'Dragon Border', description: 'Serpent guardians', emoji: '🐉', cost: 750, rarity: 'legendary' },
  { id: 'frame_galaxy', type: 'frame', name: 'Cosmic Ring', description: 'Star-studded edge', emoji: '🌌', cost: 600, rarity: 'epic' },
  { id: 'frame_ice', type: 'frame', name: 'Frozen Border', description: 'Ice cold killer', emoji: '❄️', cost: 400, rarity: 'epic' },
  { id: 'frame_animated', type: 'frame', name: 'Living Frame', description: 'Moves and breathes', emoji: '✨', cost: 900, rarity: 'legendary' },

  // === CARD STYLES (Glowing cards, holographic, etc.) ===
  { id: 'card_default', type: 'cardStyle', name: 'Classic Cards', description: 'Standard playing cards', emoji: '🃏', cost: 0, rarity: 'common', isDefault: true },
  { id: 'card_glow_blue', type: 'cardStyle', name: 'Blue Glow', description: 'Cards glow electric blue', emoji: '💙', cost: 200, rarity: 'rare' },
  { id: 'card_glow_gold', type: 'cardStyle', name: 'Golden Aura', description: 'Cards shimmer with gold', emoji: '✨', cost: 350, rarity: 'epic' },
  { id: 'card_glow_purple', type: 'cardStyle', name: 'Mystic Purple', description: 'Arcane energy pulses', emoji: '💜', cost: 300, rarity: 'rare' },
  { id: 'card_glow_green', type: 'cardStyle', name: 'Toxic Glow', description: 'Radioactive green aura', emoji: '💚', cost: 250, rarity: 'rare' },
  { id: 'card_glow_red', type: 'cardStyle', name: 'Crimson Fire', description: 'Cards burn with passion', emoji: '❤️', cost: 300, rarity: 'rare' },
  { id: 'card_glow_rainbow', type: 'cardStyle', name: 'Rainbow Pulse', description: 'Color-shifting aura', emoji: '🌈', cost: 600, rarity: 'legendary' },
  { id: 'card_holographic', type: 'cardStyle', name: 'Holographic', description: 'Shimmering holo effect', emoji: '🌟', cost: 500, rarity: 'epic' },
  { id: 'card_neon', type: 'cardStyle', name: 'Neon Edge', description: 'Glowing neon outlines', emoji: '💫', cost: 400, rarity: 'epic' },
  { id: 'card_fire', type: 'cardStyle', name: 'Flaming Cards', description: 'Cards literally on fire', emoji: '🔥', cost: 550, rarity: 'epic' },
  { id: 'card_ice', type: 'cardStyle', name: 'Frozen Cards', description: 'Encased in beautiful ice', emoji: '❄️', cost: 450, rarity: 'epic' },
  { id: 'card_lightning', type: 'cardStyle', name: 'Lightning Strike', description: 'Crackling with electricity', emoji: '⚡', cost: 500, rarity: 'epic' },
  { id: 'card_galaxy', type: 'cardStyle', name: 'Cosmic Cards', description: 'Swirling galaxies inside', emoji: '🌌', cost: 800, rarity: 'legendary' },
  { id: 'card_diamond', type: 'cardStyle', name: 'Diamond Encrusted', description: 'Covered in gems', emoji: '💎', cost: 1000, rarity: 'legendary' },
  { id: 'card_shadow', type: 'cardStyle', name: 'Shadow Cards', description: 'Dark smoke wisps around', emoji: '🖤', cost: 400, rarity: 'epic' },
  { id: 'card_plasma', type: 'cardStyle', name: 'Plasma Core', description: 'Pulsing energy core', emoji: '🔮', cost: 650, rarity: 'legendary' },
  { id: 'card_void', type: 'cardStyle', name: 'Void Walker', description: 'Cards bend reality', emoji: '🕳️', cost: 900, rarity: 'legendary' },
  { id: 'card_sakura', type: 'cardStyle', name: 'Cherry Blossom', description: 'Petals fall from cards', emoji: '🌸', cost: 350, rarity: 'rare' },
  { id: 'card_gold_plated', type: 'cardStyle', name: '24K Gold', description: 'Solid gold cards', emoji: '🏆', cost: 750, rarity: 'legendary' },
  { id: 'card_matrix', type: 'cardStyle', name: 'Matrix Code', description: 'Digital rain overlay', emoji: '💻', cost: 450, rarity: 'epic' },

  // === CARD BACKS ===
  { id: 'back_default', type: 'cardBack', name: 'Classic Red', description: 'Traditional card back', emoji: '🎴', cost: 0, rarity: 'common', isDefault: true },
  { id: 'back_dragon', type: 'cardBack', name: 'Dragon Design', description: 'Fierce dragon artwork', emoji: '🐉', cost: 300, rarity: 'rare' },
  { id: 'back_skull', type: 'cardBack', name: 'Skull & Bones', description: 'Pirate themed', emoji: '💀', cost: 250, rarity: 'rare' },
  { id: 'back_galaxy', type: 'cardBack', name: 'Deep Space', description: 'Cosmic pattern', emoji: '🌌', cost: 400, rarity: 'epic' },
  { id: 'back_royal', type: 'cardBack', name: 'Royal Crest', description: 'Noble emblem', emoji: '👑', cost: 350, rarity: 'epic' },
  { id: 'back_neon', type: 'cardBack', name: 'Neon Grid', description: 'Cyberpunk grid', emoji: '💜', cost: 300, rarity: 'rare' },
  { id: 'back_fire', type: 'cardBack', name: 'Hellfire', description: 'Burning flames', emoji: '🔥', cost: 400, rarity: 'epic' },
  { id: 'back_ice', type: 'cardBack', name: 'Frozen Tundra', description: 'Ice crystals', emoji: '❄️', cost: 350, rarity: 'epic' },
  { id: 'back_money', type: 'cardBack', name: 'Money Stack', description: 'Show off wealth', emoji: '💵', cost: 500, rarity: 'epic' },
  { id: 'back_diamond', type: 'cardBack', name: 'Diamond Pattern', description: 'Luxury design', emoji: '💎', cost: 600, rarity: 'legendary' },
  { id: 'back_animated', type: 'cardBack', name: 'Living Art', description: 'Animated design', emoji: '✨', cost: 800, rarity: 'legendary' },
  { id: 'back_custom', type: 'cardBack', name: 'Championship', description: 'Tournament winner', emoji: '🏆', cost: 1000, rarity: 'legendary' },

  // === SPECIAL EFFECTS ===
  { id: 'effect_none', type: 'effect', name: 'No Effect', description: 'Clean and simple', emoji: '❌', cost: 0, rarity: 'common', isDefault: true },
  { id: 'effect_sparkle', type: 'effect', name: 'Sparkle Trail', description: 'Sparkles follow your moves', emoji: '✨', cost: 150, rarity: 'uncommon' },
  { id: 'effect_fire_aura', type: 'effect', name: 'Fire Aura', description: 'Flames surround you', emoji: '🔥', cost: 400, rarity: 'epic' },
  { id: 'effect_ice_aura', type: 'effect', name: 'Frost Aura', description: 'Icy mist surrounds you', emoji: '❄️', cost: 400, rarity: 'epic' },
  { id: 'effect_lightning_aura', type: 'effect', name: 'Storm Aura', description: 'Electricity crackles', emoji: '⚡', cost: 450, rarity: 'epic' },
  { id: 'effect_shadow_aura', type: 'effect', name: 'Shadow Tendrils', description: 'Dark wisps surround', emoji: '🖤', cost: 350, rarity: 'rare' },
  { id: 'effect_rainbow_aura', type: 'effect', name: 'Prismatic Aura', description: 'Rainbow energy flows', emoji: '🌈', cost: 600, rarity: 'legendary' },
  { id: 'effect_money_rain', type: 'effect', name: 'Money Rain', description: 'Coins fall around you', emoji: '💰', cost: 500, rarity: 'epic' },
  { id: 'effect_confetti', type: 'effect', name: 'Confetti Blast', description: 'Party on every win', emoji: '🎉', cost: 200, rarity: 'uncommon' },
  { id: 'effect_hearts', type: 'effect', name: 'Heart Shower', description: 'Love fills the air', emoji: '💕', cost: 200, rarity: 'uncommon' },
  { id: 'effect_stars', type: 'effect', name: 'Stardust', description: 'Stars orbit around', emoji: '⭐', cost: 300, rarity: 'rare' },
  { id: 'effect_galaxy', type: 'effect', name: 'Cosmic Swirl', description: 'Galaxies spin around', emoji: '🌌', cost: 700, rarity: 'legendary' },
  { id: 'effect_skull_float', type: 'effect', name: 'Floating Skulls', description: 'Skulls orbit you', emoji: '💀', cost: 350, rarity: 'rare' },
  { id: 'effect_cards_orbit', type: 'effect', name: 'Card Tornado', description: 'Cards spin around', emoji: '🃏', cost: 450, rarity: 'epic' },
  { id: 'effect_phoenix', type: 'effect', name: 'Phoenix Wings', description: 'Fiery wings appear on wins', emoji: '🦅', cost: 800, rarity: 'legendary' },
  { id: 'effect_dragon_roar', type: 'effect', name: 'Dragon Presence', description: 'Dragon appears on big wins', emoji: '🐉', cost: 900, rarity: 'legendary' },
  { id: 'effect_glitch', type: 'effect', name: 'Glitch Effect', description: 'Reality distorts', emoji: '📺', cost: 400, rarity: 'epic' },
  { id: 'effect_hologram', type: 'effect', name: 'Hologram Flicker', description: 'Digital projection', emoji: '💫', cost: 500, rarity: 'epic' },

  // === EMOTE PACKS ===
  { id: 'emote_default', type: 'emote', name: 'Basic Emotes', description: 'Standard reactions', emoji: '😊', cost: 0, rarity: 'common', isDefault: true },
  { id: 'emote_fire', type: 'emote', name: 'Fire Pack', description: 'Flaming reactions', emoji: '🔥', cost: 150, rarity: 'uncommon' },
  { id: 'emote_royal', type: 'emote', name: 'Royal Pack', description: 'Regal reactions', emoji: '👑', cost: 300, rarity: 'rare' },
  { id: 'emote_spooky', type: 'emote', name: 'Spooky Pack', description: 'Scary reactions', emoji: '👻', cost: 200, rarity: 'uncommon' },
  { id: 'emote_meme', type: 'emote', name: 'Meme Pack', description: 'Internet classics', emoji: '😂', cost: 250, rarity: 'rare' },
  { id: 'emote_anime', type: 'emote', name: 'Anime Pack', description: 'Kawaii reactions', emoji: '🌸', cost: 350, rarity: 'epic' },
  { id: 'emote_villain', type: 'emote', name: 'Villain Pack', description: 'Evil reactions', emoji: '😈', cost: 300, rarity: 'rare' },
  { id: 'emote_champion', type: 'emote', name: 'Champion Pack', description: 'Victory reactions', emoji: '🏆', cost: 500, rarity: 'legendary' },

  // === ENTRANCE ANIMATIONS ===
  { id: 'entrance_default', type: 'entrance', name: 'Fade In', description: 'Simple appearance', emoji: '✨', cost: 0, rarity: 'common', isDefault: true },
  { id: 'entrance_lightning', type: 'entrance', name: 'Lightning Strike', description: 'Appear in a flash', emoji: '⚡', cost: 300, rarity: 'rare' },
  { id: 'entrance_fire', type: 'entrance', name: 'Fire Burst', description: 'Emerge from flames', emoji: '🔥', cost: 350, rarity: 'epic' },
  { id: 'entrance_ice', type: 'entrance', name: 'Ice Shatter', description: 'Break through ice', emoji: '❄️', cost: 350, rarity: 'epic' },
  { id: 'entrance_portal', type: 'entrance', name: 'Portal Open', description: 'Step through a portal', emoji: '🌀', cost: 500, rarity: 'epic' },
  { id: 'entrance_glitch', type: 'entrance', name: 'Glitch In', description: 'Digital materialization', emoji: '📺', cost: 400, rarity: 'epic' },
  { id: 'entrance_royal', type: 'entrance', name: 'Royal Fanfare', description: 'Trumpets and confetti', emoji: '👑', cost: 600, rarity: 'legendary' },
  { id: 'entrance_explosion', type: 'entrance', name: 'Grand Explosion', description: 'Explosive entrance', emoji: '💥', cost: 450, rarity: 'epic' },
  { id: 'entrance_ghost', type: 'entrance', name: 'Phantom Phase', description: 'Phase through reality', emoji: '👻', cost: 400, rarity: 'epic' },
  { id: 'entrance_dragon', type: 'entrance', name: 'Dragon Descent', description: 'Ride in on a dragon', emoji: '🐉', cost: 800, rarity: 'legendary' },
  { id: 'entrance_meteor', type: 'entrance', name: 'Meteor Impact', description: 'Crash from the sky', emoji: '☄️', cost: 700, rarity: 'legendary' },
  { id: 'entrance_teleport', type: 'entrance', name: 'Teleportation', description: 'Instant arrival', emoji: '🔮', cost: 350, rarity: 'rare' },
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
  const parts = [
    avatar.base, avatar.hair, avatar.eyes, avatar.mouth, avatar.hat,
    avatar.glasses, avatar.accessory, avatar.outfit, avatar.background,
    avatar.frame, avatar.cardStyle, avatar.cardBack, avatar.effect,
    avatar.emote, avatar.entrance
  ];
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
