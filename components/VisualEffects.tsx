'use client';

import { useState, useEffect, useCallback } from 'react';

// Confetti particle
interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  scale: number;
  velocityX: number;
  velocityY: number;
  shape: 'square' | 'circle' | 'triangle';
}

interface VisualEffectsProps {
  showConfetti: boolean;
  showScreenShake: boolean;
  streakFire: number; // 0 = none, 1-2 = small, 3-4 = medium, 5+ = large
  onConfettiComplete?: () => void;
}

const CONFETTI_COLORS = ['#fbbf24', '#22c55e', '#ef4444', '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6'];

export function VisualEffects({ showConfetti, showScreenShake, streakFire, onConfettiComplete }: VisualEffectsProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isShaking, setIsShaking] = useState(false);

  // Screen shake effect
  useEffect(() => {
    if (showScreenShake) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 500);
      return () => clearTimeout(timer);
    }
  }, [showScreenShake]);

  // Confetti effect
  useEffect(() => {
    if (showConfetti) {
      const newParticles: Particle[] = [];
      const particleCount = 80;

      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: -10 - Math.random() * 20,
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          rotation: Math.random() * 360,
          scale: 0.5 + Math.random() * 0.5,
          velocityX: (Math.random() - 0.5) * 3,
          velocityY: 2 + Math.random() * 3,
          shape: ['square', 'circle', 'triangle'][Math.floor(Math.random() * 3)] as 'square' | 'circle' | 'triangle',
        });
      }

      setParticles(newParticles);

      // Clear after animation
      const timer = setTimeout(() => {
        setParticles([]);
        onConfettiComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showConfetti, onConfettiComplete]);

  return (
    <>
      {/* Screen shake overlay */}
      {isShaking && (
        <style>{`
          @keyframes screen-shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          body {
            animation: screen-shake 0.5s ease-in-out;
          }
        `}</style>
      )}

      {/* Confetti */}
      {particles.length > 0 && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 9999,
            overflow: 'hidden',
          }}
        >
          <style>{`
            @keyframes confetti-fall {
              0% { transform: translateY(0) rotate(0deg); opacity: 1; }
              100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
          `}</style>
          {particles.map((p) => (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.shape === 'circle' ? '12px' : '10px',
                height: p.shape === 'circle' ? '12px' : '10px',
                backgroundColor: p.color,
                borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'triangle' ? '0' : '2px',
                transform: `scale(${p.scale}) rotate(${p.rotation}deg)`,
                animation: `confetti-fall ${2 + Math.random()}s linear forwards`,
                animationDelay: `${Math.random() * 0.5}s`,
                clipPath: p.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined,
              }}
            />
          ))}
        </div>
      )}

      {/* Streak fire effect around edges */}
      {streakFire > 0 && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 100,
          }}
        >
          <style>{`
            @keyframes fire-glow {
              0%, 100% { opacity: 0.3; transform: scale(1); }
              50% { opacity: 0.6; transform: scale(1.02); }
            }
            @keyframes fire-flicker {
              0%, 100% { filter: blur(20px); }
              50% { filter: blur(25px); }
            }
          `}</style>
          {/* Top fire */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: streakFire >= 5 ? '80px' : streakFire >= 3 ? '50px' : '30px',
              background: `linear-gradient(180deg, ${
                streakFire >= 5 ? 'rgba(239, 68, 68, 0.6)' :
                streakFire >= 3 ? 'rgba(251, 191, 36, 0.5)' :
                'rgba(251, 191, 36, 0.3)'
              } 0%, transparent 100%)`,
              animation: 'fire-glow 0.5s ease-in-out infinite, fire-flicker 0.3s ease-in-out infinite',
            }}
          />
          {/* Bottom fire */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: streakFire >= 5 ? '80px' : streakFire >= 3 ? '50px' : '30px',
              background: `linear-gradient(0deg, ${
                streakFire >= 5 ? 'rgba(239, 68, 68, 0.6)' :
                streakFire >= 3 ? 'rgba(251, 191, 36, 0.5)' :
                'rgba(251, 191, 36, 0.3)'
              } 0%, transparent 100%)`,
              animation: 'fire-glow 0.5s ease-in-out infinite, fire-flicker 0.3s ease-in-out infinite',
            }}
          />
          {/* Side fires for big streaks */}
          {streakFire >= 3 && (
            <>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  width: streakFire >= 5 ? '60px' : '30px',
                  background: `linear-gradient(90deg, ${
                    streakFire >= 5 ? 'rgba(239, 68, 68, 0.5)' : 'rgba(251, 191, 36, 0.4)'
                  } 0%, transparent 100%)`,
                  animation: 'fire-glow 0.5s ease-in-out infinite',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 0,
                  width: streakFire >= 5 ? '60px' : '30px',
                  background: `linear-gradient(270deg, ${
                    streakFire >= 5 ? 'rgba(239, 68, 68, 0.5)' : 'rgba(251, 191, 36, 0.4)'
                  } 0%, transparent 100%)`,
                  animation: 'fire-glow 0.5s ease-in-out infinite',
                }}
              />
            </>
          )}
          {/* Streak counter */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: streakFire >= 5 ? 'rgba(239, 68, 68, 0.9)' : 'rgba(251, 191, 36, 0.9)',
              borderRadius: '20px',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: `0 0 20px ${streakFire >= 5 ? 'rgba(239, 68, 68, 0.8)' : 'rgba(251, 191, 36, 0.8)'}`,
              animation: 'fire-glow 0.5s ease-in-out infinite',
            }}
          >
            <span style={{ fontSize: '20px' }}>🔥</span>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>{streakFire}</span>
            <span style={{ color: 'white', fontSize: '12px', opacity: 0.9 }}>STREAK</span>
          </div>
        </div>
      )}
    </>
  );
}

