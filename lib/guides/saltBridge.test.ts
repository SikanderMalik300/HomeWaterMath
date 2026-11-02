import { describe, it, expect } from 'vitest';
import { saltBridge } from './saltBridge';

const no = { q1: false, q2: false, q3: false, q4: false };

describe('saltBridge', () => {
  it('all no: no sign of a bridge', () => {
    const r = saltBridge(no);
    expect(r.key).toBe('none');
    expect(r.message).toBe('No sign of a bridge. Check again in a month.');
  });

  it('sludge at the bottom wins: salt mush', () => {
    expect(saltBridge({ ...no, q4: true, q3: true }).key).toBe('mush');
  });

  it('hard layer with space below: salt bridge', () => {
    expect(saltBridge({ ...no, q3: true }).key).toBe('bridge');
  });

  it('level stuck and water hard: probably a salt bridge', () => {
    const r = saltBridge({ ...no, q1: true, q2: true });
    expect(r.key).toBe('probablyBridge');
    expect(r.message).toContain('broom handle check');
  });

  it('only hard water: probably not a salt problem', () => {
    const r = saltBridge({ ...no, q2: true });
    expect(r.key).toBe('notSalt');
    expect(r.message).toContain('why softeners stop working');
  });

  it('only level stuck: treated as no clear sign', () => {
    expect(saltBridge({ ...no, q1: true }).key).toBe('none');
  });
});
