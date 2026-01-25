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
import { useState, useEffect, useRef, useCallback } from 'react';
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

// New enhancement imports
import { VisualEffects, EmoteButtons, FloatingEmote } from './VisualEffects';
import { PowerUpsBar, PowerUpShop } from './PowerUpsBar';
import { DailyChallengesModal, DailyChallengeBadge } from './DailyChallenges';
import { AchievementsPanel, AchievementUnlockNotification } from './AchievementsPanel';
import { ThemeSelector } from './ThemeSelector';
import { SideBetsPanel, SideBetResults } from './SideBetsPanel';
import { TableTheme, loadCurrentTheme, checkThemeUnlocks } from '@/lib/themes';
import { PowerUpType, purchasePowerUp, loadPowerUpInventory } from '@/lib/powerups';
import {
  loadAchievements,
  recordWin as recordAchievementWin,
  recordLoss as recordAchievementLoss,
  recordHeart as recordAchievementHeart,
  checkAndUnlockAchievements,
  Achievement as GameAchievement,
} from '@/lib/achievements';
import {
  loadDailyChallenges,
  updateChallengeProgress,
  DailyProgress,
  Challenge,
} from '@/lib/dailyChallenges';
import {
  ActiveSideBets,
  SideBet,
  SideBetResult,
  placeSideBet,
  resolveSideBets,
  getEmptyBets,
} from '@/lib/sideBets';
import { generateRivalryTaunt } from '@/lib/botRivalries';

