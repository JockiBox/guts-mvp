'use client';

import { useState, useEffect } from 'react';
import {
  HandRecord,
  getSessionHands,
  getRecentHands,
  getHandStats,
  formatHandSummary,
  exportHistoryCSV,
} from '@/lib/handHistory';

interface HandHistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onReplay?: (handId: string) => void;
}

export function HandHistorySidebar({ isOpen, onClose, onReplay }: HandHistorySidebarProps) {
  const [activeTab, setActiveTab] = useState<'session' | 'history'>('session');
  const [hands, setHands] = useState<HandRecord[]>([]);
  const [stats, setStats] = useState<ReturnType<typeof getHandStats> | null>(null);

  useEffect(() => {
    if (isOpen) {
      setHands(activeTab === 'session' ? getSessionHands() : getRecentHands(20));
      setStats(getHandStats());
    }
  }, [isOpen, activeTab]);

  const handleExport = () => {
    const csv = exportHistoryCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guts-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        width: '320px',
        background: '#1e293b',
        borderLeft: '1px solid #334155',
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideIn 0.3s ease',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid #334155',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h3 style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: '700', margin: 0 }}>
          📜 Hand History
        </h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748b',
            fontSize: '20px',
            cursor: 'pointer',
          }}
        >
          ×
        </button>
      </div>

      {/* Stats Summary */}
      {stats && (
        <div
          style={{
            padding: '12px 16px',
            background: '#0f172a',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            borderBottom: '1px solid #334155',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#4ade80', fontSize: '18px', fontWeight: '700' }}>{stats.wins}</div>
            <div style={{ color: '#64748b', fontSize: '10px' }}>Wins</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#f87171', fontSize: '18px', fontWeight: '700' }}>{stats.losses}</div>
            <div style={{ color: '#64748b', fontSize: '10px' }}>Losses</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#fbbf24', fontSize: '18px', fontWeight: '700' }}>{stats.winRate}%</div>
            <div style={{ color: '#64748b', fontSize: '10px' }}>Win Rate</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #334155' }}>
        <button
          onClick={() => setActiveTab('session')}
          style={{
            flex: 1,
            padding: '12px',
            border: 'none',
            background: activeTab === 'session' ? '#334155' : 'transparent',
            color: activeTab === 'session' ? '#f1f5f9' : '#64748b',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          This Session
        </button>
        <button
          onClick={() => setActiveTab('history')}
          style={{
            flex: 1,
            padding: '12px',
            border: 'none',
            background: activeTab === 'history' ? '#334155' : 'transparent',
            color: activeTab === 'history' ? '#f1f5f9' : '#64748b',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          All History
        </button>
      </div>

      {/* Hands List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px',
        }}
      >
        {hands.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '40px 20px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🃏</div>
            <div>No hands played yet</div>
            <div style={{ fontSize: '12px', marginTop: '8px' }}>Start playing to see your history!</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {hands.map((hand) => (
              <HandCard key={hand.id} hand={hand} onReplay={onReplay} />
            ))}
          </div>
        )}
      </div>

      {/* Export Button */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid #334155',
        }}
      >
        <button
          onClick={handleExport}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #334155',
            background: '#0f172a',
            color: '#94a3b8',
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          📥 Export to CSV
        </button>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

function HandCard({ hand, onReplay }: { hand: HandRecord; onReplay?: (id: string) => void }) {
  const cardDisplay = hand.humanCards.map((c) => {
    const suitSymbol = c.suit === 'hearts' ? '♥' : c.suit === 'diamonds' ? '♦' : c.suit === 'clubs' ? '♣' : '♠';
    const suitColor = c.suit === 'hearts' || c.suit === 'diamonds' ? '#ef4444' : '#1e293b';
    return { rank: c.rank, symbol: suitSymbol, color: suitColor };
  });

  return (
    <div
      style={{
        background: '#0f172a',
        borderRadius: '10px',
        padding: '12px',
        border: `1px solid ${hand.humanWon ? '#22c55e44' : hand.humanDecision === 'drop' ? '#64748b44' : '#ef444444'}`,
      }}
    >
      {/* Round info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ color: '#64748b', fontSize: '10px' }}>Round {hand.roundNumber}</span>
        <span style={{ color: '#64748b', fontSize: '10px' }}>
          {new Date(hand.timestamp).toLocaleTimeString()}
        </span>
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        {cardDisplay.map((card, i) => (
          <div
            key={i}
            style={{
              width: '40px',
              height: '56px',
              background: '#fff',
              borderRadius: '6px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: '700',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            <span style={{ color: card.color }}>{card.rank}</span>
            <span style={{ color: card.color, fontSize: '16px' }}>{card.symbol}</span>
          </div>
        ))}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: '8px' }}>
          <span
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              background: hand.humanDecision === 'hold' ? '#22c55e22' : '#64748b22',
              color: hand.humanDecision === 'hold' ? '#4ade80' : '#94a3b8',
              fontSize: '10px',
              fontWeight: '600',
              textTransform: 'uppercase',
            }}
          >
            {hand.humanDecision}
          </span>
        </div>
      </div>

      {/* Result */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#94a3b8', fontSize: '11px' }}>{hand.handDescription}</span>
        <span
          style={{
            color: hand.humanWon ? '#4ade80' : hand.humanDecision === 'drop' ? '#64748b' : '#f87171',
            fontSize: '12px',
            fontWeight: '700',
          }}
        >
          {hand.humanWon ? `+${hand.pot}` : hand.humanDecision === 'drop' ? '—' : `-${hand.pot}`}
        </span>
      </div>

      {/* Replay button */}
      {onReplay && (
        <button
          onClick={() => onReplay(hand.id)}
          style={{
            marginTop: '8px',
            width: '100%',
            padding: '6px',
            borderRadius: '6px',
            border: '1px solid #334155',
            background: 'transparent',
            color: '#64748b',
            fontSize: '11px',
            cursor: 'pointer',
          }}
        >
          🔄 Replay
        </button>
      )}
    </div>
  );
}

// Floating button to toggle sidebar
export function HandHistoryButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1px solid #334155',
        background: '#1e293b',
        color: '#94a3b8',
        fontSize: '12px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      📜 History
    </button>
  );
}
