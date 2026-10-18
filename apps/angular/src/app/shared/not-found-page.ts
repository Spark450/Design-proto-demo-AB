import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { GoabButton } from "@abgov/angular-components";

import { ErrorLayout } from "./error-layout";

/* Shown for any address the prototype doesn't have a page for. */
@Component({
  selector: "app-not-found-page",
  imports: [ErrorLayout, GoabButton],
  template: `
    <app-error-layout
      icon="search"
      label="Error 404"
      heading="Page not found"
      description="We can't find the page you're looking for. Check the web address, or go back to the home page."
    >
      <goab-button type="primary" size="compact" (onClick)="goHome()">
        Go to home page
      </goab-button>
    </app-error-layout>
  `,
})
export class NotFoundPage {
  private readonly router = inject(Router);

  goHome() {
    this.router.navigateByUrl("/");
  }
}
