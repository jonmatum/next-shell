import * as React from 'react';
import { AlertTriangle, Ban, Lock, Search, ServerCrash, ShieldX } from 'lucide-react';

import { cn } from '@/core/cn';

/* ────────────────────────────────────────────────────────────────────────
 * ErrorPage — full-page HTTP error surface with glass-card layout.
 * ──────────────────────────────────────────────────────────────────────── */

export interface ErrorPageProps extends React.ComponentProps<'div'> {
  /** HTTP status code displayed prominently in terminal font. */
  readonly statusCode: number;
  /** Short subtitle below the status code. */
  readonly title: string;
  /** Explanatory text below the title. */
  readonly description?: string;
  /** Icon rendered above the status code. */
  readonly icon?: React.ReactNode;
  /** Action slot (e.g. "Go home" button or button group). */
  readonly action?: React.ReactNode;
}

function ErrorPage({
  className,
  statusCode,
  title,
  description,
  icon,
  action,
  children,
  ...props
}: ErrorPageProps) {
  return (
    <div
      data-slot="error-page"
      role="alert"
      className={cn(
        'bg-background text-foreground flex min-h-svh items-center justify-center p-4 sm:p-6',
        className,
      )}
      {...props}
    >
      <div
        data-slot="error-page-card"
        className="border-border bg-card text-card-foreground max-w-lg rounded-3xl border p-6 text-center shadow-lg sm:p-12"
      >
        {icon !== undefined && icon !== null ? (
          <div
            data-slot="error-page-icon"
            className="text-muted-foreground mb-6 flex justify-center [&>svg]:size-12 [&>svg]:opacity-60 sm:[&>svg]:size-16"
          >
            {icon}
          </div>
        ) : null}
        <h1
          data-slot="error-page-code"
          className="text-foreground text-6xl font-bold sm:text-8xl"
          style={{ fontFamily: 'var(--font-terminal, "BigBlue Terminal", monospace)' }}
        >
          {statusCode}
        </h1>
        <p data-slot="error-page-title" className="text-muted-foreground mt-4 text-lg">
          {title}
        </p>
        {description !== undefined && description !== null ? (
          <p data-slot="error-page-description" className="text-muted-foreground mt-2 text-sm">
            {description}
          </p>
        ) : null}
        {action !== undefined && action !== null ? (
          <div
            data-slot="error-page-action"
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            {action}
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Pre-configured error pages for common HTTP status codes.
 * ──────────────────────────────────────────────────────────────────────── */

export type HttpErrorPageProps = Omit<ErrorPageProps, 'statusCode' | 'title'> & {
  readonly title?: string;
};

function BadRequest({ title = 'Bad Request', icon, ...props }: HttpErrorPageProps) {
  return (
    <ErrorPage
      statusCode={400}
      title={title}
      icon={icon ?? <AlertTriangle aria-hidden />}
      {...props}
    />
  );
}

function Unauthorized({ title = 'Unauthorized', icon, ...props }: HttpErrorPageProps) {
  return (
    <ErrorPage statusCode={401} title={title} icon={icon ?? <Lock aria-hidden />} {...props} />
  );
}

function Forbidden({ title = 'Forbidden', icon, ...props }: HttpErrorPageProps) {
  return (
    <ErrorPage statusCode={403} title={title} icon={icon ?? <ShieldX aria-hidden />} {...props} />
  );
}

function NotFound({ title = 'Not Found', icon, ...props }: HttpErrorPageProps) {
  return (
    <ErrorPage statusCode={404} title={title} icon={icon ?? <Search aria-hidden />} {...props} />
  );
}

function InternalServerError({
  title = 'Internal Server Error',
  icon,
  ...props
}: HttpErrorPageProps) {
  return (
    <ErrorPage
      statusCode={500}
      title={title}
      icon={icon ?? <ServerCrash aria-hidden />}
      {...props}
    />
  );
}

function ServiceUnavailable({ title = 'Service Unavailable', icon, ...props }: HttpErrorPageProps) {
  return <ErrorPage statusCode={503} title={title} icon={icon ?? <Ban aria-hidden />} {...props} />;
}

export {
  ErrorPage,
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  InternalServerError,
  ServiceUnavailable,
};