// New engagement feature imports
import { WalletModal } from './WalletModal';
import { LuckyWheelModal } from './LuckyWheelModal';
import { MysteryBoxModal } from './MysteryBoxModal';
import { SignUpPrompt } from './SignUpPrompt';
import { GhostStoryOverlay } from './GhostStoryOverlay';
import { TauntButtons, TauntDisplay } from './TauntButtons';
import { ComboNotification, ComboStack } from './ComboNotification';
import { GameModeSelector } from './GameModeSelector';
import { loadWallet, Wallet } from '@/lib/wallet';
import { loadWheelState, recordWinForWheel, WheelState } from '@/lib/luckyWheel';
import { checkForMysteryBox, MysteryBoxReward } from '@/lib/mysteryBox';
import { getRandomGhostWinStory, GhostStory } from '@/lib/ghostStories';
import { recordLossToBot, checkRevenge, completeRevenge, getTopRevengeTarget, RevengeTarget } from '@/lib/revengeTracker';
import { checkCombos, resetSessionCombos, Combo } from '@/lib/comboBonuses';
import { GAME_MODES, GameMode, GameModeType, loadUnlockedModes, checkModeUnlocks, getMode } from '@/lib/gameModes';
import { Taunt, getBotTauntResponse } from '@/lib/taunts';
import { checkLuckyNumber, getLuckyNumber } from '@/lib/luckyNumbers';
import { getReactionForSituation, getWinReaction, getLoseReaction } from '@/lib/botReactions';

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
  const { state, humanPlayer, startGame, resetToStart, makeHumanDecision, nextRound, playerCount, setPlayerCount, heartProfile, isProfileHearted, difficulty, setDifficulty, newAchievements, clearNewAchievements, setHumanTokens } = useGutsGame();
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

  // New feature modal states
  const [showPowerUpShop, setShowPowerUpShop] = useState(false);
  const [showDailyChallenges, setShowDailyChallenges] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showSideBets, setShowSideBets] = useState(false);
  const [showSideBetResults, setSideBetResults] = useState<SideBetResult[] | null>(null);

  // New engagement feature states
  const [showWallet, setShowWallet] = useState(false);
  const [showLuckyWheel, setShowLuckyWheel] = useState(false);
  const [showMysteryBox, setShowMysteryBox] = useState(false);
  const [showGameModeSelector, setShowGameModeSelector] = useState(false);
  const [currentGameMode, setCurrentGameMode] = useState<GameModeType>('classic');
  const [wheelState, setWheelState] = useState<WheelState | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [ghostStory, setGhostStory] = useState<GhostStory | null>(null);
  const [activeCombos, setActiveCombos] = useState<Combo[]>([]);
  const [activeTaunt, setActiveTaunt] = useState<{ taunt: Taunt; response: string | null } | null>(null);
  const [revengeTarget, setRevengeTarget] = useState<RevengeTarget | null>(null);
  const [revengeMessage, setRevengeMessage] = useState<string | null>(null);
  const [signUpPromptRound, setSignUpPromptRound] = useState(0);
  const [showSignUpPrompt, setShowSignUpPrompt] = useState(false);
  const [botReactions, setBotReactions] = useState<Map<string, string>>(new Map());

  // Theme state
  const [currentTheme, setCurrentTheme] = useState<TableTheme | null>(null);

  // Power-ups state
  const [activePowerUps, setActivePowerUps] = useState<PowerUpType[]>([]);

  // Achievements state
  const [gameAchievementPopup, setGameAchievementPopup] = useState<GameAchievement | null>(null);

  // Daily challenges state
  const [dailyProgress, setDailyProgress] = useState<DailyProgress | null>(null);
  const [completedChallenge, setCompletedChallenge] = useState<Challenge | null>(null);

  // Side bets state
  const [activeSideBets, setActiveSideBets] = useState<ActiveSideBets>(getEmptyBets());

  // Emote state
  const [floatingEmote, setFloatingEmote] = useState<{ emote: string; playerName: string } | null>(null);

  // Bot rivalry messages
  const [rivalryMessage, setRivalryMessage] = useState<{ from: string; to: string; message: string } | null>(null);

  // UI states
  const [shake, setShake] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
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
  const [showMenu, setShowMenu] = useState(false);

  const lastCountdown = useRef<number | null>(null);
  const lastPhase = useRef<string>('start');
  const revealSoundPlayed = useRef(false);
  const gameResultRecorded = useRef(false);
  const lastPot = useRef(0);
  const achievementCheckDone = useRef(false);

  // Initialize theme, daily challenges, achievements, wallet, and wheel on mount
  useEffect(() => {
    setCurrentTheme(loadCurrentTheme());
    setDailyProgress(loadDailyChallenges());
    setWallet(loadWallet());
    setWheelState(loadWheelState());
    setRevengeTarget(getTopRevengeTarget());
    resetSessionCombos();
  }, []);

  // Handle emote from player
  const handleEmote = useCallback((emote: string) => {
    setFloatingEmote({ emote, playerName: user?.username || 'You' });
    playClick();
  }, [user]);

  // Handle power-up use
  const handleUsePowerUp = useCallback((type: PowerUpType) => {
    if (activePowerUps.includes(type)) return;
    setActivePowerUps((prev) => [...prev, type]);
    playClick();
    // Power-up effects would be implemented in game logic
  }, [activePowerUps]);

  // Handle side bet placement
  const handlePlaceSideBet = useCallback((bet: SideBet) => {
    const displayTokens = user?.tokens ?? getGuestTokens();
    const result = placeSideBet(activeSideBets, bet, displayTokens);
    if (result.success) {
      setActiveSideBets(result.updatedBets);
      // Deduct tokens
      if (user) {
        // For logged in users, would need to sync with backend
      } else {
        deductGuestTokens(bet.amount);
      }
      return { success: true };
    }
    return { success: false, error: result.error };
  }, [activeSideBets, user]);

  // Handle theme change
  const handleThemeChange = useCallback((theme: TableTheme) => {
    setCurrentTheme(theme);
  }, []);

  // Handle theme purchase
  const handleThemePurchase = useCallback((cost: number) => {
    if (user) {
      // Would need backend integration
      return true;
    } else {
      const tokens = getGuestTokens();
      if (tokens >= cost) {
        deductGuestTokens(cost);
        return true;
      }
    }
    return false;
  }, [user]);

  // Handle power-up purchase
  const handlePowerUpPurchase = useCallback((type: PowerUpType, cost: number) => {
    if (user) {
      // Would need backend integration
    } else {
      const tokens = getGuestTokens();
      if (tokens >= cost) {
        const result = purchasePowerUp(type, tokens);
        if (result.success) {
          // Tokens already deducted in purchasePowerUp
        }
      }
    }
    playTokens();
  }, [user]);

  // Handle daily challenge reward claim
  const handleChallengeReward = useCallback((reward: number) => {
    if (user) {
      // Would need backend integration
    } else {
      addGuestTokens(reward);
    }
    playTokens();
  }, [user]);

  // Handle taunt from player
  const handleTaunt = useCallback((taunt: Taunt, response: string | null) => {
    if (!user) return; // Taunts only for logged in users
    setActiveTaunt({ taunt, response });
    playClick();
  }, [user]);

  // Handle mystery box reward
  const handleMysteryBoxReward = useCallback((reward: MysteryBoxReward) => {
    if (!user) return;
    if (reward.type === 'tokens' && reward.value) {
      const amount = typeof reward.value === 'number' ? reward.value : parseInt(reward.value, 10);
      addGuestTokens(amount);
      addGuestTokens(amount);
    }
    // Other reward types would unlock items in wallet
    setWallet(loadWallet());
    playWin();
  }, [user]);

  // Handle wheel spin reward
  const handleWheelReward = useCallback((reward: { type: string; value: number }) => {
    if (!user) return;
    if (reward.type === 'tokens') {
      addGuestTokens(reward.value);
      addGuestTokens(reward.value);
    }
    setWheelState(loadWheelState());
    playTokens();
  }, [user]);

  // Handle game mode selection
  const handleGameModeSelect = useCallback((mode: GameMode) => {
    if (!user) return; // Game modes only for logged in users
    setCurrentGameMode(mode.id);
    setShowGameModeSelector(false);
    playClick();
  }, [user]);

  // Generate bot rivalry messages occasionally
  useEffect(() => {
    if (gamePhase === 'decision' && players.length > 2) {
      const aiPlayers = players.filter((p) => !p.isHuman && p.isActive);
      if (aiPlayers.length >= 2 && Math.random() < 0.3) {
        const taunt = generateRivalryTaunt(aiPlayers);
        if (taunt) {
          setRivalryMessage(taunt);
          setTimeout(() => setRivalryMessage(null), 3000);
        }
      }
    }
  }, [gamePhase, players]);

  // Reset side bets and power-ups at start of each round
  useEffect(() => {
    if (gamePhase === 'decision') {
      setActiveSideBets(getEmptyBets());
      setActivePowerUps([]);
      achievementCheckDone.current = false;
    }
  }, [gamePhase]);

  // Track wins/losses for achievements and daily challenges
  useEffect(() => {
    if (gamePhase === 'summary' && humanPlayer && !achievementCheckDone.current) {
      achievementCheckDone.current = true;
      const won = winners.includes(humanPlayer.id);
      const lost = losers.includes(humanPlayer.id);
      const held = humanPlayer.decision === 'hold';
      const wasPair = humanPlayer.cards.length === 2 && humanPlayer.cards[0].rank === humanPlayer.cards[1].rank;
      const beatGhost = won && ghostHands.length > 0;
      const handValue = getHandValue(humanPlayer.cards);

      // Update achievements
      let achievements = loadAchievements();
      if (won) {
        achievements = recordAchievementWin(achievements, wasPair, beatGhost, handValue, pot);
        // Check for new achievements
        const { newAchievements, totalReward } = checkAndUnlockAchievements(achievements);
        if (newAchievements.length > 0) {
          setGameAchievementPopup(newAchievements[0]);
          if (totalReward > 0) {
            if (user) {
              // Backend integration needed
            } else {
              addGuestTokens(totalReward);
            }
          }
        }
        // Check theme unlocks
        checkThemeUnlocks(achievements.totalWins, achievements.unlocked);
      } else if (lost) {
        achievements = recordAchievementLoss(achievements);
      }

      // Update daily challenges
      if (dailyProgress) {
        let updatedProgress = dailyProgress;
        // Track games played
        const gamesResult = updateChallengeProgress(updatedProgress, 'games', 1);
        updatedProgress = gamesResult.updated;

        // Track holds
        if (held) {
          const holdsResult = updateChallengeProgress(updatedProgress, 'holds', 1);
          updatedProgress = holdsResult.updated;
        }

        // Track wins
        if (won) {
          const winsResult = updateChallengeProgress(updatedProgress, 'wins', 1);
          updatedProgress = winsResult.updated;
          if (winsResult.newlyCompleted.length > 0) {
            setCompletedChallenge(winsResult.newlyCompleted[0]);
            setTimeout(() => setCompletedChallenge(null), 3000);
          }

          // Track pairs
          if (wasPair) {
            const pairsResult = updateChallengeProgress(updatedProgress, 'pairs', 1);
            updatedProgress = pairsResult.updated;
          }

          // Track ghosts
          if (beatGhost) {
            const ghostsResult = updateChallengeProgress(updatedProgress, 'ghosts', 1);
            updatedProgress = ghostsResult.updated;
          }

          // Track streak
          if (winStreak >= 1) {
            const streakResult = updateChallengeProgress(updatedProgress, 'streak', 1);
            updatedProgress = streakResult.updated;
          }
        }

        setDailyProgress(updatedProgress);
      }

      // Resolve side bets
      if (activeSideBets.bets.length > 0) {
        const ghostWon = winners.some((id) => id.startsWith('ghost'));
        const ghostAppeared = ghostHands.length > 0;
        const allHeld = players.every((p) => p.decision === 'hold' || !p.isActive);
        const winningPlayer = players.find((p) => winners.includes(p.id));
        const winningHandIsPair =
          winningPlayer?.cards.length === 2 &&
          winningPlayer.cards[0].rank === winningPlayer.cards[1].rank;

        const results = resolveSideBets(activeSideBets, {
          ghostWon,
          ghostAppeared,
          allHeld,
          winningHandIsPair,
          winnerId: winningPlayer?.id,
        });

        // Calculate winnings
        const totalWinnings = results.reduce((sum, r) => sum + r.payout, 0);
        if (totalWinnings > 0) {
          if (user) {
            // Backend integration
          } else {
            addGuestTokens(totalWinnings);
          }
        }

        // Show results
        if (results.length > 0) {
          setSideBetResults(results);
        }
      }

      // Show confetti on win
      if (won) {
        setShowConfetti(true);
      }
    }
  }, [gamePhase, humanPlayer, winners, losers, ghostHands, pot, user, dailyProgress, activeSideBets, winStreak, players]);

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

  // New engagement features tracking
  useEffect(() => {
    if (gamePhase === 'summary' && humanPlayer) {
      const won = winners.includes(humanPlayer.id);
      const lost = losers.includes(humanPlayer.id);
      const ghostWon = winners.some(w => w.startsWith('ghost'));
      const beatGhost = won && ghostHands.length > 0;
      const wasPair = humanPlayer.cards.length === 2 && humanPlayer.cards[0].rank === humanPlayer.cards[1].rank;
      const handValue = getHandValue(humanPlayer.cards);
      const isSixNine = humanPlayer.cards.length === 2 &&
        [humanPlayer.cards[0].rank, humanPlayer.cards[1].rank].includes('6') &&
        [humanPlayer.cards[0].rank, humanPlayer.cards[1].rank].includes('9');

      // Track wins for lucky wheel
      if (won && user) {
        const wheelResult = recordWinForWheel();
        setWheelState(wheelResult.state);
      }

      // Check for combos
      const isAceHigh = humanPlayer.cards.some(c => c.rank === 'A');
      const dropped = humanPlayer.decision === 'drop';
      const wouldHaveLost = dropped && !won && !lost; // Dropped but could have lost
      const currentTokens = user?.tokens ?? getGuestTokens();
      const comboResult = checkCombos(
        won,
        handValue,
        wasPair,
        isAceHigh,
        isSixNine,
        beatGhost,
        currentTokens,
        wouldHaveLost,
        dropped
      );
      if (comboResult.combosTriggered.length > 0 && user) {
        setActiveCombos(comboResult.combosTriggered);
        // Award combo bonuses
        if (comboResult.totalBonus > 0) {
          addGuestTokens(comboResult.totalBonus);
          addGuestTokens(comboResult.totalBonus);
        }
      }

      // Check for lucky number bonus (for logged in users)
      if (won && user) {
        const luckyResult = checkLuckyNumber(humanPlayer.cards, won);
        if (luckyResult.bonus > 0) {
          addGuestTokens(luckyResult.bonus);
        }
      }

      // Track revenge
      if (lost) {
        const losingBot = players.find(p => !p.isHuman && winners.includes(p.id));
        if (losingBot) {
          recordLossToBot(losingBot.id, losingBot.name);
          setRevengeTarget(getTopRevengeTarget());
        }
      }

      // Check for revenge completion
      if (won) {
        const defeatedBots = players.filter(p => !p.isHuman && losers.includes(p.id));
        for (const bot of defeatedBots) {
          const revenge = checkRevenge(bot.id);
          if (revenge) {
            completeRevenge(bot.id);
            setRevengeMessage(`REVENGE on ${bot.name}! +${revenge.bounty} bonus!`);
            addGuestTokens(revenge.bounty);
            if (user) addGuestTokens(revenge.bounty);
            setTimeout(() => setRevengeMessage(null), 3000);
            setRevengeTarget(getTopRevengeTarget());
          }
        }
      }

      // Ghost story for ghost wins
      if (ghostWon && beatGhost === false) {
        const story = getRandomGhostWinStory();
        setGhostStory(story);
      }

      // Check for mystery box (random chance each round for logged in users)
      if (user) {
        const mysteryBoxResult = checkForMysteryBox();
        if (mysteryBoxResult.appears) {
          setTimeout(() => setShowMysteryBox(true), 2000);
        }
      }

      // Check game mode unlocks
      if (won && user) {
        const currentTokens = user?.tokens ?? getGuestTokens();
        checkModeUnlocks(loadAchievements().totalWins, currentTokens);
      }
    }
  }, [gamePhase, humanPlayer, winners, losers, ghostHands, players, pot, user, winStreak, roundNumber]);

  // Sign-up prompt for guests (every 5 rounds)
  useEffect(() => {
    if (gamePhase === 'decision' && !user) {
      setSignUpPromptRound(prev => prev + 1);
      if (signUpPromptRound > 0 && signUpPromptRound % 5 === 0) {
        setShowSignUpPrompt(true);
      }
    }
  }, [gamePhase, user, signUpPromptRound]);

  // Bot reactions during reveal
  useEffect(() => {
    if (gamePhase === 'reveal' || gamePhase === 'summary') {
      const newReactions = new Map<string, string>();
      players.forEach(player => {
        if (!player.isHuman && player.decision === 'hold') {
          const isWinner = winners.includes(player.id);
          const isLoser = losers.includes(player.id);
          let reactionEmoji = '';
          if (gamePhase === 'summary') {
            const reaction = isWinner ? getWinReaction(false) : isLoser ? getLoseReaction(false) : getReactionForSituation('deciding');
            reactionEmoji = reaction.emoji;
          } else {
            reactionEmoji = getReactionForSituation('deciding').emoji;
          }
          newReactions.set(player.id, reactionEmoji);
        }
      });
      setBotReactions(newReactions);
    } else {
      setBotReactions(new Map());
    }
  }, [gamePhase, players, winners, losers]);

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
        background: currentTheme?.background || 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxSizing: 'border-box',
        animation: shake ? 'shake 0.5s ease-in-out' : 'none',
        position: 'relative',
        transition: 'background 0.5s ease',
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

      {/* New Visual Effects */}
      <VisualEffects
        showConfetti={showConfetti}
        showScreenShake={shake}
        streakFire={winStreak}
        onConfettiComplete={() => setShowConfetti(false)}
      />

      {/* Floating Emote */}
      {floatingEmote && (
        <FloatingEmote
          emote={floatingEmote.emote}
          playerName={floatingEmote.playerName}
          onComplete={() => setFloatingEmote(null)}
        />
      )}

      {/* Bot Rivalry Message */}
      {rivalryMessage && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(30, 41, 59, 0.95)',
            borderRadius: '16px',
            padding: '16px 24px',
            border: '2px solid #f59e0b',
            zIndex: 200,
            maxWidth: '300px',
            textAlign: 'center',
            animation: 'fade-in 0.3s ease-out',
          }}
        >
          <div style={{ color: '#f59e0b', fontSize: '12px', marginBottom: '4px' }}>
            {rivalryMessage.from} → {rivalryMessage.to}
          </div>
          <div style={{ color: '#e2e8f0', fontSize: '14px', fontStyle: 'italic' }}>
            &quot;{rivalryMessage.message}&quot;
          </div>
        </div>
      )}

      {/* Completed Challenge Toast */}
      {completedChallenge && (
        <div
          style={{
            position: 'fixed',
            top: '120px',
            right: '20px',
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.95), rgba(22, 163, 74, 0.95))',
            borderRadius: '12px',
            padding: '12px 20px',
            zIndex: 400,
            animation: 'slide-in-right 0.4s ease-out',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span style={{ fontSize: '24px' }}>{completedChallenge.icon}</span>
          <div>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>Challenge Complete!</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>{completedChallenge.name}</div>
          </div>
        </div>
      )}

      {/* New Achievement Popup */}
      {gameAchievementPopup && (
        <AchievementUnlockNotification
          achievement={gameAchievementPopup}
          onClose={() => setGameAchievementPopup(null)}
        />
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
      <div className="game-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Menu Button */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                playClick();
                setShowMenu(prev => !prev);
              }}
              style={{
                background: showMenu ? 'rgba(20, 184, 166, 0.2)' : 'rgba(30, 41, 59, 0.9)',
                borderRadius: '8px',
                padding: '8px 10px',
                border: showMenu ? '2px solid #14b8a6' : '2px solid #334155',
                backdropFilter: 'blur(8px)',
                cursor: 'pointer',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              title="Menu"
            >
              ☰
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <>
                {/* Backdrop to close menu when clicking outside */}
                <div
                  onClick={() => setShowMenu(false)}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 99,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '8px',
                    background: 'rgba(30, 41, 59, 0.98)',
                    borderRadius: '12px',
                    border: '2px solid #334155',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                    overflow: 'hidden',
                    zIndex: 100,
                    minWidth: '180px',
                    animation: 'menu-slide-down 0.2s ease-out',
                  }}
                >
                  {/* New Game */}
                  <button
                    onClick={() => {
                      playClick();
                      setShowMenu(false);
                      startGame();
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid #334155',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      color: '#e2e8f0',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(20, 184, 166, 0.15)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ fontSize: '18px' }}>🔄</span>
                    New Game
                  </button>

                  {/* Back to Start */}
                  <button
                    onClick={() => {
                      playClick();
                      setShowMenu(false);
                      resetToStart();
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      color: '#e2e8f0',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(20, 184, 166, 0.15)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ fontSize: '18px' }}>🏠</span>
                    Back to Start
                  </button>
                </div>
              </>
            )}
          </div>

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
            🛒 <span className="shop-text">Shop</span>
          </button>

          {/* Daily Challenges */}
          <DailyChallengeBadge onClick={() => { playClick(); setShowDailyChallenges(true); }} />

          {/* Achievements */}
          <button
            onClick={() => { playClick(); setShowAchievements(true); }}
            style={{
              background: 'rgba(30, 41, 59, 0.9)',
              borderRadius: '8px',
              padding: '6px 10px',
              border: '2px solid #334155',
              cursor: 'pointer',
              fontSize: '16px',
            }}
            title="Achievements"
          >
            🏆
          </button>

          {/* Theme Selector */}
          <button
            onClick={() => { playClick(); setShowThemeSelector(true); }}
            style={{
              background: 'rgba(30, 41, 59, 0.9)',
              borderRadius: '8px',
              padding: '6px 10px',
              border: '2px solid #334155',
              cursor: 'pointer',
              fontSize: '16px',
            }}
            title="Table Themes"
          >
            🎨
          </button>

          {/* Game Modes - Only for logged in users */}
          {user && (
            <button
              onClick={() => { playClick(); setShowGameModeSelector(true); }}
              style={{
                background: 'rgba(30, 41, 59, 0.9)',
                borderRadius: '8px',
                padding: '6px 10px',
                border: '2px solid #a855f7',
                cursor: 'pointer',
                fontSize: '16px',
              }}
              title="Game Modes"
            >
              🎮
            </button>
          )}

          {/* Wallet - Only for logged in users */}
          {user && (
            <button
              onClick={() => { playClick(); setShowWallet(true); }}
              style={{
                background: 'rgba(30, 41, 59, 0.9)',
                borderRadius: '8px',
                padding: '6px 10px',
                border: '2px solid #14b8a6',
                cursor: 'pointer',
                fontSize: '16px',
              }}
              title="Wallet & Inventory"
            >
              👛
            </button>
          )}

          {/* Lucky Wheel Badge - Only for logged in users with spins available */}
          {user && wheelState && wheelState.spinsAvailable > 0 && (
            <button
              onClick={() => { playClick(); setShowLuckyWheel(true); }}
              style={{
                background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.3), rgba(245, 158, 11, 0.3))',
                borderRadius: '8px',
                padding: '6px 10px',
                border: '2px solid #fbbf24',
                cursor: 'pointer',
                fontSize: '16px',
                position: 'relative',
                animation: 'pulse-gold 1s ease-in-out infinite',
              }}
              title={`Lucky Wheel - ${wheelState.spinsAvailable} spin${wheelState.spinsAvailable > 1 ? 's' : ''} available!`}
            >
              🎡
              <span
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  background: '#ef4444',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {wheelState.spinsAvailable}
              </span>
            </button>
          )}
        </div>

        {/* User Token Display & Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Token display */}
          <div
            className="header-token-display"
            style={{
              background: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(217,119,6,0.2))',
              borderRadius: '8px',
              padding: '6px 12px',
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
              gap: '6px',
            }}
          >
            <span style={{ fontSize: '14px' }}>🪙</span>
            <span
              style={{
                color: '#fbbf24',
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              {displayTokens.toLocaleString()}
            </span>
          </div>

          {/* Ante indicator - hidden on mobile */}
          <div
            className="header-ante-display"
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              borderRadius: '8px',
              padding: '6px 10px',
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

          {/* Pot display - hidden on mobile (shown in center) */}
          <div
            className="header-pot-display"
            style={{
              background: potPulse
                ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(22, 163, 74, 0.3))'
                : 'rgba(30, 41, 59, 0.9)',
              borderRadius: '8px',
              padding: '6px 12px',
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
        {/* Poker table felt - uses current theme */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '70%',
            height: '60%',
            background: currentTheme
              ? `radial-gradient(ellipse at center, ${currentTheme.tableColor} 0%, rgba(15, 23, 42, 0.8) 70%)`
              : 'radial-gradient(ellipse at center, rgba(20, 184, 166, 0.15) 0%, rgba(15, 23, 42, 0.8) 70%)',
            borderRadius: '50%',
            border: currentTheme
              ? `3px solid ${currentTheme.accentColor}40`
              : '3px solid rgba(20, 184, 166, 0.3)',
            boxShadow: currentTheme
              ? `inset 0 0 60px ${currentTheme.accentColor}10, 0 0 30px rgba(0, 0, 0, 0.5)`
              : 'inset 0 0 60px rgba(20, 184, 166, 0.1), 0 0 30px rgba(0, 0, 0, 0.5)',
            transition: 'all 0.5s ease',
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
                  {/* Player info with tokens */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
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
                    {/* Token display */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(15, 23, 42, 0.8)',
                        borderRadius: '20px',
                        padding: '4px 12px',
                        border: '1px solid #334155',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span style={{ fontSize: '16px' }}>🪙</span>
                        <span
                          style={{
                            color: '#fbbf24',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            fontFamily: 'monospace',
                          }}
                        >
                          {displayTokens}
                        </span>
                      </div>
                      <div style={{ width: '1px', height: '16px', background: '#475569' }} />
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span style={{ color: '#94a3b8', fontSize: '11px' }}>POT</span>
                        <span
                          style={{
                            color: '#22c55e',
                            fontWeight: 'bold',
                            fontSize: '14px',
                          }}
                        >
                          {displayedPot}
                        </span>
                      </div>
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

              {/* Power-ups and Side Bets Bar */}
              {isDecisionPhase && !humanDecided && (
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'flex-start' }}>
                  {/* Power-ups */}
                  <PowerUpsBar
                    onUsePowerUp={handleUsePowerUp}
                    canUsePowerUps={true}
                    activePowerUps={activePowerUps}
                  />

                  {/* Side Bets Button */}
                  <button
                    onClick={() => { playClick(); setShowSideBets(true); }}
                    style={{
                      background: activeSideBets.bets.length > 0
                        ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(217, 119, 6, 0.3))'
                        : 'rgba(30, 41, 59, 0.9)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      border: activeSideBets.bets.length > 0 ? '2px solid #f59e0b' : '2px solid #334155',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>🎲</span>
                    <span style={{ color: '#e2e8f0', fontSize: '11px', fontWeight: 'bold' }}>Side Bets</span>
                    {activeSideBets.bets.length > 0 && (
                      <span style={{ color: '#f59e0b', fontSize: '10px' }}>
                        {activeSideBets.bets.length}/2
                      </span>
                    )}
                  </button>

                  {/* Emote Buttons */}
                  <EmoteButtons onEmote={handleEmote} />

                  {/* Taunt Buttons - Only for logged in users */}
                  {user && aiPlayers.length > 0 && (
                    <TauntButtons
                      onTaunt={handleTaunt}
                      targetBotName={aiPlayers[0].name}
                      targetBotPersonality="aggressive"
                      disabled={!isDecisionPhase || humanDecided}
                    />
                  )}
                </div>
              )}

              {/* BIG DRAMATIC BUTTONS */}
              {isDecisionPhase && !humanDecided && (
                <div className="hold-drop-buttons" style={{ display: 'flex', gap: '30px' }}>
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

      {/* New Feature Modals */}

      {/* Power-up Shop */}
      {showPowerUpShop && (
        <PowerUpShop
          playerTokens={user?.tokens ?? getGuestTokens()}
          onPurchase={handlePowerUpPurchase}
          onClose={() => setShowPowerUpShop(false)}
        />
      )}

      {/* Daily Challenges */}
      {showDailyChallenges && (
        <DailyChallengesModal
          onClaimReward={handleChallengeReward}
          onClose={() => setShowDailyChallenges(false)}
        />
      )}

      {/* Achievements Panel */}
      {showAchievements && <AchievementsPanel onClose={() => setShowAchievements(false)} />}

      {/* Theme Selector */}
      {showThemeSelector && (
        <ThemeSelector
          onThemeChange={handleThemeChange}
          playerTokens={user?.tokens ?? getGuestTokens()}
          totalWins={loadAchievements().totalWins}
          unlockedAchievements={loadAchievements().unlocked}
          onPurchase={handleThemePurchase}
          onClose={() => setShowThemeSelector(false)}
        />
      )}

      {/* Side Bets Panel */}
      {showSideBets && (
        <div
          style={{
            position: 'fixed',
            bottom: '200px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 500,
          }}
        >
          <SideBetsPanel
            playerTokens={user?.tokens ?? getGuestTokens()}
            currentBets={activeSideBets}
            canPlaceBets={isDecisionPhase && !humanDecided}
            onPlaceBet={handlePlaceSideBet}
            onClose={() => setShowSideBets(false)}
          />
        </div>
      )}

      {/* Side Bet Results */}
      {showSideBetResults && (
        <SideBetResults
          results={showSideBetResults}
          onClose={() => setSideBetResults(null)}
        />
      )}

      {/* New Engagement Feature Modals */}

      {/* Wallet Modal */}
      {showWallet && user && (
        <WalletModal
          isOpen={showWallet}
          onClose={() => setShowWallet(false)}
          playerTokens={displayTokens}
          onPurchase={(cost) => {
            if (displayTokens >= cost) {
              deductGuestTokens(cost);
              return true;
            }
            return false;
          }}
          onEquipChange={() => setWallet(loadWallet())}
        />
      )}

      {/* Lucky Wheel Modal */}
      {showLuckyWheel && user && wheelState && (
        <LuckyWheelModal
          isOpen={showLuckyWheel}
          onClose={() => {
            setShowLuckyWheel(false);
            setWheelState(loadWheelState());
          }}
          onReward={(reward) => {
            if (reward.type === 'tokens' && typeof reward.value === 'number') {
              addGuestTokens(reward.value);
              addGuestTokens(reward.value);
            }
            setWheelState(loadWheelState());
            playTokens();
          }}
        />
      )}

      {/* Mystery Box Modal */}
      <MysteryBoxModal
        isOpen={showMysteryBox}
        onClose={() => setShowMysteryBox(false)}
        onReward={handleMysteryBoxReward}
      />

      {/* Game Mode Selector */}
      {showGameModeSelector && user && (
        <GameModeSelector
          currentMode={currentGameMode}
          onSelectMode={handleGameModeSelect}
          onClose={() => setShowGameModeSelector(false)}
          totalWins={loadAchievements().totalWins}
          currentTokens={displayTokens}
        />
      )}

      {/* Ghost Story Overlay */}
      {ghostStory && (
        <GhostStoryOverlay
          story={ghostStory}
          onComplete={() => setGhostStory(null)}
        />
      )}

      {/* Taunt Display */}
      {activeTaunt && (
        <TauntDisplay
          taunt={activeTaunt.taunt}
          playerName={user?.username || 'You'}
          response={activeTaunt.response}
          botName={aiPlayers[0]?.name || 'Bot'}
          onComplete={() => setActiveTaunt(null)}
        />
      )}

      {/* Combo Notification */}
      {activeCombos.length === 1 && (
        <ComboNotification
          combo={activeCombos[0]}
          onComplete={() => setActiveCombos([])}
        />
      )}

      {/* Multiple Combos Stack */}
      {activeCombos.length > 1 && (
        <ComboStack
          combos={activeCombos}
          onComplete={() => setActiveCombos([])}
        />
      )}

      {/* Sign Up Prompt for Guests */}
      {showSignUpPrompt && !user && (
        <SignUpPrompt
          onSignUp={() => {
            setShowSignUpPrompt(false);
            setShowAuthModal(true);
          }}
          onDismiss={() => setShowSignUpPrompt(false)}
        />
      )}

      {/* Revenge Message */}
      {revengeMessage && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(185, 28, 28, 0.95))',
            borderRadius: '20px',
            padding: '24px 40px',
            textAlign: 'center',
            zIndex: 1000,
            boxShadow: '0 20px 60px rgba(239, 68, 68, 0.4)',
            animation: 'revenge-appear 0.5s ease-out',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚔️</div>
          <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
            {revengeMessage}
          </div>
        </div>
      )}

      {/* Revenge Target Indicator */}
      {revengeTarget && gamePhase === 'decision' && (
        <div
          style={{
            position: 'fixed',
            bottom: '280px',
            right: '16px',
            background: 'rgba(239, 68, 68, 0.2)',
            borderRadius: '12px',
            padding: '12px 16px',
            border: '2px solid #ef4444',
            zIndex: 200,
            maxWidth: '200px',
          }}
        >
          <div style={{ color: '#f87171', fontSize: '10px', fontWeight: 'bold', marginBottom: '4px' }}>
            REVENGE TARGET
          </div>
          <div style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 'bold' }}>
            {revengeTarget.botName}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '11px' }}>
            Beat them to earn +{10 + revengeTarget.timesLostTo * 5} bonus!
          </div>
        </div>
      )}

      {/* Bot Reactions Display */}
      {botReactions.size > 0 && (
        <>
          {players.map(player => {
            const reaction = botReactions.get(player.id);
            if (!reaction || player.isHuman) return null;
            return (
              <div
                key={`reaction-${player.id}`}
                style={{
                  position: 'fixed',
                  top: '30%',
                  left: `${20 + players.indexOf(player) * 20}%`,
                  transform: 'translateX(-50%)',
                  fontSize: '32px',
                  animation: 'reaction-pop 0.5s ease-out',
                  zIndex: 150,
                }}
              >
                {reaction}
              </div>
            );
          })}
        </>
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
        @keyframes menu-slide-down {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-right {
          0% { transform: translateX(100px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes challenge-complete {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes power-up-activate {
          0% { transform: scale(1); box-shadow: 0 0 0 rgba(20, 184, 166, 0); }
          50% { transform: scale(1.2); box-shadow: 0 0 30px rgba(20, 184, 166, 0.8); }
          100% { transform: scale(1); box-shadow: 0 0 0 rgba(20, 184, 166, 0); }
        }
        @keyframes side-bet-win {
          0% { transform: scale(1); }
          25% { transform: scale(1.1) rotate(-5deg); }
          50% { transform: scale(1.1) rotate(5deg); }
          75% { transform: scale(1.1) rotate(-5deg); }
          100% { transform: scale(1) rotate(0); }
        }
        @keyframes revenge-appear {
          0% { transform: translate(-50%, -50%) scale(0) rotate(-10deg); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.1) rotate(5deg); }
          100% { transform: translate(-50%, -50%) scale(1) rotate(0); opacity: 1; }
        }
        @keyframes reaction-pop {
          0% { transform: translateX(-50%) scale(0); opacity: 0; }
          50% { transform: translateX(-50%) scale(1.3); opacity: 1; }
          100% { transform: translateX(-50%) scale(1); opacity: 1; }
        }
        @keyframes wheel-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(1800deg); }
        }
        @keyframes mystery-shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        @keyframes combo-slide {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @media (max-width: 768px) {
          .hold-drop-btn {
            padding: 20px 40px !important;
            font-size: 24px !important;
            min-width: 140px !important;
          }
        }
        @media (max-width: 480px) {
          /* iPhone Pro Max and smaller */
          .game-header {
            padding: 4px !important;
            gap: 4px !important;
          }
          .game-header button {
            padding: 4px 8px !important;
            font-size: 12px !important;
          }
          .header-token-display {
            padding: 4px 8px !important;
            font-size: 12px !important;
          }
          .header-pot-display {
            display: none !important;
          }
          .header-ante-display {
            display: none !important;
          }
          .shop-text {
            display: none !important;
          }
          .hold-drop-buttons {
            gap: 16px !important;
          }
          .hold-drop-buttons button {
            padding: 18px 36px !important;
            font-size: 22px !important;
          }
          .human-card-area {
            padding: 10px 16px !important;
          }
          .player-cards {
            gap: 6px !important;
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
