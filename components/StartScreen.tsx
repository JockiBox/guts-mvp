'use client';

import { useState, useEffect } from 'react';
import { getTop10Profiles, loadHeartedProfiles, type AIProfile } from '@/lib/profiles';
import { loadPlayerStats, getAllAchievements, getWinRate, formatStatValue, type PlayerStats, type Achievement } from '@/lib/stats';
import { DIFFICULTY_CONFIGS, type Difficulty } from '@/lib/difficulty';
import { isTrendingEnabled, setTrendingEnabled } from '@/lib/trendingNames';
import { playClick, playTokens } from '@/lib/sounds';
import { useUser } from '@/lib/useUser';
import { AuthModal } from './AuthModal';
import { ShopModal } from './ShopModal';
import { ProfileModal } from './ProfileModal';

interface StartScreenProps {
  onStart: (playerCount: number) => void;
  resultMessage?: string;
  playerCount: number;
  setPlayerCount: (count: number) => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
}

export function StartScreen({ onStart, resultMessage, playerCount, setPlayerCount, difficulty, setDifficulty }: StartScreenProps) {
  const { user, loading: userLoading, canClaimDaily, fetchProfile, claimDaily, buyItem, purchaseTokens } = useUser();
  const [topProfiles, setTopProfiles] = useState<AIProfile[]>([]);
  const [heartedIds, setHeartedIds] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activeTab, setActiveTab] = useState<'play' | 'stats' | 'achievements'>('play');
  const [trendingNames, setTrendingNames] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [dailyRewardClaimed, setDailyRewardClaimed] = useState<{ tokens: number; streak: number } | null>(null);

  useEffect(() => {
    setTopProfiles(getTop10Profiles());
    setHeartedIds(loadHeartedProfiles());
    setStats(loadPlayerStats());
    setAchievements(getAllAchievements());
    setTrendingNames(isTrendingEnabled());
  }, []);

  const toggleTrendingNames = () => {
    const newValue = !trendingNames;
    setTrendingNames(newValue);
    setTrendingEnabled(newValue);
    playClick();
  };

  const handleClaimDaily = async () => {
    const result = await claimDaily();
    if (result?.success) {
      playTokens();
      setDailyRewardClaimed({ tokens: result.tokens, streak: result.streak });
      setTimeout(() => setDailyRewardClaimed(null), 3000);
    }
  };

  const unlockedCount = achievements.filter(a => a.unlockedAt).length;

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      }}
    >
      <div
        style={{
          background: '#1e293b',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '520px',
          width: '100%',
          textAlign: 'center',
          border: '1px solid #334155',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* User Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}
        >
          {/* Shop Button */}
          <button
            onClick={() => {
              playClick();
              setShowShopModal(true);
            }}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: '2px solid #fbbf24',
              background: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(217,119,6,0.1))',
              color: '#fbbf24',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 0 15px rgba(251,191,36,0.2)',
            }}
          >
            🛒 Shop
          </button>

          {/* User/Auth */}
          {userLoading ? (
            <div style={{ color: '#64748b', fontSize: '12px' }}>Loading...</div>
          ) : user ? (
            <button
              onClick={() => {
                playClick();
                setShowProfileModal(true);
              }}
              style={{
                padding: '6px 12px',
                borderRadius: '10px',
                border: '1px solid #334155',
                background: '#0f172a',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: user.avatar_color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                }}
              >
                {user.avatar_emoji}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ color: '#cbd5e1', fontSize: '12px', fontWeight: '600' }}>{user.username}</div>
                <div style={{ color: '#fbbf24', fontSize: '11px' }}>🪙 {user.tokens.toLocaleString()}</div>
              </div>
            </button>
          ) : (
            <button
              onClick={() => {
                playClick();
                setShowAuthModal(true);
              }}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                border: '2px solid #14b8a6',
                background: 'transparent',
                color: '#14b8a6',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Sign In
            </button>
          )}
        </div>

        {/* Daily Reward Claimed Toast */}
        {dailyRewardClaimed && (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.1))',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              animation: 'slide-down 0.3s ease-out',
            }}
          >
            <span style={{ fontSize: '24px' }}>🎁</span>
            <div>
              <div style={{ color: '#4ade80', fontWeight: '700', fontSize: '14px' }}>
                +{dailyRewardClaimed.tokens} tokens claimed!
              </div>
              <div style={{ color: '#64748b', fontSize: '11px' }}>
                Day {dailyRewardClaimed.streak} streak
              </div>
            </div>
          </div>
        )}

        {/* Title */}
        <h1
          style={{
            fontSize: '42px',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #2dd4bf, #22d3ee)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '4px',
            letterSpacing: '-1px',
          }}
        >
          GUTS
        </h1>
        <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '13px' }}>
          High-Stakes 2-Card Poker
        </p>

        {resultMessage && (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(217, 119, 6, 0.05))',
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '20px',
              color: '#fbbf24',
              fontWeight: '600',
              border: '1px solid rgba(251, 191, 36, 0.3)',
              fontSize: '14px',
            }}
          >
            {resultMessage}
          </div>
        )}

        {/* Tab Navigation */}
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
          {(['play', 'stats', 'achievements'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                playClick();
                setActiveTab(tab);
              }}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab ? '#14b8a6' : 'transparent',
                color: activeTab === tab ? '#0f172a' : '#64748b',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'capitalize',
              }}
            >
              {tab === 'achievements' ? `${tab} (${unlockedCount}/${achievements.length})` : tab}
            </button>
          ))}
        </div>

        {/* Play Tab */}
        {activeTab === 'play' && (
          <>
            {/* Difficulty Selector */}
            <div
              style={{
                background: '#0f172a',
                borderRadius: '10px',
                padding: '14px',
                marginBottom: '16px',
                border: '1px solid #334155',
              }}
            >
              <h2 style={{ fontWeight: '600', color: '#94a3b8', marginBottom: '10px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Difficulty
              </h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(Object.keys(DIFFICULTY_CONFIGS) as Difficulty[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      playClick();
                      setDifficulty(d);
                    }}
                    style={{
                      flex: 1,
                      padding: '10px 8px',
                      borderRadius: '8px',
                      border: difficulty === d ? '2px solid #14b8a6' : '1px solid #334155',
                      background: difficulty === d ? 'rgba(20, 184, 166, 0.1)' : '#1e293b',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ color: difficulty === d ? '#14b8a6' : '#cbd5e1', fontWeight: '600', fontSize: '13px' }}>
                      {DIFFICULTY_CONFIGS[d].name}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '10px', marginTop: '2px' }}>
                      {DIFFICULTY_CONFIGS[d].description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Player Count */}
            <div
              style={{
                background: '#0f172a',
                borderRadius: '10px',
                padding: '14px',
                marginBottom: '16px',
                border: '1px solid #334155',
              }}
            >
              <h2 style={{ fontWeight: '600', color: '#94a3b8', marginBottom: '10px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Players
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
                {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      playClick();
                      setPlayerCount(num);
                    }}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      border: playerCount === num ? '2px solid #14b8a6' : '1px solid #334155',
                      background: playerCount === num ? '#14b8a6' : '#1e293b',
                      color: playerCount === num ? '#0f172a' : '#94a3b8',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <p style={{ color: '#64748b', fontSize: '11px', marginTop: '8px' }}>
                You + {playerCount - 1} AI
              </p>
            </div>

            {/* Trending Names Toggle */}
            <div
              style={{
                background: '#0f172a',
                borderRadius: '10px',
                padding: '12px 14px',
                marginBottom: '16px',
                border: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600' }}>
                  Celebrity Names
                </div>
                <div style={{ color: '#64748b', fontSize: '10px' }}>
                  Replace AI names with trending personalities
                </div>
              </div>
              <button
                onClick={toggleTrendingNames}
                style={{
                  width: '48px',
                  height: '26px',
                  borderRadius: '13px',
                  border: 'none',
                  background: trendingNames ? 'linear-gradient(135deg, #14b8a6, #0f766e)' : '#334155',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s',
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'white',
                    position: 'absolute',
                    top: '3px',
                    left: trendingNames ? '25px' : '3px',
                    transition: 'left 0.2s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                />
              </button>
            </div>

            {/* Quick Stats Preview */}
            {stats && stats.roundsPlayed > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ background: '#0f172a', borderRadius: '8px', padding: '10px', border: '1px solid #334155' }}>
                  <div style={{ color: '#4ade80', fontSize: '18px', fontWeight: '700' }}>{getWinRate(stats)}%</div>
                  <div style={{ color: '#64748b', fontSize: '10px' }}>Win Rate</div>
                </div>
                <div style={{ background: '#0f172a', borderRadius: '8px', padding: '10px', border: '1px solid #334155' }}>
                  <div style={{ color: '#fbbf24', fontSize: '18px', fontWeight: '700' }}>{formatStatValue(stats.wins)}</div>
                  <div style={{ color: '#64748b', fontSize: '10px' }}>Wins</div>
                </div>
                <div style={{ background: '#0f172a', borderRadius: '8px', padding: '10px', border: '1px solid #334155' }}>
                  <div style={{ color: '#14b8a6', fontSize: '18px', fontWeight: '700' }}>{stats.bestStreak}</div>
                  <div style={{ color: '#64748b', fontSize: '10px' }}>Best Streak</div>
                </div>
              </div>
            )}

            {/* Start Button */}
            <button
              onClick={() => {
                playClick();
                onStart(playerCount);
              }}
              style={{
                padding: '16px 32px',
                fontSize: '18px',
                fontWeight: '700',
                color: 'white',
                width: '100%',
                background: 'linear-gradient(135deg, #14b8a6, #0f766e)',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(20, 184, 166, 0.4)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                letterSpacing: '0.5px',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(20, 184, 166, 0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(20, 184, 166, 0.4)';
              }}
            >
              {resultMessage ? 'PLAY AGAIN' : 'START GAME'}
            </button>

            {/* Top Favorites (collapsed) */}
            {topProfiles.filter(p => p.heartsReceived > 0).length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '8px' }}>
                  Top Favorites
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {topProfiles.filter(p => p.heartsReceived > 0).slice(0, 5).map((p) => (
                    <div
                      key={p.id}
                      style={{
                        background: '#0f172a',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        border: '1px solid #334155',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span>{p.avatar}</span>
                      <span style={{ color: '#cbd5e1', fontSize: '12px' }}>{p.name}</span>
                      <span style={{ color: '#ec4899', fontSize: '10px' }}>❤️{p.heartsReceived}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && stats && (
          <div style={{ textAlign: 'left' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px',
                marginBottom: '16px',
              }}
            >
              <StatCard label="Games Played" value={stats.gamesPlayed} color="#14b8a6" />
              <StatCard label="Rounds Played" value={stats.roundsPlayed} color="#14b8a6" />
              <StatCard label="Wins" value={stats.wins} color="#4ade80" />
              <StatCard label="Losses" value={stats.losses} color="#f87171" />
              <StatCard label="Win Rate" value={`${getWinRate(stats)}%`} color="#fbbf24" />
              <StatCard label="Best Streak" value={stats.bestStreak} color="#a855f7" />
              <StatCard label="Current Streak" value={stats.currentStreak} color="#22d3ee" />
              <StatCard label="Biggest Pot Won" value={stats.biggestPot} color="#fbbf24" />
              <StatCard label="Tokens Won" value={formatStatValue(stats.totalTokensWon)} color="#4ade80" />
              <StatCard label="Tokens Lost" value={formatStatValue(stats.totalTokensLost)} color="#f87171" />
              <StatCard label="Six-Nine Hands" value={stats.sixNineCount} color="#f472b6" icon="😏" />
              <StatCard label="Ghosts Defeated" value={stats.ghostsDefeated} color="#c084fc" icon="👻" />
            </div>

            {stats.bestHand && (
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(217, 119, 6, 0.05))',
                  borderRadius: '10px',
                  padding: '12px',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  textAlign: 'center',
                }}
              >
                <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '4px' }}>Best Hand</div>
                <div style={{ color: '#fbbf24', fontSize: '16px', fontWeight: '700' }}>{stats.bestHand.description}</div>
              </div>
            )}
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px',
            }}
          >
            {achievements.map((a) => (
              <div
                key={a.id}
                style={{
                  background: a.unlockedAt ? 'linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(15, 118, 110, 0.05))' : '#0f172a',
                  borderRadius: '10px',
                  padding: '12px',
                  border: a.unlockedAt ? '1px solid rgba(20, 184, 166, 0.3)' : '1px solid #334155',
                  textAlign: 'center',
                  opacity: a.unlockedAt ? 1 : 0.5,
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '4px', filter: a.unlockedAt ? 'none' : 'grayscale(1)' }}>
                  {a.icon}
                </div>
                <div style={{ color: a.unlockedAt ? '#14b8a6' : '#64748b', fontSize: '12px', fontWeight: '600' }}>
                  {a.name}
                </div>
                <div style={{ color: '#64748b', fontSize: '10px', marginTop: '2px' }}>
                  {a.description}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rules (collapsible at bottom) */}
        {activeTab === 'play' && (
          <details style={{ marginTop: '16px', textAlign: 'left' }}>
            <summary style={{ color: '#64748b', fontSize: '12px', cursor: 'pointer', padding: '8px 0' }}>
              How to Play
            </summary>
            <div style={{ background: '#0f172a', borderRadius: '10px', padding: '12px', marginTop: '8px', border: '1px solid #334155' }}>
              <ol style={{ fontSize: '12px', color: '#94a3b8', margin: 0, paddingLeft: '16px' }}>
                <li style={{ marginBottom: '6px' }}>Each player antes 1 token and gets 2 cards</li>
                <li style={{ marginBottom: '6px' }}>Choose <span style={{ color: '#4ade80' }}>HOLD</span> or <span style={{ color: '#f87171' }}>DROP</span> in 3 seconds</li>
                <li style={{ marginBottom: '6px' }}>Winner takes pot, losers match it</li>
                <li style={{ marginBottom: '6px' }}>Everyone drops? <span style={{ color: '#c084fc' }}>Ghost Hand</span> appears!</li>
                <li>Lose to ghost? <span style={{ color: '#ef4444' }}>Double</span> the pot!</li>
              </ol>
              <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #334155' }}>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Hand Rankings:</div>
                <div style={{ fontSize: '11px', color: '#f472b6' }}>★ Six-Nine (Best) → Pair → Flush → High Card</div>
              </div>
            </div>
          </details>
        )}
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={fetchProfile}
      />

      <ShopModal
        isOpen={showShopModal}
        onClose={() => setShowShopModal(false)}
        user={user}
        onPurchaseTokens={purchaseTokens}
        onBuyItem={buyItem}
        onClaimDaily={handleClaimDaily}
        canClaimDaily={canClaimDaily}
      />

      {user && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={user}
          onUpdate={fetchProfile}
          onSignOut={() => {
            fetchProfile();
            setShowProfileModal(false);
          }}
        />
      )}

      <style jsx>{`
        @keyframes slide-down {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function StatCard({ label, value, color, icon }: { label: string; value: string | number; color: string; icon?: string }) {
  return (
    <div style={{ background: '#0f172a', borderRadius: '8px', padding: '10px', border: '1px solid #334155' }}>
      <div style={{ color, fontSize: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
        {icon && <span style={{ fontSize: '16px' }}>{icon}</span>}
        {value}
      </div>
      <div style={{ color: '#64748b', fontSize: '10px' }}>{label}</div>
    </div>
  );
}
