'use client';

import { Collapsible as CollapsiblePrimitive } from 'radix-ui';

/** Accessible collapsible component built on Radix UI. @see https://ui.shadcn.com/docs/components/collapsible */
function Collapsible({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

/** Accessible collapsible trigger built on Radix UI. @see https://ui.shadcn.com/docs/components/collapsible */
function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return <CollapsiblePrimitive.CollapsibleTrigger data-slot="collapsible-trigger" {...props} />;
}

/** Accessible collapsible content panel built on Radix UI. @see https://ui.shadcn.com/docs/components/collapsible */
function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return <CollapsiblePrimitive.CollapsibleContent data-slot="collapsible-content" {...props} />;
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
