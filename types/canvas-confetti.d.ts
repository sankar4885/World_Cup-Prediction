declare module 'canvas-confetti' {
  interface Options {
    particleCount?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: {
      x?: number;
      y?: number;
    };
    colors?: string[];
    shapes?: string[];
    zIndex?: number;
  }

  interface Confetti {
    (options?: Options): Promise<unknown>;
    reset(): void;
  }

  const confetti: Confetti;
  export default confetti;
}