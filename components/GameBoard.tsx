'use client';

import { useGutsGame } from '@/lib/useGutsGame';
import { Player } from './Player';
import { Pot } from './Pot';
import { Card } from './Card';
import { StartScreen } from './StartScreen';
import { AuthModal } from './AuthModal';
import { ShopModal } from './ShopModal';
import { ProfileModal } from './ProfileModal';
import { getHandDescription, getHandValue } from '@/lib/useGutsGame';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '@/lib/useUser';
import { recordGameResult } from '@/lib/supabase';
import {
  playClick,
  playCardFlip,
  playCountdown,
  playHold,
  playDrop,
  playWin,
  playLose,
  playGhostAppear,
  playSixNine,
  playTokens,
  playNewRound,
  playRevealStart,
  isSoundEnabled,
  setSoundEnabled,
} from '@/lib/sounds';
import { type Achievement } from '@/lib/stats';
import { shareResult, downloadResultCard, type ShareData } from '@/lib/share';
import { getGuestTokens, setGuestTokens, addGuestTokens, deductGuestTokens } from '@/lib/guestTokens';

// Particle component for celebrations
function Particles({ active, type }: { active: boolean; type: 'win' | 'sixnine' | 'lose' }) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; size: number; angle: number }>>([]);

  useEffect(() => {
    if (active) {
      const colors = type === 'sixnine'
        ? ['#f472b6', '#e879f9', '#c084fc', '#a855f7', '#fbbf24']
        : type === 'win'
          ? ['#fbbf24', '#f59e0b', '#22c55e', '#4ade80', '#fef08a']
          : ['#ef4444', '#f87171', '#fca5a5'];

      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: Date.now() + i,
        x: 50 + (Math.random() - 0.5) * 20,
        y: 50 + (Math.random() - 0.5) * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 8,
        angle: Math.random() * 360,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => setParticles([]), 2000);
      return () => clearTimeout(timer);
    }
  }, [active, type]);

  if (!active || particles.length === 0) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100, overflow: 'hidden' }}>
      {particles.map((p, i) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: '50%',
            animation: `particle-fly-${i % 5} 1.5s ease-out forwards`,
            boxShadow: `0 0 ${p.size}px ${p.color}`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes particle-fly-0 { to { transform: translate(${Math.random() * 400 - 200}px, ${-300 - Math.random() * 200}px) rotate(720deg); opacity: 0; } }
        @keyframes particle-fly-1 { to { transform: translate(${Math.random() * 400 - 200}px, ${-300 - Math.random() * 200}px) rotate(-720deg); opacity: 0; } }
        @keyframes particle-fly-2 { to { transform: translate(${Math.random() * 400 - 200}px, ${-300 - Math.random() * 200}px) rotate(540deg); opacity: 0; } }
        @keyframes particle-fly-3 { to { transform: translate(${Math.random() * 400 - 200}px, ${-300 - Math.random() * 200}px) rotate(-540deg); opacity: 0; } }
        @keyframes particle-fly-4 { to { transform: translate(${Math.random() * 400 - 200}px, ${-300 - Math.random() * 200}px) rotate(360deg); opacity: 0; } }
      `}</style>
    </div>
  );
}

// Daily reward claimed toast
function DailyRewardToast({ tokens, streak, onClose }: { tokens: number; streak: number; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        top: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.95), rgba(217, 119, 6, 0.95))',
        borderRadius: '12px',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: 400,
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
        animation: 'slide-down 0.4s ease-out',
      }}
    >
      <span style={{ fontSize: '32px' }}>🎁</span>
      <div>
        <div style={{ color: '#0f172a', fontSize: '16px', fontWeight: '700' }}>
          +{tokens} Tokens Claimed!
        </div>
        <div style={{ color: 'rgba(15, 23, 42, 0.7)', fontSize: '12px' }}>
          Day {streak} streak bonus
        </div>
      </div>
      <style jsx>{`
        @keyframes slide-down {
          from { transform: translateX(-50%) translateY(-100px); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export function GameBoard() {
  const { user, loading: userLoading, canClaimDaily, fetchProfile, claimDaily, buyItem, purchaseTokens } = useUser();
  const { state, humanPlayer, startGame, makeHumanDecision, nextRound, playerCount, setPlayerCount, heartProfile, isProfileHearted, difficulty, setDifficulty, newAchievements, clearNewAchievements, setHumanTokens } = useGutsGame();
  const {
    players,
    pot,
    potWon,
    gamePhase,
    countdown,
    ghostHands,
    roundResult,
    winners,
    losers,
    roundNumber,
  } = state;

  // Modal states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // UI states
  const [shake, setShake] = useState(false);
  const [showParticles, setShowParticles] = useState<'win' | 'sixnine' | 'lose' | null>(null);
  const [flashColor, setFlashColor] = useState<string | null>(null);
  const [sixNineReveal, setSixNineReveal] = useState<{ name: string; cards: string[] } | null>(null);
  const [soundOn, setSoundOn] = useState(true);
  const [achievementPopup, setAchievementPopup] = useState<Achievement | null>(null);
  const [shareStatus, setShareStatus] = useState<'idle' | 'shared' | 'copied'>('idle');
  const [dailyRewardToast, setDailyRewardToast] = useState<{ tokens: number; streak: number } | null>(null);
  const [showAnteAnimation, setShowAnteAnimation] = useState(false);
  const [displayedPot, setDisplayedPot] = useState(0);
  const [potPulse, setPotPulse] = useState(false);
  const [winStreak, setWinStreak] = useState(0);
  const [closeCallMessage, setCloseCallMessage] = useState<string | null>(null);

  const lastCountdown = useRef<number | null>(null);
  const lastPhase = useRef<string>('start');
  const revealSoundPlayed = useRef(false);
  const gameResultRecorded = useRef(false);
  const lastPot = useRef(0);

  // Sync user/guest tokens with game state
  useEffect(() => {
    if (setHumanTokens) {
      if (user) {
        setHumanTokens(user.tokens);
      } else {
        setHumanTokens(getGuestTokens());
      }
    }
  }, [user, setHumanTokens]);

  // Animate pot changes
  useEffect(() => {
    if (pot !== lastPot.current) {
      const diff = pot - lastPot.current;

      // Only animate increases
      if (diff > 0) {
        setShowAnteAnimation(true);
        setPotPulse(true);
        playTokens();

        // Animate the number counting up
        const startPot = lastPot.current;
        const duration = 600;
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplayedPot(Math.round(startPot + (pot - startPot) * eased));

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        requestAnimationFrame(animate);

        setTimeout(() => {
          setShowAnteAnimation(false);
          setPotPulse(false);
        }, 800);
      } else {
        setDisplayedPot(pot);
      }

      lastPot.current = pot;
    }
  }, [pot]);

  // Track win streaks
  useEffect(() => {
    if (gamePhase === 'summary' && humanPlayer) {
      if (winners.includes(humanPlayer.id)) {
        setWinStreak(prev => prev + 1);
      } else if (losers.includes(humanPlayer.id)) {
        setWinStreak(0);
      }
    }
  }, [gamePhase, winners, losers, humanPlayer]);

  // Close call detection
  useEffect(() => {
    if (gamePhase === 'summary' && humanPlayer && !winners.includes(humanPlayer.id) && !losers.includes(humanPlayer.id)) {
      // Player dropped but had a winning hand
      const handValue = getHandValue(humanPlayer.cards);
      if (handValue > 500) {
        setCloseCallMessage("You had a strong hand!");
        setTimeout(() => setCloseCallMessage(null), 2500);
      }
    }
  }, [gamePhase, humanPlayer, winners, losers]);

  // Record game results to database (for logged in users) or localStorage (for guests)
  useEffect(() => {
    if (gamePhase === 'summary' && humanPlayer && !gameResultRecorded.current) {
      gameResultRecorded.current = true;
      const won = winners.includes(humanPlayer.id);
      const lost = losers.includes(humanPlayer.id);

      // Use potWon for winnings (the pot that was actually won before losers matched)
      // For losses, losers match the original pot (which is now in potWon when ghost wins, or pot when player wins)
      const tokensWon = won ? potWon : 0;
      const tokensLost = lost ? pot : 0; // Losers pay into the new pot

      if (tokensWon > 0 || tokensLost > 0) {
        if (user) {
          // Logged in user - record to database
          const netChange = tokensWon - tokensLost;
          recordGameResult(user.id, won, netChange).then(() => {
            fetchProfile(); // Refresh user data
          });
        } else {
          // Guest - update localStorage tokens
          if (won && tokensWon > 0) {
            addGuestTokens(tokensWon);
          } else if (lost && tokensLost > 0) {
            deductGuestTokens(tokensLost);
          }
        }
      }
    }

    if (gamePhase === 'decision') {
      gameResultRecorded.current = false;
    }
  }, [gamePhase, humanPlayer, user, winners, losers, pot, potWon, fetchProfile]);

  // Initialize sound state from localStorage
  useEffect(() => {
    setSoundOn(isSoundEnabled());
  }, []);

  // Toggle sound
  const toggleSound = () => {
    const newState = !soundOn;
    setSoundOn(newState);
    setSoundEnabled(newState);
    if (newState) playClick();
  };

  // Handle daily reward claim
  const handleClaimDaily = async () => {
    const result = await claimDaily();
    if (result?.success) {
      setDailyRewardToast({ tokens: result.tokens, streak: result.streak });
      playTokens();
    }
  };

  // Share result
  const handleShare = async () => {
    if (!humanPlayer) return;

    const isSixNineHand = humanPlayer.cards.length === 2 &&
      [humanPlayer.cards[0].rank, humanPlayer.cards[1].rank].includes('6') &&
      [humanPlayer.cards[0].rank, humanPlayer.cards[1].rank].includes('9');

    const shareData: ShareData = {
      result: winners.includes(humanPlayer.id) ? 'win' : losers.includes(humanPlayer.id) ? 'lose' : 'drop',
      handDescription: getHandDescription(humanPlayer.cards),
      potSize: pot,
      roundNumber,
      opponentCount: players.filter(p => !p.isHuman && p.isActive).length,
      isSixNine: isSixNineHand,
      beatGhost: winners.includes(humanPlayer.id) && ghostHands.length > 0,
    };

    playClick();
    const success = await shareResult(shareData);
    setShareStatus(success ? 'shared' : 'copied');
    setTimeout(() => setShareStatus('idle'), 2000);
  };

  // Download share card
  const handleDownload = () => {
    if (!humanPlayer) return;

    const isSixNineHand = humanPlayer.cards.length === 2 &&
      [humanPlayer.cards[0].rank, humanPlayer.cards[1].rank].includes('6') &&
      [humanPlayer.cards[0].rank, humanPlayer.cards[1].rank].includes('9');

    const shareData: ShareData = {
      result: winners.includes(humanPlayer.id) ? 'win' : losers.includes(humanPlayer.id) ? 'lose' : 'drop',
      handDescription: getHandDescription(humanPlayer.cards),
      potSize: pot,
      roundNumber,
      opponentCount: players.filter(p => !p.isHuman && p.isActive).length,
      isSixNine: isSixNineHand,
      beatGhost: winners.includes(humanPlayer.id) && ghostHands.length > 0,
    };

    playClick();
    downloadResultCard(shareData);
  };

  // Trigger effects on game events
  useEffect(() => {
    if (gamePhase === 'summary' && humanPlayer) {
      if (winners.includes(humanPlayer.id)) {
        setShowParticles('win');
        setFlashColor('rgba(34, 197, 94, 0.3)');
        playWin();
        playTokens();
      } else if (losers.includes(humanPlayer.id)) {
        setShake(true);
        setShowParticles('lose');
        setFlashColor('rgba(239, 68, 68, 0.3)');
        playLose();
      }

      const timer = setTimeout(() => {
        setShake(false);
        setFlashColor(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gamePhase, winners, losers, humanPlayer]);

  // Check for six-nine celebration
  const hasSixNine = humanPlayer?.cards.length === 2 &&
    [humanPlayer.cards[0].rank, humanPlayer.cards[1].rank].includes('6') &&
    [humanPlayer.cards[0].rank, humanPlayer.cards[1].rank].includes('9');

  useEffect(() => {
    if (hasSixNine && gamePhase === 'decision') {
      setShowParticles('sixnine');
      playSixNine();
      const timer = setTimeout(() => setShowParticles(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [hasSixNine, gamePhase]);

  // Sound effects for countdown
  useEffect(() => {
    if (gamePhase === 'decision' && countdown !== null && countdown > 0) {
      if (lastCountdown.current !== countdown) {
        lastCountdown.current = countdown;
        playCountdown(countdown);
      }
    }
  }, [countdown, gamePhase]);

  // Sound effects for phase changes
  useEffect(() => {
    if (lastPhase.current !== gamePhase) {
      const prevPhase = lastPhase.current;
      lastPhase.current = gamePhase;

      if (gamePhase === 'reveal' && prevPhase === 'decision') {
        playRevealStart();
        revealSoundPlayed.current = false;
      }

      if (gamePhase === 'decision' && prevPhase !== 'decision') {
        playNewRound();
        playTokens();
      }
    }
  }, [gamePhase]);

  // Sound for card reveals
  useEffect(() => {
    if (gamePhase === 'reveal' || gamePhase === 'summary') {
      const anyRevealed = players.some(p => p.cardsRevealed > 0);
      const ghostRevealed = ghostHands.some(g => g.cardsRevealed > 0);
      if ((anyRevealed || ghostRevealed) && !revealSoundPlayed.current) {
        playCardFlip();
        revealSoundPlayed.current = true;
      }
    }
  }, [gamePhase, players, ghostHands]);

  // Sound for ghost appearing
  useEffect(() => {
    if (roundResult.includes('Ghost hand #')) {
      playGhostAppear();
    }
  }, [roundResult]);

  // Show achievement popups
  useEffect(() => {
    if (newAchievements.length > 0) {
      setAchievementPopup(newAchievements[0]);
      playWin();

      const timer = setTimeout(() => {
        setAchievementPopup(null);
        clearNewAchievements();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [newAchievements, clearNewAchievements]);

  // Check for dramatic 69 reveal during reveal/summary phase
  useEffect(() => {
    if (gamePhase === 'reveal' || gamePhase === 'summary') {
      for (const player of players) {
        if (player.cardsRevealed === 2 && player.cards.length === 2) {
          const ranks = [player.cards[0].rank, player.cards[1].rank];
          if (ranks.includes('6') && ranks.includes('9')) {
            setSixNineReveal({
              name: player.name,
              cards: player.cards.map(c => `${c.rank}${c.suit === 'hearts' ? '♥' : c.suit === 'diamonds' ? '♦' : c.suit === 'clubs' ? '♣' : '♠'}`)
            });
            setShowParticles('sixnine');
            playSixNine();
            const timer = setTimeout(() => {
              setSixNineReveal(null);
              setShowParticles(null);
            }, 2500);
            return () => clearTimeout(timer);
          }
        }
      }
      for (const ghost of ghostHands) {
        if (ghost.cardsRevealed === 2 && ghost.cards.length === 2) {
          const ranks = [ghost.cards[0].rank, ghost.cards[1].rank];
          if (ranks.includes('6') && ranks.includes('9')) {
            setSixNineReveal({
              name: 'GHOST',
              cards: ghost.cards.map(c => `${c.rank}${c.suit === 'hearts' ? '♥' : c.suit === 'diamonds' ? '♦' : c.suit === 'clubs' ? '♣' : '♠'}`)
            });
            setShowParticles('sixnine');
            playSixNine();
            const timer = setTimeout(() => {
              setSixNineReveal(null);
              setShowParticles(null);
            }, 2500);
            return () => clearTimeout(timer);
          }
        }
      }
    }
  }, [gamePhase, players, ghostHands]);

  // Get display tokens (from user if logged in, otherwise guest tokens)
  const displayTokens = user?.tokens ?? getGuestTokens();

  if (gamePhase === 'start') {
    return (
      <>
        {/* Top Header Bar - Always visible */}
        <UserHeader
          user={user}
          userLoading={userLoading}
          canClaimDaily={canClaimDaily}
          onClaimDaily={handleClaimDaily}
          onAuthClick={() => setShowAuthModal(true)}
          onShopClick={() => setShowShopModal(true)}
          onProfileClick={() => setShowProfileModal(true)}
          soundOn={soundOn}
          onToggleSound={toggleSound}
        />

        <StartScreen
          onStart={startGame}
          resultMessage={roundResult}
          playerCount={playerCount}
          setPlayerCount={setPlayerCount}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
        />

        {/* Modals */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => fetchProfile()}
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
            onUpdate={() => fetchProfile()}
            onSignOut={() => {
              setShowProfileModal(false);
              fetchProfile();
            }}
          />
        )}

        {/* Daily reward toast */}
        {dailyRewardToast && (
          <DailyRewardToast
            tokens={dailyRewardToast.tokens}
            streak={dailyRewardToast.streak}
            onClose={() => setDailyRewardToast(null)}
          />
        )}
      </>
    );
  }

  const aiPlayers = players.filter(p => !p.isHuman && p.isActive);
  const showCards = gamePhase === 'reveal' || gamePhase === 'summary';
  const isDecisionPhase = gamePhase === 'decision';
  const humanDecided = humanPlayer?.decision !== null;

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxSizing: 'border-box',
        animation: shake ? 'shake 0.5s ease-in-out' : 'none',
        position: 'relative',
      }}
    >
      {/* Screen flash overlay */}
      {flashColor && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: flashColor,
            pointerEvents: 'none',
            zIndex: 50,
            animation: 'flash 0.5s ease-out forwards',
          }}
        />
      )}

      {/* Win Streak indicator */}
      {winStreak >= 2 && (
        <div
          style={{
            position: 'fixed',
            top: '70px',
            left: '16px',
            background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.9), rgba(239, 68, 68, 0.9))',
            borderRadius: '12px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 300,
            boxShadow: '0 4px 20px rgba(251, 146, 60, 0.5)',
            animation: 'streak-fire 1s ease-in-out infinite',
          }}
        >
          <span style={{ fontSize: '24px' }}>🔥</span>
          <div>
            <div style={{ color: 'white', fontSize: '14px', fontWeight: '700' }}>
              {winStreak} WIN STREAK!
            </div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '10px' }}>
              You&apos;re on fire!
            </div>
          </div>
        </div>
      )}

      {/* Close call message */}
      {closeCallMessage && (
        <div
          style={{
            position: 'fixed',
            top: '120px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(251, 191, 36, 0.9)',
            borderRadius: '8px',
            padding: '10px 20px',
            zIndex: 300,
            boxShadow: '0 4px 20px rgba(251, 191, 36, 0.4)',
            animation: 'close-call-slide 2.5s ease-out forwards',
          }}
        >
          <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: '600' }}>
            😬 {closeCallMessage}
          </span>
        </div>
      )}

      {/* Particles */}
      <Particles active={showParticles !== null} type={showParticles || 'win'} />

      {/* Achievement Popup */}
      {achievementPopup && (
        <div
          style={{
            position: 'fixed',
            top: '70px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.95), rgba(15, 118, 110, 0.95))',
            borderRadius: '12px',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 300,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(45, 212, 191, 0.5)',
            animation: 'achievement-slide-in 0.4s ease-out',
          }}
        >
          <span style={{ fontSize: '32px' }}>{achievementPopup.icon}</span>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Achievement Unlocked
            </div>
            <div style={{ color: 'white', fontSize: '16px', fontWeight: '700' }}>
              {achievementPopup.name}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
              {achievementPopup.description}
            </div>
          </div>
        </div>
      )}

      {/* Daily reward toast */}
      {dailyRewardToast && (
        <DailyRewardToast
          tokens={dailyRewardToast.tokens}
          streak={dailyRewardToast.streak}
          onClose={() => setDailyRewardToast(null)}
        />
      )}

      {/* DRAMATIC 69 REVEAL OVERLAY */}
      {sixNineReveal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.85)',
            zIndex: 200,
            animation: 'sixnine-overlay-appear 0.3s ease-out',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              animation: 'sixnine-content-burst 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <div
              style={{
                fontSize: '120px',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #f472b6, #e879f9, #c084fc, #a855f7, #f472b6)',
                backgroundSize: '400% 400%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'rainbow-shift 1s ease infinite, sixnine-pulse 0.5s ease-in-out infinite',
                textShadow: '0 0 80px rgba(232, 121, 249, 0.8)',
                filter: 'drop-shadow(0 0 30px rgba(232, 121, 249, 0.8))',
                letterSpacing: '-5px',
              }}
            >
              6 9
            </div>
            <div
              style={{
                fontSize: '48px',
                fontWeight: 900,
                color: '#fbbf24',
                textShadow: '0 0 30px rgba(251, 191, 36, 0.8)',
                animation: 'sixnine-bounce 0.4s ease-out',
              }}
            >
              {sixNineReveal.name} HAS IT!
            </div>
            <div
              style={{
                display: 'flex',
                gap: '20px',
                fontSize: '60px',
              }}
            >
              {sixNineReveal.cards.map((card, i) => (
                <span
                  key={i}
                  style={{
                    animation: `card-slam ${0.3 + i * 0.1}s ease-out`,
                    textShadow: card.includes('♥') || card.includes('♦')
                      ? '0 0 20px rgba(239, 68, 68, 0.8)'
                      : '0 0 20px rgba(255, 255, 255, 0.5)',
                    color: card.includes('♥') || card.includes('♦') ? '#ef4444' : 'white',
                  }}
                >
                  {card}
                </span>
              ))}
            </div>
            <div
              style={{
                fontSize: '24px',
                color: '#e879f9',
                fontStyle: 'italic',
                animation: 'fade-in 0.5s ease-out 0.3s both',
              }}
            >
              UNBEATABLE HAND!
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.9)',
              borderRadius: '8px',
              padding: '6px 14px',
              border: '2px solid #334155',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span style={{ color: '#94a3b8', fontSize: '12px' }}>ROUND </span>
            <span style={{ color: '#14b8a6', fontWeight: 'bold', fontSize: '18px' }}>{roundNumber}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            style={{
              background: 'rgba(30, 41, 59, 0.9)',
              borderRadius: '8px',
              padding: '6px 10px',
              border: `2px solid ${soundOn ? '#14b8a6' : '#334155'}`,
              backdropFilter: 'blur(8px)',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'all 0.2s',
            }}
            title={soundOn ? 'Sound On' : 'Sound Off'}
          >
            {soundOn ? '🔊' : '🔇'}
          </button>

          {/* Shop Button */}
          <button
            onClick={() => {
              playClick();
              setShowShopModal(true);
            }}
            style={{
              background: 'rgba(30, 41, 59, 0.9)',
              borderRadius: '8px',
              padding: '6px 12px',
              border: '2px solid #fbbf24',
              backdropFilter: 'blur(8px)',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#fbbf24',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            🛒 Shop
          </button>
        </div>

        {/* User Token Display & Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Token display */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(217,119,6,0.2))',
              borderRadius: '8px',
              padding: '6px 16px',
              border: '2px solid #fbbf24',
              boxShadow: '0 0 20px rgba(251,191,36,0.3)',
              animation: pot > 20
                ? 'pot-glow-intense 1.5s ease-in-out infinite'
                : pot > 10
                  ? 'pulse-gold 1s ease-in-out infinite'
                  : 'none',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '14px' }}>🪙</span>
            <span
              style={{
                color: '#fbbf24',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
            >
              {displayTokens.toLocaleString()}
            </span>
          </div>

          {/* Ante indicator */}
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              borderRadius: '8px',
              padding: '6px 12px',
              border: '2px solid #ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span style={{ color: '#f87171', fontSize: '11px', fontWeight: '600' }}>ANTE</span>
            <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '14px' }}>1</span>
            <span style={{ fontSize: '12px' }}>🪙</span>
          </div>

          {/* Pot display */}
          <div
            style={{
              background: potPulse
                ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(22, 163, 74, 0.3))'
                : 'rgba(30, 41, 59, 0.9)',
              borderRadius: '8px',
              padding: '6px 14px',
              border: potPulse ? '2px solid #22c55e' : '2px solid #334155',
              boxShadow: potPulse ? '0 0 20px rgba(34, 197, 94, 0.5)' : 'none',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <span style={{ color: '#94a3b8', fontSize: '12px' }}>POT </span>
            <span
              style={{
                color: '#22c55e',
                fontWeight: 'bold',
                fontSize: potPulse ? '18px' : '16px',
                transition: 'all 0.3s ease',
              }}
            >
              {displayedPot}
            </span>

            {/* Flying token animation */}
            {showAnteAnimation && (
              <>
                {Array.from({ length: players.filter(p => p.isActive).length }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      bottom: '-20px',
                      left: `${20 + i * 15}%`,
                      fontSize: '16px',
                      animation: `fly-to-pot 0.6s ease-out ${i * 0.1}s forwards`,
                      opacity: 0,
                    }}
                  >
                    🪙
                  </div>
                ))}
              </>
            )}
          </div>

          {/* User/Auth button */}
          {user ? (
            <button
              onClick={() => {
                playClick();
                setShowProfileModal(true);
              }}
              style={{
                background: user.avatar_color || '#14b8a6',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                border: '2px solid rgba(255,255,255,0.3)',
                cursor: 'pointer',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {user.avatar_emoji}
            </button>
          ) : (
            <button
              onClick={() => {
                playClick();
                setShowAuthModal(true);
              }}
              style={{
                background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                borderRadius: '8px',
                padding: '6px 12px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                color: 'white',
                fontWeight: '600',
              }}
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Main game area - Circular Poker Table Layout */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          maxWidth: '900px',
          margin: '0 auto',
          width: '100%',
          minHeight: '400px',
        }}
      >
        {/* Poker table felt */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '70%',
            height: '60%',
            background: 'radial-gradient(ellipse at center, rgba(20, 184, 166, 0.15) 0%, rgba(15, 23, 42, 0.8) 70%)',
            borderRadius: '50%',
            border: '3px solid rgba(20, 184, 166, 0.3)',
            boxShadow: 'inset 0 0 60px rgba(20, 184, 166, 0.1), 0 0 30px rgba(0, 0, 0, 0.5)',
          }}
        />

        {/* AI Players positioned in circle */}
        {aiPlayers.map((player, index) => {
          // Calculate position around the circle (top half only, human at bottom)
          const totalAI = aiPlayers.length;
          const angleStep = 180 / (totalAI + 1); // Spread across top half
          const angle = (180 + angleStep * (index + 1)) * (Math.PI / 180); // Start from left, go right
          const radiusX = 42; // % from center horizontally
          const radiusY = 38; // % from center vertically

          const left = 50 + radiusX * Math.cos(angle);
          const top = 50 + radiusY * Math.sin(angle);

          return (
            <div
              key={player.id}
              style={{
                position: 'absolute',
                left: `${left}%`,
                top: `${top}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
              }}
            >
              <Player
                player={player}
                isWinner={winners.includes(player.id)}
                isLoser={losers.includes(player.id)}
                showCards={showCards && player.decision === 'hold'}
                isHearted={player.profileId ? isProfileHearted(player.profileId) : false}
                onHeart={heartProfile}
              />
            </div>
          );
        })}

        {/* Center - Positioned in middle of table */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            zIndex: 20,
          }}
        >
          {/* Center Pot Display */}
          <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                animation: potPulse ? 'pot-burst 0.4s ease-out' : 'none',
              }}
            >
              {/* Token pile visualization */}
              <div style={{ position: 'relative', width: '120px', height: '60px' }}>
                {Array.from({ length: Math.min(displayedPot, 10) }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                      border: '2px solid #b45309',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
                      left: `${30 + (i % 5) * 12}px`,
                      top: `${10 + Math.floor(i / 5) * 18}px`,
                      zIndex: i,
                      animation: showAnteAnimation && i >= Math.min(displayedPot, 10) - players.filter(p => p.isActive).length
                        ? 'fly-to-pot 0.5s ease-out' : 'none',
                    }}
                  />
                ))}
                {displayedPot > 10 && (
                  <div
                    style={{
                      position: 'absolute',
                      right: '-20px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '20px',
                      color: '#fbbf24',
                      fontWeight: 'bold',
                    }}
                  >
                    +{displayedPot - 10}
                  </div>
                )}
              </div>

              {/* Pot amount */}
              <div
                style={{
                  background: potPulse
                    ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.3), rgba(217, 119, 6, 0.3))'
                    : 'rgba(30, 41, 59, 0.9)',
                  borderRadius: '12px',
                  padding: '8px 24px',
                  border: potPulse ? '3px solid #fbbf24' : '2px solid #334155',
                  boxShadow: potPulse
                    ? '0 0 30px rgba(251, 191, 36, 0.5)'
                    : '0 4px 20px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>POT</span>
                <span
                  style={{
                    color: '#fbbf24',
                    fontWeight: '900',
                    fontSize: potPulse ? '32px' : '28px',
                    textShadow: potPulse ? '0 0 20px rgba(251, 191, 36, 0.8)' : '0 0 10px rgba(251, 191, 36, 0.4)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {displayedPot}
                </span>
                <span style={{ fontSize: '20px' }}>🪙</span>
              </div>

              {/* Ghost count indicator */}
              {ghostHands.length > 0 && gamePhase === 'decision' && (
                <div
                  style={{
                    color: '#a855f7',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    animation: 'pulse 2s ease-in-out infinite',
                  }}
                >
                  <span>👻</span> {ghostHands.length} Ghost{ghostHands.length > 1 ? 's' : ''} Waiting
                </div>
              )}
            </div>

          {/* DRAMATIC COUNTDOWN */}
          {isDecisionPhase && countdown !== null && countdown > 0 && (
            <div
              style={{
                fontSize: '140px',
                fontWeight: 900,
                color: countdown === 1 ? '#ef4444' : countdown === 2 ? '#fbbf24' : '#14b8a6',
                textShadow: `
                  0 0 80px ${countdown === 1 ? 'rgba(239,68,68,1)' : countdown === 2 ? 'rgba(251,191,36,1)' : 'rgba(20,184,166,1)'},
                  0 0 120px ${countdown === 1 ? 'rgba(239,68,68,0.8)' : countdown === 2 ? 'rgba(251,191,36,0.8)' : 'rgba(20,184,166,0.8)'}
                `,
                animation: 'countdown-pulse 1s ease-in-out infinite, countdown-shake 0.1s ease-in-out infinite',
                lineHeight: 0.8,
                fontFamily: 'Impact, sans-serif',
              }}
            >
              {countdown}
            </div>
          )}

          {/* Tension text during countdown */}
          {isDecisionPhase && countdown !== null && countdown > 0 && (
            <div
              style={{
                color: countdown === 1 ? '#ef4444' : '#94a3b8',
                fontSize: countdown === 1 ? '20px' : '14px',
                fontWeight: countdown === 1 ? 'bold' : 'normal',
                textTransform: 'uppercase',
                letterSpacing: '4px',
                animation: countdown === 1 ? 'blink 0.3s ease-in-out infinite' : 'none',
              }}
            >
              {countdown === 1 ? 'LAST CHANCE!' : countdown === 2 ? 'DECIDE NOW!' : 'HOLD OR DROP?'}
            </div>
          )}

          {/* Reveal indicator */}
          {gamePhase === 'reveal' && (
            <div
              style={{
                color: '#14b8a6',
                fontWeight: 'bold',
                fontSize: '28px',
                textShadow: '0 0 30px rgba(20,184,166,0.8)',
                animation: 'pulse 0.5s ease-in-out infinite',
                letterSpacing: '4px',
              }}
            >
              REVEALING...
            </div>
          )}

          {/* Result message with winner crown */}
          {gamePhase === 'summary' && roundResult && (
            <div
              style={{
                position: 'relative',
                background: 'rgba(30,41,59,0.95)',
                borderRadius: '16px',
                padding: '20px 28px',
                border: winners.includes(humanPlayer?.id || '')
                  ? '3px solid #22c55e'
                  : losers.includes(humanPlayer?.id || '')
                    ? '3px solid #ef4444'
                    : '2px solid #fbbf24',
                textAlign: 'center',
                maxWidth: '400px',
                boxShadow: winners.includes(humanPlayer?.id || '')
                  ? '0 0 50px rgba(34,197,94,0.6)'
                  : losers.includes(humanPlayer?.id || '')
                    ? '0 0 50px rgba(239,68,68,0.6)'
                    : '0 0 40px rgba(251,191,36,0.5)',
                animation: 'result-appear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              {/* Winner crown burst */}
              {winners.includes(humanPlayer?.id || '') && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '40px',
                    animation: 'crown-bounce 0.5s ease-out',
                    filter: 'drop-shadow(0 0 10px rgba(251,191,36,0.8))',
                  }}
                >
                  👑
                </div>
              )}
              {/* Loser skull */}
              {losers.includes(humanPlayer?.id || '') && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-25px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '32px',
                    animation: 'skull-shake 0.3s ease-out',
                  }}
                >
                  💀
                </div>
              )}
              {/* Ghost win */}
              {!winners.includes(humanPlayer?.id || '') && !losers.includes(humanPlayer?.id || '') && roundResult.includes('Ghost') && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-25px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '32px',
                    animation: 'ghost-float 1s ease-in-out infinite',
                  }}
                >
                  👻
                </div>
              )}
              <p style={{
                color: winners.includes(humanPlayer?.id || '') ? '#4ade80' : losers.includes(humanPlayer?.id || '') ? '#f87171' : '#fbbf24',
                fontWeight: 'bold',
                fontSize: '20px',
                margin: 0,
                textShadow: winners.includes(humanPlayer?.id || '')
                  ? '0 0 20px rgba(74,222,128,0.5)'
                  : losers.includes(humanPlayer?.id || '')
                    ? '0 0 20px rgba(248,113,113,0.5)'
                    : 'none',
              }}>
                {roundResult}
              </p>
            </div>
          )}

          {/* Ghost hands */}
          {ghostHands.length > 0 && (
            <Pot amount={pot} ghostHands={ghostHands} winners={winners} showGhostCards={showCards} />
          )}
        </div>

        {/* Human player - Bottom of table */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 30,
          }}
        >
          {humanPlayer && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  background: hasSixNine
                    ? 'linear-gradient(135deg, #1e293b, #4a1d6a, #1e293b)'
                    : 'linear-gradient(135deg, #1e293b, #0f172a)',
                  borderRadius: '16px',
                  padding: '14px 24px',
                  border: `3px solid ${
                    winners.includes(humanPlayer.id)
                      ? '#22c55e'
                      : losers.includes(humanPlayer.id)
                        ? '#ef4444'
                        : hasSixNine
                          ? '#e879f9'
                          : '#334155'
                  }`,
                  boxShadow: winners.includes(humanPlayer.id)
                    ? '0 0 40px rgba(34,197,94,0.6), inset 0 0 30px rgba(34,197,94,0.1)'
                    : losers.includes(humanPlayer.id)
                      ? '0 0 40px rgba(239,68,68,0.6), inset 0 0 30px rgba(239,68,68,0.1)'
                      : hasSixNine
                        ? '0 0 50px rgba(232,121,249,0.6), inset 0 0 40px rgba(232,121,249,0.1)'
                        : '0 8px 32px rgba(0,0,0,0.3)',
                  animation: hasSixNine ? 'sixnine-glow 1s ease-in-out infinite' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {/* Player info */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {user && (
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
                            border: '2px solid rgba(255,255,255,0.3)',
                          }}
                        >
                          {user.avatar_emoji}
                        </div>
                      )}
                      <span style={{ fontWeight: 'bold', color: '#14b8a6', fontSize: '18px' }}>
                        {user?.username || humanPlayer.name}
                      </span>
                    </div>
                  </div>

                  {/* Cards */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {humanPlayer.cards.map((card, idx) => (
                      <Card
                        key={idx}
                        card={card}
                        revealed={true}
                        size="lg"
                        isWinner={winners.includes(humanPlayer.id)}
                        isSixNine={hasSixNine}
                      />
                    ))}
                  </div>

                  {/* Hand description with strength indicator */}
                  {humanPlayer.cards.length === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div
                        style={{
                          color: hasSixNine ? '#e879f9' : '#5eead4',
                          fontWeight: hasSixNine ? 900 : 600,
                          fontSize: hasSixNine ? '22px' : '16px',
                          textShadow: hasSixNine ? '0 0 20px rgba(232,121,249,0.8)' : 'none',
                          animation: hasSixNine ? 'rainbow-text 2s linear infinite' : 'none',
                        }}
                      >
                        {getHandDescription(humanPlayer.cards)}
                      </div>

                      {/* Hand strength meter */}
                      {isDecisionPhase && (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '2px',
                          }}
                        >
                          <div
                            style={{
                              width: '80px',
                              height: '6px',
                              background: '#1e293b',
                              borderRadius: '3px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${Math.min(100, (getHandValue(humanPlayer.cards) / 200) * 100)}%`,
                                height: '100%',
                                background:
                                  getHandValue(humanPlayer.cards) > 1000
                                    ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                                    : getHandValue(humanPlayer.cards) > 150
                                      ? 'linear-gradient(90deg, #fbbf24, #f59e0b)'
                                      : 'linear-gradient(90deg, #ef4444, #f87171)',
                                borderRadius: '3px',
                                transition: 'width 0.3s ease',
                              }}
                            />
                          </div>
                          <span
                            style={{
                              fontSize: '10px',
                              color:
                                getHandValue(humanPlayer.cards) > 1000
                                  ? '#4ade80'
                                  : getHandValue(humanPlayer.cards) > 150
                                    ? '#fbbf24'
                                    : '#f87171',
                              animation: 'hand-strength-pulse 2s ease-in-out infinite',
                            }}
                          >
                            {getHandValue(humanPlayer.cards) > 1000
                              ? '🔥 STRONG'
                              : getHandValue(humanPlayer.cards) > 150
                                ? '👍 DECENT'
                                : '😬 WEAK'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Decision badge */}
                  {humanPlayer.decision && (
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        background: humanPlayer.decision === 'hold'
                          ? 'linear-gradient(135deg, rgba(34,197,94,0.3), rgba(22,163,74,0.3))'
                          : 'linear-gradient(135deg, rgba(239,68,68,0.3), rgba(185,28,28,0.3))',
                        color: humanPlayer.decision === 'hold' ? '#4ade80' : '#f87171',
                        border: `2px solid ${humanPlayer.decision === 'hold' ? '#22c55e' : '#ef4444'}`,
                        boxShadow: humanPlayer.decision === 'hold'
                          ? '0 0 15px rgba(34,197,94,0.4)'
                          : '0 0 15px rgba(239,68,68,0.4)',
                      }}
                    >
                      {humanPlayer.decision.toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* BIG DRAMATIC BUTTONS */}
              {isDecisionPhase && !humanDecided && (
                <div style={{ display: 'flex', gap: '30px' }}>
                  <button
                    onClick={() => {
                      playHold();
                      makeHumanDecision('hold');
                    }}
                    style={{
                      padding: '24px 56px',
                      fontSize: '28px',
                      fontWeight: 900,
                      color: 'white',
                      background: 'linear-gradient(135deg, #22c55e, #16a34a, #15803d)',
                      border: '4px solid #4ade80',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      boxShadow: '0 0 40px rgba(34,197,94,0.6), 0 8px 32px rgba(0,0,0,0.3)',
                      transition: 'all 0.15s ease',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      animation: 'button-pulse-green 1s ease-in-out infinite',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1) translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 0 60px rgba(34,197,94,0.8), 0 12px 40px rgba(0,0,0,0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 0 40px rgba(34,197,94,0.6), 0 8px 32px rgba(0,0,0,0.3)';
                    }}
                  >
                    HOLD
                  </button>
                  <button
                    onClick={() => {
                      playDrop();
                      makeHumanDecision('drop');
                    }}
                    style={{
                      padding: '24px 56px',
                      fontSize: '28px',
                      fontWeight: 900,
                      color: 'white',
                      background: 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)',
                      border: '4px solid #f87171',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      boxShadow: '0 0 40px rgba(239,68,68,0.6), 0 8px 32px rgba(0,0,0,0.3)',
                      transition: 'all 0.15s ease',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      animation: 'button-pulse-red 1s ease-in-out infinite',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1) translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 0 60px rgba(239,68,68,0.8), 0 12px 40px rgba(0,0,0,0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 0 40px rgba(239,68,68,0.6), 0 8px 32px rgba(0,0,0,0.3)';
                    }}
                  >
                    DROP
                  </button>
                </div>
              )}

              {isDecisionPhase && humanDecided && (
                <div style={{ color: '#64748b', fontSize: '16px', fontStyle: 'italic' }}>
                  Locked in... waiting for countdown
                </div>
              )}

              {gamePhase === 'summary' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={() => {
                      playClick();
                      nextRound();
                    }}
                    style={{
                      padding: '18px 48px',
                      fontSize: '22px',
                      fontWeight: 'bold',
                      color: 'white',
                      background: 'linear-gradient(135deg, #14b8a6, #0d9488, #0f766e)',
                      border: '3px solid #2dd4bf',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      boxShadow: '0 0 30px rgba(20,184,166,0.5)',
                      animation: 'pulse 1s ease-in-out infinite',
                    }}
                  >
                    NEXT ROUND
                  </button>

                  {/* Share buttons */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={handleShare}
                      style={{
                        padding: '10px 20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: shareStatus !== 'idle' ? '#0f172a' : '#cbd5e1',
                        background: shareStatus !== 'idle'
                          ? 'linear-gradient(135deg, #4ade80, #22c55e)'
                          : 'rgba(30, 41, 59, 0.9)',
                        border: '2px solid #334155',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      {shareStatus === 'idle' ? '📤' : '✅'}
                      {shareStatus === 'idle' ? 'Share' : shareStatus === 'shared' ? 'Shared!' : 'Copied!'}
                    </button>
                    <button
                      onClick={handleDownload}
                      style={{
                        padding: '10px 20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#cbd5e1',
                        background: 'rgba(30, 41, 59, 0.9)',
                        border: '2px solid #334155',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      📷 Save Card
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => fetchProfile()}
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
          onUpdate={() => fetchProfile()}
          onSignOut={() => {
            setShowProfileModal(false);
            fetchProfile();
          }}
        />
      )}

      {/* All animations */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        @keyframes flash {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes countdown-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        @keyframes countdown-shake {
          0%, 100% { transform: rotate(-1deg); }
          50% { transform: rotate(1deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
        @keyframes pulse-gold {
          0%, 100% { box-shadow: 0 0 20px rgba(251,191,36,0.3); }
          50% { box-shadow: 0 0 40px rgba(251,191,36,0.6); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes sixnine-glow {
          0%, 100% { box-shadow: 0 0 50px rgba(232,121,249,0.6), inset 0 0 40px rgba(232,121,249,0.1); }
          50% { box-shadow: 0 0 80px rgba(232,121,249,0.9), inset 0 0 60px rgba(232,121,249,0.2); }
        }
        @keyframes rainbow-text {
          0% { color: #f472b6; }
          25% { color: #e879f9; }
          50% { color: #c084fc; }
          75% { color: #a855f7; }
          100% { color: #f472b6; }
        }
        @keyframes button-pulse-green {
          0%, 100% { box-shadow: 0 0 40px rgba(34,197,94,0.6), 0 8px 32px rgba(0,0,0,0.3); }
          50% { box-shadow: 0 0 60px rgba(34,197,94,0.8), 0 8px 32px rgba(0,0,0,0.3); }
        }
        @keyframes button-pulse-red {
          0%, 100% { box-shadow: 0 0 40px rgba(239,68,68,0.6), 0 8px 32px rgba(0,0,0,0.3); }
          50% { box-shadow: 0 0 60px rgba(239,68,68,0.8), 0 8px 32px rgba(0,0,0,0.3); }
        }
        @keyframes result-appear {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes crown-bounce {
          0% { transform: translateX(-50%) translateY(-20px) scale(0); opacity: 0; }
          50% { transform: translateX(-50%) translateY(5px) scale(1.2); }
          100% { transform: translateX(-50%) translateY(0) scale(1); opacity: 1; }
        }
        @keyframes skull-shake {
          0%, 100% { transform: translateX(-50%) rotate(0deg); }
          25% { transform: translateX(-50%) rotate(-10deg); }
          75% { transform: translateX(-50%) rotate(10deg); }
        }
        @keyframes ghost-float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-5px); }
        }
        @keyframes sixnine-overlay-appear {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes sixnine-content-burst {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes rainbow-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes sixnine-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes sixnine-bounce {
          0% { transform: translateY(30px); opacity: 0; }
          60% { transform: translateY(-10px); }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes card-slam {
          0% { transform: translateY(-100px) scale(0.5); opacity: 0; }
          60% { transform: translateY(10px) scale(1.1); }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes achievement-slide-in {
          0% { transform: translateX(-50%) translateY(-100px); opacity: 0; }
          100% { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        @keyframes token-to-pot {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          50% { transform: translateY(-80px) scale(1.2); opacity: 0.8; }
          100% { transform: translateY(-160px) scale(0.6); opacity: 0; }
        }
        @keyframes token-from-pot {
          0% { transform: translateY(-160px) scale(0.6); opacity: 0; }
          50% { transform: translateY(-80px) scale(1.2); opacity: 0.8; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes token-burst {
          0% { transform: scale(1); box-shadow: 0 0 0 rgba(251, 191, 36, 0); }
          50% { transform: scale(1.3); box-shadow: 0 0 30px rgba(251, 191, 36, 0.8); }
          100% { transform: scale(1); box-shadow: 0 0 0 rgba(251, 191, 36, 0); }
        }
        @keyframes pot-glow-intense {
          0%, 100% { box-shadow: 0 0 20px rgba(251,191,36,0.3), 0 0 40px rgba(251,191,36,0.2); }
          50% { box-shadow: 0 0 40px rgba(251,191,36,0.6), 0 0 80px rgba(251,191,36,0.4); }
        }
        @keyframes fly-to-pot {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          50% { transform: translateY(-30px) scale(1.3); opacity: 1; }
          100% { transform: translateY(-50px) scale(0.5); opacity: 0; }
        }
        @keyframes streak-fire {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.2); filter: brightness(1.3); }
        }
        @keyframes pot-burst {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        @keyframes close-call-slide {
          0% { transform: translateX(-50%) translateY(-20px); opacity: 0; }
          20% { transform: translateX(-50%) translateY(0); opacity: 1; }
          80% { transform: translateX(-50%) translateY(0); opacity: 1; }
          100% { transform: translateX(-50%) translateY(-20px); opacity: 0; }
        }
        @keyframes hand-strength-pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        @media (max-width: 768px) {
          .hold-drop-btn {
            padding: 20px 40px !important;
            font-size: 24px !important;
            min-width: 140px !important;
          }
        }
      `}</style>
    </div>
  );
}

// User Header Component for start screen
function UserHeader({
  user,
  userLoading,
  canClaimDaily,
  onClaimDaily,
  onAuthClick,
  onShopClick,
  onProfileClick,
  soundOn,
  onToggleSound,
}: {
  user: ReturnType<typeof useUser>['user'];
  userLoading: boolean;
  canClaimDaily: boolean;
  onClaimDaily: () => void;
  onAuthClick: () => void;
  onShopClick: () => void;
  onProfileClick: () => void;
  soundOn: boolean;
  onToggleSound: () => void;
}) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '56px',
        background: 'rgba(15, 23, 42, 0.95)',
        borderBottom: '1px solid #334155',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 100,
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Left side - Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '24px' }}>🃏</span>
        <span style={{ color: '#14b8a6', fontWeight: '700', fontSize: '20px' }}>GUTS</span>
      </div>

      {/* Right side - User controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Sound toggle */}
        <button
          onClick={onToggleSound}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          {soundOn ? '🔊' : '🔇'}
        </button>

        {userLoading ? (
          <div style={{ color: '#64748b', fontSize: '14px' }}>Loading...</div>
        ) : user ? (
          <>
            {/* Daily reward indicator */}
            {canClaimDaily && (
              <button
                onClick={() => {
                  playClick();
                  onClaimDaily();
                }}
                style={{
                  background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  color: '#0f172a',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              >
                🎁 Claim Daily
              </button>
            )}

            {/* Token balance */}
            <div
              style={{
                background: 'rgba(251, 191, 36, 0.15)',
                borderRadius: '8px',
                padding: '6px 12px',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span style={{ fontSize: '14px' }}>🪙</span>
              <span style={{ color: '#fbbf24', fontWeight: '600', fontSize: '14px' }}>
                {user.tokens.toLocaleString()}
              </span>
            </div>

            {/* Shop button */}
            <button
              onClick={() => {
                playClick();
                onShopClick();
              }}
              style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                borderRadius: '8px',
                padding: '6px 12px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                color: 'white',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              🛒 Shop
            </button>

            {/* User avatar */}
            <button
              onClick={() => {
                playClick();
                onProfileClick();
              }}
              style={{
                background: user.avatar_color || '#14b8a6',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                border: '2px solid rgba(255,255,255,0.3)',
                cursor: 'pointer',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {user.avatar_emoji}
            </button>
          </>
        ) : (
          <>
            {/* Shop button (guest) */}
            <button
              onClick={() => {
                playClick();
                onShopClick();
              }}
              style={{
                background: 'rgba(30, 41, 59, 0.9)',
                borderRadius: '8px',
                padding: '6px 12px',
                border: '1px solid #334155',
                cursor: 'pointer',
                fontSize: '13px',
                color: '#94a3b8',
                fontWeight: '600',
              }}
            >
              🛒 Shop
            </button>

            {/* Sign in button */}
            <button
              onClick={() => {
                playClick();
                onAuthClick();
              }}
              style={{
                background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                borderRadius: '8px',
                padding: '8px 16px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                color: 'white',
                fontWeight: '600',
              }}
            >
              Sign In
            </button>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
