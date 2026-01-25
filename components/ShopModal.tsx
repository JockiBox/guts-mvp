'use client';

import { useState } from 'react';
import {
  TOKEN_PACKAGES,
  AVATAR_SHOP,
  THEME_SHOP,
  EFFECT_SHOP,
  VIP_PACKAGES,
  POWERUP_PACKAGES,
  DAILY_REWARDS,
  formatPrice,
  getPackageTotal,
  getRarityColor,
  getRarityGradient,
  type ShopItem,
} from '@/lib/shop';
import { type UserProfile } from '@/lib/supabase';
import { playClick, playTokens } from '@/lib/sounds';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onPurchaseTokens: (packageId: string) => void;
  onBuyItem: (item: ShopItem) => void;
  onClaimDaily: () => void;
  canClaimDaily: boolean;
}

type ShopTab = 'tokens' | 'powerups' | 'avatars' | 'themes' | 'effects' | 'vip';

export function ShopModal({
  isOpen,
  onClose,
  user,
  onPurchaseTokens,
  onBuyItem,
  onClaimDaily,
  canClaimDaily,
}: ShopModalProps) {
  const [activeTab, setActiveTab] = useState<ShopTab>('tokens');
  const [purchasing, setPurchasing] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleBuyTokens = async (packageId: string) => {
    playClick();
    setPurchasing(packageId);
    await onPurchaseTokens(packageId);
    setPurchasing(null);
  };

  const handleBuyItem = (item: ShopItem) => {
    if (!user || user.tokens < item.price) return;

    // Check if already owned
    const owned = item.type === 'avatar'
      ? user.unlocked_avatars.includes(item.value)
      : item.type === 'theme'
        ? user.unlocked_themes.includes(item.value)
        : item.type === 'effect'
          ? user.unlocked_effects.includes(item.value)
          : user.vip_level >= parseInt(item.value);

    if (owned) return;

    playTokens();
    onBuyItem(item);
  };

  const isOwned = (item: ShopItem): boolean => {
    if (!user) return false;
    if (item.type === 'avatar') return user.unlocked_avatars.includes(item.value);
    if (item.type === 'theme') return user.unlocked_themes.includes(item.value);
    if (item.type === 'effect') return user.unlocked_effects.includes(item.value);
    if (item.type === 'vip') return user.vip_level >= parseInt(item.value);
    if (item.type === 'powerup') return false; // Power-ups are never "owned", they're consumable
    return false;
  };

  const tabs: { id: ShopTab; label: string; icon: string }[] = [
    { id: 'tokens', label: 'Tokens', icon: '🪙' },
    { id: 'powerups', label: 'Power-Ups', icon: '⚡' },
    { id: 'avatars', label: 'Avatars', icon: '😎' },
    { id: 'themes', label: 'Themes', icon: '🎨' },
    { id: 'effects', label: 'Effects', icon: '✨' },
    { id: 'vip', label: 'VIP', icon: '👑' },
  ];

  const currentDayReward = DAILY_REWARDS[Math.min((user?.daily_streak || 0), 6)];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#1e293b',
          borderRadius: '16px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          border: '1px solid #334155',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid #334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#14b8a6', margin: 0 }}>
              Shop
            </h2>
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span style={{ color: '#fbbf24', fontWeight: '600' }}>
                  🪙 {user.tokens.toLocaleString()}
                </span>
                {user.vip_level > 0 && (
                  <span style={{ color: '#a855f7', fontSize: '12px' }}>
                    {user.vip_level === 1 ? '🥉' : user.vip_level === 2 ? '🥈' : '🥇'} VIP
                  </span>
                )}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px 8px',
            }}
          >
            ×
          </button>
        </div>

        {/* Daily Reward Banner */}
        {user && (
          <div
            style={{
              background: canClaimDaily
                ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(217, 119, 6, 0.1))'
                : 'rgba(15, 23, 42, 0.5)',
              padding: '12px 20px',
              borderBottom: '1px solid #334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ color: '#fbbf24', fontWeight: '600', fontSize: '14px' }}>
                🎁 Daily Reward - Day {Math.min((user.daily_streak || 0) + 1, 7)}
              </div>
              <div style={{ color: '#64748b', fontSize: '12px' }}>
                {canClaimDaily
                  ? `Claim ${currentDayReward.tokens} tokens!`
                  : 'Come back tomorrow!'}
              </div>
            </div>
            <button
              onClick={() => {
                if (canClaimDaily) {
                  playTokens();
                  onClaimDaily();
                }
              }}
              disabled={!canClaimDaily}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: canClaimDaily
                  ? 'linear-gradient(135deg, #fbbf24, #d97706)'
                  : '#334155',
                color: canClaimDaily ? '#0f172a' : '#64748b',
                fontWeight: '600',
                fontSize: '13px',
                cursor: canClaimDaily ? 'pointer' : 'not-allowed',
              }}
            >
              {canClaimDaily ? 'Claim!' : 'Claimed'}
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            padding: '12px 20px',
            background: '#0f172a',
            overflowX: 'auto',
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                playClick();
                setActiveTab(tab.id);
              }}
              style={{
                flex: '0 0 auto',
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab.id ? '#14b8a6' : 'transparent',
                color: activeTab === tab.id ? '#0f172a' : '#64748b',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {/* Token Packages */}
          {activeTab === 'tokens' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {TOKEN_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  style={{
                    background: pkg.popular
                      ? 'linear-gradient(135deg, rgba(20, 184, 166, 0.2), rgba(15, 118, 110, 0.1))'
                      : '#0f172a',
                    borderRadius: '12px',
                    padding: '16px',
                    border: pkg.popular ? '2px solid #14b8a6' : '1px solid #334155',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {pkg.popular && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '-20px',
                        background: '#14b8a6',
                        color: '#0f172a',
                        fontSize: '10px',
                        fontWeight: '700',
                        padding: '2px 24px',
                        transform: 'rotate(45deg)',
                      }}
                    >
                      BEST
                    </div>
                  )}
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#fbbf24', marginBottom: '4px' }}>
                    🪙 {getPackageTotal(pkg).toLocaleString()}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>
                    {pkg.name}
                  </div>
                  {pkg.bonus > 0 && (
                    <div style={{ color: '#4ade80', fontSize: '11px', marginBottom: '8px' }}>
                      +{pkg.bonus.toLocaleString()} bonus!
                    </div>
                  )}
                  <button
                    onClick={() => handleBuyTokens(pkg.id)}
                    disabled={purchasing === pkg.id || !user}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: purchasing === pkg.id
                        ? '#475569'
                        : 'linear-gradient(135deg, #22c55e, #16a34a)',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '14px',
                      cursor: purchasing === pkg.id || !user ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {purchasing === pkg.id ? '...' : formatPrice(pkg.price)}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Shop Items */}
          {activeTab !== 'tokens' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {(activeTab === 'avatars' ? AVATAR_SHOP :
                activeTab === 'themes' ? THEME_SHOP :
                activeTab === 'effects' ? EFFECT_SHOP :
                activeTab === 'powerups' ? POWERUP_PACKAGES :
                VIP_PACKAGES).map((item) => {
                  const owned = isOwned(item);
                  const canAfford = user && user.tokens >= item.price;

                  return (
                    <div
                      key={item.id}
                      style={{
                        background: owned
                          ? 'rgba(34, 197, 94, 0.1)'
                          : '#0f172a',
                        borderRadius: '10px',
                        padding: '12px',
                        border: owned
                          ? '2px solid #22c55e'
                          : `1px solid ${getRarityColor(item.rarity)}30`,
                        textAlign: 'center',
                        opacity: owned ? 0.7 : 1,
                      }}
                    >
                      <div
                        style={{
                          fontSize: '28px',
                          marginBottom: '6px',
                          filter: owned ? 'none' : 'drop-shadow(0 0 8px ' + getRarityColor(item.rarity) + ')',
                        }}
                      >
                        {item.icon}
                      </div>
                      <div style={{ color: '#cbd5e1', fontSize: '12px', fontWeight: '600', marginBottom: '2px' }}>
                        {item.name}
                      </div>
                      {item.quantity && (
                        <div style={{ color: '#4ade80', fontSize: '10px', fontWeight: '600', marginBottom: '2px' }}>
                          x{item.quantity}
                        </div>
                      )}
                      <div
                        style={{
                          color: getRarityColor(item.rarity),
                          fontSize: '9px',
                          textTransform: 'uppercase',
                          fontWeight: '600',
                          marginBottom: '8px',
                        }}
                      >
                        {item.rarity}
                      </div>

                      {owned ? (
                        <div style={{ color: '#4ade80', fontSize: '11px', fontWeight: '600' }}>
                          ✓ Owned
                        </div>
                      ) : (
                        <button
                          onClick={() => handleBuyItem(item)}
                          disabled={!canAfford || !user}
                          style={{
                            width: '100%',
                            padding: '6px',
                            borderRadius: '6px',
                            border: 'none',
                            background: canAfford
                              ? getRarityGradient(item.rarity)
                              : '#334155',
                            color: canAfford ? 'white' : '#64748b',
                            fontWeight: '600',
                            fontSize: '11px',
                            cursor: canAfford ? 'pointer' : 'not-allowed',
                          }}
                        >
                          🪙 {item.price}
                        </button>
                      )}
                    </div>
                  );
                })}
            </div>
          )}

          {!user && (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#64748b',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#94a3b8', marginBottom: '8px' }}>
                Sign in to access the shop
              </div>
              <div style={{ fontSize: '13px' }}>
                Create an account to buy tokens and unlock cosmetics
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
