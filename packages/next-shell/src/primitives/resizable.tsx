'use client';

import { GripVerticalIcon } from 'lucide-react';
import * as ResizablePrimitive from 'react-resizable-panels';

import { cn } from '@/core/cn';

// react-resizable-panels v3 exports `PanelGroup` / `PanelResizeHandle`
// as named exports (not `.Group` / `.Separator` on the namespace). The
// shadcn upstream source uses the namespace-member style expected by
// their internal wrapper; we access the real export names directly.

/** Accessible resizable panel group container. @see https://ui.shadcn.com/docs/components/resizable */
function ResizablePanelGroup({ className, ...props }: ResizablePrimitive.PanelGroupProps) {
  return (
    <ResizablePrimitive.PanelGroup
      data-slot="resizable-panel-group"
      className={cn('flex h-full w-full aria-[orientation=vertical]:flex-col', className)}
      {...props}
    />
  );
}

/** Accessible resizable panel component. @see https://ui.shadcn.com/docs/components/resizable */
function ResizablePanel({ ...props }: ResizablePrimitive.PanelProps) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

/** Accessible resizable panel drag handle. @see https://ui.shadcn.com/docs/components/resizable */
function ResizableHandle({
  withHandle,
  className,
  ...props
}: ResizablePrimitive.PanelResizeHandleProps & {
  withHandle?: boolean;
}) {
  return (
    <ResizablePrimitive.PanelResizeHandle
      data-slot="resizable-handle"
      className={cn(
        'bg-border focus-visible:ring-ring focus-visible:outline-hidden relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-offset-1 aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:-translate-y-1/2 aria-[orientation=horizontal]:after:translate-x-0 [&[aria-orientation=horizontal]>div]:rotate-90',
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className="rounded-xs bg-border z-10 flex h-4 w-3 items-center justify-center border">
          <GripVerticalIcon className="size-2.5" />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  );
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
