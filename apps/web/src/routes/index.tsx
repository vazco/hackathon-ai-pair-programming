import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { PairingResult } from '@/components/PairingResult';
import { WinnersHistory } from '@/components/WinnersHistory';
import { apiClient, type History } from '@/lib/api-client';
import { Pairing } from '@/types/user';
import { useSoundEffects } from '@/hooks/useSoundEffects';

function Index() {
  const [currentPairing, setCurrentPairing] = useState<Pairing | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [history, setHistory] = useState<History[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { playRandomizingSound, stopRandomizingSound, playWinnerSound } = useSoundEffects();

  // Load history on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const historyData = await apiClient.getPairingHistory();
        setHistory(historyData);
      } catch (error) {
        console.error('Failed to load history:', error);
      }
    };
    loadData();
  }, []);

  // Play randomizing sound when animation starts and stop when it ends
  useEffect(() => {
    if (isAnimating) {
      playRandomizingSound();
    } else {
      stopRandomizingSound();
    }
  }, [isAnimating, playRandomizingSound, stopRandomizingSound]);

  // Play winner sound when pairing is revealed
  useEffect(() => {
    if (!isAnimating && currentPairing) {
      playWinnerSound();
    }
  }, [isAnimating, currentPairing, playWinnerSound]);

  const handleGeneratePairing = async () => {
    try {
      setIsLoading(true);
      setIsAnimating(true);

      // Animate for 2.5 seconds before showing result
      const [pairingData] = await Promise.all([
        apiClient.generateAndSavePairing(),
        new Promise((resolve) => setTimeout(resolve, 2500)),
      ]);

      setIsAnimating(false);
      setCurrentPairing(pairingData);

      // Refresh history
      const historyData = await apiClient.getPairingHistory();
      setHistory(historyData);
    } catch (error) {
      console.error('Failed to generate pairing:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to generate pairing. Please try again.'
      );
      setIsAnimating(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 py-8 px-4 items-center justify-center">
      <div className="max-w-4xl mx-auto w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Pair Programming Lottery
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Generate random pairings for pair programming sessions
          </p>
        </div>

        {/* Generate Pairing Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleGeneratePairing}
            disabled={isLoading || isAnimating}
            className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading || isAnimating ? 'Generating...' : 'Run the Gamble!'}
          </button>
        </div>

        {/* Pairing Result */}
        <PairingResult
          user1={currentPairing?.user1 || null}
          user2={currentPairing?.user2 || null}
          isAnimating={isAnimating}
        />

        {/* Pairing History */}
        <WinnersHistory winners={history} />

      </div>
    </div>
  );
}

export const Route = createFileRoute('/')({
  component: Index,
});
