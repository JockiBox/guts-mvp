'use client';

import { useState } from 'react';
import { MILESTONES, getLevelDisplay } from '@/lib/profiles';

interface HelpLegendProps {
  isExpanded?: boolean;
}

export function HelpLegend({ isExpanded: initialExpanded = false }: HelpLegendProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 200,
      }}
    >
      {/* Collapsed state - just a help button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            border: '2px solid #60a5fa',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
            transition: 'transform 0.2s',
          }}
          title="Game Help"
        >
          ❓
        </button>
      )}

      {/* Expanded state - full help panel */}
      {isExpanded && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98), rgba(15, 23, 42, 0.98))',
            borderRadius: '16px',
            border: '2px solid #3b82f6',
            padding: '16px',
            width: '320px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, color: 'white', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>❓</span> Game Guide
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              ✕
            </button>
          </div>

          {/* Heart System Section */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 8px', color: '#f472b6', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>❤️</span> Heart System
            </h4>
            <div style={{ color: '#cbd5e1', fontSize: '12px', lineHeight: '1.5' }}>
              <p style={{ margin: '0 0 8px' }}>
                <strong>Tap ❤️ on any AI player to show your love!</strong>
              </p>
              <ul style={{ margin: 0, paddingLeft: '16px' }}>
                <li>More hearts = AI appears more often in your games</li>
                <li>Hearted bots are never cycled out</li>
                <li>Every 10 hearts unlocks new rewards for that bot!</li>
              </ul>
            </div>
          </div>

          {/* Milestone Rewards Section */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 8px', color: '#fbbf24', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🏆</span> Bot Milestone Rewards
            </h4>
            <div style={{ color: '#cbd5e1', fontSize: '11px' }}>
              <p style={{ margin: '0 0 8px', fontSize: '12px' }}>
                At every 10 hearts, bots level up and get:
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '4px',
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '8px',
                padding: '8px',
              }}>
                {MILESTONES.slice(0, 6).map((milestone, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 6px',
                      background: 'rgba(251, 191, 36, 0.1)',
                      borderRadius: '4px',
                    }}
                  >
                    <span style={{ fontSize: '14px' }}>{milestone.wardrobeUnlock}</span>
                    <span>{(idx + 1) * 10}❤️</span>
                    <span style={{ color: '#22c55e', fontSize: '10px' }}>+{Math.round(milestone.experienceBonus * 100)}% IQ</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* What Bots Get Section */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 8px', color: '#22c55e', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🎁</span> What Bots Unlock
            </h4>
            <div style={{
              color: '#cbd5e1',
              fontSize: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>🧠</span>
                <span><strong>Smarter Play:</strong> Better decision making</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>👑</span>
                <span><strong>New Badges:</strong> Special wardrobe items</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>⚡</span>
                <span><strong>Power-ups:</strong> Unlocked at milestones</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>🎯</span>
                <span><strong>More Games:</strong> Appears more frequently</span>
              </div>
            </div>
          </div>

          {/* Bot Levels Preview */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 8px', color: '#a855f7', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>📊</span> Bot Levels
            </h4>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '4px',
              fontSize: '11px',
            }}>
              {['Rookie', 'Rising Star', 'Fan Favorite', 'Diamond', 'Hot Streak', 'Lightning', 'Legendary', 'All-Star', 'Superstar', 'Champion', 'GOAT'].map((title, idx) => (
                <span
                  key={idx}
                  style={{
                    background: idx === 0 ? 'rgba(100, 116, 139, 0.3)' : 'rgba(168, 85, 247, 0.2)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    color: idx === 0 ? '#94a3b8' : '#c4b5fd',
                  }}
                >
                  {idx === 0 ? '' : MILESTONES[idx - 1]?.wardrobeUnlock} {title}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div>
            <h4 style={{ margin: '0 0 8px', color: '#14b8a6', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>💡</span> Quick Tips
            </h4>
            <div style={{ color: '#94a3b8', fontSize: '11px', lineHeight: '1.6' }}>
              <p style={{ margin: '0 0 4px' }}>• <strong>6-9</strong> is the best hand (beats pairs!)</p>
              <p style={{ margin: '0 0 4px' }}>• Pairs beat high cards</p>
              <p style={{ margin: '0 0 4px' }}>• Losers match the pot</p>
              <p style={{ margin: '0 0 4px' }}>• Ghost hands stay until someone beats them</p>
              <p style={{ margin: 0 }}>• If everyone holds, another ghost joins!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
