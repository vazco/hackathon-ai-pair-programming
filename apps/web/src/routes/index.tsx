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
  const [recentlyCompleted, setRecentlyCompleted] = useState<
    { id: number; timestamp: number }[]
  >([]);
  const { playRandomizingSound, stopRandomizingSound, playWinnerSound } =
    useSoundEffects();

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

  useEffect(() => {
    if (isAnimating) {
      playRandomizingSound();
    } else {
      stopRandomizingSound();
    }
  }, [isAnimating, playRandomizingSound, stopRandomizingSound]);

  useEffect(() => {
    if (!isAnimating && currentPairing) {
      playWinnerSound();
    }
  }, [isAnimating, currentPairing, playWinnerSound]);

  // Clean up expired undo items
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setRecentlyCompleted((prev) =>
        prev.filter((item) => now - item.timestamp < 5000)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleGeneratePairing = async () => {
    try {
      setIsLoading(true);
      setIsAnimating(true);

      const [pairingData] = await Promise.all([
        apiClient.generateAndSavePairing(),
        new Promise((resolve) => setTimeout(resolve, 2500)),
      ]);

      setIsAnimating(false);
      setCurrentPairing(pairingData);

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

  const handleRegamble = async () => {
    try {
      setIsAnimating(true);

      const [regambledData] = await Promise.all([
        apiClient.regenerateLatestPairing(),
        new Promise((resolve) => setTimeout(resolve, 2500)),
      ]);

      setIsAnimating(false);

      if (regambledData) {
        const newPairing: Pairing = {
          user1: {
            name: regambledData.firstWinnerName,
            github: regambledData.firstWinnerGithub,
            active: true,
          },
          user2: {
            name: regambledData.secondWinnerName,
            github: regambledData.secondWinnerGithub,
            active: true,
          },
          timestamp: regambledData.createdAt.toISOString(),
        };
        setCurrentPairing(newPairing);
      }

      const historyData = await apiClient.getPairingHistory();
      setHistory(historyData);
    } catch (error) {
      console.error('Failed to regamble:', error);
      alert('Failed to regamble. Please try again.');
      setIsAnimating(false);
    }
  };

  const handleMarkCompleted = async (id: number) => {
    try {
      await apiClient.markCompleted({ id });
      const historyData = await apiClient.getPairingHistory();
      setHistory(historyData);
      setRecentlyCompleted((prev) => [...prev, { id, timestamp: Date.now() }]);
    } catch (error) {
      console.error('Failed to mark as completed:', error);
      alert('Failed to mark as completed. Please try again.');
    }
  };

  const handleUndoCompleted = async (id: number) => {
    try {
      await apiClient.undoCompleted({ id });
      const historyData = await apiClient.getPairingHistory();
      setHistory(historyData);
      setRecentlyCompleted((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Failed to undo completion:', error);
      alert('Failed to undo completion. Please try again.');
    }
  };

  return (
    <div className="flex flex-col flex-1 py-8 px-4 items-center justify-center">
      <div className="max-w-4xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Pair Programming Lottery
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Generate random pairings for pair programming sessions
          </p>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleGeneratePairing}
            disabled={isLoading || isAnimating}
            className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading || isAnimating ? 'Generating...' : 'Run the Gamble!'}
          </button>
        </div>

        <PairingResult
          user1={currentPairing?.user1 || null}
          user2={currentPairing?.user2 || null}
          isAnimating={isAnimating}
        />

        <WinnersHistory
          winners={history}
          onRegamble={handleRegamble}
          onMarkCompleted={handleMarkCompleted}
          onUndoCompleted={handleUndoCompleted}
          recentlyCompleted={recentlyCompleted}
        />
      </div>
    </div>
  );
}

export const Route = createFileRoute('/')({
  component: Index,
});
