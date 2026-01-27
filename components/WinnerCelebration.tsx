'use client';

import { useState, useEffect, useRef } from 'react';

interface WinnerCelebrationProps {
  show: boolean;
  winnerName: string;
  tokensWon: number;
  isHuman?: boolean;
  onComplete?: () => void;
}

export function WinnerCelebration({
  show,
  winnerName,
  tokensWon,
  isHuman = false,
  onComplete,
}: WinnerCelebrationProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; emoji: string }>>([]);
  const [visible, setVisible] = useState(false);
  const onCompleteRef = useRef(onComplete);

  // Keep ref updated without triggering effect
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (show) {
      setVisible(true);

      // Create confetti particles
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        emoji: ['🎉', '✨', '⭐', '💫', '🌟', '🎊', '💰', '🪙'][Math.floor(Math.random() * 8)],
      }));
      setParticles(newParticles);

      // Auto-hide after 2 seconds
      const timer = setTimeout(() => {
        setVisible(false);
        onCompleteRef.current?.();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 900,
        overflow: 'hidden',
      }}
    >
      {/* Confetti particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            fontSize: '24px',
            animation: `fall ${2 + Math.random()}s ease-out forwards`,
            animationDelay: `${Math.random() * 0.5}s`,
          }}
        >
          {particle.emoji}
        </div>
      ))}

      {/* Winner announcement */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          animation: 'popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <div
          style={{
            background: isHuman
              ? 'linear-gradient(135deg, #22c55e, #14b8a6)'
              : 'linear-gradient(135deg, #ef4444, #f97316)',
            borderRadius: '20px',
            padding: '24px 48px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>
            {isHuman ? '🏆' : '😈'}
          </div>
          <div
            style={{
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '8px',
            }}
          >
            {isHuman ? 'You Win!' : 'Winner'}
          </div>
          <div
            style={{
              color: '#fff',
              fontSize: '28px',
              fontWeight: '900',
              marginBottom: '12px',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}
          >
            {winnerName}
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
            }}
          >
            <span style={{ fontSize: '20px' }}>🪙</span>
            <span style={{ color: '#fbbf24', fontSize: '24px', fontWeight: '900' }}>
              +{tokensWon}
            </span>
          </div>
        </div>
      </div>

      {/* Screen flash */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isHuman
            ? 'radial-gradient(circle at center, rgba(34, 197, 94, 0.3), transparent)'
            : 'radial-gradient(circle at center, rgba(239, 68, 68, 0.2), transparent)',
          animation: 'flashFade 0.5s ease-out',
        }}
      />

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes popIn {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }
        @keyframes flashFade {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

// Streak celebration for win streaks
export function StreakCelebration({
  streak,
  show,
  onComplete,
}: {
  streak: number;
  show: boolean;
  onComplete?: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const onCompleteRef = useRef(onComplete);

  // Keep ref updated without triggering effect
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (show && streak >= 3) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onCompleteRef.current?.();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, streak]);

  if (!visible || streak < 3) return null;

  const streakEmoji = streak >= 10 ? '🔥🔥🔥' : streak >= 5 ? '🔥🔥' : '🔥';
  const streakColor = streak >= 10 ? '#ef4444' : streak >= 5 ? '#f97316' : '#fbbf24';

  return (
    <div
      style={{
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 950,
        pointerEvents: 'none',
        animation: 'streakBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <div
        style={{
          background: `linear-gradient(135deg, ${streakColor}44, ${streakColor}22)`,
          border: `2px solid ${streakColor}`,
          borderRadius: '16px',
          padding: '16px 32px',
          textAlign: 'center',
          boxShadow: `0 0 40px ${streakColor}66`,
        }}
      >
        <div style={{ fontSize: '32px', marginBottom: '4px' }}>{streakEmoji}</div>
        <div style={{ color: streakColor, fontSize: '24px', fontWeight: '900' }}>
          {streak} WIN STREAK!
        </div>
        <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
          +{streak * 10} Bonus XP
        </div>
      </div>

      <style jsx>{`
        @keyframes streakBounce {
          0% {
            transform: translateX(-50%) scale(0) translateY(-50px);
            opacity: 0;
          }
          60% {
            transform: translateX(-50%) scale(1.1) translateY(0);
          }
          100% {
            transform: translateX(-50%) scale(1) translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

// Token gain animation
export function TokenGainAnimation({
  amount,
  position,
  show,
}: {
  amount: number;
  position: { x: number; y: number };
  show: boolean;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!visible) return null;

  const isPositive = amount > 0;

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: 'translateX(-50%)',
        zIndex: 100,
        pointerEvents: 'none',
        animation: 'floatUp 1.5s ease-out forwards',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '6px 12px',
          background: isPositive ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)',
          borderRadius: '20px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        }}
      >
        <span style={{ fontSize: '16px' }}>🪙</span>
        <span
          style={{
            color: '#fff',
            fontSize: '18px',
            fontWeight: '700',
          }}
        >
          {isPositive ? '+' : ''}{amount}
        </span>
      </div>

      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateX(-50%) translateY(-60px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

// Ghost reveal celebration
export function GhostRevealCelebration({ show, onComplete }: { show: boolean; onComplete?: () => void }) {
  const [visible, setVisible] = useState(false);
  const onCompleteRef = useRef(onComplete);

  // Keep ref updated without triggering effect
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onCompleteRef.current?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 950,
        pointerEvents: 'none',
        animation: 'ghostReveal 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
          borderRadius: '20px',
          padding: '24px 40px',
          textAlign: 'center',
          boxShadow: '0 0 60px rgba(139, 92, 246, 0.5)',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>👻</div>
        <div style={{ color: '#fff', fontSize: '20px', fontWeight: '900' }}>GHOST WINS!</div>
        <div style={{ color: '#c4b5fd', fontSize: '12px', marginTop: '4px' }}>
          Everyone who held loses!
        </div>
      </div>

      <style jsx>{`
        @keyframes ghostReveal {
          0% {
            transform: translate(-50%, -50%) scale(0) rotate(-180deg);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, -50%) scale(1) rotate(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
