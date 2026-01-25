'use client';

import { useState, useEffect } from 'react';

interface SignUpPromptProps {
  onSignUp: () => void;
  onDismiss: () => void;
}

const PERSUASIVE_MESSAGES = [
  {
    icon: '💰',
    title: 'Missing Out on Rewards!',
    message: 'Signed-in players earn 2x tokens, unlock power-ups, and spin the Lucky Wheel!',
    cta: 'Start Earning Now',
  },
  {
    icon: '🏆',
    title: 'Your Progress Won\'t Save!',
    message: 'Create an account to save your achievements, stats, and climb the leaderboard!',
    cta: 'Save My Progress',
  },
  {
    icon: '👜',
    title: 'Unlock the Wallet!',
    message: 'Get access to avatars, card backs, taunts, and exclusive items in the shop!',
    cta: 'Unlock Everything',
  },
  {
    icon: '🎡',
    title: 'Free Spins Waiting!',
    message: 'Sign up now and get 3 FREE Lucky Wheel spins! Win tokens and power-ups!',
    cta: 'Claim Free Spins',
  },
  {
    icon: '⚡',
    title: 'Power-Ups Disabled!',
    message: 'Guests can\'t use power-ups like Ghost Peek, Shield, or Double Down. Sign up to dominate!',
    cta: 'Get Power-Ups',
  },
  {
    icon: '🎯',
    title: 'Daily Challenges Available!',
    message: 'Complete daily challenges for bonus tokens. Only available to registered players!',
    cta: 'Start Challenges',
  },
  {
    icon: '🔥',
    title: 'Losing Your Streak!',
    message: 'Your win streak won\'t be saved! Sign up to track your longest streaks and earn combo bonuses!',
    cta: 'Save My Streak',
  },
  {
    icon: '👻',
    title: 'Beat the Ghosts!',
    message: 'Registered players can use Ghost Freeze and Ghost Peek power-ups. Level the playing field!',
    cta: 'Fight Ghosts',
  },
];

const PROMPT_KEY = 'guts_last_signup_prompt';
const PROMPT_INTERVAL = 5; // Show every N rounds

export function SignUpPrompt({ onSignUp, onDismiss }: SignUpPromptProps) {
  const [message, setMessage] = useState(PERSUASIVE_MESSAGES[0]);

  useEffect(() => {
    // Pick a random message
    setMessage(PERSUASIVE_MESSAGES[Math.floor(Math.random() * PERSUASIVE_MESSAGES.length)]);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1200,
        animation: 'fade-in 0.3s ease-out',
      }}
      onClick={onDismiss}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          borderRadius: '24px',
          padding: '32px',
          border: '3px solid #14b8a6',
          maxWidth: '400px',
          width: '90%',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(20, 184, 166, 0.2)',
          animation: 'modal-pop 0.4s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>{message.icon}</div>

        <h2 style={{ color: '#e2e8f0', margin: '0 0 12px 0', fontSize: '24px' }}>
          {message.title}
        </h2>

        <p style={{ color: '#94a3b8', margin: '0 0 24px 0', fontSize: '14px', lineHeight: 1.6 }}>
          {message.message}
        </p>

        <button
          onClick={onSignUp}
          style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: '12px',
            boxShadow: '0 4px 15px rgba(20, 184, 166, 0.4)',
          }}
        >
          {message.cta}
        </button>

        <button
          onClick={onDismiss}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            fontSize: '13px',
            cursor: 'pointer',
            padding: '8px',
          }}
        >
          Maybe later
        </button>

        <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px' }}>
          <p style={{ color: '#fbbf24', fontSize: '12px', margin: 0 }}>
            🎁 Sign up bonus: <strong>100 free tokens!</strong>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modal-pop {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// Check if we should show the prompt
export function shouldShowSignUpPrompt(roundsPlayed: number): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const lastPrompt = localStorage.getItem(PROMPT_KEY);
    const lastRound = lastPrompt ? parseInt(lastPrompt, 10) : 0;

    // Show every PROMPT_INTERVAL rounds
    if (roundsPlayed > 0 && roundsPlayed % PROMPT_INTERVAL === 0 && roundsPlayed !== lastRound) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function recordSignUpPromptShown(roundsPlayed: number): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROMPT_KEY, roundsPlayed.toString());
  } catch {
    // Ignore
  }
}
