export const FREQUENCY = { min: 0.5, max: 12, step: 0.1, initial: 4 } as const;
export const SAMPLING_RATE = { min: 1, max: 30, step: 0.1, initial: 3 } as const;
export const WINDOW = { start: -1, end: 1 } as const;
const TAU = 2 * Math.PI;

export function aliasFrequency(frequency: number, samplingRate: number): number {
  return frequency - samplingRate * Math.floor(frequency / samplingRate + 0.5);
}

export function signalAt(frequency: number, time: number): number {
  return Math.cos(TAU * frequency * time);
}

export function samples(frequency: number, samplingRate: number) {
  const first = Math.ceil(WINDOW.start * samplingRate);
  const last = Math.floor(WINDOW.end * samplingRate);
  return Array.from({ length: last - first + 1 }, (_, offset) => {
    const index = first + offset;
    const time = index / samplingRate;
    return { index, time, value: signalAt(frequency, time) };
  });
}

export function pointAt(time: number, value: number, width: number, height: number) {
  return {
    x: (time - WINDOW.start) / (WINDOW.end - WINDOW.start) * width,
    y: height / 2 - value * height * 0.36,
  };
}

export function signalPath(frequency: number, width: number, height: number): string {
  // At least 64 segments per cycle; screen resolution may require more.
  const segments = Math.ceil(Math.max(width, Math.abs(frequency) * 2 * 64, 256));
  return Array.from({ length: segments + 1 }, (_, index) => {
    const time = WINDOW.start + index / segments * (WINDOW.end - WINDOW.start);
    const { x, y } = pointAt(time, signalAt(frequency, time), width, height);
    return `${index === 0 ? 'M' : 'L'}${x.toFixed(3)},${y.toFixed(3)}`;
  }).join(' ');
}
