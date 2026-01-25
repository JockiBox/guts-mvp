'use client';

import { useState, useEffect } from 'react';
import {
  TABLE_THEMES,
  TableTheme,
  loadCurrentTheme,
  saveCurrentTheme,
  loadUnlockedThemes,
  purchaseTheme,
  isThemeUnlocked,
} from '@/lib/themes';

interface ThemeSelectorProps {
  onThemeChange: (theme: TableTheme) => void;
  playerTokens: number;
  totalWins: number;
  unlockedAchievements: string[];
  onPurchase: (cost: number) => boolean; // Returns true if purchase successful
  onClose: () => void;
}

export function ThemeSelector({
  onThemeChange,
  playerTokens,
  totalWins,
  unlockedAchievements,
  onPurchase,
  onClose,
}: ThemeSelectorProps) {
  const [currentTheme, setCurrentTheme] = useState<TableTheme>(TABLE_THEMES[0]);
  const [unlockedThemes, setUnlockedThemes] = useState<string[]>(['classic']);
  const [previewTheme, setPreviewTheme] = useState<TableTheme | null>(null);

  useEffect(() => {
    setCurrentTheme(loadCurrentTheme());
    setUnlockedThemes(loadUnlockedThemes());
  }, []);

  const handleSelectTheme = (theme: TableTheme) => {
    if (!isThemeUnlocked(theme.id)) return;
    setCurrentTheme(theme);
    saveCurrentTheme(theme.id);
    onThemeChange(theme);
  };

  const handlePurchase = (theme: TableTheme) => {
    if (theme.unlockCondition !== 'purchase' || !theme.unlockValue) return;
    if (playerTokens < theme.unlockValue) return;

    if (onPurchase(theme.unlockValue)) {
      const { success } = purchaseTheme(theme.id, playerTokens);
      if (success) {
        setUnlockedThemes([...unlockedThemes, theme.id]);
      }
    }
  };

  const getUnlockStatus = (theme: TableTheme) => {
    if (isThemeUnlocked(theme.id)) return { unlocked: true, message: '' };

    switch (theme.unlockCondition) {
      case 'free':
        return { unlocked: true, message: '' };
      case 'wins':
        const winsNeeded = (theme.unlockValue || 0) - totalWins;
        if (winsNeeded <= 0) return { unlocked: true, message: '' };
        return { unlocked: false, message: `Win ${winsNeeded} more hands` };
      case 'purchase':
        return { unlocked: false, message: `🪙 ${theme.unlockValue}` };
      case 'achievement':
        if (unlockedAchievements.includes(theme.unlockAchievement || '')) {
          return { unlocked: true, message: '' };
        }
        return { unlocked: false, message: 'Achievement required' };
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
          maxWidth: '700px',
          width: '95%',
          maxHeight: '85vh',
          overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#e2e8f0', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🎨</span> Table Themes
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

        {/* Theme Preview */}
        {previewTheme && (
          <div
            style={{
              marginBottom: '20px',
              padding: '20px',
              borderRadius: '16px',
              background: previewTheme.background,
              border: `2px solid ${previewTheme.accentColor}`,
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100px',
                borderRadius: '12px',
                background: previewTheme.tableColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
              }}
            >
              <span style={{ fontSize: '32px' }}>{previewTheme.cardBack}</span>
              <span style={{ fontSize: '32px' }}>{previewTheme.cardBack}</span>
              <span style={{ color: previewTheme.accentColor, fontWeight: 'bold' }}>
                {previewTheme.name}
              </span>
              <span style={{ fontSize: '32px' }}>{previewTheme.cardBack}</span>
              <span style={{ fontSize: '32px' }}>{previewTheme.cardBack}</span>
            </div>
          </div>
        )}

        {/* Theme Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          {TABLE_THEMES.map((theme) => {
            const status = getUnlockStatus(theme);
            const isSelected = currentTheme.id === theme.id;
            const canPurchase =
              theme.unlockCondition === 'purchase' &&
              !status.unlocked &&
              playerTokens >= (theme.unlockValue || 0);

            return (
              <div
                key={theme.id}
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: isSelected
                    ? `3px solid ${theme.accentColor}`
                    : status.unlocked
                    ? '2px solid #475569'
                    : '2px solid #334155',
                  opacity: status.unlocked ? 1 : 0.6,
                  cursor: status.unlocked ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={() => setPreviewTheme(theme)}
                onMouseLeave={() => setPreviewTheme(null)}
                onClick={() => status.unlocked && handleSelectTheme(theme)}
              >
                {/* Mini Preview */}
                <div
                  style={{
                    height: '80px',
                    background: theme.background,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      padding: '12px 20px',
                      borderRadius: '8px',
                      background: theme.tableColor,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{theme.cardBack}</span>
                    <span style={{ fontSize: '20px' }}>{theme.cardBack}</span>
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: '12px', background: 'rgba(30, 41, 59, 0.95)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>{theme.icon}</span>
                    <span style={{ color: '#e2e8f0', fontWeight: 'bold', fontSize: '14px' }}>
                      {theme.name}
                    </span>
                    {isSelected && (
                      <span style={{ color: theme.accentColor, fontSize: '12px' }}>✓</span>
                    )}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '11px', marginTop: '4px' }}>
                    {theme.description}
                  </div>

                  {/* Unlock Status */}
                  {!status.unlocked && (
                    <div style={{ marginTop: '8px' }}>
                      {canPurchase ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePurchase(theme);
                          }}
                          style={{
                            width: '100%',
                            background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          Buy for 🪙 {theme.unlockValue}
                        </button>
                      ) : (
                        <div
                          style={{
                            padding: '6px 10px',
                            background: 'rgba(51, 65, 85, 0.5)',
                            borderRadius: '6px',
                            color: '#94a3b8',
                            fontSize: '11px',
                            textAlign: 'center',
                          }}
                        >
                          🔒 {status.message}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
