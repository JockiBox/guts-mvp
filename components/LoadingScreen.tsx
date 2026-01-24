'use client';

import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete?: () => void;
  minDuration?: number;
}

export default function LoadingScreen({ onComplete, minDuration = 2000 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / minDuration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        setFadeOut(true);
        setTimeout(() => {
          onComplete?.();
        }, 500);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [minDuration, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            <span className="text-2xl opacity-20">
              {['♠', '♥', '♦', '♣'][Math.floor(Math.random() * 4)]}
            </span>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated cards */}
        <div className="relative w-64 h-48 mb-8">
          {/* Card 1 - Left */}
          <div
            className="absolute left-4 top-4 w-24 h-36 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-teal-500/50 shadow-lg shadow-teal-500/20 animate-card-1"
            style={{ transformOrigin: 'center bottom' }}
          >
            <div className="absolute top-2 left-2 text-red-500 text-xl font-bold">A</div>
            <div className="absolute top-8 left-2 text-red-500 text-lg">♥</div>
            <div className="flex items-center justify-center h-full text-4xl text-red-500">♥</div>
          </div>

          {/* Card 2 - Center */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0 w-24 h-36 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-teal-400 shadow-lg shadow-teal-400/30 animate-card-2 z-10"
            style={{ transformOrigin: 'center bottom' }}
          >
            <div className="absolute top-2 left-2 text-teal-400 text-xl font-bold">K</div>
            <div className="absolute top-8 left-2 text-teal-400 text-lg">♠</div>
            <div className="flex items-center justify-center h-full text-4xl text-teal-400">♠</div>
          </div>

          {/* Card 3 - Right */}
          <div
            className="absolute right-4 top-4 w-24 h-36 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-teal-500/50 shadow-lg shadow-teal-500/20 animate-card-3"
            style={{ transformOrigin: 'center bottom' }}
          >
            <div className="absolute top-2 left-2 text-red-500 text-xl font-bold">Q</div>
            <div className="absolute top-8 left-2 text-red-500 text-lg">♦</div>
            <div className="flex items-center justify-center h-full text-4xl text-red-500">♦</div>
          </div>

          {/* Glow effect */}
          <div className="absolute inset-0 bg-teal-500/10 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        {/* GUTS Logo */}
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-300 to-teal-400 animate-shimmer mb-2">
          GUTS
        </h1>
        <p className="text-slate-400 text-sm mb-8 animate-pulse">Hold or Drop. Beat the Ghost.</p>

        {/* Progress bar */}
        <div className="w-64 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-slate-500 text-xs mt-2">{Math.round(progress)}%</p>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
            opacity: 0.4;
          }
        }

        @keyframes card-1 {
          0%, 100% {
            transform: rotate(-15deg) translateY(0);
          }
          50% {
            transform: rotate(-10deg) translateY(-10px);
          }
        }

        @keyframes card-2 {
          0%, 100% {
            transform: translateX(-50%) rotate(0deg) translateY(0);
          }
          50% {
            transform: translateX(-50%) rotate(3deg) translateY(-15px);
          }
        }

        @keyframes card-3 {
          0%, 100% {
            transform: rotate(15deg) translateY(0);
          }
          50% {
            transform: rotate(10deg) translateY(-10px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-card-1 {
          animation: card-1 2s ease-in-out infinite;
        }

        .animate-card-2 {
          animation: card-2 2s ease-in-out infinite;
          animation-delay: 0.2s;
        }

        .animate-card-3 {
          animation: card-3 2s ease-in-out infinite;
          animation-delay: 0.4s;
        }

        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// Quick splash for page transitions
export function QuickLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-teal-500/30 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <span className="mt-4 text-teal-400 font-semibold">Loading...</span>
      </div>
    </div>
  );
}
