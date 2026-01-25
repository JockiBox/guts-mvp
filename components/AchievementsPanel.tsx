'use client';

import { useState, useEffect } from 'react';
import { ACHIEVEMENTS, Achievement, loadAchievements, PlayerAchievements } from '@/lib/achievements';
import { getRankForWins, getProgressToNextRank, RANKS } from '@/lib/ranks';

interface AchievementsPanelProps {
  onClose: () => void;
}

export function AchievementsPanel({ onClose }: AchievementsPanelProps) {
  const [achievements, setAchievements] = useState<PlayerAchievements | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    setAchievements(loadAchievements());
  }, []);

  if (!achievements) return null;

  const categories = [
    { id: 'all', name: 'All', icon: '🏆' },
    { id: 'wins', name: 'Wins', icon: '⭐' },
    { id: 'streaks', name: 'Streaks', icon: '🔥' },
    { id: 'hands', name: 'Hands', icon: '🃏' },
    { id: 'social', name: 'Social', icon: '❤️' },
    { id: 'special', name: 'Special', icon: '💎' },
  ];

  const filteredAchievements =
    selectedCategory === 'all'
      ? ACHIEVEMENTS
      : ACHIEVEMENTS.filter((a) => a.category === selectedCategory);

  const unlockedCount = achievements.unlocked.length;
  const totalCount = ACHIEVEMENTS.length;
  const rankProgress = getProgressToNextRank(achievements.totalWins);

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
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          borderRadius: '20px',
          padding: '24px',
          border: '2px solid #334155',
          maxWidth: '600px',
          width: '95%',
          maxHeight: '85vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h2 style={{ color: '#e2e8f0', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🏆</span> Achievements
            </h2>
            <p style={{ color: '#64748b', fontSize: '12px', margin: '4px 0 0 0' }}>
              {unlockedCount}/{totalCount} Unlocked
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '24px',
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        {/* Rank Display */}
        <div
          style={{
            padding: '16px',
            background: `linear-gradient(135deg, ${rankProgress.current.color}20, ${rankProgress.current.color}10)`,
            borderRadius: '12px',
            border: `2px solid ${rankProgress.current.color}`,
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${rankProgress.current.color}, ${rankProgress.current.color}80)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                boxShadow: `0 0 20px ${rankProgress.current.glowColor}`,
              }}
            >
              {rankProgress.current.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: rankProgress.current.color, fontWeight: 'bold', fontSize: '18px' }}>
                {rankProgress.current.name} Rank
              </div>
              <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
                {achievements.totalWins} total wins
              </div>
              {rankProgress.next && (
                <>
                  <div
                    style={{
                      height: '6px',
                      background: 'rgba(51, 65, 85, 0.5)',
                      borderRadius: '3px',
                      marginTop: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${rankProgress.progress}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, ${rankProgress.current.color}, ${rankProgress.next.color})`,
                      }}
                    />
                  </div>
                  <div style={{ color: '#64748b', fontSize: '10px', marginTop: '4px' }}>
                    {rankProgress.winsNeeded} wins to {rankProgress.next.name}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <div style={{ flex: 1, padding: '12px', background: 'rgba(51, 65, 85, 0.3)', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '20px' }}>{achievements.maxStreak}</div>
            <div style={{ color: '#64748b', fontSize: '10px' }}>Best Streak</div>
          </div>
          <div style={{ flex: 1, padding: '12px', background: 'rgba(51, 65, 85, 0.3)', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '20px' }}>{achievements.pairWins}</div>
            <div style={{ color: '#64748b', fontSize: '10px' }}>Pair Wins</div>
          </div>
          <div style={{ flex: 1, padding: '12px', background: 'rgba(51, 65, 85, 0.3)', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ color: '#8b5cf6', fontWeight: 'bold', fontSize: '20px' }}>{achievements.ghostsBeaten}</div>
            <div style={{ color: '#64748b', fontSize: '10px' }}>Ghosts Beat</div>
          </div>
          <div style={{ flex: 1, padding: '12px', background: 'rgba(51, 65, 85, 0.3)', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ color: '#ec4899', fontWeight: 'bold', fontSize: '20px' }}>{achievements.botsHearted}</div>
            <div style={{ color: '#64748b', fontSize: '10px' }}>Bots Loved</div>
          </div>
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                background: selectedCategory === cat.id ? 'rgba(20, 184, 166, 0.3)' : 'rgba(51, 65, 85, 0.3)',
                border: selectedCategory === cat.id ? '2px solid #14b8a6' : '1px solid #475569',
                borderRadius: '8px',
                padding: '8px 12px',
                color: selectedCategory === cat.id ? '#14b8a6' : '#94a3b8',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Achievements List */}
        <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredAchievements.map((achievement) => {
            const isUnlocked = achievements.unlocked.includes(achievement.id);
            const progress = achievements.progress[achievement.id] || 0;
            const progressPercent = Math.min(100, (progress / achievement.requirement) * 100);

            return (
              <div
                key={achievement.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: isUnlocked ? 'rgba(20, 184, 166, 0.1)' : 'rgba(51, 65, 85, 0.2)',
                  borderRadius: '10px',
                  border: isUnlocked ? '1px solid #14b8a6' : '1px solid #334155',
                  opacity: isUnlocked ? 1 : 0.7,
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: isUnlocked ? 'linear-gradient(135deg, #14b8a6, #22c55e)' : 'rgba(51, 65, 85, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    flexShrink: 0,
                  }}
                >
                  {isUnlocked ? achievement.icon : '🔒'}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: isUnlocked ? '#e2e8f0' : '#94a3b8', fontWeight: 'bold', fontSize: '13px' }}>
                    {achievement.name}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>
                    {achievement.description}
                  </div>
                  {!isUnlocked && (
                    <div style={{ marginTop: '6px' }}>
                      <div
                        style={{
                          height: '4px',
                          background: 'rgba(51, 65, 85, 0.5)',
                          borderRadius: '2px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${progressPercent}%`,
                            height: '100%',
                            background: '#fbbf24',
                          }}
                        />
                      </div>
                      <div style={{ color: '#64748b', fontSize: '9px', marginTop: '2px' }}>
                        {progress}/{achievement.requirement}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 'bold' }}>
                    +{achievement.reward} 🪙
                  </div>
                  {isUnlocked && (
                    <div style={{ color: '#22c55e', fontSize: '10px', marginTop: '2px' }}>
                      ✓ Unlocked
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Achievement unlock notification
interface AchievementUnlockProps {
  achievement: Achievement;
  onClose: () => void;
}

export function AchievementUnlockNotification({ achievement, onClose }: AchievementUnlockProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        animation: 'achievement-slide-in 0.5s ease-out',
      }}
    >
      <style>{`
        @keyframes achievement-slide-in {
          0% { transform: translateX(-50%) translateY(-100px); opacity: 0; }
          100% { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      `}</style>
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          borderRadius: '16px',
          padding: '16px 24px',
          border: '2px solid #fbbf24',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(251, 191, 36, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
          }}
        >
          {achievement.icon}
        </div>
        <div>
          <div style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
            Achievement Unlocked!
          </div>
          <div style={{ color: '#e2e8f0', fontWeight: 'bold', fontSize: '16px', marginTop: '2px' }}>
            {achievement.name}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>
            +{achievement.reward} 🪙 reward
          </div>
        </div>
      </div>
    </div>
  );
}
