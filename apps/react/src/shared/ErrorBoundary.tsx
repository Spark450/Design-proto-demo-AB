/* Catches anything a page throws while it draws, and shows an error page
 * instead of a blank screen. Half-finished pages are normal in a prototype, and
 * a blank screen in the middle of a demo tells nobody what happened. The message
 * is shown so you can tell the AI exactly what broke.
 */

import { ReactNode, useCallback } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { GoabButton, GoabText } from "@abgov/react-components";
import { ErrorLayout } from "./ErrorLayout";

interface ErrorBoundaryProps {
  children: ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const handleError = useCallback((error: Error, info: { componentStack?: string | null }) => {
    console.error("ErrorBoundary caught an error:", error, info);
  }, []);

  return (
    <ReactErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorLayout
          icon="warning"
          label="Prototype error"
          heading="Something went wrong"
          description="This page stopped working. Try again. If it keeps happening, copy the message below and share it."
          action={
            <>
              {error && (
                <div className="error-page-description">
                  <GoabText size="body-xs" mt="m" mb="none" color="secondary">
                    {error.message}
                  </GoabText>
                </div>
              )}
              <GoabButton type="primary" size="compact" mt="xl" onClick={() => resetErrorBoundary()}>
                Try again
              </GoabButton>
            </>
          }
        />
      )}
      onError={handleError}
    >
      {children}
    </ReactErrorBoundary>
  );
}
