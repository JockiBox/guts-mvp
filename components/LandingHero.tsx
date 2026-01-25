'use client';

import { useState, useEffect } from 'react';

interface LandingHeroProps {
  onPlayNow: () => void;
  onSignUp: () => void;
}

export function LandingHero({ onPlayNow, onSignUp }: LandingHeroProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [cardRotations, setCardRotations] = useState([0, 0, 0]);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCardRotations([
        Math.random() * 6 - 3,
        Math.random() * 4 - 2,
        Math.random() * 6 - 3,
      ]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: '🎰', title: 'Hold or Drop', desc: 'High-stakes decisions every hand' },
    { icon: '👻', title: 'Beat the Ghost', desc: 'Outsmart the mystery hand' },
    { icon: '🏆', title: 'Win Big', desc: 'Climb the leaderboards' },
    { icon: '🎡', title: 'Daily Rewards', desc: 'Spin the lucky wheel' },
  ];

  const stats = [
    { value: '10K+', label: 'Games Played' },
    { value: '500', label: 'Free Tokens' },
    { value: '24/7', label: 'Always Online' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Animated Cards */}
          <div className="flex justify-center gap-2 mb-8">
            {['A♠', 'K♥', 'Q♦'].map((card, i) => (
              <div
                key={card}
                className="w-20 h-28 md:w-24 md:h-32 bg-slate-800 border-2 border-teal-500 rounded-xl flex items-center justify-center text-2xl md:text-3xl font-bold shadow-lg shadow-teal-500/20 transition-transform duration-500"
                style={{ transform: `rotate(${cardRotations[i]}deg)` }}
              >
                <span className={card.includes('♥') || card.includes('♦') ? 'text-red-500' : 'text-teal-400'}>
                  {card}
                </span>
              </div>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-600 mb-4">
            GUTS
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-2">
            The Ultimate Card Game
          </p>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Do you have the guts to hold? Face off against the ghost hand in this classic high-stakes poker game.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={onPlayNow}
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white text-lg font-bold rounded-xl shadow-lg shadow-teal-500/30 transition-all hover:scale-105 hover:shadow-teal-500/50"
            >
              Play Free Now
            </button>
            <button
              onClick={onSignUp}
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white text-lg font-medium rounded-xl border border-slate-600 transition-all hover:scale-105"
            >
              Create Account
            </button>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 md:gap-16 mb-16">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-teal-400">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4 text-center hover:border-teal-500/50 transition-colors"
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="font-bold text-white mb-1">{feature.title}</h3>
              <p className="text-sm text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* How to Play */}
        <div className={`bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-6 md:p-8 mb-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-2xl font-bold text-white text-center mb-6">How to Play</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center text-teal-400 font-bold text-xl mx-auto mb-3">1</div>
              <h3 className="font-semibold text-white mb-2">Get Your Cards</h3>
              <p className="text-slate-400 text-sm">You receive 2 cards. A ghost hand is dealt face down.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center text-teal-400 font-bold text-xl mx-auto mb-3">2</div>
              <h3 className="font-semibold text-white mb-2">Hold or Drop</h3>
              <p className="text-slate-400 text-sm">Decide if your hand can beat the ghost. Hold to compete, drop to fold.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center text-teal-400 font-bold text-xl mx-auto mb-3">3</div>
              <h3 className="font-semibold text-white mb-2">Win the Pot</h3>
              <p className="text-slate-400 text-sm">Beat the ghost to win! Losers who held must match the pot.</p>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className={`text-center transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-slate-400 mb-4">Trusted by players worldwide</p>
          <div className="flex justify-center gap-2">
            {['⭐', '⭐', '⭐', '⭐', '⭐'].map((star, i) => (
              <span key={i} className="text-2xl text-yellow-400">{star}</span>
            ))}
          </div>
          <p className="text-sm text-slate-500 mt-2">&quot;The most addictive card game I&apos;ve played!&quot;</p>
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-16">
          <button
            onClick={onPlayNow}
            className="px-12 py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white text-xl font-bold rounded-xl shadow-lg shadow-teal-500/30 transition-all hover:scale-105 animate-pulse"
          >
            Start Playing - It&apos;s Free!
          </button>
        </div>
      </div>
    </div>
  );
}
