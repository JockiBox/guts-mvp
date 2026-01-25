'use client';

import { useState, useEffect, useCallback } from 'react';
import { WHEEL_SEGMENTS, WheelSegment, spinWheel, loadWheelState, WheelState } from '@/lib/luckyWheel';

interface LuckyWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReward: (reward: { type: string; value: number | string }) => void;
}

export function LuckyWheelModal({ isOpen, onClose, onReward }: LuckyWheelModalProps) {
  const [wheelState, setWheelState] = useState<WheelState | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<WheelSegment | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setWheelState(loadWheelState());
      setResult(null);
      setShowResult(false);
    }
  }, [isOpen]);

  const handleSpin = useCallback(() => {
    if (isSpinning || !wheelState || wheelState.spinsAvailable <= 0) return;

    setIsSpinning(true);
    setShowResult(false);

    const spinResult = spinWheel();
    if (!spinResult) {
      setIsSpinning(false);
      return;
    }

    // Calculate rotation to land on the segment
    const segmentIndex = WHEEL_SEGMENTS.findIndex(s => s.id === spinResult.segment.id);
    const segmentAngle = 360 / WHEEL_SEGMENTS.length;
    const targetAngle = segmentIndex * segmentAngle + segmentAngle / 2;
    const spins = 5 + Math.random() * 3; // 5-8 full rotations
    const finalRotation = spins * 360 + (360 - targetAngle);

    setRotation(prev => prev + finalRotation);

    // Show result after animation
    setTimeout(() => {
      setIsSpinning(false);
      setResult(spinResult.segment);
      setWheelState(spinResult.state);
      setShowResult(true);

      // Trigger reward callback
      onReward({
        type: spinResult.segment.reward.type,
        value: spinResult.segment.reward.value,
      });
    }, 4000);
  }, [isSpinning, wheelState, onReward]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
      }}
      onClick={!isSpinning ? onClose : undefined}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          borderRadius: '24px',
          padding: '32px',
          border: '3px solid #fbbf24',
          maxWidth: '450px',
          width: '95%',
          textAlign: 'center',
          boxShadow: '0 0 60px rgba(251, 191, 36, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ color: '#fbbf24', margin: '0 0 8px 0', fontSize: '28px' }}>
          🎡 Lucky Wheel!
        </h2>
        <p style={{ color: '#94a3b8', margin: '0 0 24px 0', fontSize: '14px' }}>
          Spins available: <span style={{ color: '#22c55e', fontWeight: 'bold' }}>{wheelState?.spinsAvailable || 0}</span>
        </p>

        {/* Wheel */}
        <div style={{ position: 'relative', width: '300px', height: '300px', margin: '0 auto 24px' }}>
          {/* Pointer */}
          <div
            style={{
              position: 'absolute',
              top: '-20px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '32px',
              zIndex: 10,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
            }}
          >
            ▼
          </div>

          {/* Wheel */}
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '8px solid #fbbf24',
              overflow: 'hidden',
              position: 'relative',
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
              boxShadow: '0 0 30px rgba(251, 191, 36, 0.4), inset 0 0 30px rgba(0,0,0,0.3)',
            }}
          >
            {WHEEL_SEGMENTS.map((segment, index) => {
              const angle = (360 / WHEEL_SEGMENTS.length) * index;
              const skewAngle = 90 - (360 / WHEEL_SEGMENTS.length);

              return (
                <div
                  key={segment.id}
                  style={{
                    position: 'absolute',
                    width: '50%',
                    height: '50%',
                    top: 0,
                    left: '50%',
                    transformOrigin: '0 100%',
                    transform: `rotate(${angle}deg) skewY(${skewAngle}deg)`,
                    background: segment.color,
                    borderRight: '1px solid rgba(255,255,255,0.2)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: '20%',
                      top: '20%',
                      transform: `skewY(-${skewAngle}deg) rotate(${45 - 360 / WHEEL_SEGMENTS.length / 2}deg)`,
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                    }}
                  >
                    {segment.icon}
                  </div>
                </div>
              );
            })}

            {/* Center */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              }}
            >
              🎡
            </div>
          </div>
        </div>

        {/* Result */}
        {showResult && result && (
          <div
            style={{
              padding: '16px',
              background: result.reward.type === 'nothing'
                ? 'rgba(100, 116, 139, 0.3)'
                : 'rgba(34, 197, 94, 0.3)',
              borderRadius: '12px',
              marginBottom: '20px',
              animation: 'result-pop 0.5s ease-out',
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>{result.icon}</div>
            <div style={{ color: '#e2e8f0', fontSize: '18px', fontWeight: 'bold' }}>
              {result.reward.displayValue}
            </div>
          </div>
        )}

        {/* Spin Button */}
        <button
          onClick={handleSpin}
          disabled={isSpinning || !wheelState || wheelState.spinsAvailable <= 0}
          style={{
            width: '100%',
            padding: '16px',
            background: isSpinning || !wheelState || wheelState.spinsAvailable <= 0
              ? 'rgba(51, 65, 85, 0.5)'
              : 'linear-gradient(135deg, #fbbf24, #d97706)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: isSpinning || !wheelState || wheelState.spinsAvailable <= 0 ? 'not-allowed' : 'pointer',
            textTransform: 'uppercase',
          }}
        >
          {isSpinning ? '🎡 Spinning...' : wheelState && wheelState.spinsAvailable > 0 ? '🎡 SPIN!' : 'No Spins Available'}
        </button>

        {wheelState && wheelState.spinsAvailable === 0 && (
          <p style={{ color: '#64748b', fontSize: '12px', marginTop: '12px' }}>
            Win {wheelState.winsUntilSpin} more hands to earn a spin!
          </p>
        )}

        <style>{`
          @keyframes result-pop {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}

// Mini badge to show spins available
interface WheelBadgeProps {
  onClick: () => void;
}

export function LuckyWheelBadge({ onClick }: WheelBadgeProps) {
  const [spins, setSpins] = useState(0);

  useEffect(() => {
    const state = loadWheelState();
    setSpins(state.spinsAvailable);
  }, []);

  return (
    <button
      onClick={onClick}
      style={{
        background: spins > 0 ? 'rgba(251, 191, 36, 0.2)' : 'rgba(30, 41, 59, 0.9)',
        borderRadius: '8px',
        padding: '6px 10px',
        border: spins > 0 ? '2px solid #fbbf24' : '2px solid #334155',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        position: 'relative',
      }}
    >
      <span style={{ fontSize: '16px' }}>🎡</span>
      {spins > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            background: '#fbbf24',
            color: '#1e293b',
            fontSize: '10px',
            fontWeight: 'bold',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse 1s ease-in-out infinite',
          }}
        >
          {spins}
        </span>
      )}
    </button>
  );
}
