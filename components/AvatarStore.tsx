'use client';

import { useState } from 'react';
import {
  AvatarPartType,
  AvatarItem,
  PlayerAvatar as AvatarType,
  AVATAR_ITEMS,
  getItemsByType,
  getItemById,
  getRarityColor,
  getRarityLabel,
  DEFAULT_AVATAR,
  loadGuestAvatar,
  saveGuestAvatar,
  loadGuestOwnedItems,
  purchaseGuestItem,
  guestOwnsItem,
} from '@/lib/avatars';
import { PlayerAvatar } from './PlayerAvatar';
import { playClick, playTokens, playWin } from '@/lib/sounds';

interface AvatarStoreProps {
  isOpen: boolean;
  onClose: () => void;
  currentTokens: number;
  onPurchase: (cost: number) => void;
  avatar: AvatarType;
  onAvatarChange: (avatar: AvatarType) => void;
  ownedItems: string[];
  onItemPurchased: (itemId: string) => void;
}

const CATEGORIES: { type: AvatarPartType; label: string; icon: string }[] = [
  { type: 'base', label: 'Character', icon: '😊' },
  { type: 'hair', label: 'Hair', icon: '💇' },
  { type: 'eyes', label: 'Eyes', icon: '👀' },
  { type: 'mouth', label: 'Mouth', icon: '👄' },
  { type: 'hat', label: 'Hats', icon: '🎩' },
  { type: 'glasses', label: 'Eyewear', icon: '🕶️' },
  { type: 'accessory', label: 'Accessories', icon: '💎' },
  { type: 'outfit', label: 'Outfits', icon: '👔' },
  { type: 'background', label: 'Backgrounds', icon: '🌈' },
  { type: 'frame', label: 'Frames', icon: '🖼️' },
  { type: 'cardStyle', label: 'Card Glow', icon: '✨' },
  { type: 'cardBack', label: 'Card Backs', icon: '🎴' },
  { type: 'effect', label: 'Effects', icon: '🔥' },
  { type: 'emote', label: 'Emotes', icon: '😄' },
  { type: 'entrance', label: 'Entrance', icon: '⚡' },
];

