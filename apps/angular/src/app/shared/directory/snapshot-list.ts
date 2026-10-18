/* The list of snapshots on the directory page. It only draws what it's given,
   so the tests can check every state without fetching anything. */

import { Component, input } from "@angular/core";
import { GoabBlock, GoabText } from "@abgov/angular-components";
import { formatDate } from "../format-date";
import { snapshotUrl, type SnapshotsState } from "./snapshots";

@Component({
  selector: "app-snapshot-list",
  imports: [GoabBlock, GoabText],
  host: { style: "display: contents" },
  template: `
    @let current = state();
    @switch (current.status) {
      @case ("local") {
        <goab-text size="body-m" mt="none" mb="none">
          Snapshots show here once the prototype is published. You're running it on your
          own computer, so there aren't any yet.
        </goab-text>
      }
      @case ("loading") {
        <goab-text size="body-m" mt="none" mb="none">Loading snapshots…</goab-text>
      }
      @case ("failed") {
        <goab-text size="body-m" mt="none" mb="none">
          We couldn't load the list of snapshots here. Use the link below to see them.
        </goab-text>
      }
      @case ("ready") {
        @if ($any(current).snapshots.length === 0) {
          <goab-text size="body-m" mt="none" mb="none">
            There aren't any snapshots yet. One is taken each time a change is merged.
          </goab-text>
        } @else {
          <ul class="directory__snapshots">
            @for (snapshot of $any(current).snapshots; track snapshot.slug) {
              <li>
                <goab-block direction="column" gap="3xs" width="100%">
                  <goab-text size="body-s" mt="none" mb="none">
                    <a [href]="snapshotUrl(siteRoot(), snapshot.slug)">{{
                      snapshot.slug
                    }}</a>
                  </goab-text>
                  @if (snapshot.note) {
                    <goab-text size="body-s" mt="none" mb="none">{{
                      snapshot.note
                    }}</goab-text>
                  }
                  @if (snapshot.created) {
                    <goab-text size="body-xs" color="secondary" mt="none" mb="none">
                      {{ formatDate(snapshot.created) }}
                    </goab-text>
                  }
                </goab-block>
              </li>
            }
          </ul>
        }
      }
    }
  `,
})
export class SnapshotList {
  readonly state = input.required<SnapshotsState>();
  readonly siteRoot = input.required<string>();

  protected readonly snapshotUrl = snapshotUrl;
  protected readonly formatDate = formatDate;
}
