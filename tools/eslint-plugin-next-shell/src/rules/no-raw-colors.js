/**
 * @fileoverview Disallow raw color values in source code.
 *
 * The next-shell package enforces a semantic-token-only design system. Every
 * color must come from a semantic token (e.g. `bg-background`, `text-foreground`,
 * `border-border`) — never from a hex literal, a raw CSS color function, or a
 * Tailwind palette utility like `bg-slate-500`.
 *
 * This rule flags:
 *   1. Hex literals in strings / template literals: `#abc`, `#abcdef`, `#abcdef12`
 *   2. Raw CSS color functions: `rgb()`, `rgba()`, `hsl()`, `hsla()`, `oklch()`,
 *      `oklab()`, `color()`, `color-mix()`
 *   3. Tailwind color-palette utility classes: `bg-red-500`, `text-slate-700`,
 *      `border-blue-400`, and also raw `bg-white` / `bg-black`.
 *
 * Token definition files (matched by path) are automatically allowed so the
 * tokens themselves can reference real colors.
 */

const TAILWIND_COLOR_PROPS = [
  'bg',
  'text',
  'border',
  'ring',
  'divide',
  'placeholder',
  'accent',
  'caret',
  'fill',
  'stroke',
  'from',
  'via',
  'to',
  'outline',
  'decoration',
  'shadow',
].join('|');

const TAILWIND_PALETTE = [
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
].join('|');

// e.g. "bg-slate-500", "text-red-50", "border-emerald-950/50"
const TAILWIND_PALETTE_REGEX = new RegExp(
  `\\b(?:${TAILWIND_COLOR_PROPS})-(?:${TAILWIND_PALETTE})-(?:50|100|200|300|400|500|600|700|800|900|950)(?:/\\d+)?\\b`,
);

// e.g. "bg-white", "text-black"
const TAILWIND_BW_REGEX = new RegExp(`\\b(?:${TAILWIND_COLOR_PROPS})-(?:white|black)(?:/\\d+)?\\b`);

// e.g. "#fff", "#abcdef", "#abcdef12"
const HEX_REGEX = /#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/;

// e.g. "rgb(12, 34, 56)", "rgba(...)", "hsl(...)", "oklch(...)"
const CSS_FN_REGEX = /\b(?:rgb|rgba|hsl|hsla|oklch|oklab|color|color-mix)\s*\(/;

const DEFAULT_ALLOW_PATHS = [
  // Token definition files — tokens must define real colors.
  /\/tokens\//,
  /tokens\.css$/,
  /tokens\.ts$/,
  /tokens\.js$/,
  /\/styles\/tokens/,
  // Tailwind preset where we map theme tokens to CSS vars.
  /tailwind-preset/,
];

function isAllowedFile(filename, allowPaths) {
  return allowPaths.some((pattern) => pattern.test(filename));
}

function checkString(value) {
  if (typeof value !== 'string' || value.length === 0) {
    return null;
  }
  if (HEX_REGEX.test(value)) return 'hex literal';
  if (CSS_FN_REGEX.test(value)) return 'CSS color function';
  if (TAILWIND_PALETTE_REGEX.test(value)) return 'Tailwind palette utility';
  if (TAILWIND_BW_REGEX.test(value)) return 'Tailwind black/white utility';
  return null;
}

const rule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow raw color values (hex, CSS color functions, Tailwind palette utilities). Use semantic tokens instead.',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          allow: {
            type: 'array',
            items: { type: 'string' },
            default: [],
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      rawColor:
        'Raw color detected ({{kind}}): "{{match}}". Use a semantic token from @jonmatum/next-shell/tokens instead (e.g. bg-background, text-foreground, border-border).',
    },
  },

  create(context) {
    const options = context.options[0] ?? {};
    const userAllow = (options.allow ?? []).map((s) => new RegExp(s));
    const allowPaths = [...DEFAULT_ALLOW_PATHS, ...userAllow];

    if (isAllowedFile(context.filename ?? '', allowPaths)) {
      return {};
    }

    function report(node, value) {
      const kind = checkString(value);
      if (!kind) return;
      const match =
        value.match(HEX_REGEX)?.[0] ??
        value.match(CSS_FN_REGEX)?.[0] ??
        value.match(TAILWIND_PALETTE_REGEX)?.[0] ??
        value.match(TAILWIND_BW_REGEX)?.[0] ??
        value.slice(0, 40);
      context.report({
        node,
        messageId: 'rawColor',
        data: { kind, match },
      });
    }

    return {
      Literal(node) {
        if (typeof node.value === 'string') {
          report(node, node.value);
        }
      },
      TemplateElement(node) {
        report(node, node.value?.cooked ?? node.value?.raw ?? '');
      },
    };
  },
};

export default rule;