export function AvatarStore({
  isOpen,
  onClose,
  currentTokens,
  onPurchase,
  avatar,
  onAvatarChange,
  ownedItems,
  onItemPurchased,
}: AvatarStoreProps) {
  const [selectedCategory, setSelectedCategory] = useState<AvatarPartType>('base');
  const [previewAvatar, setPreviewAvatar] = useState<AvatarType>(avatar);

  if (!isOpen) return null;

  const categoryItems = getItemsByType(selectedCategory);

  const handleItemClick = (item: AvatarItem) => {
    playClick();
    // Update preview
    const newAvatar = { ...previewAvatar };
    switch (item.type) {
      case 'base': newAvatar.base = item.id; break;
      case 'hair': newAvatar.hair = item.id; break;
      case 'eyes': newAvatar.eyes = item.id; break;
      case 'mouth': newAvatar.mouth = item.id; break;
      case 'hat': newAvatar.hat = item.id; break;
      case 'glasses': newAvatar.glasses = item.id; break;
      case 'accessory': newAvatar.accessory = item.id; break;
      case 'outfit': newAvatar.outfit = item.id; break;
      case 'background': newAvatar.background = item.id; break;
      case 'frame': newAvatar.frame = item.id; break;
      case 'cardStyle': newAvatar.cardStyle = item.id; break;
      case 'cardBack': newAvatar.cardBack = item.id; break;
      case 'effect': newAvatar.effect = item.id; break;
      case 'emote': newAvatar.emote = item.id; break;
      case 'entrance': newAvatar.entrance = item.id; break;
    }
    setPreviewAvatar(newAvatar);
  };

  const handlePurchase = (item: AvatarItem) => {
    if (currentTokens < item.cost) return;
    if (ownedItems.includes(item.id)) return;

    playWin();
    onPurchase(item.cost);
    onItemPurchased(item.id);
  };

  const handleEquip = () => {
    // Check if all items in preview are owned
    const partsToCheck = [
      previewAvatar.base,
      previewAvatar.hair,
      previewAvatar.eyes,
      previewAvatar.mouth,
      previewAvatar.hat,
      previewAvatar.glasses,
      previewAvatar.accessory,
      previewAvatar.outfit,
      previewAvatar.background,
      previewAvatar.frame,
      previewAvatar.cardStyle,
      previewAvatar.cardBack,
      previewAvatar.effect,
      previewAvatar.emote,
      previewAvatar.entrance,
    ].filter(Boolean) as string[];

    const allOwned = partsToCheck.every(id => ownedItems.includes(id) || getItemById(id)?.isDefault);
    if (!allOwned) return;

    playTokens();
    onAvatarChange(previewAvatar);
    onClose();
  };

  const isItemOwned = (itemId: string) => {
    const item = getItemById(itemId);
    return ownedItems.includes(itemId) || item?.isDefault;
  };

  const isItemEquipped = (item: AvatarItem) => {
    switch (item.type) {
      case 'base': return previewAvatar.base === item.id;
      case 'hair': return previewAvatar.hair === item.id;
      case 'eyes': return previewAvatar.eyes === item.id;
      case 'mouth': return previewAvatar.mouth === item.id;
      case 'hat': return previewAvatar.hat === item.id;
      case 'glasses': return previewAvatar.glasses === item.id;
      case 'accessory': return previewAvatar.accessory === item.id;
      case 'outfit': return previewAvatar.outfit === item.id;
      case 'background': return previewAvatar.background === item.id;
      case 'frame': return previewAvatar.frame === item.id;
      case 'cardStyle': return previewAvatar.cardStyle === item.id;
      case 'cardBack': return previewAvatar.cardBack === item.id;
      case 'effect': return previewAvatar.effect === item.id;
      case 'emote': return previewAvatar.emote === item.id;
      case 'entrance': return previewAvatar.entrance === item.id;
      default: return false;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          borderRadius: '24px',
          border: '2px solid #14b8a6',
          width: '100%',
          maxWidth: '900px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid #334155',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h2 style={{ margin: 0, color: 'white', fontSize: '24px' }}>
              🛍️ Avatar Store
            </h2>
            <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '14px' }}>
              Customize your look
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                background: 'rgba(251, 191, 36, 0.2)',
                padding: '8px 16px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '20px' }}>🪙</span>
              <span style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '18px' }}>
                {currentTokens.toLocaleString()}
              </span>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            overflow: 'hidden',
          }}
        >
          {/* Preview Panel */}
          <div
            style={{
              width: '280px',
              padding: '20px',
              borderRight: '1px solid #334155',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#94a3b8', margin: '0 0 12px', fontSize: '14px' }}>Preview</p>
              <PlayerAvatar avatar={previewAvatar} size="xl" showFrame={true} />
            </div>

            <button
              onClick={handleEquip}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
            >
              ✓ Save & Equip
            </button>

            <button
              onClick={() => setPreviewAvatar(avatar)}
              style={{
                width: '100%',
                padding: '10px',
                background: 'transparent',
                border: '1px solid #475569',
                borderRadius: '12px',
                color: '#94a3b8',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Reset Preview
            </button>
          </div>

          {/* Categories + Items */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Category Tabs */}
            <div
              style={{
                display: 'flex',
                gap: '4px',
                padding: '12px',
                overflowX: 'auto',
                borderBottom: '1px solid #334155',
              }}
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.type}
                  onClick={() => {
                    playClick();
                    setSelectedCategory(cat.type);
                  }}
                  style={{
                    padding: '8px 12px',
                    background: selectedCategory === cat.type ? '#14b8a6' : 'rgba(51, 65, 85, 0.5)',
                    border: 'none',
                    borderRadius: '8px',
                    color: selectedCategory === cat.type ? 'white' : '#94a3b8',
                    fontSize: '13px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s',
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Items Grid */}
            <div
              style={{
                flex: 1,
                overflow: 'auto',
                padding: '16px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '12px',
                alignContent: 'start',
              }}
            >
              {categoryItems.map((item) => {
                const owned = isItemOwned(item.id);
                const equipped = isItemEquipped(item);
                const canAfford = currentTokens >= item.cost;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    style={{
                      background: equipped
                        ? 'rgba(20, 184, 166, 0.2)'
                        : 'rgba(51, 65, 85, 0.3)',
                      borderRadius: '12px',
                      padding: '12px',
                      border: equipped
                        ? '2px solid #14b8a6'
                        : `2px solid ${getRarityColor(item.rarity)}40`,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {/* Item Preview */}
                    <div
                      style={{
                        fontSize: '40px',
                        textAlign: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      {item.emoji}
                    </div>

                    {/* Item Name */}
                    <p
                      style={{
                        margin: 0,
                        color: 'white',
                        fontSize: '13px',
                        fontWeight: '600',
                        textAlign: 'center',
                      }}
                    >
                      {item.name}
                    </p>

                    {/* Rarity Badge */}
                    <div
                      style={{
                        textAlign: 'center',
                        marginTop: '4px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '10px',
                          color: getRarityColor(item.rarity),
                          textTransform: 'uppercase',
                          fontWeight: 'bold',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {getRarityLabel(item.rarity)}
                      </span>
                    </div>

                    {/* Price / Status */}
                    <div style={{ marginTop: '8px', textAlign: 'center' }}>
                      {owned ? (
                        equipped ? (
                          <span
                            style={{
                              color: '#14b8a6',
                              fontSize: '12px',
                              fontWeight: 'bold',
                            }}
                          >
                            ✓ Equipped
                          </span>
                        ) : (
                          <span
                            style={{
                              color: '#22c55e',
                              fontSize: '12px',
                            }}
                          >
                            ✓ Owned
                          </span>
                        )
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePurchase(item);
                          }}
                          disabled={!canAfford}
                          style={{
                            background: canAfford
                              ? 'linear-gradient(135deg, #fbbf24, #d97706)'
                              : '#475569',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            color: canAfford ? '#0f172a' : '#94a3b8',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            cursor: canAfford ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            margin: '0 auto',
                          }}
                        >
                          🪙 {item.cost}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