// Quick Emotes Component
interface EmoteButtonProps {
  onEmote: (emote: string) => void;
}

export function EmoteButtons({ onEmote }: EmoteButtonProps) {
  const emotes = ['👏', '🔥', '😱', '💀', '😎', '🎉'];

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        padding: '8px',
        background: 'rgba(30, 41, 59, 0.9)',
        borderRadius: '12px',
        border: '1px solid #334155',
      }}
    >
      {emotes.map((emote) => (
        <button
          key={emote}
          onClick={() => onEmote(emote)}
          style={{
            background: 'rgba(51, 65, 85, 0.5)',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '20px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(20, 184, 166, 0.3)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(51, 65, 85, 0.5)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {emote}
        </button>
      ))}
    </div>
  );
}

// Floating emote that shows when someone emotes
interface FloatingEmoteProps {
  emote: string;
  playerName: string;
  onComplete: () => void;
}

export function FloatingEmote({ emote, playerName, onComplete }: FloatingEmoteProps) {
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
        zIndex: 9999,
        animation: 'emote-pop 2s ease-out forwards',
      }}
    >
      <style>{`
        @keyframes emote-pop {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          20% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
          30% { transform: translate(-50%, -50%) scale(1); }
          80% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -70%) scale(0.8); opacity: 0; }
        }
      `}</style>
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.95)',
          borderRadius: '20px',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          border: '2px solid #14b8a6',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
        }}
      >
        <span style={{ fontSize: '48px' }}>{emote}</span>
        <span style={{ color: '#94a3b8', fontSize: '12px' }}>{playerName}</span>
      </div>
    </div>
  );
}

// Coin flying animation for wins
interface CoinFlyProps {
  amount: number;
  startPosition: { x: number; y: number };
  onComplete: () => void;
}

export function CoinFly({ amount, startPosition, onComplete }: CoinFlyProps) {
  const [coins, setCoins] = useState<{ id: number; delay: number }[]>([]);

  useEffect(() => {
    const coinCount = Math.min(20, Math.ceil(amount / 5));
    const newCoins = Array.from({ length: coinCount }, (_, i) => ({
      id: i,
      delay: i * 0.05,
    }));
    setCoins(newCoins);

    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [amount, onComplete]);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9998 }}>
      <style>{`
        @keyframes coin-fly {
          0% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(0.5) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
      {coins.map((coin) => (
        <div
          key={coin.id}
          style={{
            position: 'absolute',
            left: startPosition.x,
            top: startPosition.y,
            fontSize: '24px',
            '--tx': `${(Math.random() - 0.5) * 200}px`,
            '--ty': `${-100 - Math.random() * 100}px`,
            animation: `coin-fly 1s ease-out forwards`,
            animationDelay: `${coin.delay}s`,
          } as React.CSSProperties}
        >
          🪙
        </div>
      ))}
    </div>
  );
}
