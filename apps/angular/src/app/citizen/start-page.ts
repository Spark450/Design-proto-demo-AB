/* The citizen start page, following the design system's start page pattern:
 * a heading, a short intro and a start button. Swap the words for your
 * service's own. */

import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { GoabButton, GoabText } from "@abgov/angular-components";
import { prototypeName } from "../shared/prototype";

@Component({
  selector: "app-start-page",
  imports: [GoabButton, GoabText],
  host: { style: "display: contents" },
  template: `
    <goab-text tag="h1" size="heading-xl" mt="none" mb="l">{{ prototypeName }}</goab-text>
    <goab-text size="body-l" mt="none" mb="none">
      A short overview of the service. One or two sentences that help people understand
      what it is and whether it's for them.
    </goab-text>
    <goab-text size="body-m" mt="l" mb="none">
      It takes about 5 minutes. You'll answer 4 questions, then check your answers before
      you submit.
    </goab-text>
    <goab-button type="start" mt="2xl" (onClick)="start()">Start now</goab-button>
  `,
})
export class StartPage {
  private readonly router = inject(Router);
  protected readonly prototypeName = prototypeName;

  protected start() {
    this.router.navigateByUrl("/apply/name");
  }
}
