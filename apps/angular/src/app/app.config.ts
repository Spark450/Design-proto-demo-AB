/* What the app is set up with when it starts: the routes, and the error
 * handler that shows the error page when a page breaks. */

import { ApplicationConfig, ErrorHandler, inject } from "@angular/core";
import {
  provideRouter,
  withComponentInputBinding,
  withNavigationErrorHandler,
} from "@angular/router";

import { routes } from "./app.routes";
import { ErrorBoundary, PrototypeErrorHandler } from "./shared/error-boundary";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      // Hands route parameters and data (like :caseId) to pages as inputs.
      withComponentInputBinding(),
      // A page that breaks while it opens shows the error page too.
      withNavigationErrorHandler((e) => inject(ErrorBoundary).catch(e.error, e.url)),
    ),
    { provide: ErrorHandler, useClass: PrototypeErrorHandler },
  ],
};
