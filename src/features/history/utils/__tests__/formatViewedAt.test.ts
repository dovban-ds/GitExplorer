import {formatViewedAt} from '../formatViewedAt';

describe('formatViewedAt', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns "Viewed recently" when viewed less than 5 minutes ago', () => {
    const now = new Date('2026-04-26T12:00:00Z').getTime();
    jest.setSystemTime(now);

    const fourMinutesAgo = now - 4 * 60 * 1000;
    expect(formatViewedAt(fourMinutesAgo)).toBe('Viewed recently');
  });

  it('returns "Viewed recently" when viewed just now', () => {
    const now = new Date('2026-04-26T12:00:00Z').getTime();
    jest.setSystemTime(now);

    expect(formatViewedAt(now)).toBe('Viewed recently');
  });

  it('returns "Viewed recently" when viewed exactly at the 5-minute boundary', () => {
    const now = new Date('2026-04-26T12:00:00Z').getTime();
    jest.setSystemTime(now);

    const exactlyFiveMinutes = now - 5 * 60 * 1000 + 1;
    expect(formatViewedAt(exactlyFiveMinutes)).toBe('Viewed recently');
  });

  it('returns a relative time string when viewed more than 5 minutes ago', () => {
    const now = new Date('2026-04-26T12:00:00Z').getTime();
    jest.setSystemTime(now);

    const tenMinutesAgo = now - 10 * 60 * 1000;
    expect(formatViewedAt(tenMinutesAgo)).toBe('Viewed 10 minutes ago');
  });

  it('returns relative time for hours ago', () => {
    const now = new Date('2026-04-26T12:00:00Z').getTime();
    jest.setSystemTime(now);

    const twoHoursAgo = now - 2 * 60 * 60 * 1000;
    expect(formatViewedAt(twoHoursAgo)).toBe('Viewed 2 hours ago');
  });

  it('returns relative time for days ago', () => {
    const now = new Date('2026-04-26T12:00:00Z').getTime();
    jest.setSystemTime(now);

    const threeDaysAgo = now - 3 * 24 * 60 * 60 * 1000;
    expect(formatViewedAt(threeDaysAgo)).toBe('Viewed 3 days ago');
  });
});
