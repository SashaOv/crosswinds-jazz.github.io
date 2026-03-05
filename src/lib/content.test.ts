import { describe, it, expect } from 'vitest';
import { getHomeContent, getTheBandContent } from './content';
import type { ContentDocument } from '../types/content';

function assertContentDocument(doc: ContentDocument) {
  expect(doc).toBeDefined();
  expect(typeof doc.title).toBe('string');
  expect(Array.isArray(doc.content)).toBe(true);
  for (const item of doc.content) {
    expect(typeof item.photo).toBe('string');
    if (item.title) expect(typeof item.title).toBe('string');
    if (item.text) expect(typeof item.text).toBe('string');
    if (item.audio) {
      expect(Array.isArray(item.audio)).toBe(true);
      for (const track of item.audio) {
        expect(typeof track.source).toBe('string');
        if (track.title) expect(typeof track.title).toBe('string');
      }
    }
  }
}

describe('content loader', () => {
  it('getHomeContent returns a valid ContentDocument', () => {
    const home = getHomeContent();
    assertContentDocument(home);
    expect(home.content.length).toBeGreaterThan(0);
  });

  it('getTheBandContent returns a valid ContentDocument with hero', () => {
    const band = getTheBandContent();
    assertContentDocument(band);
    expect(typeof band.hero).toBe('string');
    expect(band.content.length).toBeGreaterThan(0);
  });

  it('home content items have photos', () => {
    const home = getHomeContent();
    for (const item of home.content) {
      expect(item.photo).toBeTruthy();
    }
  });

  it('band content items each have a title (member heading)', () => {
    const band = getTheBandContent();
    for (const item of band.content) {
      expect(item.title).toBeTruthy();
    }
  });
});
