/* Says which copy of the prototype someone is looking at.
 *
 * A preview link sent a fortnight ago looks exactly like the current prototype.
 * On the main build (and when running locally) this renders nothing, so it stays
 * out of the way. On a preview or a snapshot it says so, and links to the list of
 * every published version. See version.ts for how the build works this out.
 */

import { Component, computed, input } from "@angular/core";
import { GoabCallout } from "@abgov/angular-components";

import { describeVersion, siteVersion, versionsUrl, type SiteVersion } from "./version";

@Component({
  selector: "app-version-banner",
  imports: [GoabCallout],
  template: `
    @if (description(); as description) {
      <goab-callout
        type="information"
        heading="This isn't the current version"
        mt="none"
        mb="l"
      >
        {{ description }} <a [href]="versionsUrl">See all versions</a>
      </goab-callout>
    }
  `,
})
export class VersionBanner {
  readonly version = input<SiteVersion>(siteVersion);

  protected readonly description = computed(() => describeVersion(this.version()));
  protected readonly versionsUrl = versionsUrl;
}
