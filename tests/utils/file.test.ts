import { describe, it, expect, vi } from 'vitest';
import { readFileAsJSON, downloadJSON } from '../../src/utils/file.js';

describe('readFileAsJSON', () => {
  it('parses valid JSON from a File', async () => {
    const file = new File(['{"hello":"world","n":42}'], 'test.json', { type: 'application/json' });
    const result = await readFileAsJSON<{ hello: string; n: number }>(file);
    expect(result).toEqual({ hello: 'world', n: 42 });
  });

  it('rejects on invalid JSON', async () => {
    const file = new File(['not json at all'], 'bad.json', { type: 'application/json' });
    await expect(readFileAsJSON(file)).rejects.toThrow(/Failed to parse JSON/);
  });

  it('parses an empty array', async () => {
    const file = new File(['[]'], 'empty.json', { type: 'application/json' });
    await expect(readFileAsJSON(file)).resolves.toEqual([]);
  });
});

describe('downloadJSON', () => {
  it('calls URL.createObjectURL and triggers a click', () => {
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:fake');
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    const clickSpy = vi.fn();

    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = originalCreateElement(tag);
      if (tag === 'a') {
        (el as HTMLAnchorElement).click = clickSpy;
      }
      return el;
    });

    downloadJSON({ foo: 'bar' }, 'test.json');

    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(clickSpy).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledOnce();

    vi.restoreAllMocks();
  });
});
