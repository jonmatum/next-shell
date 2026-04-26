/**
 * hexToOklch — convert a hex color string to an OKLCH CSS value.
 *
 * Pipeline: sRGB hex → linear RGB → CIE XYZ (D65) → OKLab → OKLCH
 *
 * Returns a string like `oklch(0.627 0.194 163.1)` with L rounded to 3
 * decimals, C to 3 decimals, and H to 1 decimal. When chroma is near zero
 * (achromatic), hue is reported as 0.
 */

/* ────────────────────────────────────────────────────────────────────────
 * Step 1 — Parse hex
 * ──────────────────────────────────────────────────────────────────────── */

function parseHex(hex: string): [r: number, g: number, b: number] {
  let h = hex.startsWith('#') ? hex.slice(1) : hex;

  if (h.length === 3) {
    h = h[0]! + h[0]! + h[1]! + h[1]! + h[2]! + h[2]!;
  }

  if (h.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(h)) {
    throw new Error(`hexToOklch: invalid hex color "${hex}"`);
  }

  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

/* ────────────────────────────────────────────────────────────────────────
 * Step 2 — sRGB → linear RGB
 * ──────────────────────────────────────────────────────────────────────── */

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/* ────────────────────────────────────────────────────────────────────────
 * Step 3 — linear RGB → CIE XYZ (D65)
 *
 * Using the standard sRGB-to-XYZ matrix (IEC 61966-2-1).
 * ──────────────────────────────────────────────────────────────────────── */

function linearRgbToXyz(r: number, g: number, b: number): [x: number, y: number, z: number] {
  return [
    0.4123907992659595 * r + 0.357584339383878 * g + 0.1804807884018343 * b,
    0.21263900587151027 * r + 0.715168678767756 * g + 0.07219231536073371 * b,
    0.01933081871559182 * r + 0.11919477979462598 * g + 0.9505321522496607 * b,
  ];
}

/* ────────────────────────────────────────────────────────────────────────
 * Step 4 — XYZ → OKLab
 *
 * Uses the Björn Ottosson matrices (2020).
 * XYZ → LMS (M1) → cube-root → OKLab (M2)
 * ──────────────────────────────────────────────────────────────────────── */

function xyzToOklab(x: number, y: number, z: number): [L: number, a: number, b: number] {
  // M1: XYZ → approximate cone responses (LMS)
  const l = 0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z;
  const m = 0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z;
  const s = 0.0482003018 * x + 0.2643662691 * y + 0.633851707 * z;

  // Cube root
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  // M2: LMS cube-root → OKLab
  return [
    0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  ];
}

/* ────────────────────────────────────────────────────────────────────────
 * Step 5 — OKLab → OKLCH
 * ──────────────────────────────────────────────────────────────────────── */

function oklabToOklch(L: number, a: number, b: number): [L: number, C: number, H: number] {
  const C = Math.sqrt(a * a + b * b);
  let H = (Math.atan2(b, a) * 180) / Math.PI;
  if (H < 0) H += 360;

  // When chroma rounds to "0.000" at 3 decimal places the hue is meaningless
  if (C < 0.0005) {
    return [L, 0, 0];
  }

  return [L, C, H];
}

/* ────────────────────────────────────────────────────────────────────────
 * Public API
 * ──────────────────────────────────────────────────────────────────────── */

/**
 * Convert a hex color string to an OKLCH CSS function value.
 *
 * @param hex - A 3- or 6-digit hex string, with or without leading `#`.
 * @returns A string like `oklch(0.627 0.194 163.1)`.
 * @throws If the input is not a valid hex color.
 *
 * @example
 * ```ts
 * hexToOklch('#10b981'); // → "oklch(0.696 0.174 162.5)"
 * hexToOklch('fff');     // → "oklch(1.000 0.000 0.0)"
 * ```
 */
export function hexToOklch(hex: string): string {
  const [r, g, b] = parseHex(hex);

  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);

  const [x, y, z] = linearRgbToXyz(lr, lg, lb);
  const [labL, labA, labB] = xyzToOklab(x, y, z);
  const [L, C, H] = oklabToOklch(labL, labA, labB);

  return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(1)})`;
}
