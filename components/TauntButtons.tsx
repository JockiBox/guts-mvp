'use client';

import { useState, useEffect } from 'react';
import { getUnlockedTaunts, Taunt, recordTauntSent, getBotTauntResponse } from '@/lib/taunts';

interface TauntButtonsProps {
  onTaunt: (taunt: Taunt, response: string | null) => void;
  targetBotName: string;
  targetBotPersonality: string;
  disabled?: boolean;
}

export function TauntButtons({ onTaunt, targetBotName, targetBotPersonality, disabled }: TauntButtonsProps) {
  const [taunts, setTaunts] = useState<Taunt[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  useEffect(() => {
    const unlocked = getUnlockedTaunts();
    // Show first 4 by default
    setTaunts(unlocked);
  }, []);

  const handleTaunt = (taunt: Taunt) => {
    if (disabled || cooldown) return;

    setCooldown(true);
    recordTauntSent();

    // Get bot response
    const response = getBotTauntResponse(targetBotPersonality, taunt.category);
    onTaunt(taunt, response);

    // 3 second cooldown
    setTimeout(() => setCooldown(false), 3000);
  };

  const displayTaunts = showAll ? taunts : taunts.slice(0, 4);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '10px',
        background: 'rgba(30, 41, 59, 0.95)',
        borderRadius: '12px',
        border: '2px solid #334155',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ color: '#94a3b8', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}>
          Taunt {targetBotName}
        </span>
        {taunts.length > 4 && (
          <button
            onClick={() => setShowAll(!showAll)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#14b8a6',
              fontSize: '10px',
              cursor: 'pointer',
            }}
          >
            {showAll ? 'Less' : `+${taunts.length - 4} more`}
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {displayTaunts.map((taunt) => (
          <button
            key={taunt.id}
            onClick={() => handleTaunt(taunt)}
            disabled={disabled || cooldown}
            title={taunt.text}
            style={{
              padding: '8px 12px',
              background: cooldown ? 'rgba(51, 65, 85, 0.3)' : 'rgba(51, 65, 85, 0.5)',
              border: '1px solid #475569',
              borderRadius: '8px',
              fontSize: '18px',
              cursor: disabled || cooldown ? 'not-allowed' : 'pointer',
              opacity: disabled || cooldown ? 0.5 : 1,
              transition: 'all 0.2s ease',
            }}
          >
            {taunt.emoji}
          </button>
        ))}
      </div>

      {cooldown && (
        <div style={{ color: '#64748b', fontSize: '10px', textAlign: 'center' }}>
          Cooldown...
        </div>
      )}
    </div>
  );
}

// Taunt display popup
interface TauntDisplayProps {
  taunt: Taunt;
  playerName: string;
  response: string | null;
  botName: string;
  onComplete: () => void;
}

export function TauntDisplay({ taunt, playerName, response, botName, onComplete }: TauntDisplayProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, response ? 4000 : 2500);
    return () => clearTimeout(timer);
  }, [onComplete, response]);

  const getAnimationStyle = () => {
    switch (taunt.animation) {
      case 'shake':
        return 'taunt-shake 0.3s ease-in-out 3';
      case 'bounce':
        return 'taunt-bounce 0.5s ease-in-out 2';
      case 'spin':
        return 'taunt-spin 0.5s ease-in-out';
      case 'grow':
        return 'taunt-grow 0.3s ease-out';
      case 'flash':
        return 'taunt-flash 0.2s ease-in-out 3';
      default:
        return 'taunt-bounce 0.5s ease-in-out';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 900,
        animation: 'taunt-appear 0.3s ease-out',
      }}
    >
      {/* Player taunt */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.95)',
          borderRadius: '16px',
          padding: '16px 24px',
          border: '2px solid #14b8a6',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
          textAlign: 'center',
          marginBottom: response ? '12px' : 0,
        }}
      >
        <div
          style={{
            fontSize: '48px',
            marginBottom: '8px',
            animation: getAnimationStyle(),
          }}
        >
          {taunt.emoji}
        </div>
        <div style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 'bold' }}>
          {taunt.text}
        </div>
        <div style={{ color: '#64748b', fontSize: '11px', marginTop: '4px' }}>
          - {playerName}
        </div>
      </div>

      {/* Bot response */}
      {response && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.2)',
            borderRadius: '16px',
            padding: '12px 20px',
            border: '2px solid #ef4444',
            textAlign: 'center',
            animation: 'response-appear 0.5s ease-out 0.5s both',
          }}
        >
          <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold' }}>
            {response}
          </div>
          <div style={{ color: '#64748b', fontSize: '10px', marginTop: '4px' }}>
            - {botName}
          </div>
        </div>
      )}

      <style>{`
        @keyframes taunt-appear {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes response-appear {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes taunt-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        @keyframes taunt-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes taunt-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes taunt-grow {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        @keyframes taunt-flash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
