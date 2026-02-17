import { useCallback, useRef } from "react";

type SoundType = "drumroll" | "coin" | "celebration";

const SOUNDS: Record<SoundType, { frequencies: number[]; duration: number; type: OscillatorType }> = {
  drumroll: { frequencies: [200, 250, 300, 350, 400, 450, 500], duration: 0.08, type: "triangle" },
  coin: { frequencies: [800, 1200, 1600], duration: 0.15, type: "sine" },
  celebration: { frequencies: [523, 659, 784, 1047], duration: 0.2, type: "sine" },
};

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return ctxRef.current;
  }, []);

  const play = useCallback(
    (sound: SoundType) => {
      try {
        const ctx = getCtx();
        const { frequencies, duration, type } = SOUNDS[sound];
        frequencies.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = type;
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.15, ctx.currentTime + i * duration);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * duration + duration);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * duration);
          osc.stop(ctx.currentTime + i * duration + duration + 0.05);
        });
      } catch (e) {
        console.warn("Sound playback failed:", e);
      }
    },
    [getCtx]
  );

  return { play };
}
