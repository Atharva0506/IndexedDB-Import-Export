import { describe, it, expect, afterEach, vi } from 'vitest';
import { isBrowser, assertBrowser } from '../../src/utils/ssr.js';

describe('isBrowser', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns true under happy-dom (window + document present)', () => {
    expect(isBrowser()).toBe(true);
  });

  it('returns false when window is absent (SSR)', () => {
    vi.stubGlobal('window', undefined);
    expect(isBrowser()).toBe(false);
  });

  it('returns false when document is absent', () => {
    vi.stubGlobal('document', undefined);
    expect(isBrowser()).toBe(false);
  });
});

describe('assertBrowser', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('does not throw in a browser env', () => {
    expect(() => assertBrowser('testFn')).not.toThrow();
  });

  it('throws outside a browser env, naming the function', () => {
    vi.stubGlobal('window', undefined);
    expect(() => assertBrowser('downloadJSON')).toThrow(/downloadJSON is browser-only/);
  });
});
