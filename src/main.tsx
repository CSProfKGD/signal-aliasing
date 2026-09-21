import { StrictMode, useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { createRoot } from 'react-dom/client';
import { aliasFrequency, FREQUENCY, pointAt, samples, SAMPLING_RATE, signalPath } from './signal';
import './styles.css';

function Slider({ label, value, range, unit, spokenUnit, onChange }: {
  label: string;
  value: number;
  range: { min: number; max: number; step: number };
  unit: string;
  spokenUnit: string;
  onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <div className="control-row">
      <label htmlFor={id}>{label}</label>
      <input id={id} type="range" min={range.min} max={range.max} step={range.step}
        value={value} aria-valuetext={`${value.toFixed(1)} ${spokenUnit}`}
        style={{ '--slider-progress': `${(value - range.min) / (range.max - range.min) * 100}%` } as CSSProperties}
        onChange={(event) => onChange(Number(event.currentTarget.value))} />
      <output htmlFor={id}>
        <span className="control-value">{value.toFixed(1)}</span>{' '}
        <span className="control-unit">{unit}</span>
      </output>
    </div>
  );
}

function Waveform({ frequency, samplingRate }: { frequency: number; samplingRate: number }) {
  const stage = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 1440, height: 400 });
  const descriptionId = useId();
  const alias = aliasFrequency(frequency, samplingRate);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setSize({ width: Math.max(1, entry.contentRect.width), height: Math.max(1, entry.contentRect.height) });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="waveform" ref={stage}>
      <svg viewBox={`0 0 ${size.width} ${size.height}`} role="img" aria-labelledby={descriptionId}>
        <title id={descriptionId}>
          {`True signal at ${frequency.toFixed(1)} hertz in periwinkle and its lowest-frequency sampled reconstruction at ${Math.abs(alias).toFixed(1)} hertz in aqua. Ivory dots are samples taken ${samplingRate.toFixed(1)} times per second; each lies on both curves. The view spans two seconds. ${frequency < samplingRate / 2 ? 'The curves coincide because the sampling rate is above twice the signal frequency.' : frequency === samplingRate / 2 ? 'The signal is exactly at the Nyquist limit.' : 'The sampling rate is too low to distinguish the true signal from its alias.'}`}
        </title>
        <path className="true-signal" d={signalPath(frequency, size.width, size.height)} />
        <path className="alias-signal" d={signalPath(alias, size.width, size.height)} />
        {samples(frequency, samplingRate).map(({ index, time, value }) => {
          const point = pointAt(time, value, size.width, size.height);
          return <circle className="sample" key={index} cx={point.x} cy={point.y} r="5" />;
        })}
      </svg>
    </div>
  );
}

function App() {
  const [frequency, setFrequency] = useState<number>(FREQUENCY.initial);
  const [samplingRate, setSamplingRate] = useState<number>(SAMPLING_RATE.initial);
  return (
    <main className="site-shell">
      <header className="hero">
        <h1>Signal Aliasing</h1>
        <p className="subtitle">High frequencies in disguise.</p>
      </header>
      <section className="experiment" aria-label="Signal aliasing visualization">
        <Waveform frequency={frequency} samplingRate={samplingRate} />
        <div className="control-dock" role="group" aria-label="Signal controls">
          <Slider label="Signal frequency" value={frequency} range={FREQUENCY} unit="Hz" spokenUnit="hertz" onChange={setFrequency} />
          <Slider label="Sampling frequency" value={samplingRate} range={SAMPLING_RATE} unit="Hz" spokenUnit="hertz" onChange={setSamplingRate} />
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
