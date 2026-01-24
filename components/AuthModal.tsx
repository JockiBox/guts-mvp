'use client';

import { useState } from 'react';
import { signUp, signIn } from '@/lib/supabase';
import { playClick } from '@/lib/sounds';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (username.length < 3) {
          setError('Username must be at least 3 characters');
          setLoading(false);
          return;
        }
        await signUp(email, password, username);
      } else {
        await signIn(email, password);
      }
      playClick();
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#1e293b',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '400px',
          width: '100%',
          border: '1px solid #334155',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#14b8a6',
            textAlign: 'center',
            marginBottom: '8px',
          }}
        >
          {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '20px', fontSize: '14px' }}>
          {mode === 'signin'
            ? 'Sign in to track your progress and buy tokens'
            : 'Sign up to get 100 free tokens!'}
        </p>

        {/* Mode Toggle */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            marginBottom: '20px',
            background: '#0f172a',
            borderRadius: '10px',
            padding: '4px',
          }}
        >
          {(['signin', 'signup'] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                playClick();
                setMode(m);
                setError('');
              }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: mode === m ? '#14b8a6' : 'transparent',
                color: mode === m ? '#0f172a' : '#64748b',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {m === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '10px',
              marginBottom: '16px',
              color: '#f87171',
              fontSize: '13px',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                maxLength={20}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  background: '#0f172a',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                placeholder="YourGamertag"
              />
            </div>
          )}

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #334155',
                background: '#0f172a',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              placeholder="you@example.com"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #334155',
                background: '#0f172a',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '16px',
              fontWeight: '700',
              color: 'white',
              background: loading
                ? '#475569'
                : 'linear-gradient(135deg, #14b8a6, #0f766e)',
              border: 'none',
              borderRadius: '10px',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 14px rgba(20, 184, 166, 0.4)',
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '10px',
            marginTop: '12px',
            fontSize: '14px',
            color: '#64748b',
            background: 'transparent',
            border: '1px solid #334155',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>

        {mode === 'signup' && (
          <p style={{ color: '#64748b', fontSize: '11px', textAlign: 'center', marginTop: '16px' }}>
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        )}
      </div>
    </div>
  );
}
