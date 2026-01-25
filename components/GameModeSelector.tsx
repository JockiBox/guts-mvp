'use client';

import { useState, useEffect } from 'react';
import { GAME_MODES, GameMode, GameModeType, isModeUnlocked, loadUnlockedModes } from '@/lib/gameModes';

interface GameModeSelectorProps {
  currentMode: GameModeType;
  onSelectMode: (mode: GameMode) => void;
  onClose: () => void;
  totalWins: number;
  currentTokens: number;
}

export function GameModeSelector({ currentMode, onSelectMode, onClose, totalWins, currentTokens }: GameModeSelectorProps) {
  const [unlockedModes, setUnlockedModes] = useState<GameModeType[]>([]);

  useEffect(() => {
    setUnlockedModes(loadUnlockedModes());
  }, []);

  const getUnlockStatus = (mode: GameMode) => {
    if (isModeUnlocked(mode.id)) return { unlocked: true, message: '' };

    switch (mode.unlockCondition) {
      case 'free':
        return { unlocked: true, message: '' };
      case 'wins':
        const winsNeeded = (mode.unlockValue || 0) - totalWins;
        return { unlocked: false, message: `Win ${winsNeeded} more hands` };
      case 'tokens':
        if (currentTokens >= (mode.unlockValue || 0)) {
          return { unlocked: true, message: '' };
        }
        return { unlocked: false, message: `Need ${mode.unlockValue} tokens` };
      default:
        return { unlocked: false, message: 'Locked' };
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
          border: '2px solid #334155',
          maxWidth: '600px',
          width: '95%',
          maxHeight: '85vh',
          overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#e2e8f0', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🎮</span> Game Modes
          </h2>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {GAME_MODES.map((mode) => {
            const status = getUnlockStatus(mode);
            const isSelected = currentMode === mode.id;

            return (
              <div
                key={mode.id}
                onClick={() => status.unlocked && onSelectMode(mode)}
                style={{
                  padding: '16px',
                  background: isSelected
                    ? 'rgba(20, 184, 166, 0.2)'
                    : status.unlocked
                    ? 'rgba(51, 65, 85, 0.3)'
                    : 'rgba(51, 65, 85, 0.15)',
                  borderRadius: '12px',
                  border: isSelected
                    ? '2px solid #14b8a6'
                    : status.unlocked
                    ? '1px solid #475569'
                    : '1px solid #334155',
                  cursor: status.unlocked ? 'pointer' : 'not-allowed',
                  opacity: status.unlocked ? 1 : 0.6,
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '12px',
                      background: status.unlocked
                        ? 'linear-gradient(135deg, #14b8a6, #0d9488)'
                        : 'rgba(51, 65, 85, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                    }}
                  >
                    {status.unlocked ? mode.icon : '🔒'}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#e2e8f0', fontWeight: 'bold', fontSize: '16px' }}>
                        {mode.name}
                      </span>
                      {isSelected && (
                        <span style={{ color: '#14b8a6', fontSize: '12px' }}>✓ Selected</span>
                      )}
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0 0 0' }}>
                      {mode.description}
                    </p>
                  </div>
                </div>

                {/* Rules */}
                {status.unlocked && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #334155' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {mode.rules.map((rule, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: '4px 10px',
                            background: 'rgba(20, 184, 166, 0.2)',
                            borderRadius: '4px',
                            color: '#14b8a6',
                            fontSize: '11px',
                          }}
                        >
                          {rule}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Unlock requirement */}
                {!status.unlocked && (
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '8px 12px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span style={{ fontSize: '14px' }}>🔒</span>
                    <span style={{ color: '#94a3b8', fontSize: '12px' }}>{status.message}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
