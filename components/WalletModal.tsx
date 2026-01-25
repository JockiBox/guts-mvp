'use client';

import { useState, useEffect } from 'react';
import {
  loadWallet,
  Wallet,
  WalletItem,
  SHOP_ITEMS,
  purchaseItem,
  equipItem,
  ItemCategory,
} from '@/lib/wallet';
import { getUnlockedTaunts, Taunt, setFavoriteTaunts } from '@/lib/taunts';
import { loadLuckyNumberState, setLuckyNumber, numberToRank, LUCKY_NUMBER_NAMES } from '@/lib/luckyNumbers';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerTokens: number;
  onPurchase: (cost: number) => boolean;
  onEquipChange: () => void;
}

type Tab = 'inventory' | 'shop' | 'taunts' | 'lucky';

export function WalletModal({ isOpen, onClose, playerTokens, onPurchase, onEquipChange }: WalletModalProps) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('inventory');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');
  const [luckyNum, setLuckyNum] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setWallet(loadWallet());
      setLuckyNum(loadLuckyNumberState().luckyNumber);
    }
  }, [isOpen]);

  if (!isOpen || !wallet) return null;

  const categories: { id: ItemCategory | 'all'; name: string; icon: string }[] = [
    { id: 'all', name: 'All', icon: '📦' },
    { id: 'avatar', name: 'Avatars', icon: '😎' },
    { id: 'card_back', name: 'Cards', icon: '🎴' },
    { id: 'sound_pack', name: 'Sounds', icon: '🔊' },
    { id: 'taunt', name: 'Taunts', icon: '💬' },
  ];

  const filteredItems = selectedCategory === 'all'
    ? wallet.items.filter(i => i.owned > 0)
    : wallet.items.filter(i => i.owned > 0 && i.category === selectedCategory);

  const shopItems = selectedCategory === 'all'
    ? SHOP_ITEMS
    : SHOP_ITEMS.filter(i => i.category === selectedCategory);

  const handlePurchase = (itemId: string) => {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item || playerTokens < item.price) return;

    if (onPurchase(item.price)) {
      const result = purchaseItem(itemId, playerTokens);
      if (result.success) {
        setWallet(result.wallet);
      }
    }
  };

  const handleEquip = (itemId: string, category: ItemCategory) => {
    const newWallet = equipItem(itemId, category);
    setWallet(newWallet);
    onEquipChange();
  };

  const handleSetLuckyNumber = (num: number) => {
    setLuckyNumber(num);
    setLuckyNum(num);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '#fbbf24';
      case 'epic': return '#8b5cf6';
      case 'rare': return '#3b82f6';
      default: return '#6b7280';
    }
  };

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
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          borderRadius: '20px',
          padding: '24px',
          border: '2px solid #14b8a6',
          maxWidth: '700px',
          width: '95%',
          maxHeight: '85vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ color: '#e2e8f0', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>👜</span> My Wallet
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>🪙 {playerTokens}</span>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '24px',
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {[
            { id: 'inventory', name: 'Inventory', icon: '📦' },
            { id: 'shop', name: 'Shop', icon: '🛒' },
            { id: 'taunts', name: 'Taunts', icon: '💬' },
            { id: 'lucky', name: 'Lucky #', icon: '🍀' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              style={{
                flex: 1,
                padding: '10px',
                background: activeTab === tab.id ? 'rgba(20, 184, 166, 0.3)' : 'rgba(51, 65, 85, 0.3)',
                border: activeTab === tab.id ? '2px solid #14b8a6' : '1px solid #475569',
                borderRadius: '10px',
                color: activeTab === tab.id ? '#14b8a6' : '#94a3b8',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>

        {/* Category Filter (for inventory/shop) */}
        {(activeTab === 'inventory' || activeTab === 'shop') && (
          <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '6px 12px',
                  background: selectedCategory === cat.id ? 'rgba(20, 184, 166, 0.2)' : 'rgba(51, 65, 85, 0.3)',
                  border: selectedCategory === cat.id ? '1px solid #14b8a6' : '1px solid #475569',
                  borderRadius: '6px',
                  color: selectedCategory === cat.id ? '#14b8a6' : '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '11px',
                }}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {activeTab === 'inventory' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
              {filteredItems.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#64748b', padding: '40px' }}>
                  No items yet. Visit the shop!
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '12px',
                      background: item.equipped ? 'rgba(20, 184, 166, 0.2)' : 'rgba(51, 65, 85, 0.3)',
                      borderRadius: '10px',
                      border: item.equipped ? '2px solid #14b8a6' : '1px solid #475569',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{item.icon}</div>
                    <div style={{ color: '#e2e8f0', fontSize: '12px', fontWeight: 'bold' }}>{item.name}</div>
                    <div style={{ color: getRarityColor(item.rarity), fontSize: '10px', textTransform: 'uppercase' }}>
                      {item.rarity}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '10px', marginTop: '4px' }}>x{item.owned}</div>
                    {['avatar', 'card_back', 'sound_pack'].includes(item.category) && (
                      <button
                        onClick={() => handleEquip(item.id, item.category)}
                        disabled={item.equipped}
                        style={{
                          marginTop: '8px',
                          padding: '6px 12px',
                          background: item.equipped ? '#14b8a6' : 'rgba(20, 184, 166, 0.3)',
                          border: 'none',
                          borderRadius: '6px',
                          color: 'white',
                          fontSize: '10px',
                          cursor: item.equipped ? 'default' : 'pointer',
                        }}
                      >
                        {item.equipped ? '✓ Equipped' : 'Equip'}
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'shop' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
              {shopItems.map((item) => {
                const owned = wallet.items.find(i => i.id === item.id)?.owned || 0;
                const canAfford = playerTokens >= item.price;

                return (
                  <div
                    key={item.id}
                    style={{
                      padding: '12px',
                      background: 'rgba(51, 65, 85, 0.3)',
                      borderRadius: '10px',
                      border: `1px solid ${getRarityColor(item.rarity)}40`,
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{item.icon}</div>
                    <div style={{ color: '#e2e8f0', fontSize: '12px', fontWeight: 'bold' }}>{item.name}</div>
                    <div style={{ color: getRarityColor(item.rarity), fontSize: '10px', textTransform: 'uppercase' }}>
                      {item.rarity}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '9px', marginTop: '4px' }}>{item.description}</div>
                    {owned > 0 && (
                      <div style={{ color: '#14b8a6', fontSize: '10px', marginTop: '4px' }}>Owned: {owned}</div>
                    )}
                    <button
                      onClick={() => handlePurchase(item.id)}
                      disabled={!canAfford}
                      style={{
                        marginTop: '8px',
                        padding: '6px 12px',
                        background: canAfford ? 'linear-gradient(135deg, #14b8a6, #0d9488)' : 'rgba(51, 65, 85, 0.5)',
                        border: 'none',
                        borderRadius: '6px',
                        color: canAfford ? 'white' : '#64748b',
                        fontSize: '11px',
                        cursor: canAfford ? 'pointer' : 'not-allowed',
                        fontWeight: 'bold',
                      }}
                    >
                      🪙 {item.price}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'taunts' && (
            <TauntsTab />
          )}

          {activeTab === 'lucky' && (
            <div style={{ padding: '20px' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>🍀</div>
                <h3 style={{ color: '#e2e8f0', margin: '0 0 8px 0' }}>Lucky Number</h3>
                <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>
                  Choose your lucky card rank. When it appears and you win, get +5 bonus tokens!
                </p>
              </div>

              {luckyNum && (
                <div style={{
                  textAlign: 'center',
                  padding: '16px',
                  background: 'rgba(34, 197, 94, 0.2)',
                  borderRadius: '12px',
                  border: '2px solid #22c55e',
                  marginBottom: '20px',
                }}>
                  <div style={{ color: '#22c55e', fontSize: '14px' }}>Current Lucky Number</div>
                  <div style={{ color: '#e2e8f0', fontSize: '32px', fontWeight: 'bold' }}>
                    {numberToRank(luckyNum)}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                    {LUCKY_NUMBER_NAMES[luckyNum]}
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleSetLuckyNumber(num)}
                    style={{
                      padding: '12px',
                      background: luckyNum === num ? 'rgba(34, 197, 94, 0.3)' : 'rgba(51, 65, 85, 0.3)',
                      border: luckyNum === num ? '2px solid #22c55e' : '1px solid #475569',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ color: '#e2e8f0', fontSize: '20px', fontWeight: 'bold' }}>
                      {numberToRank(num)}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '9px' }}>
                      {LUCKY_NUMBER_NAMES[num]}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TauntsTab() {
  const [taunts, setTaunts] = useState<Taunt[]>([]);

  useEffect(() => {
    setTaunts(getUnlockedTaunts());
  }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
      {taunts.map((taunt) => (
        <div
          key={taunt.id}
          style={{
            padding: '12px',
            background: 'rgba(51, 65, 85, 0.3)',
            borderRadius: '10px',
            border: '1px solid #475569',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>{taunt.emoji}</div>
          <div style={{ color: '#e2e8f0', fontSize: '12px', fontWeight: 'bold' }}>{taunt.name}</div>
          <div style={{ color: '#64748b', fontSize: '10px', marginTop: '4px' }}>{taunt.text}</div>
        </div>
      ))}
    </div>
  );
}
