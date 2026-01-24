'use client';

import { useState, useEffect } from 'react';
import { GameBoard } from '@/components/GameBoard';
import LoadingScreen from '@/components/LoadingScreen';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Check if we've already shown the loading screen this session
    const hasLoaded = sessionStorage.getItem('guts_loaded');
    if (hasLoaded) {
      setIsLoading(false);
      setShowContent(true);
    }
  }, []);

  const handleLoadComplete = () => {
    sessionStorage.setItem('guts_loaded', 'true');
    setShowContent(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <>
      {isLoading && <LoadingScreen onComplete={handleLoadComplete} minDuration={2500} />}
      {showContent && <GameBoard />}
    </>
  );
}
