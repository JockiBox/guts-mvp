'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminSettings, getAdminSettings, getClientSettings, cacheClientSettings } from './adminSettings';

interface UseAdminSettingsResult {
  settings: AdminSettings;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  isEnabled: (feature: keyof AdminSettings) => boolean;
  getValue: <K extends keyof AdminSettings>(key: K) => AdminSettings[K];
}

export function useAdminSettings(): UseAdminSettingsResult {
  const [settings, setSettings] = useState<AdminSettings>(getClientSettings());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedSettings = await getAdminSettings();
      setSettings(fetchedSettings);
      cacheClientSettings(fetchedSettings);
    } catch (err) {
      console.error('Error loading admin settings:', err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();

    // Refresh settings periodically (every 5 minutes)
    const interval = setInterval(fetchSettings, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchSettings]);

  const isEnabled = useCallback(
    (feature: keyof AdminSettings): boolean => {
      const value = settings[feature];
      return typeof value === 'boolean' ? value : true;
    },
    [settings]
  );

  const getValue = useCallback(
    <K extends keyof AdminSettings>(key: K): AdminSettings[K] => {
      return settings[key];
    },
    [settings]
  );

  return {
    settings,
    loading,
    error,
    refresh: fetchSettings,
    isEnabled,
    getValue,
  };
}

// Simpler hook for just checking if a feature is enabled
export function useFeatureEnabled(feature: keyof AdminSettings): boolean {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const checkFeature = async () => {
      const settings = await getAdminSettings();
      const value = settings[feature];
      setEnabled(typeof value === 'boolean' ? value : true);
    };
    checkFeature();
  }, [feature]);

  return enabled;
}

// Hook for maintenance mode
export function useMaintenanceMode(): { inMaintenance: boolean; message: string } {
  const [state, setState] = useState({ inMaintenance: false, message: '' });

  useEffect(() => {
    const checkMaintenance = async () => {
      const settings = await getAdminSettings();
      setState({
        inMaintenance: settings.maintenanceMode,
        message: settings.maintenanceMessage,
      });
    };
    checkMaintenance();
  }, []);

  return state;
}
