'use client';

import * as React from 'react';

import { ErrorState } from '@/layout/status-states';

export interface ErrorBoundaryFallbackProps {
  readonly error: Error;
  readonly reset: () => void;
}

export interface ErrorBoundaryProps {
  readonly children: React.ReactNode;
  /**
   * Custom fallback UI. Receives the caught `error` and a `reset` callback
   * that clears the error state and re-renders children.
   * Defaults to `<ErrorState>` from the layout primitives.
   */
  readonly fallback?: (props: ErrorBoundaryFallbackProps) => React.ReactNode;
  /** Called after an error is caught — useful for logging. */
  readonly onError?: (error: Error, info: React.ErrorInfo) => void;
}

interface State {
  error: Error | null;
}

/**
 * Class-based error boundary (React requires class components for
 * `componentDidCatch`). Wraps the default `ErrorState` fallback from
 * the layout primitives — override with the `fallback` prop.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.props.onError?.(error, info);
  }

  reset = () => this.setState({ error: null });

  override render() {
    if (this.state.error) {
      const { fallback } = this.props;
      if (fallback) return fallback({ error: this.state.error, reset: this.reset });
      return (
        <ErrorState
          title="Something went wrong"
          description={this.state.error.message}
          action={
            <button type="button" onClick={this.reset}>
              Try again
            </button>
          }
        />
      );
    }
    return this.props.children;
  }
}
