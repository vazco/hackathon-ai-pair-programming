import { useRef } from 'react';

type RandomizingSoundNodes = {
  oscillator1: OscillatorNode;
  oscillator2: OscillatorNode;
  lfoOscillator: OscillatorNode;
  gainNode: GainNode;
  lfoGain: GainNode;
};

export function useSoundEffects() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const randomizingSoundNodesRef = useRef<RandomizingSoundNodes | null>(null);

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  };

  const playRandomizingSound = () => {
    const audioContext = getAudioContext();
    const now = audioContext.currentTime;

    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    const lfoOscillator = audioContext.createOscillator();
    const lfoGain = audioContext.createGain();

    lfoOscillator.frequency.setValueAtTime(8, now); // 8 clicks per second initially
    lfoOscillator.frequency.linearRampToValueAtTime(25, now + 2.5); // Speed up to 25 clicks per second
    lfoGain.gain.setValueAtTime(0.5, now);

    lfoOscillator.connect(lfoGain);
    lfoGain.connect(gainNode.gain);

    oscillator1.type = 'square';
    oscillator2.type = 'sawtooth';

    oscillator1.frequency.setValueAtTime(220, now);
    oscillator1.frequency.linearRampToValueAtTime(330, now + 2.5);

    oscillator2.frequency.setValueAtTime(440, now);
    oscillator2.frequency.linearRampToValueAtTime(660, now + 2.5);

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.12, now + 0.1);
    gainNode.gain.setValueAtTime(0.12, now + 2.3);
    gainNode.gain.linearRampToValueAtTime(0.01, now + 2.5);

    oscillator1.start(now);
    oscillator2.start(now);
    lfoOscillator.start(now);

    oscillator1.stop(now + 2.5);
    oscillator2.stop(now + 2.5);
    lfoOscillator.stop(now + 2.5);

    randomizingSoundNodesRef.current = {
      oscillator1,
      oscillator2,
      lfoOscillator,
      gainNode,
      lfoGain,
    };
  };

  const stopRandomizingSound = () => {
    if (randomizingSoundNodesRef.current) {
      const audioContext = getAudioContext();
      const now = audioContext.currentTime;

      try {
        const { oscillator1, oscillator2, lfoOscillator, gainNode } =
          randomizingSoundNodesRef.current;

        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(gainNode.gain.value, now);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 0.1);

        oscillator1.stop(now + 0.1);
        oscillator2.stop(now + 0.1);
        lfoOscillator.stop(now + 0.1);
      } catch {
        // Ignore errors when stopping audio nodes
      }

      randomizingSoundNodesRef.current = null;
    }
  };

  const playWinnerSound = () => {
    const audioContext = getAudioContext();
    const now = audioContext.currentTime;

    const notes = [
      { freq: 523.25, start: 0, duration: 0.15 }, // C5
      { freq: 659.25, start: 0.1, duration: 0.15 }, // E5
      { freq: 783.99, start: 0.2, duration: 0.25 }, // G5
    ];

    notes.forEach((note) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = note.freq;
      oscillator.type = 'sine';

      const startTime = now + note.start;
      const endTime = startTime + note.duration;

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);

      oscillator.start(startTime);
      oscillator.stop(endTime);
    });

    const bassOscillator = audioContext.createOscillator();
    const bassGain = audioContext.createGain();

    bassOscillator.connect(bassGain);
    bassGain.connect(audioContext.destination);

    bassOscillator.frequency.value = 130.81; // C3
    bassOscillator.type = 'triangle';

    const bassStart = now + 0.2;
    const bassEnd = bassStart + 0.4;

    bassGain.gain.setValueAtTime(0, bassStart);
    bassGain.gain.linearRampToValueAtTime(0.25, bassStart + 0.02);
    bassGain.gain.exponentialRampToValueAtTime(0.01, bassEnd);

    bassOscillator.start(bassStart);
    bassOscillator.stop(bassEnd);
  };

  return {
    playRandomizingSound,
    stopRandomizingSound,
    playWinnerSound,
  };
}
