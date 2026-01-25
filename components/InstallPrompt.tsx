'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Listen for install prompt (Android/Desktop)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Show prompt after a delay if not dismissed before
      const dismissed = localStorage.getItem('install-prompt-dismissed');
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Show iOS prompt after delay
    if (iOS && !standalone) {
      const dismissed = localStorage.getItem('install-prompt-dismissed');
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 5000);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('install-prompt-dismissed', 'true');
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        borderRadius: '16px',
        padding: '16px 20px',
        border: '2px solid #14b8a6',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(20, 184, 166, 0.3)',
        zIndex: 9999,
        maxWidth: '340px',
        width: 'calc(100% - 40px)',
        animation: 'slide-up 0.4s ease-out',
      }}
    >
      <style>{`
        @keyframes slide-up {
          from { transform: translateX(-50%) translateY(100px); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        {/* App Icon */}
        <div
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            flexShrink: 0,
          }}
        >
          🃏
        </div>

        <div style={{ flex: 1 }}>
          <h3
            style={{
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              margin: 0,
              marginBottom: '4px',
            }}
          >
            Install GUTS
          </h3>
          <p
            style={{
              color: '#94a3b8',
              fontSize: '13px',
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {isIOS
              ? 'Tap the share button, then "Add to Home Screen"'
              : 'Add to your home screen for the best experience'}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '0',
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
        {!isIOS && deferredPrompt && (
          <button
            onClick={handleInstall}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 16px',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Install App
          </button>
        )}
        <button
          onClick={handleDismiss}
          style={{
            flex: isIOS || !deferredPrompt ? 1 : 0,
            background: 'rgba(51, 65, 85, 0.5)',
            border: '1px solid #475569',
            borderRadius: '10px',
            padding: '10px 16px',
            color: '#94a3b8',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          {isIOS ? 'Got it' : 'Not now'}
        </button>
      </div>
    </div>
  );
}
