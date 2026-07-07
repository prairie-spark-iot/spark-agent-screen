import { describe, it, expect } from 'vitest';
import { isNewerAlert, mergeIncomingAlert } from '@/src/lib/ws/merge';
import { Alert } from '@/src/types';

function baseAlert(overrides: Partial<Alert> = {}): Alert {
  return {
    id: '100',
    time: '09:14:20',
    timestamp: '2026-07-06T09:14:20',
    device: 'DK_TEST_001',
    metric: 'temperature',
    triggerValue: '245.2',
    threshold: '> 240',
    severity: 'Critical',
    status: 'Pending',
    ...overrides,
  };
}

describe('isNewerAlert', () => {
  it('accepts when there is no cached alert yet', () => {
    expect(isNewerAlert(baseAlert(), undefined)).toBe(true);
  });

  it('accepts when either side lacks updateTime', () => {
    const incoming = baseAlert({ updateTime: undefined });
    const cached = baseAlert({ updateTime: '2026-07-06T10:00:00' });
    expect(isNewerAlert(incoming, cached)).toBe(true);
  });

  it('rejects a strictly older updateTime', () => {
    const incoming = baseAlert({ updateTime: '2026-07-06T09:00:00' });
    const cached = baseAlert({ updateTime: '2026-07-06T10:00:00' });
    expect(isNewerAlert(incoming, cached)).toBe(false);
  });

  it('accepts an equal or newer updateTime', () => {
    const incoming = baseAlert({ updateTime: '2026-07-06T10:00:00' });
    const cached = baseAlert({ updateTime: '2026-07-06T10:00:00' });
    expect(isNewerAlert(incoming, cached)).toBe(true);
  });
});

describe('mergeIncomingAlert', () => {
  it('prepends a brand new alert', () => {
    const existing = [baseAlert({ id: '1' })];
    const incoming = baseAlert({ id: '2' });

    const result = mergeIncomingAlert(existing, incoming);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('2');
  });

  it('replaces the cached alert in place when the incoming one is newer', () => {
    const cached = baseAlert({ id: '1', status: 'Diagnosing', updateTime: '2026-07-06T09:00:00' });
    const incoming = baseAlert({ id: '1', status: 'Diagnosed', updateTime: '2026-07-06T09:05:00' });

    const result = mergeIncomingAlert([cached], incoming);

    expect(result[0].status).toBe('Diagnosed');
  });

  it('the race this was built for: a stale "Diagnosing" push arriving after "Diagnosed" is discarded, no rerender', () => {
    const cached = [baseAlert({ id: '1', status: 'Diagnosed', updateTime: '2026-07-06T09:05:00' })];
    const stale = baseAlert({ id: '1', status: 'Diagnosing', updateTime: '2026-07-06T09:00:00' });

    const result = mergeIncomingAlert(cached, stale);

    expect(result).toBe(cached);
    expect(result[0].status).toBe('Diagnosed');
  });
});
