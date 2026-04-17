'use client';

import * as React from 'react';

export interface UseCopyToClipboardResult {
  /** The most recently copied value, or `null` before any copy. */
  readonly copiedValue: string | null;
  /** Whether the last copy happened within the reset window. */
  readonly isCopied: boolean;
  /** Copy `text` to the clipboard. Returns `true` on success. */
  readonly copy: (text: string) => Promise<boolean>;
}

/**
 * Copy text to the clipboard. `isCopied` is `true` for `resetMs`
 * milliseconds after a successful copy (default 2000 ms).
 *
 * ```ts
 * const { isCopied, copy } = useCopyToClipboard();
 * <button onClick={() => copy(url)}>{isCopied ? 'Copied!' : 'Copy'}</button>
 * ```
 */
export function useCopyToClipboard(resetMs = 2000): UseCopyToClipboardResult {
  const [copiedValue, setCopiedValue] = React.useState<string | null>(null);
  const [isCopied, setIsCopied] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  const copy = React.useCallback(
    async (text: string): Promise<boolean> => {
      if (!navigator?.clipboard) return false;
      try {
        await navigator.clipboard.writeText(text);
        setCopiedValue(text);
        setIsCopied(true);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setIsCopied(false), resetMs);
        return true;
      } catch {
        return false;
      }
    },
    [resetMs],
  );

  React.useEffect(() => () => clearTimeout(timerRef.current), []);

  return { copiedValue, isCopied, copy };
}
