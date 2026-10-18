/* The confirmation page, following the design system's result page pattern.
 * The reference number is made up. */

import { Component, computed, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { GoabCallout, GoabText } from "@abgov/angular-components";
import { PageTitleSize } from "../shared/page-title-size";
import { AnswersStore } from "./answers";
import { startPath } from "./journey";

@Component({
  selector: "app-done-page",
  imports: [RouterLink, GoabCallout, GoabText],
  host: { style: "display: contents" },
  template: `
    <goab-text tag="h1" [size]="titleSize()" mt="none" mb="l"
      >Application submitted</goab-text
    >

    <goab-callout type="success" heading="We've received your application">
      <goab-text size="body-m" mt="none" mb="none">
        Your reference number is <strong>SAMPLE-REF-0001</strong>
      </goab-text>
    </goab-callout>

    <goab-text tag="h2" size="heading-s" mt="xl" mb="s">What happens next</goab-text>
    <goab-text size="body-m" mt="none" mb="s">
      We'll review your application within 10 business days.{{ whenDone() }}
    </goab-text>
    <goab-text size="body-m" mt="none" mb="s">
      <a [routerLink]="startPath">Go back to the start</a>
    </goab-text>
  `,
})
export class DonePage {
  private readonly answers = inject(AnswersStore).answers;
  protected readonly titleSize = inject(PageTitleSize).size;
  protected readonly startPath = startPath;

  protected readonly whenDone = computed(() => {
    const method = this.answers().contactMethod;
    return method === "phone"
      ? " We'll phone you when it's done."
      : method === "mail"
        ? " We'll send you a letter when it's done."
        : " We'll email you when it's done.";
  });
}
