/* The shared shape of every error page: an icon in a circle, a small label, an
 * underline, a heading, a sentence or two and one action. Built from the design
 * system's error page pattern (design.alberta.ca, Examples > Error pages).
 *
 * It doesn't depend on either surface's layout, so it still works if the worker
 * or citizen side has been removed.
 *
 * The action goes between the tags: <app-error-layout ...><goab-button ...>
 */

import { Component, ViewEncapsulation, inject, input } from "@angular/core";
import { GoabIcon, GoabText } from "@abgov/angular-components";
import type { GoabIconType } from "@abgov/ui-components-common";

import { PageTitleSize } from "./page-title-size";

@Component({
  selector: "app-error-layout",
  imports: [GoabIcon, GoabText],
  styleUrl: "./error-page.css",
  encapsulation: ViewEncapsulation.None,
  template: `
    <main class="error-page">
      <div class="error-page-content">
        <div class="error-page-icon-wrapper">
          <goab-icon [type]="icon()" size="xlarge" />
        </div>
        <goab-text size="body-m" mt="m" mb="none" color="secondary">{{
          label()
        }}</goab-text>
        <div class="error-page-underline" aria-hidden="true"></div>
        <goab-text tag="h1" [size]="titleSize()" mt="xl" mb="none">{{
          heading()
        }}</goab-text>
        <div class="error-page-description">
          <goab-text size="body-m" mt="l" mb="none">{{ description() }}</goab-text>
        </div>
        <div style="margin-top: var(--goa-space-xl)"><ng-content /></div>
      </div>
    </main>
  `,
})
export class ErrorLayout {
  readonly icon = input.required<GoabIconType>();
  readonly label = input.required<string>();
  readonly heading = input.required<string>();
  readonly description = input.required<string>();

  protected readonly titleSize = inject(PageTitleSize).size;
}
