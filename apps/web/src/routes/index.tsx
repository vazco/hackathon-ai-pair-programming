import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PairingResult } from '@/components/PairingResult';
import { WinnersHistory } from '@/components/WinnersHistory';
import { apiClient, type History, type Pairing } from '@/lib/api-client';
import { useSoundEffects } from '@/hooks/useSoundEffects';

function Index() {
  const { t } = useTranslation();
  const [currentPairing, setCurrentPairing] = useState<Pairing | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [history, setHistory] = useState<History[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentlyCompleted, setRecentlyCompleted] = useState<
    { id: number; timestamp: number }[]
  >([]);
  const [reminderUsers, setReminderUsers] = useState<Set<string>>(new Set());
  const { playRandomizingSound, stopRandomizingSound, playWinnerSound } =
    useSoundEffects();

  useEffect(() => {
    const loadData = async () => {
      try {
        const historyData = await apiClient.getPairingHistory();
        setHistory(historyData);

        // Calculate initial reminder users from history
        // This is a one-time calculation for initial load
        const reminderSet = new Set<string>();
        // Note: We don't have users data here, so we'll get it from history
        const userGithubs = new Set<string>();
        historyData.forEach((h: History) => {
          if (h.firstWinnerGithub) userGithubs.add(h.firstWinnerGithub);
          if (h.secondWinnerGithub) userGithubs.add(h.secondWinnerGithub);
        });

        for (const github of userGithubs) {
          const userSelections = historyData
            .filter(
              (h: History) =>
                h.firstWinnerGithub === github ||
                h.secondWinnerGithub === github
            )
            .sort(
              (a: History, b: History) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .slice(0, 5);

          if (
            userSelections.length >= 5 &&
            userSelections.every((h: History) => !h.completed)
          ) {
            reminderSet.add(github);
          }
        }

        setReminderUsers(reminderSet);
      } catch (error) {
        console.error('Failed to load data:', error);
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
      setReminderUsers(new Set(pairingData.reminderUsers));
    } catch (error) {
      console.error('Failed to generate pairing:', error);
      alert(error instanceof Error ? error.message : t('failedToGenerate'));
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
        setCurrentPairing(regambledData);
      }

      const historyData = await apiClient.getPairingHistory();
      setHistory(historyData);
      if (regambledData) {
        setReminderUsers(new Set(regambledData.reminderUsers));
      }
    } catch (error) {
      console.error('Failed to regamble:', error);
      alert(t('failedToRegamble'));
      setIsAnimating(false);
    }
  };

  const handleMarkCompleted = async (id: number) => {
    try {
      const result = await apiClient.markCompleted({ id });
      const historyData = await apiClient.getPairingHistory();
      setHistory(historyData);
      setReminderUsers(new Set(result.reminderUsers));
      setRecentlyCompleted((prev) => [...prev, { id, timestamp: Date.now() }]);
    } catch (error) {
      console.error('Failed to mark as completed:', error);
      alert(t('failedToMarkCompleted'));
    }
  };

  const handleUndoCompleted = async (id: number) => {
    try {
      const result = await apiClient.undoCompleted({ id });
      const historyData = await apiClient.getPairingHistory();
      setHistory(historyData);
      setReminderUsers(new Set(result.reminderUsers));
      setRecentlyCompleted((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Failed to undo completion:', error);
      alert(t('failedToUndoCompletion'));
    }
  };

  return (
    <div className="flex flex-col flex-1 py-8 px-4 items-center justify-center">
      <div className="max-w-4xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">{t('subtitle')}</p>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleGeneratePairing}
            disabled={isLoading || isAnimating}
            className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading || isAnimating ? t('generating') : t('gambleButton')}
          </button>
        </div>

        <PairingResult
          user1={currentPairing?.user1 || null}
          user2={currentPairing?.user2 || null}
          isAnimating={isAnimating}
          reminderUsers={reminderUsers}
        />

        <WinnersHistory
          winners={history}
          onRegamble={handleRegamble}
          onMarkCompleted={handleMarkCompleted}
          onUndoCompleted={handleUndoCompleted}
          recentlyCompleted={recentlyCompleted}
          reminderUsers={reminderUsers}
        />
      </div>
    </div>
  );
}

export const Route = createFileRoute('/')({
  component: Index,
});
