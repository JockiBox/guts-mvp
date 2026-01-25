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
        bottom: '8px',
        left: '8px',
        zIndex: 9999,
      }}
    >
      {/* Collapsed state - just a help button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            border: '2px solid #60a5fa',
            color: 'white',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
            transition: 'transform 0.2s',
            opacity: 0.8,
          }}
          title="Game Help"
        >
          ?
        </button>
      )}

      {/* Expanded state - full help panel */}
      {isExpanded && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98), rgba(15, 23, 42, 0.98))',
            borderRadius: '12px',
            border: '2px solid #3b82f6',
            padding: '12px',
            width: '280px',
            maxHeight: '70vh',
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

          {/* Power-ups Section */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 8px', color: '#3b82f6', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>⚡</span> Power-ups
            </h4>
            <div style={{ color: '#cbd5e1', fontSize: '11px', lineHeight: '1.5' }}>
              <p style={{ margin: '0 0 8px', fontSize: '12px' }}>
                Use power-ups during your turn for special advantages:
              </p>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '8px',
                padding: '8px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px' }}>👁️</span>
                  <div>
                    <strong style={{ color: '#94a3b8' }}>Ghost Peek</strong>
                    <span style={{ color: '#64748b' }}> - See one ghost card</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px' }}>🔄</span>
                  <div>
                    <strong style={{ color: '#94a3b8' }}>Card Swap</strong>
                    <span style={{ color: '#64748b' }}> - Exchange a card with deck</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px' }}>🍀</span>
                  <div>
                    <strong style={{ color: '#94a3b8' }}>Lucky Draw</strong>
                    <span style={{ color: '#64748b' }}> - Redraw one card</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px' }}>💰</span>
                  <div>
                    <strong style={{ color: '#fbbf24' }}>Double Down</strong>
                    <span style={{ color: '#64748b' }}> - 2x winnings if you win</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px' }}>🛡️</span>
                  <div>
                    <strong style={{ color: '#fbbf24' }}>Shield</strong>
                    <span style={{ color: '#64748b' }}> - Protect from matching pot</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px' }}>🔮</span>
                  <div>
                    <strong style={{ color: '#a855f7' }}>Mind Read</strong>
                    <span style={{ color: '#64748b' }}> - See opponent cards early</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px' }}>❄️</span>
                  <div>
                    <strong style={{ color: '#a855f7' }}>Ghost Freeze</strong>
                    <span style={{ color: '#64748b' }}> - Stop ghost hand addition</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px' }}>🃏</span>
                  <div>
                    <strong style={{ color: '#f59e0b' }}>Third Card</strong>
                    <span style={{ color: '#64748b' }}> - Get 3 cards, keep best 2</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px' }}>⏱️</span>
                  <div>
                    <strong style={{ color: '#94a3b8' }}>Time Extender</strong>
                    <span style={{ color: '#64748b' }}> - +5 sec pause time</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Emotes & Taunts Section */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 8px', color: '#ec4899', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>😤</span> Emotes & Taunts
            </h4>
            <div style={{ color: '#cbd5e1', fontSize: '12px', lineHeight: '1.5' }}>
              <p style={{ margin: '0 0 8px' }}>
                Express yourself and mess with opponents!
              </p>
              <ul style={{ margin: 0, paddingLeft: '16px' }}>
                <li><strong>Emotes</strong> - Show your mood (below your cards)</li>
                <li><strong>Taunts</strong> - Trash talk bots to tilt them!</li>
                <li>Bots may respond with their own taunts</li>
                <li>Use during PAUSE for maximum effect</li>
              </ul>
            </div>
          </div>

          {/* Pause System Section */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 8px', color: '#8b5cf6', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>⏸️</span> Pause System
            </h4>
            <div style={{ color: '#cbd5e1', fontSize: '12px', lineHeight: '1.5' }}>
              <ul style={{ margin: 0, paddingLeft: '16px' }}>
                <li>Press PAUSE for 15 seconds to think</li>
                <li>Use power-ups or taunts while paused</li>
                <li>Start with 1 token, earn 1 every 5 wins</li>
                <li>Buy more in the shop!</li>
              </ul>
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
              <p style={{ margin: '0 0 4px' }}>• Ghost wins = ALL holders match pot!</p>
              <p style={{ margin: 0 }}>• If everyone holds, another ghost joins!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
