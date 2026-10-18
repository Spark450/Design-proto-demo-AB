/* The outside of the whole prototype: whichever page the address points to
 * (see app.routes.ts), with the prototype controls on top.
 *
 * If a page breaks, the error page takes the place of everything, like the
 * React version's error boundary (see shared/error-boundary.ts).
 */

import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { sides } from "./app.routes";
import { ErrorBoundary, ErrorBoundaryPage } from "./shared/error-boundary";
import { PrototypeControls } from "./shared/controls/prototype-controls";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, ErrorBoundaryPage, PrototypeControls],
  template: `
    @if (boundary.error()) {
      <app-error-boundary-page />
    } @else {
      <router-outlet />
      <app-prototype-controls [sides]="sides" />
    }
  `,
})
export class App {
  protected readonly boundary = inject(ErrorBoundary);
  protected readonly sides = sides;
}
