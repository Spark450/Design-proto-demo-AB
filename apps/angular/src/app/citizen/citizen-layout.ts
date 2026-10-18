/* The citizen side of the prototype: a public page with the standard GoA
 * header and footer, laid out with the design system's one-column layout.
 *
 * The header shows a "Prototype" badge so nobody mistakes it for a live
 * service. Its alberta.ca logo links to the real alberta.ca, as on any GoA
 * service.
 *
 * The Angular components don't wrap the one-column layout, so this uses the
 * design system's <goa-one-column-layout> element directly (that's what
 * CUSTOM_ELEMENTS_SCHEMA is for).
 */

import { CUSTOM_ELEMENTS_SCHEMA, Component, ViewEncapsulation } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import {
  GoabAppFooter,
  GoabAppHeader,
  GoabBadge,
  GoabPageBlock,
} from "@abgov/angular-components";

import { prototypeName } from "../shared/prototype";
import { VersionBanner } from "../shared/version-banner";
import { AnswersStore } from "./answers";

const CONTENT_WIDTH = "1232px";

@Component({
  selector: "app-citizen-layout",
  imports: [
    RouterOutlet,
    GoabAppFooter,
    GoabAppHeader,
    GoabBadge,
    GoabPageBlock,
    VersionBanner,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [AnswersStore],
  styleUrl: "./citizen.css",
  encapsulation: ViewEncapsulation.None,
  host: { style: "display: contents" },
  template: `
    <ng-template #phase>
      <goab-badge type="important" content="Prototype" />
    </ng-template>

    <goa-one-column-layout>
      <section slot="header">
        <goab-app-header
          url="https://www.alberta.ca"
          [heading]="prototypeName"
          [maxContentWidth]="contentWidth"
          [phase]="phase"
        />
      </section>

      <goab-page-block [width]="contentWidth">
        <!-- The layout puts no space under the header, so the page would
             otherwise start flush against it. -->
        <main class="page-body">
          <app-version-banner />
          <router-outlet />
        </main>
      </goab-page-block>

      <section slot="footer">
        <goab-app-footer [maxContentWidth]="contentWidth" />
      </section>
    </goa-one-column-layout>
  `,
})
export class CitizenLayout {
  protected readonly prototypeName = prototypeName;
  protected readonly contentWidth = CONTENT_WIDTH;
}
