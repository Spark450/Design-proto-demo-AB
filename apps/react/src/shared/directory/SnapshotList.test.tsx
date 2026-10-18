/* The directory reads the snapshot list when it opens. These check what it
 * shows in each case, and that a broken or odd versions.json can't break it. */

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SnapshotList } from "./SnapshotList";
import { snapshotsFrom, snapshotUrl } from "./snapshots";

const render = (state: Parameters<typeof SnapshotList>[0]["state"]) =>
  renderToStaticMarkup(<SnapshotList state={state} siteRoot="/site/" />);

describe("the snapshot list", () => {
  it("lists each snapshot with its link, note and date", () => {
    const markup = render({
      status: "ready",
      snapshots: [{ slug: "round-1", note: "Used in the first research round.", created: "2026-03-04T10:00:00Z" }],
    });
    expect(markup).toContain('href="/site/v/round-1/"');
    expect(markup).toContain("Used in the first research round.");
    expect(markup).toContain("March 4, 2026");
  });

  it("says so when there aren't any", () => {
    expect(render({ status: "ready", snapshots: [] })).toContain("snapshots yet");
  });

  it("explains why there are none when running locally", () => {
    expect(render({ status: "local" })).toContain("once the prototype is published");
  });

  it("points to the full list if loading fails", () => {
    expect(render({ status: "failed" })).toContain("load the list of snapshots");
  });
});

describe("reading versions.json", () => {
  it("puts the newest snapshot first and skips anything malformed", () => {
    const snapshots = snapshotsFrom({
      snapshots: [
        { slug: "older", created: "2026-01-01T00:00:00Z" },
        { note: "no name" },
        { slug: "newer", created: "2026-02-01T00:00:00Z" },
      ],
    });
    expect(snapshots.map((s) => s.slug)).toEqual(["newer", "older"]);
  });

  it("copes with a file that has no snapshots", () => {
    expect(snapshotsFrom({ previews: [] })).toEqual([]);
    expect(snapshotsFrom(null)).toEqual([]);
  });

  it("links to the snapshot's folder at the site root", () => {
    expect(snapshotUrl("/site/", "round-1")).toBe("/site/v/round-1/");
  });
});
