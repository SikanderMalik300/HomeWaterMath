import { describe, it, expect, vi, afterEach } from 'vitest';
import { track } from './analytics';

afterEach(() => {
  // Clean up any window we define on the node global.
  delete (globalThis as { window?: unknown }).window;
});

describe('track', () => {
  it('is a no-op (no throw) when there is no window', () => {
    expect(typeof (globalThis as { window?: unknown }).window).toBe('undefined');
    expect(() => track('tool_used', { tool: '/x/' })).not.toThrow();
  });

  it('is a no-op when window exists but gtag is missing', () => {
    (globalThis as { window?: unknown }).window = {};
    expect(() => track('tool_used', { tool: '/x/' })).not.toThrow();
  });

  it('calls gtag with event name and params when gtag is present', () => {
    const gtag = vi.fn();
    (globalThis as { window?: unknown }).window = { gtag };
    track('tool_used', { tool: '/water-softener-size-calculator/' });
    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledWith('event', 'tool_used', {
      tool: '/water-softener-size-calculator/',
    });
  });

  it('defaults params to an empty object', () => {
    const gtag = vi.fn();
    (globalThis as { window?: unknown }).window = { gtag };
    track('copy_result');
    expect(gtag).toHaveBeenCalledWith('event', 'copy_result', {});
  });
});
