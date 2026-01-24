'use client';

import { useState, useEffect } from 'react';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  getNotificationSettings,
  saveNotificationSettings,
  type NotificationSettings as NotificationSettingsType,
  showNotification,
} from '@/lib/notifications';

interface NotificationSettingsProps {
  onClose?: () => void;
  isCompact?: boolean;
}

export default function NotificationSettings({
  onClose,
  isCompact = false,
}: NotificationSettingsProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<NotificationSettingsType>({
    enabled: false,
    friendRequests: true,
    gameInvites: true,
    tournaments: true,
    dailyRewards: true,
    achievements: true,
  });
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    // Check support and permission on mount
    const supported = isNotificationSupported();
    setIsSupported(supported);

    if (supported) {
      setPermission(getNotificationPermission());
      setSettings(getNotificationSettings());
    }
  }, []);

  const handleRequestPermission = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);

    if (result === 'granted') {
      const newSettings = { ...settings, enabled: true };
      setSettings(newSettings);
      saveNotificationSettings(newSettings);
    }
  };

  const handleToggle = (key: keyof NotificationSettingsType) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    saveNotificationSettings(newSettings);
  };

  const handleSendTest = async () => {
    const success = await showNotification({
      title: 'Test Notification',
      body: 'GUTS notifications are working!',
      tag: 'test',
      data: { type: 'test' },
    });

    if (success) {
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    }
  };

  if (!isSupported) {
    return (
      <div
        style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>
          🚫
        </span>
        <span style={{ color: '#f87171', fontSize: '14px' }}>
          Push notifications are not supported in this browser
        </span>
      </div>
    );
  }

  const toggleItems = [
    {
      key: 'friendRequests' as const,
      label: 'Friend Requests',
      description: 'When someone sends you a friend request',
      icon: '👥',
    },
    {
      key: 'gameInvites' as const,
      label: 'Game Invites',
      description: 'When a friend invites you to play',
      icon: '🎮',
    },
    {
      key: 'tournaments' as const,
      label: 'Tournaments',
      description: 'Tournament starts and updates',
      icon: '🏆',
    },
    {
      key: 'dailyRewards' as const,
      label: 'Daily Rewards',
      description: 'Reminder to claim your daily reward',
      icon: '🎁',
    },
    {
      key: 'achievements' as const,
      label: 'Achievements',
      description: 'When you unlock an achievement',
      icon: '🏅',
    },
  ];

  return (
    <div
      style={{
        background: 'rgba(30, 41, 59, 0.95)',
        borderRadius: '16px',
        border: '1px solid #334155',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      {!isCompact && (
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>🔔</span>
            <span style={{ color: '#e2e8f0', fontWeight: '600', fontSize: '16px' }}>
              Notification Settings
            </span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                fontSize: '20px',
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          )}
        </div>
      )}

      <div style={{ padding: isCompact ? '12px' : '20px' }}>
        {/* Permission status */}
        {permission !== 'granted' ? (
          <div
            style={{
              background:
                permission === 'denied'
                  ? 'rgba(239, 68, 68, 0.15)'
                  : 'rgba(251, 191, 36, 0.15)',
              border: `1px solid ${
                permission === 'denied'
                  ? 'rgba(239, 68, 68, 0.3)'
                  : 'rgba(251, 191, 36, 0.3)'
              }`,
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            {permission === 'denied' ? (
              <>
                <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>
                  🔕
                </span>
                <span style={{ color: '#f87171', fontSize: '14px', display: 'block' }}>
                  Notifications are blocked
                </span>
                <span style={{ color: '#94a3b8', fontSize: '12px' }}>
                  Enable them in your browser settings
                </span>
              </>
            ) : (
              <>
                <span style={{ color: '#fbbf24', fontSize: '14px', display: 'block', marginBottom: '12px' }}>
                  Enable notifications to stay updated on game events
                </span>
                <button
                  onClick={handleRequestPermission}
                  style={{
                    background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '14px',
                  }}
                >
                  Enable Notifications
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Master toggle */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: settings.enabled
                  ? 'rgba(20, 184, 166, 0.15)'
                  : 'rgba(51, 65, 85, 0.5)',
                borderRadius: '12px',
                marginBottom: '16px',
                border: `1px solid ${settings.enabled ? 'rgba(20, 184, 166, 0.3)' : '#334155'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>
                  {settings.enabled ? '🔔' : '🔕'}
                </span>
                <span style={{ color: '#e2e8f0', fontWeight: '600' }}>
                  All Notifications
                </span>
              </div>
              <ToggleSwitch
                enabled={settings.enabled}
                onToggle={() => handleToggle('enabled')}
              />
            </div>

            {/* Individual toggles */}
            <div
              style={{
                opacity: settings.enabled ? 1 : 0.5,
                pointerEvents: settings.enabled ? 'auto' : 'none',
              }}
            >
              {toggleItems.map((item) => (
                <div
                  key={item.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: '1px solid #334155',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '18px' }}>{item.icon}</span>
                    <div>
                      <div style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '500' }}>
                        {item.label}
                      </div>
                      {!isCompact && (
                        <div style={{ color: '#64748b', fontSize: '12px' }}>
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <ToggleSwitch
                    enabled={settings[item.key]}
                    onToggle={() => handleToggle(item.key)}
                  />
                </div>
              ))}
            </div>

            {/* Test notification button */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button
                onClick={handleSendTest}
                disabled={!settings.enabled || testSent}
                style={{
                  background: testSent
                    ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                    : 'rgba(51, 65, 85, 0.5)',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  cursor: settings.enabled && !testSent ? 'pointer' : 'not-allowed',
                  color: testSent ? 'white' : '#94a3b8',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                }}
              >
                {testSent ? '✓ Notification Sent!' : 'Send Test Notification'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Toggle switch component
function ToggleSwitch({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: '48px',
        height: '26px',
        borderRadius: '13px',
        background: enabled
          ? 'linear-gradient(135deg, #14b8a6, #0d9488)'
          : 'rgba(51, 65, 85, 0.8)',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.2s',
      }}
    >
      <div
        style={{
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          background: 'white',
          position: 'absolute',
          top: '2px',
          left: enabled ? '24px' : '2px',
          transition: 'all 0.2s',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        }}
      />
    </button>
  );
}

// Compact notification badge for nav
export function NotificationBadge({
  count,
  onClick,
}: {
  count: number;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
      }}
    >
      <span style={{ fontSize: '20px' }}>🔔</span>
      {count > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '0',
            right: '0',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: '#ef4444',
            color: 'white',
            fontSize: '10px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {count > 9 ? '9+' : count}
        </div>
      )}
    </button>
  );
}
