'use client';

import { useState } from 'react';
import {
  SIDE_BET_OPTIONS,
  SideBetOption,
  SideBet,
  ActiveSideBets,
  placeSideBet,
  SideBetResult,
} from '@/lib/sideBets';

interface SideBetsPanelProps {
  playerTokens: number;
  currentBets: ActiveSideBets;
  canPlaceBets: boolean; // Usually during deal phase
  onPlaceBet: (bet: SideBet) => { success: boolean; error?: string };
  onClose: () => void;
}

export function SideBetsPanel({
  playerTokens,
  currentBets,
  canPlaceBets,
  onPlaceBet,
  onClose,
}: SideBetsPanelProps) {
  const [selectedBet, setSelectedBet] = useState<SideBetOption | null>(null);
  const [betAmount, setBetAmount] = useState<number>(5);
  const [error, setError] = useState<string>('');

  const handlePlaceBet = () => {
    if (!selectedBet) return;

    const result = onPlaceBet({
      type: selectedBet.type,
      amount: betAmount,
    });

    if (result.success) {
      setSelectedBet(null);
      setBetAmount(5);
      setError('');
    } else {
      setError(result.error || 'Failed to place bet');
    }
  };

  const alreadyBetTypes = currentBets.bets.map((b) => b.type);

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        borderRadius: '16px',
        padding: '16px',
        border: '2px solid #f59e0b',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(245, 158, 11, 0.2)',
        maxWidth: '350px',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🎲</span>
          <span style={{ color: '#e2e8f0', fontWeight: 'bold' }}>Side Bets</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#fbbf24', fontSize: '12px' }}>🪙 {playerTokens}</span>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '18px',
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Current Bets */}
      {currentBets.bets.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', marginBottom: '8px' }}>
            Your Bets ({currentBets.bets.length}/2)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {currentBets.bets.map((bet, idx) => {
              const option = SIDE_BET_OPTIONS.find((o) => o.type === bet.type);
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    borderRadius: '8px',
                    border: '1px solid #f59e0b',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{option?.icon}</span>
                    <span style={{ color: '#e2e8f0', fontSize: '12px' }}>{option?.name}</span>
                  </div>
                  <div style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 'bold' }}>
                    🪙 {bet.amount} → {option ? Math.floor(bet.amount * option.payout) : 0}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Bets */}
      {canPlaceBets && currentBets.bets.length < 2 && (
        <>
          <div style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', marginBottom: '8px' }}>
            Place a Bet
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {SIDE_BET_OPTIONS.filter((opt) => !alreadyBetTypes.includes(opt.type)).map((option) => (
              <button
                key={option.type}
                onClick={() => {
                  setSelectedBet(option);
                  setBetAmount(option.minBet);
                  setError('');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background:
                    selectedBet?.type === option.type
                      ? 'rgba(20, 184, 166, 0.2)'
                      : 'rgba(51, 65, 85, 0.3)',
                  borderRadius: '10px',
                  border:
                    selectedBet?.type === option.type
                      ? '2px solid #14b8a6'
                      : '1px solid #475569',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '22px' }}>{option.icon}</span>
                  <div>
                    <div style={{ color: '#e2e8f0', fontWeight: 'bold', fontSize: '13px' }}>
                      {option.name}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '10px' }}>{option.description}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '14px' }}>
                    {option.payout}x
                  </div>
                  <div style={{ color: '#64748b', fontSize: '9px' }}>
                    {option.minBet}-{option.maxBet}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Bet Amount */}
          {selectedBet && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ color: '#94a3b8', fontSize: '11px', marginBottom: '8px' }}>
                Bet Amount (🪙 {selectedBet.minBet} - {selectedBet.maxBet})
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="range"
                  min={selectedBet.minBet}
                  max={Math.min(selectedBet.maxBet, playerTokens)}
                  value={betAmount}
                  onChange={(e) => setBetAmount(parseInt(e.target.value))}
                  style={{ flex: 1 }}
                />
                <div
                  style={{
                    background: 'rgba(51, 65, 85, 0.5)',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    color: '#fbbf24',
                    fontWeight: 'bold',
                    minWidth: '60px',
                    textAlign: 'center',
                  }}
                >
                  🪙 {betAmount}
                </div>
              </div>
              <div style={{ color: '#22c55e', fontSize: '11px', marginTop: '6px', textAlign: 'center' }}>
                Win: 🪙 {Math.floor(betAmount * selectedBet.payout)}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              style={{
                padding: '8px 12px',
                background: 'rgba(239, 68, 68, 0.2)',
                borderRadius: '6px',
                color: '#ef4444',
                fontSize: '11px',
                marginBottom: '12px',
              }}
            >
              {error}
            </div>
          )}

          {/* Place Bet Button */}
          {selectedBet && (
            <button
              onClick={handlePlaceBet}
              disabled={!canPlaceBets || betAmount > playerTokens}
              style={{
                width: '100%',
                padding: '12px',
                background:
                  betAmount > playerTokens
                    ? 'rgba(51, 65, 85, 0.5)'
                    : 'linear-gradient(135deg, #f59e0b, #d97706)',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: betAmount > playerTokens ? 'not-allowed' : 'pointer',
              }}
            >
              Place Bet
            </button>
          )}
        </>
      )}

      {!canPlaceBets && currentBets.bets.length === 0 && (
        <div style={{ color: '#64748b', fontSize: '12px', textAlign: 'center', padding: '20px' }}>
          Side bets available at the start of each round
        </div>
      )}
    </div>
  );
}

// Side bet results display
interface SideBetResultsProps {
  results: SideBetResult[];
  onClose: () => void;
}

export function SideBetResults({ results, onClose }: SideBetResultsProps) {
  const totalWon = results.reduce((sum, r) => sum + r.payout, 0);
  const anyWon = results.some((r) => r.won);

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
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          borderRadius: '20px',
          padding: '24px',
          border: anyWon ? '2px solid #22c55e' : '2px solid #ef4444',
          maxWidth: '350px',
          width: '90%',
          textAlign: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>{anyWon ? '🎉' : '😢'}</div>
        <h3 style={{ color: '#e2e8f0', margin: '0 0 16px 0' }}>Side Bet Results</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          {results.map((result, idx) => {
            const option = SIDE_BET_OPTIONS.find((o) => o.type === result.bet.type);
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: result.won ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  borderRadius: '10px',
                  border: result.won ? '1px solid #22c55e' : '1px solid #ef4444',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{option?.icon}</span>
                  <span style={{ color: '#e2e8f0', fontSize: '13px' }}>{option?.name}</span>
                </div>
                <div
                  style={{
                    color: result.won ? '#22c55e' : '#ef4444',
                    fontWeight: 'bold',
                  }}
                >
                  {result.won ? `+${result.payout} 🪙` : 'Lost'}
                </div>
              </div>
            );
          })}
        </div>

        {anyWon && (
          <div
            style={{
              padding: '12px',
              background: 'rgba(34, 197, 94, 0.2)',
              borderRadius: '10px',
              marginBottom: '16px',
            }}
          >
            <div style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '20px' }}>
              Total Won: 🪙 {totalWon}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
