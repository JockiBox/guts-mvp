'use client';

import { useEffect } from 'react';
import { Combo } from '@/lib/comboBonuses';

interface ComboNotificationProps {
  combo: Combo;
  onComplete: () => void;
}

export function ComboNotification({ combo, onComplete }: ComboNotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        animation: 'combo-appear 0.5s ease-out',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.95), rgba(245, 158, 11, 0.95))',
          borderRadius: '20px',
          padding: '24px 40px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(251, 191, 36, 0.4), 0 0 40px rgba(251, 191, 36, 0.3)',
        }}
      >
        <div
          style={{
            fontSize: '56px',
            marginBottom: '8px',
            animation: 'combo-icon 0.5s ease-out',
          }}
        >
          {combo.icon}
        </div>

        <div
          style={{
            color: '#1e293b',
            fontSize: '28px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '8px',
          }}
        >
          {combo.name}
        </div>

        <div
          style={{
            color: '#1e293b',
            fontSize: '14px',
            opacity: 0.8,
            marginBottom: '12px',
          }}
        >
          {combo.description}
        </div>

        <div
          style={{
            display: 'inline-block',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '20px',
            padding: '8px 20px',
          }}
        >
          <span style={{ color: '#1e293b', fontSize: '18px', fontWeight: 'bold' }}>
            +{combo.bonus} 🪙
          </span>
        </div>
      </div>

      <style>{`
        @keyframes combo-appear {
          0% { transform: translate(-50%, -50%) scale(0) rotate(-180deg); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.1) rotate(10deg); }
          100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes combo-icon {
          0% { transform: scale(0); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

// Multiple combos stacked
interface ComboStackProps {
  combos: Combo[];
  onComplete: () => void;
}

export function ComboStack({ combos, onComplete }: ComboStackProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [combos, onComplete]);

  const totalBonus = combos.reduce((sum, c) => sum + c.bonus, 0);

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        animation: 'combo-appear 0.5s ease-out',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.95), rgba(245, 158, 11, 0.95))',
          borderRadius: '20px',
          padding: '24px 32px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(251, 191, 36, 0.4)',
        }}
      >
        <div style={{ color: '#1e293b', fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>
          COMBO x{combos.length}!
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          {combos.map((combo, index) => (
            <div
              key={combo.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                padding: '8px 12px',
                animation: `combo-item 0.3s ease-out ${index * 0.2}s both`,
              }}
            >
              <span style={{ fontSize: '24px' }}>{combo.icon}</span>
              <span style={{ color: '#1e293b', fontSize: '14px', fontWeight: 'bold', flex: 1 }}>
                {combo.name}
              </span>
              <span style={{ color: '#1e293b', fontSize: '12px' }}>+{combo.bonus}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '12px',
            padding: '12px 20px',
          }}
        >
          <span style={{ color: '#1e293b', fontSize: '20px', fontWeight: 'bold' }}>
            Total: +{totalBonus} 🪙
          </span>
        </div>
      </div>

      <style>{`
        @keyframes combo-item {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
