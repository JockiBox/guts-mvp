'use client';

import { useMaintenanceMode } from '@/lib/useAdminSettings';

interface MaintenanceModeProps {
  children: React.ReactNode;
}

export function MaintenanceMode({ children }: MaintenanceModeProps) {
  const { inMaintenance, message } = useMaintenanceMode();

  if (inMaintenance) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <div
          style={{
            background: '#1e293b',
            borderRadius: '24px',
            padding: '48px',
            border: '1px solid #334155',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.1))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '48px',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            🔧
          </div>
          <h1
            style={{
              color: '#fbbf24',
              fontSize: '28px',
              fontWeight: '700',
              marginBottom: '16px',
            }}
          >
            Under Maintenance
          </h1>
          <p
            style={{
              color: '#94a3b8',
              fontSize: '16px',
              lineHeight: '1.6',
              marginBottom: '24px',
            }}
          >
            {message || 'We are currently performing maintenance. Please check back soon!'}
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: '#64748b',
              fontSize: '14px',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#fbbf24',
                animation: 'blink 1s ease-in-out infinite',
              }}
            />
            Working on improvements...
          </div>
          <style jsx>{`
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
            @keyframes blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.3; }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Wrapper for individual features that checks if enabled
interface FeatureGateProps {
  feature: string;
  enabled: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureGate({ enabled, children, fallback }: FeatureGateProps) {
  if (!enabled) {
    return fallback ? <>{fallback}</> : null;
  }
  return <>{children}</>;
}

// Disabled feature message component
interface DisabledFeatureProps {
  name: string;
  message?: string;
}

export function DisabledFeature({ name, message }: DisabledFeatureProps) {
  return (
    <div
      style={{
        background: 'rgba(100, 116, 139, 0.1)',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center',
        border: '1px dashed #475569',
      }}
    >
      <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>🚧</div>
      <h3 style={{ color: '#94a3b8', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
        {name} Temporarily Unavailable
      </h3>
      <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
        {message || 'This feature is currently disabled. Please check back later.'}
      </p>
    </div>
  );
}
