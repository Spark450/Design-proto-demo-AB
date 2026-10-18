/* Catches anything a page throws while it draws, and shows an error page
 * instead of a blank screen. Half-finished pages are normal in a prototype, and
 * a blank screen in the middle of a demo tells nobody what happened. The message
 * is shown so you can tell the AI exactly what broke.
 *
 * Three parts: Angular hands every error to PrototypeErrorHandler (set up in
 * app.config.ts), which keeps it in ErrorBoundary; app.ts shows
 * ErrorBoundaryPage instead of the page while there is one.
 */

import { Component, ErrorHandler, Injectable, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { GoabButton, GoabText } from "@abgov/angular-components";

import { ErrorLayout } from "./error-layout";

@Injectable({ providedIn: "root" })
export class ErrorBoundary {
  readonly error = signal<Error | null>(null);
  /* Where the page that failed was going, if it broke while opening. */
  private failedUrl: string | null = null;

  catch(error: unknown, failedUrl: string | null = null) {
    this.error.set(error instanceof Error ? error : new Error(String(error)));
    this.failedUrl = failedUrl;
  }

  reset(router: Router) {
    const url = this.failedUrl;
    this.failedUrl = null;
    this.error.set(null);
    if (url) router.navigateByUrl(url);
  }
}

@Injectable()
export class PrototypeErrorHandler implements ErrorHandler {
  private readonly boundary = inject(ErrorBoundary);

  handleError(error: unknown) {
    console.error("ErrorBoundary caught an error:", error);
    this.boundary.catch(error);
  }
}

@Component({
  selector: "app-error-boundary-page",
  imports: [ErrorLayout, GoabButton, GoabText],
  template: `
    <app-error-layout
      icon="warning"
      label="Prototype error"
      heading="Something went wrong"
      description="This page stopped working. Try again. If it keeps happening, copy the message below and share it."
    >
      @if (boundary.error(); as error) {
        <div class="error-page-description">
          <goab-text size="body-xs" mt="m" mb="none" color="secondary">
            {{ error.message }}
          </goab-text>
        </div>
      }
      <goab-button type="primary" size="compact" mt="xl" (onClick)="tryAgain()">
        Try again
      </goab-button>
    </app-error-layout>
  `,
})
export class ErrorBoundaryPage {
  protected readonly boundary = inject(ErrorBoundary);
  private readonly router = inject(Router);

  tryAgain() {
    this.boundary.reset(this.router);
  }
}
