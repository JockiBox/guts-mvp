'use client';

import { useState, useEffect } from 'react';
import { GameBoard } from '@/components/GameBoard';
import LoadingScreen from '@/components/LoadingScreen';

export default function Home() {
  const [showLoading, setShowLoading] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    // Only show loading screen if we haven't shown it this session
    if (typeof window !== 'undefined') {
      const hasLoaded = sessionStorage.getItem('guts_loaded');
      if (!hasLoaded) {
        setShowLoading(true);
      } else {
        setLoadingComplete(true);
      }
    }
  }, []);

  const handleLoadComplete = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('guts_loaded', 'true');
    }
    setLoadingComplete(true);
    // Small delay before hiding loader to allow fade animation
    setTimeout(() => setShowLoading(false), 600);
  };

  // Always render GameBoard, loading screen overlays on top
  return (
    <>
      {showLoading && <LoadingScreen onComplete={handleLoadComplete} minDuration={2000} />}
      {(loadingComplete || !showLoading) && <GameBoard />}
    </>
  );
}
