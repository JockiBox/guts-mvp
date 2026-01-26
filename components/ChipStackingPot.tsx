'use client';

import { useState, useEffect } from 'react';

interface ChipStackingPotProps {
  amount: number;
  animate?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function ChipStackingPot({ amount, animate = true, size = 'medium' }: ChipStackingPotProps) {
  const [displayAmount, setDisplayAmount] = useState(amount);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (animate && amount !== displayAmount) {
      setIsAnimating(true);

      // Animate count up/down
      const diff = amount - displayAmount;
      const steps = Math.min(Math.abs(diff), 20);
      const stepSize = diff / steps;
      let current = displayAmount;
      let step = 0;

      const interval = setInterval(() => {
        step++;
        current += stepSize;
        setDisplayAmount(Math.round(current));

        if (step >= steps) {
          setDisplayAmount(amount);
          clearInterval(interval);
          setTimeout(() => setIsAnimating(false), 300);
        }
      }, 30);

      return () => clearInterval(interval);
    } else {
      setDisplayAmount(amount);
    }
  }, [amount, animate, displayAmount]);

  // Calculate chip stacks
  const getChipStacks = () => {
    const stacks: Array<{ color: string; count: number; value: number }> = [];
    let remaining = displayAmount;

    // Gold chips (100)
    if (remaining >= 100) {
      const count = Math.min(Math.floor(remaining / 100), 5);
      stacks.push({ color: '#fbbf24', count, value: 100 });
      remaining -= count * 100;
    }

    // Silver chips (25)
    if (remaining >= 25) {
      const count = Math.min(Math.floor(remaining / 25), 5);
      stacks.push({ color: '#94a3b8', count, value: 25 });
      remaining -= count * 25;
    }

    // Teal chips (10)
    if (remaining >= 10) {
      const count = Math.min(Math.floor(remaining / 10), 5);
      stacks.push({ color: '#14b8a6', count, value: 10 });
      remaining -= count * 10;
    }

    // Red chips (5)
    if (remaining >= 5) {
      const count = Math.min(Math.floor(remaining / 5), 5);
      stacks.push({ color: '#ef4444', count, value: 5 });
      remaining -= count * 5;
    }

    // Blue chips (1)
    if (remaining >= 1) {
      const count = Math.min(remaining, 5);
      stacks.push({ color: '#3b82f6', count, value: 1 });
    }

    return stacks;
  };

  const chipStacks = getChipStacks();

  const sizes = {
    small: { chip: 20, spacing: 3, fontSize: 12 },
    medium: { chip: 28, spacing: 4, fontSize: 16 },
    large: { chip: 36, spacing: 5, fontSize: 20 },
  };

  const s = sizes[size];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      {/* Chip stacks visual */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-end',
          justifyContent: 'center',
          minHeight: s.chip * 1.5,
        }}
      >
        {chipStacks.map((stack, stackIndex) => (
          <div
            key={stackIndex}
            style={{
              position: 'relative',
              width: s.chip,
              height: s.chip + (stack.count - 1) * s.spacing,
            }}
          >
            {Array.from({ length: stack.count }).map((_, chipIndex) => (
              <div
                key={chipIndex}
                style={{
                  position: 'absolute',
                  bottom: chipIndex * s.spacing,
                  width: s.chip,
                  height: s.chip,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${stack.color}, ${stack.color}88)`,
                  border: `2px solid ${stack.color}`,
                  boxShadow: `0 ${s.spacing}px ${s.spacing * 2}px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.3)`,
                  animation: isAnimating && chipIndex === stack.count - 1
                    ? 'chipDrop 0.3s ease-out'
                    : 'none',
                  animationDelay: `${stackIndex * 0.05}s`,
                }}
              >
                {/* Chip pattern */}
                <div
                  style={{
                    position: 'absolute',
                    inset: '20%',
                    borderRadius: '50%',
                    border: `1px dashed rgba(255,255,255,0.3)`,
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Amount display */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.6)',
          borderRadius: '8px',
          padding: '6px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span style={{ fontSize: s.fontSize }}>🪙</span>
        <span
          style={{
            color: '#fbbf24',
            fontSize: s.fontSize,
            fontWeight: '700',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {displayAmount.toLocaleString()}
        </span>
      </div>

      <style jsx>{`
        @keyframes chipDrop {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }
          60% {
            transform: translateY(3px);
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

// Simple pot display without chip stacking
export function SimplePot({ amount, label }: { amount: number; label?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      {label && (
        <span style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
          {label}
        </span>
      )}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.1))',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          borderRadius: '12px',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span style={{ fontSize: '18px' }}>🪙</span>
        <span
          style={{
            color: '#fbbf24',
            fontSize: '20px',
            fontWeight: '700',
          }}
        >
          {amount.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

// Animated pot that shows tokens flying in
export function AnimatedPot({
  amount,
  contributions,
}: {
  amount: number;
  contributions?: Array<{ playerId: string; amount: number; position: { x: number; y: number } }>;
}) {
  const [flyingTokens, setFlyingTokens] = useState<Array<{ id: string; x: number; y: number }>>([]);

  useEffect(() => {
    if (contributions && contributions.length > 0) {
      const tokens = contributions.map((c, i) => ({
        id: `${c.playerId}-${i}`,
        x: c.position.x,
        y: c.position.y,
      }));
      setFlyingTokens(tokens);

      // Clear after animation
      const timer = setTimeout(() => setFlyingTokens([]), 600);
      return () => clearTimeout(timer);
    }
  }, [contributions]);

  return (
    <div style={{ position: 'relative' }}>
      {/* Flying tokens */}
      {flyingTokens.map((token) => (
        <div
          key={token.id}
          style={{
            position: 'absolute',
            left: token.x,
            top: token.y,
            fontSize: '20px',
            animation: 'flyToPot 0.5s ease-in forwards',
            pointerEvents: 'none',
          }}
        >
          🪙
        </div>
      ))}

      <ChipStackingPot amount={amount} />

      <style jsx>{`
        @keyframes flyToPot {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(
              calc(50% - var(--start-x, 0px)),
              calc(-50px - var(--start-y, 0px))
            ) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
