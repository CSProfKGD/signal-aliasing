import assert from 'node:assert/strict';
import test from 'node:test';
import { aliasFrequency, FREQUENCY, pointAt, samples, SAMPLING_RATE, signalAt, signalPath } from '../src/signal.ts';

test('every slider combination produces an in-band alias that agrees at every visible sample', () => {
  let worstError = 0;
  for (let f = FREQUENCY.min * 10; f <= FREQUENCY.max * 10; f++) {
    for (let s = SAMPLING_RATE.min * 10; s <= SAMPLING_RATE.max * 10; s++) {
      const frequency = f / 10;
      const samplingRate = s / 10;
      const alias = aliasFrequency(frequency, samplingRate);
      assert.ok(Math.abs(alias) <= samplingRate / 2 + 1e-12);
      for (const sample of samples(frequency, samplingRate)) {
        const error = Math.abs(sample.value - signalAt(alias, sample.time));
        worstError = Math.max(worstError, error);
        assert.ok(error < 1e-10, `${frequency} Hz / ${samplingRate} samples/s at ${sample.time}: ${error}`);
      }
    }
  }
  console.log(`Worst sample mismatch across all 33,756 slider combinations: ${worstError}`);
});

test('default undersampling produces a 1 Hz reconstruction', () => {
  assert.equal(aliasFrequency(4, 3), 1);
  assert.equal(samples(4, 3).length, 7);
  assert.ok(Math.abs(signalAt(4, 1 / 6) - signalAt(1, 1 / 6)) > 0.9);
});

test('oversampling coincides everywhere, including between sample positions', () => {
  for (const time of [-1, -0.731, 0, 0.128, 1]) {
    assert.equal(signalAt(4, time), signalAt(aliasFrequency(4, 9), time));
  }
});

test('Nyquist and multiple Nyquist folds preserve the cosine samples', () => {
  assert.equal(aliasFrequency(4, 8), -4);
  assert.equal(aliasFrequency(12, 8), -4);
  for (const time of [-1, -0.731, 0, 0.128, 1]) {
    assert.equal(signalAt(4, time), signalAt(-4, time));
  }
  assert.ok(aliasFrequency(4.1, 8) < 0);
  assert.ok(aliasFrequency(3.9, 8) > 0);
});

test('integer sampling-rate multiples alias to a constant, without invented motion', () => {
  for (const frequency of [3, 6, 9, 12]) {
    assert.equal(aliasFrequency(frequency, 3), 0);
    assert.equal(signalAt(aliasFrequency(frequency, 3), 0.217), 1);
    for (const sample of samples(frequency, 3)) assert.ok(Math.abs(sample.value - 1) < 1e-10);
  }
});

test('fractional sampling rates use exact integer indices and keep samples in the window', () => {
  const points = samples(7.3, 4.7);
  assert.deepEqual(points.map((point) => point.index), [-4, -3, -2, -1, 0, 1, 2, 3, 4]);
  for (const point of points) {
    assert.equal(point.time, point.index / 4.7);
    assert.ok(point.time >= -1 && point.time <= 1);
  }
});

test('responsive geometry keeps amplitude and time mapping unchanged at the edges', () => {
  for (const width of [320, 390, 1440, 2560]) {
    const height = 400;
    assert.deepEqual(pointAt(-1, 1, width, height), { x: 0, y: 56 });
    assert.deepEqual(pointAt(1, 1, width, height), { x: width, y: 56 });
    assert.deepEqual(pointAt(0, -1, width, height), { x: width / 2, y: 344 });
    const path = signalPath(12, width, height);
    assert.ok(!/NaN|Infinity/.test(path));
    assert.ok(path.split(' ').length >= 12 * 2 * 64 + 1);
  }
});
