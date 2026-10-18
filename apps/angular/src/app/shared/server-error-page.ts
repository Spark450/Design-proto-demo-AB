import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { GoabButton } from "@abgov/angular-components";

import { ErrorLayout } from "./error-layout";

/* There is no server behind a prototype, so nothing sends people here on its
 * own. It lives at /error so you can link to it when you want to show what
 * happens when something goes wrong. */
@Component({
  selector: "app-server-error-page",
  imports: [ErrorLayout, GoabButton],
  template: `
    <app-error-layout
      icon="warning"
      label="Error 500"
      heading="We are having a problem"
      description="We can't load this page right now. Try again in a few minutes."
    >
      <goab-button type="primary" size="compact" (onClick)="goHome()">
        Go to home page
      </goab-button>
    </app-error-layout>
  `,
})
export class ServerErrorPage {
  private readonly router = inject(Router);

  goHome() {
    this.router.navigateByUrl("/");
  }
}
