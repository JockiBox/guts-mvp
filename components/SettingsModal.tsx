'use client';

import { useState, useEffect } from 'react';
import {
  GameSettings,
  loadSettings,
  saveSettings,
  DEFAULT_SETTINGS,
} from '@/lib/gameModeSettings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange?: (settings: GameSettings) => void;
}

export function SettingsModal({ isOpen, onClose, onSettingsChange }: SettingsModalProps) {
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState<'gameplay' | 'display' | 'accessibility'>('gameplay');

  useEffect(() => {
    if (isOpen) {
      setSettings(loadSettings());
    }
  }, [isOpen]);

  const handleChange = (key: keyof GameSettings, value: boolean | number) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  if (!isOpen) return null;

  const tabs = [
    { key: 'gameplay' as const, label: '🎮 Gameplay', icon: '🎮' },
    { key: 'display' as const, label: '🖥️ Display', icon: '🖥️' },
    { key: 'accessibility' as const, label: '♿ Access', icon: '♿' },
  ];

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
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#1e293b',
          borderRadius: '16px',
          maxWidth: '450px',
          width: '100%',
          maxHeight: '80vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #334155',
        }}
        onClick={(e) => e.stopPropagation()}
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
          <h2 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: '700', margin: 0 }}>
            ⚙️ Settings
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: '24px',
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #334155' }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                padding: '12px 8px',
                border: 'none',
                background: activeTab === tab.key ? '#334155' : 'transparent',
                color: activeTab === tab.key ? '#f1f5f9' : '#64748b',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label.split(' ')[1]}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {activeTab === 'gameplay' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <ToggleSetting
                label="Speed Mode"
                description="Faster animations and shorter timers"
                icon="⚡"
                value={settings.speedMode}
                onChange={(v) => handleChange('speedMode', v)}
              />
              <ToggleSetting
                label="Practice Mode"
                description="No token changes, just for fun"
                icon="🎯"
                value={settings.practiceMode}
                onChange={(v) => handleChange('practiceMode', v)}
              />
              <ToggleSetting
                label="Show Hand Odds"
                description="Display win probability for your hand"
                icon="📊"
                value={settings.showOdds}
                onChange={(v) => handleChange('showOdds', v)}
              />
              <SliderSetting
                label="Decision Timer"
                description="Seconds to make your choice"
                icon="⏱️"
                value={settings.countdownDuration}
                min={3}
                max={30}
                onChange={(v) => handleChange('countdownDuration', v)}
              />
              <ToggleSetting
                label="Sound Effects"
                description="Play game sounds"
                icon="🔊"
                value={settings.soundEnabled}
                onChange={(v) => handleChange('soundEnabled', v)}
              />
              <ToggleSetting
                label="Vibration"
                description="Haptic feedback on mobile"
                icon="📳"
                value={settings.vibrationEnabled}
                onChange={(v) => handleChange('vibrationEnabled', v)}
              />
            </div>
          )}

          {activeTab === 'display' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <ToggleSetting
                label="Dark Mode"
                description="Use dark color theme"
                icon="🌙"
                value={settings.darkMode}
                onChange={(v) => handleChange('darkMode', v)}
              />
              <ToggleSetting
                label="Show Animations"
                description="Enable card and UI animations"
                icon="✨"
                value={settings.showAnimations}
                onChange={(v) => handleChange('showAnimations', v)}
              />
              <ToggleSetting
                label="Auto-Flip Cards"
                description="Automatically reveal your cards"
                icon="🃏"
                value={settings.autoFlipCards}
                onChange={(v) => handleChange('autoFlipCards', v)}
              />
              <ToggleSetting
                label="Confirm Actions"
                description="Require confirmation for Hold/Drop"
                icon="✅"
                value={settings.confirmActions}
                onChange={(v) => handleChange('confirmActions', v)}
              />
            </div>
          )}

          {activeTab === 'accessibility' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <ToggleSetting
                label="Large Text"
                description="Increase text size throughout"
                icon="🔤"
                value={settings.largeText}
                onChange={(v) => handleChange('largeText', v)}
              />
              <ToggleSetting
                label="Colorblind Mode"
                description="Use patterns instead of colors only"
                icon="👁️"
                value={settings.colorblindMode}
                onChange={(v) => handleChange('colorblindMode', v)}
              />
              <ToggleSetting
                label="Reduced Motion"
                description="Minimize animations"
                icon="🐢"
                value={settings.reducedMotion}
                onChange={(v) => handleChange('reducedMotion', v)}
              />
              <ToggleSetting
                label="High Contrast"
                description="Increase contrast for better visibility"
                icon="◐"
                value={settings.highContrast}
                onChange={(v) => handleChange('highContrast', v)}
              />
              <ToggleSetting
                label="Screen Reader Hints"
                description="Enhanced ARIA labels"
                icon="📢"
                value={settings.screenReaderHints}
                onChange={(v) => handleChange('screenReaderHints', v)}
              />
            </div>
          )}
        </div>

        {/* Reset Button */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid #334155',
          }}
        >
          <button
            onClick={() => {
              setSettings(DEFAULT_SETTINGS);
              saveSettings(DEFAULT_SETTINGS);
              onSettingsChange?.(DEFAULT_SETTINGS);
            }}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #ef444444',
              background: 'transparent',
              color: '#f87171',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}

function ToggleSetting({
  label,
  description,
  icon,
  value,
  onChange,
}: {
  label: string;
  description: string;
  icon: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px',
        background: '#0f172a',
        borderRadius: '10px',
        border: '1px solid #334155',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '20px' }}>{icon}</span>
        <div>
          <div style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: '600' }}>{label}</div>
          <div style={{ color: '#64748b', fontSize: '11px' }}>{description}</div>
        </div>
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: '48px',
          height: '26px',
          borderRadius: '13px',
          border: 'none',
          background: value ? 'linear-gradient(135deg, #14b8a6, #0d9488)' : '#334155',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background 0.2s ease',
        }}
      >
        <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#fff',
            position: 'absolute',
            top: '3px',
            left: value ? '25px' : '3px',
            transition: 'left 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        />
      </button>
    </div>
  );
}

function SliderSetting({
  label,
  description,
  icon,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  description: string;
  icon: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div
      style={{
        padding: '12px',
        background: '#0f172a',
        borderRadius: '10px',
        border: '1px solid #334155',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '20px' }}>{icon}</span>
          <div>
            <div style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: '600' }}>{label}</div>
            <div style={{ color: '#64748b', fontSize: '11px' }}>{description}</div>
          </div>
        </div>
        <span style={{ color: '#14b8a6', fontSize: '16px', fontWeight: '700' }}>{value}s</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        style={{
          width: '100%',
          height: '6px',
          borderRadius: '3px',
          background: '#334155',
          appearance: 'none',
          cursor: 'pointer',
        }}
      />
    </div>
  );
}

// Settings button for quick access
export function SettingsButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1px solid #334155',
        background: '#1e293b',
        color: '#94a3b8',
        fontSize: '14px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      ⚙️
    </button>
  );
}
