import { describe, expect, it } from 'vitest';
import { hexToOklch } from '../src/tokens/index.js';

describe('hexToOklch', () => {
  describe('6-digit hex', () => {
    it('converts #10b981 (with hash)', () => {
      expect(hexToOklch('#10b981')).toBe('oklch(0.696 0.149 162.5)');
    });

    it('converts 10b981 (without hash)', () => {
      expect(hexToOklch('10b981')).toBe('oklch(0.696 0.149 162.5)');
    });
  });

  describe('3-digit hex', () => {
    it('converts #fff to white', () => {
      const result = hexToOklch('#fff');
      expect(result).toBe('oklch(1.000 0.000 0.0)');
    });

    it('converts #000 to black', () => {
      const result = hexToOklch('#000');
      expect(result).toBe('oklch(0.000 0.000 0.0)');
    });
  });

  describe('primary colors — hue ranges', () => {
    it('pure red (#ff0000) has hue in 20-40 range', () => {
      const result = hexToOklch('#ff0000');
      const match = result.match(/oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)/);
      expect(match).not.toBeNull();
      const h = parseFloat(match![3]!);
      expect(h).toBeGreaterThanOrEqual(20);
      expect(h).toBeLessThanOrEqual(40);
    });

    it('pure green (#00ff00) has hue in 130-155 range', () => {
      const result = hexToOklch('#00ff00');
      const match = result.match(/oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)/);
      expect(match).not.toBeNull();
      const h = parseFloat(match![3]!);
      expect(h).toBeGreaterThanOrEqual(130);
      expect(h).toBeLessThanOrEqual(155);
    });

    it('pure blue (#0000ff) has hue in 260-270 range', () => {
      const result = hexToOklch('#0000ff');
      const match = result.match(/oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)/);
      expect(match).not.toBeNull();
      const h = parseFloat(match![3]!);
      expect(h).toBeGreaterThanOrEqual(260);
      expect(h).toBeLessThanOrEqual(270);
    });
  });

  describe('achromatic extremes', () => {
    it('black (#000000) has L=0', () => {
      const result = hexToOklch('#000000');
      expect(result).toMatch(/^oklch\(0\.000 /);
    });

    it('white (#ffffff) has L close to 1', () => {
      const result = hexToOklch('#ffffff');
      expect(result).toMatch(/^oklch\(1\.000 /);
    });

    it('achromatic colors have C=0 and H=0', () => {
      const black = hexToOklch('#000000');
      expect(black).toBe('oklch(0.000 0.000 0.0)');

      // White is also achromatic
      const white = hexToOklch('#ffffff');
      expect(white).toBe('oklch(1.000 0.000 0.0)');
    });
  });

  describe('invalid input', () => {
    it('throws on empty string', () => {
      expect(() => hexToOklch('')).toThrow('invalid hex color');
    });

    it('throws on too-short input', () => {
      expect(() => hexToOklch('#ab')).toThrow('invalid hex color');
    });

    it('throws on too-long input', () => {
      expect(() => hexToOklch('#1234567')).toThrow('invalid hex color');
    });

    it('throws on non-hex characters', () => {
      expect(() => hexToOklch('#gggggg')).toThrow('invalid hex color');
    });

    it('throws on 4-digit hex', () => {
      expect(() => hexToOklch('#abcd')).toThrow('invalid hex color');
    });
  });
});
