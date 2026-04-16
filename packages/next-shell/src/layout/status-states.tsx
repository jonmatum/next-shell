import * as React from 'react';
import { AlertTriangle, Inbox, Loader2 } from 'lucide-react';

import { cn } from '@/core/cn';

/**
 * Shared primitive for the three status surfaces (Empty / Error / Loading).
 * Not exported directly — consumers use the tone-specific wrappers below.
 */
interface StatusSurfaceProps extends Omit<React.ComponentProps<'div'>, 'title' | 'role'> {
  readonly dataSlot: string;
  readonly icon?: React.ReactNode;
  readonly title?: React.ReactNode;
  readonly description?: React.ReactNode;
  readonly action?: React.ReactNode;
  readonly iconClassName?: string;
}

function StatusSurface({
  className,
  dataSlot,
  icon,
  title,
  description,
  action,
  iconClassName,
  children,
  ...props
}: StatusSurfaceProps) {
  return (
    <div
      data-slot={dataSlot}
      role={dataSlot === 'error-state' ? 'alert' : 'status'}
      className={cn(
        'border-border bg-card text-card-foreground flex flex-col items-center justify-center gap-4 rounded-lg border p-8 text-center sm:p-12',
        className,
      )}
      {...props}
    >
      {icon !== undefined && icon !== null ? (
        <div
          data-slot={`${dataSlot}-icon`}
          className={cn(
            'text-muted-foreground flex size-12 items-center justify-center [&>svg]:size-6',
            iconClassName,
          )}
        >
          {icon}
        </div>
      ) : null}
      {title !== undefined && title !== null ? (
        <div data-slot={`${dataSlot}-title`} className="text-foreground text-lg font-semibold">
          {title}
        </div>
      ) : null}
      {description !== undefined && description !== null ? (
        <p data-slot={`${dataSlot}-description`} className="text-muted-foreground max-w-sm text-sm">
          {description}
        </p>
      ) : null}
      {action !== undefined && action !== null ? (
        <div data-slot={`${dataSlot}-action`} className="mt-2 flex flex-wrap gap-2">
          {action}
        </div>
      ) : null}
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * EmptyState — neutral surface, for "no results" / "nothing here yet".
 * ──────────────────────────────────────────────────────────────────────── */

export type EmptyStateProps = Omit<StatusSurfaceProps, 'dataSlot'>;

function EmptyState({ icon, ...props }: EmptyStateProps) {
  return <StatusSurface dataSlot="empty-state" icon={icon ?? <Inbox aria-hidden />} {...props} />;
}

/* ────────────────────────────────────────────────────────────────────────
 * ErrorState — destructive-tinted, for recoverable runtime errors.
 * ──────────────────────────────────────────────────────────────────────── */

export type ErrorStateProps = Omit<StatusSurfaceProps, 'dataSlot'>;

function ErrorState({ icon, iconClassName, ...props }: ErrorStateProps) {
  return (
    <StatusSurface
      dataSlot="error-state"
      icon={icon ?? <AlertTriangle aria-hidden />}
      iconClassName={cn('text-destructive', iconClassName)}
      {...props}
    />
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * LoadingState — animated spinner; content is secondary.
 * ──────────────────────────────────────────────────────────────────────── */

export type LoadingStateProps = Omit<StatusSurfaceProps, 'dataSlot'>;

function LoadingState({ icon, iconClassName, ...props }: LoadingStateProps) {
  return (
    <StatusSurface
      dataSlot="loading-state"
      icon={icon ?? <Loader2 aria-hidden className="animate-spin" />}
      iconClassName={cn('text-muted-foreground', iconClassName)}
      {...props}
    />
  );
}

export { EmptyState, ErrorState, LoadingState };
