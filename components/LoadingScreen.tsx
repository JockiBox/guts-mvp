'use client';

import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete?: () => void;
  minDuration?: number;
}

export default function LoadingScreen({ onComplete, minDuration = 2000 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / minDuration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        setFadeOut(true);
        setTimeout(() => {
          onComplete?.();
        }, 500);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [minDuration, onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        transition: 'opacity 0.5s ease-out',
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? 'none' : 'auto',
      }}
    >
      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Animated cards */}
        <div style={{ position: 'relative', width: '256px', height: '192px', marginBottom: '32px' }}>
          {/* Card 1 - Left */}
          <div
            style={{
              position: 'absolute',
              left: '16px',
              top: '16px',
              width: '96px',
              height: '144px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #334155, #1e293b)',
              border: '2px solid rgba(20, 184, 166, 0.5)',
              boxShadow: '0 10px 25px rgba(20, 184, 166, 0.2)',
              transformOrigin: 'center bottom',
              animation: 'card1 2s ease-in-out infinite',
            }}
          >
            <div style={{ position: 'absolute', top: '8px', left: '8px', color: '#ef4444', fontSize: '20px', fontWeight: 'bold' }}>A</div>
            <div style={{ position: 'absolute', top: '32px', left: '8px', color: '#ef4444', fontSize: '18px' }}>♥</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '36px', color: '#ef4444' }}>♥</div>
          </div>

          {/* Card 2 - Center */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '0',
              transform: 'translateX(-50%)',
              width: '96px',
              height: '144px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #334155, #1e293b)',
              border: '2px solid #14b8a6',
              boxShadow: '0 10px 25px rgba(20, 184, 166, 0.3)',
              transformOrigin: 'center bottom',
              zIndex: 10,
              animation: 'card2 2s ease-in-out infinite 0.2s',
            }}
          >
            <div style={{ position: 'absolute', top: '8px', left: '8px', color: '#14b8a6', fontSize: '20px', fontWeight: 'bold' }}>K</div>
            <div style={{ position: 'absolute', top: '32px', left: '8px', color: '#14b8a6', fontSize: '18px' }}>♠</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '36px', color: '#14b8a6' }}>♠</div>
          </div>

          {/* Card 3 - Right */}
          <div
            style={{
              position: 'absolute',
              right: '16px',
              top: '16px',
              width: '96px',
              height: '144px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #334155, #1e293b)',
              border: '2px solid rgba(20, 184, 166, 0.5)',
              boxShadow: '0 10px 25px rgba(20, 184, 166, 0.2)',
              transformOrigin: 'center bottom',
              animation: 'card3 2s ease-in-out infinite 0.4s',
            }}
          >
            <div style={{ position: 'absolute', top: '8px', left: '8px', color: '#ef4444', fontSize: '20px', fontWeight: 'bold' }}>Q</div>
            <div style={{ position: 'absolute', top: '32px', left: '8px', color: '#ef4444', fontSize: '18px' }}>♦</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '36px', color: '#ef4444' }}>♦</div>
          </div>

          {/* Glow effect */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(20, 184, 166, 0.1)',
              borderRadius: '100%',
              filter: 'blur(40px)',
              animation: 'glow 3s ease-in-out infinite',
            }}
          />
        </div>

        {/* GUTS Logo */}
        <h1
          style={{
            fontSize: '48px',
            fontWeight: 900,
            background: 'linear-gradient(90deg, #14b8a6, #5eead4, #14b8a6)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px',
            animation: 'shimmer 2s linear infinite',
          }}
        >
          GUTS
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '32px', animation: 'pulse 2s ease-in-out infinite' }}>
          Hold or Drop. Beat the Ghost.
        </p>

        {/* Progress bar */}
        <div style={{ width: '256px', height: '8px', background: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #14b8a6, #5eead4)',
              borderRadius: '4px',
              transition: 'width 0.1s ease-out',
            }}
          />
        </div>
        <p style={{ color: '#64748b', fontSize: '12px', marginTop: '8px' }}>{Math.round(progress)}%</p>
      </div>

      <style>{`
        @keyframes card1 {
          0%, 100% { transform: rotate(-15deg) translateY(0); }
          50% { transform: rotate(-10deg) translateY(-10px); }
        }
        @keyframes card2 {
          0%, 100% { transform: translateX(-50%) rotate(0deg) translateY(0); }
          50% { transform: translateX(-50%) rotate(3deg) translateY(-15px); }
        }
        @keyframes card3 {
          0%, 100% { transform: rotate(15deg) translateY(0); }
          50% { transform: rotate(10deg) translateY(-10px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
