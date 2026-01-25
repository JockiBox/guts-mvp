'use client';

import { useEffect } from 'react';
import { GhostStory } from '@/lib/ghostStories';

interface GhostStoryOverlayProps {
  story: GhostStory;
  onComplete: () => void;
}

export function GhostStoryOverlay({ story, onComplete }: GhostStoryOverlayProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const getAnimation = () => {
    switch (story.animation) {
      case 'shake':
        return 'ghost-shake 0.5s ease-in-out infinite';
      case 'float':
        return 'ghost-float 2s ease-in-out infinite';
      case 'glitch':
        return 'ghost-glitch 0.3s ease-in-out infinite';
      default:
        return 'ghost-fade 3s ease-out forwards';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        animation: 'ghost-overlay 0.3s ease-out',
      }}
      onClick={onComplete}
    >
      <div
        style={{
          textAlign: 'center',
          animation: getAnimation(),
        }}
      >
        <div
          style={{
            fontSize: '120px',
            marginBottom: '20px',
            filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.8))',
          }}
        >
          {story.icon}
        </div>

        <h1
          style={{
            color: '#8b5cf6',
            fontSize: '36px',
            fontWeight: 'bold',
            margin: '0 0 12px 0',
            textShadow: '0 0 20px rgba(139, 92, 246, 0.8)',
            letterSpacing: '4px',
          }}
        >
          {story.message}
        </h1>

        <p
          style={{
            color: '#a78bfa',
            fontSize: '18px',
            margin: 0,
            fontStyle: 'italic',
          }}
        >
          {story.subMessage}
        </p>
      </div>

      <style>{`
        @keyframes ghost-overlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes ghost-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        @keyframes ghost-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes ghost-glitch {
          0% { transform: translate(0); filter: hue-rotate(0deg); }
          25% { transform: translate(-5px, 5px); filter: hue-rotate(90deg); }
          50% { transform: translate(5px, -5px); filter: hue-rotate(180deg); }
          75% { transform: translate(-5px, -5px); filter: hue-rotate(270deg); }
          100% { transform: translate(0); filter: hue-rotate(360deg); }
        }
        @keyframes ghost-fade {
          0% { opacity: 0; transform: scale(0.5); }
          20% { opacity: 1; transform: scale(1.1); }
          30% { transform: scale(1); }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
