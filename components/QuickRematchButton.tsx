'use client';

import { useState, useEffect } from 'react';

interface QuickRematchButtonProps {
  onRematch: () => void;
  countdown?: number;
  disabled?: boolean;
}

export function QuickRematchButton({
  onRematch,
  countdown = 5,
  disabled = false,
}: QuickRematchButtonProps) {
  const [timeLeft, setTimeLeft] = useState(countdown);
  const [autoRematch, setAutoRematch] = useState(false);

  useEffect(() => {
    if (autoRematch && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (autoRematch && timeLeft === 0) {
      onRematch();
    }
  }, [autoRematch, timeLeft, onRematch]);

  const handleToggleAuto = () => {
    if (autoRematch) {
      setAutoRematch(false);
      setTimeLeft(countdown);
    } else {
      setAutoRematch(true);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      {/* Main rematch button */}
      <button
        onClick={onRematch}
        disabled={disabled}
        style={{
          padding: '14px 32px',
          borderRadius: '12px',
          border: 'none',
          background: disabled
            ? '#334155'
            : 'linear-gradient(135deg, #14b8a6, #0d9488)',
          color: disabled ? '#64748b' : '#fff',
          fontSize: '16px',
          fontWeight: '700',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: disabled ? 'none' : '0 4px 20px rgba(20, 184, 166, 0.4)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
      >
        <span style={{ fontSize: '20px' }}>🔄</span>
        Play Again
      </button>

      {/* Auto-rematch toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <button
          onClick={handleToggleAuto}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: autoRematch ? '1px solid #14b8a6' : '1px solid #334155',
            background: autoRematch ? 'rgba(20, 184, 166, 0.2)' : 'transparent',
            color: autoRematch ? '#14b8a6' : '#64748b',
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '3px',
              border: autoRematch ? '2px solid #14b8a6' : '2px solid #64748b',
              background: autoRematch ? '#14b8a6' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8px',
              color: '#fff',
            }}
          >
            {autoRematch && '✓'}
          </span>
          Auto-rematch
        </button>

        {autoRematch && (
          <span style={{ color: '#94a3b8', fontSize: '12px' }}>
            Starting in {timeLeft}s
          </span>
        )}
      </div>
    </div>
  );
}

// Compact rematch button for inline use
export function RematchButton({ onClick, size = 'medium' }: { onClick: () => void; size?: 'small' | 'medium' | 'large' }) {
  const sizes = {
    small: { padding: '6px 12px', fontSize: '12px', iconSize: '14px' },
    medium: { padding: '10px 20px', fontSize: '14px', iconSize: '16px' },
    large: { padding: '14px 28px', fontSize: '16px', iconSize: '20px' },
  };

  const s = sizes[size];

  return (
    <button
      onClick={onClick}
      style={{
        padding: s.padding,
        borderRadius: '8px',
        border: 'none',
        background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
        color: '#fff',
        fontSize: s.fontSize,
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      <span style={{ fontSize: s.iconSize }}>🔄</span>
      Rematch
    </button>
  );
}

// Game over screen with rematch option
export function GameOverScreen({
  isWinner,
  finalTokens,
  roundsPlayed,
  onRematch,
  onExit,
}: {
  isWinner: boolean;
  finalTokens: number;
  roundsPlayed: number;
  onRematch: () => void;
  onExit: () => void;
}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: '#1e293b',
          borderRadius: '24px',
          padding: '40px',
          textAlign: 'center',
          maxWidth: '400px',
          width: '90%',
          border: isWinner ? '2px solid #22c55e' : '2px solid #ef4444',
          animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Result icon */}
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>
          {isWinner ? '🏆' : '💀'}
        </div>

        {/* Result text */}
        <h2
          style={{
            color: isWinner ? '#4ade80' : '#f87171',
            fontSize: '32px',
            fontWeight: '900',
            marginBottom: '8px',
          }}
        >
          {isWinner ? 'VICTORY!' : 'GAME OVER'}
        </h2>

        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>
          {isWinner
            ? 'You outlasted all opponents!'
            : 'You ran out of tokens!'}
        </p>

        {/* Stats */}
        <div
          style={{
            background: '#0f172a',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ color: '#fbbf24', fontSize: '24px', fontWeight: '700' }}>
              🪙 {finalTokens}
            </div>
            <div style={{ color: '#64748b', fontSize: '11px' }}>Final Tokens</div>
          </div>
          <div>
            <div style={{ color: '#14b8a6', fontSize: '24px', fontWeight: '700' }}>
              🎴 {roundsPlayed}
            </div>
            <div style={{ color: '#64748b', fontSize: '11px' }}>Rounds Played</div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={onExit}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              border: '1px solid #334155',
              background: 'transparent',
              color: '#94a3b8',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Exit
          </button>
          <button
            onClick={onRematch}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            🔄 Play Again
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
