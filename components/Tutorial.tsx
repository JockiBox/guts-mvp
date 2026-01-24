'use client';

import { useState } from 'react';
import { playClick } from '@/lib/sounds';

interface TutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const TUTORIAL_STEPS = [
  {
    title: 'Welcome to GUTS!',
    description: 'A fast-paced 2-card poker game where you bet your guts. Ready to learn?',
    emoji: '🃏',
    tip: 'The game is simple but addictive!',
  },
  {
    title: 'Everyone Antes Up',
    description: 'Each round, everyone puts 1 token in the pot. You get 2 cards dealt face-down.',
    emoji: '🪙',
    visual: 'ante',
    tip: 'More players = bigger pots!',
  },
  {
    title: 'Hold or Drop?',
    description: 'Look at your cards and decide: HOLD to stay in and compete, or DROP to fold safely.',
    emoji: '🤔',
    visual: 'decision',
    tip: 'You have 3 seconds to decide!',
  },
  {
    title: 'Hand Rankings',
    description: 'From best to worst: Six-Nine (unbeatable!) → Pair → Flush → High Card',
    emoji: '📊',
    visual: 'rankings',
    tip: '6-9 is the legendary hand!',
  },
  {
    title: 'Winners & Losers',
    description: 'If you HOLD and have the best hand, you win the pot! But if you lose...',
    emoji: '🏆',
    tip: 'Winning feels amazing!',
  },
  {
    title: 'The Catch!',
    description: 'If you HOLD and lose, you must match the pot for next round. High risk, high reward!',
    emoji: '💀',
    tip: 'Pots can grow quickly!',
  },
  {
    title: 'Ghost Hands',
    description: 'If EVERYONE drops, a Ghost Hand appears! Beat it or pay double the pot.',
    emoji: '👻',
    tip: 'Ghosts are unpredictable!',
  },
  {
    title: "You're Ready!",
    description: 'Start with 100 tokens, climb the leaderboard, and show everyone who has GUTS!',
    emoji: '🚀',
    tip: 'Good luck!',
  },
];

export function Tutorial({ isOpen, onClose, onComplete }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;
  const progress = ((currentStep + 1) / TUTORIAL_STEPS.length) * 100;

  const handleNext = () => {
    playClick();
    if (isLastStep) {
      // Mark tutorial as complete in localStorage
      localStorage.setItem('guts_tutorial_complete', 'true');
      onComplete();
      onClose();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    playClick();
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleSkip = () => {
    playClick();
    localStorage.setItem('guts_tutorial_complete', 'true');
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '16px',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          borderRadius: '20px',
          padding: '32px',
          maxWidth: '420px',
          width: '100%',
          border: '1px solid #334155',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Progress Bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: '#334155',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #14b8a6, #22d3ee)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        {/* Skip button */}
        <button
          onClick={handleSkip}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          Skip Tutorial
        </button>

        {/* Step Counter */}
        <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '16px' }}>
          Step {currentStep + 1} of {TUTORIAL_STEPS.length}
        </div>

        {/* Emoji */}
        <div
          style={{
            fontSize: '80px',
            textAlign: 'center',
            marginBottom: '20px',
            animation: 'bounce 1s ease infinite',
          }}
        >
          {step.emoji}
        </div>

        {/* Title */}
        <h2
          style={{
            color: '#14b8a6',
            fontSize: '28px',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '12px',
          }}
        >
          {step.title}
        </h2>

        {/* Description */}
        <p
          style={{
            color: '#cbd5e1',
            fontSize: '16px',
            textAlign: 'center',
            marginBottom: '20px',
            lineHeight: 1.6,
          }}
        >
          {step.description}
        </p>

        {/* Visual aids */}
        {step.visual === 'rankings' && (
          <div
            style={{
              background: '#0f172a',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#f472b6', fontWeight: '700', width: '20px' }}>1.</span>
                <span style={{ color: '#f472b6' }}>😏 Six-Nine</span>
                <span style={{ color: '#64748b', fontSize: '12px', marginLeft: 'auto' }}>UNBEATABLE</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#fbbf24', fontWeight: '700', width: '20px' }}>2.</span>
                <span style={{ color: '#fbbf24' }}>👯 Pair</span>
                <span style={{ color: '#64748b', fontSize: '12px', marginLeft: 'auto' }}>AA, KK, QQ...</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#22d3ee', fontWeight: '700', width: '20px' }}>3.</span>
                <span style={{ color: '#22d3ee' }}>♠️ Flush</span>
                <span style={{ color: '#64748b', fontSize: '12px', marginLeft: 'auto' }}>Same suit</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#94a3b8', fontWeight: '700', width: '20px' }}>4.</span>
                <span style={{ color: '#94a3b8' }}>🃏 High Card</span>
                <span style={{ color: '#64748b', fontSize: '12px', marginLeft: 'auto' }}>A beats K</span>
              </div>
            </div>
          </div>
        )}

        {step.visual === 'decision' && (
          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                background: 'rgba(34, 197, 94, 0.2)',
                border: '2px solid #22c55e',
                borderRadius: '12px',
                padding: '16px 24px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>✊</div>
              <div style={{ color: '#4ade80', fontWeight: '700' }}>HOLD</div>
              <div style={{ color: '#64748b', fontSize: '11px' }}>Stay & fight</div>
            </div>
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '2px solid #ef4444',
                borderRadius: '12px',
                padding: '16px 24px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>🏃</div>
              <div style={{ color: '#f87171', fontWeight: '700' }}>DROP</div>
              <div style={{ color: '#64748b', fontSize: '11px' }}>Fold safely</div>
            </div>
          </div>
        )}

        {/* Tip */}
        <div
          style={{
            background: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: '8px',
            padding: '10px 14px',
            marginBottom: '24px',
          }}
        >
          <span style={{ color: '#fbbf24', fontSize: '13px' }}>💡 {step.tip}</span>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              style={{
                flex: 1,
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#94a3b8',
                background: 'transparent',
                border: '1px solid #334155',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            style={{
              flex: currentStep === 0 ? 1 : 2,
              padding: '14px',
              fontSize: '16px',
              fontWeight: '700',
              color: 'white',
              background: isLastStep
                ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                : 'linear-gradient(135deg, #14b8a6, #0f766e)',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              boxShadow: isLastStep
                ? '0 4px 14px rgba(34, 197, 94, 0.4)'
                : '0 4px 14px rgba(20, 184, 166, 0.4)',
            }}
          >
            {isLastStep ? "Let's Play!" : 'Next'}
          </button>
        </div>

        <style jsx>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </div>
    </div>
  );
}

// Hook to check if tutorial should be shown
export function useTutorial() {
  const shouldShowTutorial = () => {
    if (typeof window === 'undefined') return false;
    return !localStorage.getItem('guts_tutorial_complete');
  };

  const resetTutorial = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('guts_tutorial_complete');
    }
  };

  return { shouldShowTutorial, resetTutorial };
}
