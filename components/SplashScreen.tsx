'use client';

import { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<'cards' | 'title' | 'tagline' | 'done'>('cards');
  const [cardsDealt, setCardsDealt] = useState(0);

  useEffect(() => {
    // Deal cards animation
    const cardTimers = [0, 150, 300].map((delay, i) =>
      setTimeout(() => setCardsDealt(i + 1), delay)
    );

    // Show title
    const titleTimer = setTimeout(() => setPhase('title'), 600);

    // Show tagline
    const taglineTimer = setTimeout(() => setPhase('tagline'), 1200);

    // Complete splash
    const completeTimer = setTimeout(() => {
      setPhase('done');
      setTimeout(onComplete, 400);
    }, 2200);

    return () => {
      cardTimers.forEach(clearTimeout);
      clearTimeout(titleTimer);
      clearTimeout(taglineTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        opacity: phase === 'done' ? 0 : 1,
        transition: 'opacity 0.4s ease-out',
      }}
    >
      {/* Animated background particles */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${4 + Math.random() * 8}px`,
              height: `${4 + Math.random() * 8}px`,
              borderRadius: '50%',
              background: i % 3 === 0 ? '#14b8a6' : i % 3 === 1 ? '#fbbf24' : '#ef4444',
              opacity: 0.3,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Cards flying in */}
      <div style={{ position: 'relative', width: '280px', height: '180px', marginBottom: '32px' }}>
        {/* Card 1 - Ace of Hearts */}
        <div
          style={{
            position: 'absolute',
            left: '20px',
            top: '20px',
            width: '80px',
            height: '120px',
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
            transform: cardsDealt >= 1
              ? 'translateY(0) rotate(-15deg) scale(1)'
              : 'translateY(-200px) rotate(-45deg) scale(0.5)',
            opacity: cardsDealt >= 1 ? 1 : 0,
            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            display: 'flex',
            flexDirection: 'column',
            padding: '8px',
          }}
        >
          <div style={{ color: '#ef4444', fontSize: '24px', fontWeight: 'bold' }}>A</div>
          <div style={{ color: '#ef4444', fontSize: '18px' }}>♥</div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '36px', color: '#ef4444' }}>♥</span>
          </div>
        </div>

        {/* Card 2 - King of Spades */}
        <div
          style={{
            position: 'absolute',
            left: '100px',
            top: '0px',
            width: '80px',
            height: '120px',
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
            transform: cardsDealt >= 2
              ? 'translateY(0) rotate(0deg) scale(1)'
              : 'translateY(-200px) rotate(0deg) scale(0.5)',
            opacity: cardsDealt >= 2 ? 1 : 0,
            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            display: 'flex',
            flexDirection: 'column',
            padding: '8px',
            zIndex: 2,
          }}
        >
          <div style={{ color: '#1e293b', fontSize: '24px', fontWeight: 'bold' }}>K</div>
          <div style={{ color: '#1e293b', fontSize: '18px' }}>♠</div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '36px', color: '#1e293b' }}>♠</span>
          </div>
        </div>

        {/* Card 3 - Queen of Diamonds */}
        <div
          style={{
            position: 'absolute',
            left: '180px',
            top: '20px',
            width: '80px',
            height: '120px',
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
            transform: cardsDealt >= 3
              ? 'translateY(0) rotate(15deg) scale(1)'
              : 'translateY(-200px) rotate(45deg) scale(0.5)',
            opacity: cardsDealt >= 3 ? 1 : 0,
            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            display: 'flex',
            flexDirection: 'column',
            padding: '8px',
          }}
        >
          <div style={{ color: '#ef4444', fontSize: '24px', fontWeight: 'bold' }}>Q</div>
          <div style={{ color: '#ef4444', fontSize: '18px' }}>♦</div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '36px', color: '#ef4444' }}>♦</span>
          </div>
        </div>

        {/* Glow effect behind cards */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(20, 184, 166, 0.3) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            zIndex: -1,
            opacity: cardsDealt >= 3 ? 1 : 0,
            transition: 'opacity 0.5s',
          }}
        />
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: '72px',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #14b8a6, #22d3ee, #14b8a6)',
          backgroundSize: '200% 200%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-2px',
          marginBottom: '8px',
          textShadow: '0 0 60px rgba(20, 184, 166, 0.5)',
          transform: phase === 'cards' ? 'scale(0.8) translateY(20px)' : 'scale(1) translateY(0)',
          opacity: phase === 'cards' ? 0 : 1,
          transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          animation: phase !== 'cards' ? 'shimmer 2s linear infinite' : 'none',
        }}
      >
        GUTS
      </h1>

      {/* Tagline */}
      <p
        style={{
          color: '#94a3b8',
          fontSize: '18px',
          fontWeight: 500,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          transform: phase === 'tagline' || phase === 'done' ? 'translateY(0)' : 'translateY(20px)',
          opacity: phase === 'tagline' || phase === 'done' ? 1 : 0,
          transition: 'all 0.4s ease-out',
        }}
      >
        Do You Have The Guts?
      </p>

      {/* Suit icons decorations */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          display: 'flex',
          gap: '24px',
          opacity: phase === 'tagline' || phase === 'done' ? 0.6 : 0,
          transition: 'opacity 0.4s',
        }}
      >
        <span style={{ fontSize: '28px', color: '#ef4444' }}>♥</span>
        <span style={{ fontSize: '28px', color: '#1e293b', textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>♠</span>
        <span style={{ fontSize: '28px', color: '#ef4444' }}>♦</span>
        <span style={{ fontSize: '28px', color: '#14b8a6' }}>♣</span>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes shimmer {
          0% { background-position: 200% 50%; }
          100% { background-position: -200% 50%; }
        }
      `}</style>
    </div>
  );
}
