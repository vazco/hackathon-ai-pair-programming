import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PairingResult } from '@/components/PairingResult';
import { PairingHistory } from '@/components/PairingHistory';
import { apiClient } from '@/lib/api-client';
import { Pairing } from '@/types/user';

function Index() {
  const [currentPairing, setCurrentPairing] = useState<Pairing | null>(null);
  const [pairingHistory, setPairingHistory] = useState<Pairing[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGamble = async () => {
    try {
      setIsLoading(true);
      setIsAnimating(true);

      // Animate for 2.5 seconds before showing result
      const [pairing] = await Promise.all([
        apiClient.generatePairing(),
        new Promise((resolve) => setTimeout(resolve, 2500)),
      ]);

      setIsAnimating(false);
      setCurrentPairing(pairing);

      // Add to history
      setPairingHistory((prev) => [pairing, ...prev]);
    } catch (error) {
      console.error('Failed to generate pairing:', error);
      alert('Failed to generate pairing. Please try again.');
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
            Click the button below to randomly select a programming pair
          </p>

          <Button
            onClick={handleGamble}
            disabled={isLoading}
            size="lg"
            className="text-xl px-12 py-6 h-auto font-bold shadow-lg hover:shadow-xl transition-all"
          >
            {isLoading ? 'Gambling...' : 'Run the Gamble!'}
          </Button>
        </div>

        {/* Pairing Result */}
        <PairingResult
          user1={currentPairing?.user1 || null}
          user2={currentPairing?.user2 || null}
          isAnimating={isAnimating}
        />

        {/* Pairing History */}
        <PairingHistory pairings={pairingHistory} />
      </div>
    </div>
  );
}

export const Route = createFileRoute('/')({
  component: Index,
});
