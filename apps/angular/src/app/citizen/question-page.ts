/* The frame every question page shares, following the design system's
 * question page pattern: a back link, "Question 1 of 4", the question as the
 * page heading, the answer fields, and a Continue button.
 *
 * Each question page puts its fields inside <app-question-page> and passes an
 * onContinue that checks the answer. If onContinue returns true, this moves on
 * to the next page.
 */

import { Component, computed, inject, input } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { map } from "rxjs";
import {
  GoabButton,
  GoabButtonGroup,
  GoabLink,
  GoabText,
} from "@abgov/angular-components";

import { PageTitleSize } from "../shared/page-title-size";
import { stepFor } from "./journey";

@Component({
  selector: "app-question-page",
  imports: [RouterLink, GoabButton, GoabButtonGroup, GoabLink, GoabText],
  host: { style: "display: contents" },
  template: `
    <goab-link leadingIcon="arrow-back" size="small" mb="none">
      <a [routerLink]="step().back">Back</a>
    </goab-link>

    <goab-text size="body-xs" color="secondary" mt="xl" mb="xs">
      {{ step().caption }}
    </goab-text>
    <goab-text tag="h1" [size]="titleSize()" mt="none" mb="m">{{ heading() }}</goab-text>
    @if (intro()) {
      <goab-text size="body-m" mt="none" mb="xl">{{ intro() }}</goab-text>
    }

    <ng-content />

    <goab-button-group alignment="start" mt="2xl">
      <goab-button type="primary" (onClick)="continue()">Continue</goab-button>
    </goab-button-group>
  `,
})
export class QuestionPage {
  private readonly router = inject(Router);

  /** This page's address, as listed in journey.ts. */
  readonly path = input.required<string>();
  readonly heading = input.required<string>();
  /** A sentence under the heading. Optional. */
  readonly intro = input<string>();
  /** Check the answer and save it. Return false to stay on the page. */
  readonly onContinue = input.required<() => boolean>();

  private readonly changing = toSignal(
    inject(ActivatedRoute).queryParamMap.pipe(map((q) => q.get("change") === "1")),
    { initialValue: false },
  );

  protected readonly step = computed(() => stepFor(this.path(), this.changing()));
  protected readonly titleSize = inject(PageTitleSize).size;

  protected continue() {
    if (this.onContinue()()) this.router.navigateByUrl(this.step().next);
  }
}
