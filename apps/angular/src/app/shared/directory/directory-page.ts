/* The front page of the prototype, at the site root.
 *
 * It lists every page on each side and the published snapshots, so someone
 * given the address can find their way around without already knowing what's
 * in here. It also says whether they're looking at the current prototype, a
 * preview of a branch, or a frozen snapshot.
 *
 * The pages come from each side's screens list in its routes.ts, the same
 * list the prototype controls use. app.routes.ts passes them in, so a page
 * added there shows up here too.
 */

import { Component, ViewEncapsulation, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import {
  GoabBlock,
  GoabCallout,
  GoabContainer,
  GoabGrid,
  GoabText,
} from "@abgov/angular-components";

import { prototypeName } from "../prototype";
import { VersionBanner } from "../version-banner";
import { versionsUrl } from "../version";
import type { ControlSide } from "../controls/types";
import { SnapshotList } from "./snapshot-list";
import { loadSnapshots, siteRoot } from "./snapshots";

@Component({
  selector: "app-directory-page",
  imports: [
    RouterLink,
    GoabBlock,
    GoabCallout,
    GoabContainer,
    GoabGrid,
    GoabText,
    SnapshotList,
    VersionBanner,
  ],
  styleUrl: "./directory.css",
  encapsulation: ViewEncapsulation.None,
  host: { style: "display: contents" },
  templateUrl: "./directory-page.html",
})
export class DirectoryPage {
  /** From the route's data in app.routes.ts. */
  readonly sides = input<ControlSide[]>([]);

  protected readonly snapshots = loadSnapshots();
  protected readonly prototypeName = prototypeName;
  protected readonly versionsUrl = versionsUrl;
  protected readonly siteRoot = siteRoot;
}
