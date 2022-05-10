import { Temporal } from '@js-temporal/polyfill';

import { formatDuration } from './format-duration';

describe('format-duration', () => {
  it('second', () => {
    const dateString = '2020-01-01T00:00:00.000Z';
    const date = Temporal.Instant.from(dateString);
    const now = date.add({ seconds: 2 });
    expect(formatDuration(dateString, now)).toBe('2秒前');
  });
  it('minute', () => {
    const dateString = '2020-01-01T00:00:00.000Z';
    const date = Temporal.Instant.from(dateString);
    const now = date.add({ minutes: 2 });
    expect(formatDuration(dateString, now)).toBe('2分前');
  });
  it('hour', () => {
    const dateString = '2020-01-01T00:00:00.000Z';
    const date = Temporal.Instant.from(dateString);
    const now = date.add({ hours: 2 });
    expect(formatDuration(dateString, now)).toBe('2時間前');
  });
  it('day', () => {
    const dateString = '2020-01-01T00:00:00.000Z';
    const date = Temporal.Instant.from(dateString);
    const now = date.add({ hours: 48 });
    expect(formatDuration(dateString, now)).toBe('2日前');
  });
  it('other', () => {
    const dateString = '2020-01-01T00:00:00.000Z';
    const date = Temporal.Instant.from(dateString);
    const now = date.add({ hours: 480 });
    expect(formatDuration(dateString, now)).toBe('2020/01/01 09:00');
  });
});
