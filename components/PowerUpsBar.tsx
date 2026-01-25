'use client';

import { useState, useEffect } from 'react';
import { POWER_UPS, PowerUpType, loadPowerUpInventory, consumePowerUp, getPowerUpCount } from '@/lib/powerups';

interface PowerUpsBarProps {
  onUsePowerUp: (type: PowerUpType) => void;
  canUsePowerUps: boolean; // Usually true during decision phase
  activePowerUps: PowerUpType[]; // Currently active power-ups this round
}

export function PowerUpsBar({ onUsePowerUp, canUsePowerUps, activePowerUps }: PowerUpsBarProps) {
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [hoveredPowerUp, setHoveredPowerUp] = useState<PowerUpType | null>(null);

  useEffect(() => {
    setInventory(loadPowerUpInventory());
  }, []);

  const handleUsePowerUp = (type: PowerUpType) => {
    if (!canUsePowerUps) return;
    if (activePowerUps.includes(type)) return;
    if (getPowerUpCount(type) <= 0) return;

    if (consumePowerUp(type)) {
      setInventory(loadPowerUpInventory());
      onUsePowerUp(type);
    }
  };

  const powerUpList = Object.values(POWER_UPS);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        padding: '8px',
        background: 'rgba(30, 41, 59, 0.9)',
        borderRadius: '10px',
        border: '2px solid #334155',
        maxWidth: '60px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
        <span style={{ fontSize: '12px' }}>⚡</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {powerUpList.map((powerUp) => {
          const count = inventory[powerUp.type] || 0;
          const isActive = activePowerUps.includes(powerUp.type);
          const canUse = canUsePowerUps && count > 0 && !isActive;

          return (
            <div
              key={powerUp.type}
              style={{ position: 'relative' }}
              onMouseEnter={() => setHoveredPowerUp(powerUp.type)}
              onMouseLeave={() => setHoveredPowerUp(null)}
            >
              <button
                onClick={() => handleUsePowerUp(powerUp.type)}
                disabled={!canUse}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  border: isActive
                    ? '2px solid #22c55e'
                    : canUse
                    ? '2px solid #14b8a6'
                    : '2px solid #475569',
                  background: isActive
                    ? 'rgba(34, 197, 94, 0.3)'
                    : canUse
                    ? 'rgba(20, 184, 166, 0.2)'
                    : 'rgba(51, 65, 85, 0.3)',
                  cursor: canUse ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  transition: 'all 0.2s ease',
                  opacity: count === 0 ? 0.4 : 1,
                  position: 'relative',
                }}
              >
                {powerUp.icon}
                {/* Count badge */}
                {count > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      background: isActive ? '#22c55e' : '#14b8a6',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {count}
                  </span>
                )}
                {/* Active indicator */}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '10px',
                    }}
                  >
                    ✓
                  </span>
                )}
              </button>

              {/* Tooltip */}
              {hoveredPowerUp === powerUp.type && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginBottom: '8px',
                    background: 'rgba(15, 23, 42, 0.98)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    border: '1px solid #475569',
                    whiteSpace: 'nowrap',
                    zIndex: 100,
                    minWidth: '150px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span>{powerUp.icon}</span>
                    <span style={{ color: '#e2e8f0', fontWeight: 'bold', fontSize: '13px' }}>
                      {powerUp.name}
                    </span>
                    <span
                      style={{
                        fontSize: '9px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background:
                          powerUp.rarity === 'legendary'
                            ? '#fbbf24'
                            : powerUp.rarity === 'epic'
                            ? '#8b5cf6'
                            : powerUp.rarity === 'rare'
                            ? '#3b82f6'
                            : '#6b7280',
                        color: 'white',
                        textTransform: 'uppercase',
                      }}
                    >
                      {powerUp.rarity}
                    </span>
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '11px', lineHeight: 1.4 }}>
                    {powerUp.description}
                  </div>
                  <div style={{ color: '#fbbf24', fontSize: '10px', marginTop: '6px' }}>
                    You have: {count}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Power-up shop component
interface PowerUpShopProps {
  playerTokens: number;
  onPurchase: (type: PowerUpType, cost: number) => void;
  onClose: () => void;
}

export function PowerUpShop({ playerTokens, onPurchase, onClose }: PowerUpShopProps) {
  const [inventory, setInventory] = useState<Record<string, number>>({});

  useEffect(() => {
    setInventory(loadPowerUpInventory());
  }, []);

  const powerUpList = Object.values(POWER_UPS);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.8)',
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
          border: '2px solid #334155',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#e2e8f0', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚡</span> Power-Up Shop
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {powerUpList.map((powerUp) => {
            const count = inventory[powerUp.type] || 0;
            const canAfford = playerTokens >= powerUp.cost;

            return (
              <div
                key={powerUp.type}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  background: 'rgba(51, 65, 85, 0.3)',
                  borderRadius: '12px',
                  border: '1px solid #475569',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    background:
                      powerUp.rarity === 'legendary'
                        ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                        : powerUp.rarity === 'epic'
                        ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                        : powerUp.rarity === 'rare'
                        ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                        : 'linear-gradient(135deg, #6b7280, #4b5563)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    flexShrink: 0,
                  }}
                >
                  {powerUp.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#e2e8f0', fontWeight: 'bold' }}>{powerUp.name}</span>
                    <span
                      style={{
                        fontSize: '9px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background:
                          powerUp.rarity === 'legendary'
                            ? '#fbbf24'
                            : powerUp.rarity === 'epic'
                            ? '#8b5cf6'
                            : powerUp.rarity === 'rare'
                            ? '#3b82f6'
                            : '#6b7280',
                        color: 'white',
                        textTransform: 'uppercase',
                      }}
                    >
                      {powerUp.rarity}
                    </span>
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
                    {powerUp.description}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '11px', marginTop: '4px' }}>
                    Owned: {count}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (canAfford) {
                      onPurchase(powerUp.type, powerUp.cost);
                      setInventory(loadPowerUpInventory());
                    }
                  }}
                  disabled={!canAfford}
                  style={{
                    background: canAfford
                      ? 'linear-gradient(135deg, #14b8a6, #0d9488)'
                      : 'rgba(51, 65, 85, 0.5)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    color: canAfford ? 'white' : '#64748b',
                    fontWeight: 'bold',
                    cursor: canAfford ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '14px',
                  }}
                >
                  <span>🪙</span>
                  {powerUp.cost}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
