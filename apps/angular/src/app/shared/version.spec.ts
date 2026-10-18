/* Someone handed a preview link a fortnight ago has no way of telling it from
 * the current prototype — the builds are identical. Getting this wrong means a
 * stakeholder signs off on work that was abandoned, or research runs against
 * the wrong screens. So the build has to be able to say which one it is, and
 * the link to the versions page has to point at the site rather than at
 * whichever copy of the app is running.
 */

import { describe, expect, it } from "vitest";
import { describeVersion, siteRootFrom, versionFrom, versionsUrlFrom } from "./version";

describe("working out which build this is", () => {
  it("treats the site root as the current prototype", () => {
    expect(versionFrom("/")).toEqual({ kind: "main" });
  });

  it("recognises a preview and names the branch", () => {
    expect(versionFrom("/preview/new-reasons-panel/")).toEqual({
      kind: "preview",
      name: "new-reasons-panel",
    });
  });

  it("recognises a snapshot and names it", () => {
    expect(versionFrom("/v/feb-12-session/")).toEqual({
      kind: "snapshot",
      name: "feb-12-session",
    });
  });

  /* The site is served from the root while the repository is private or internal.
     Making it public moves everything under /<repo-name>/, and a version check
     that assumed the root would then call every preview the main build. */
  it("still works when the site is served from a subdirectory", () => {
    expect(versionFrom("/design-prototype/preview/a-branch/")).toEqual({
      kind: "preview",
      name: "a-branch",
    });
    expect(versionFrom("/design-prototype/")).toEqual({ kind: "main" });
  });

  it("looks past the template's angular/ folder", () => {
    expect(versionFrom("/angular/")).toEqual({ kind: "main" });
    expect(versionFrom("/preview/a-branch/angular/")).toEqual({
      kind: "preview",
      name: "a-branch",
    });
    expect(versionFrom("/v/feb-12/angular/")).toEqual({
      kind: "snapshot",
      name: "feb-12",
    });
  });

  it("is not fooled by a screen that happens to be called preview", () => {
    expect(versionFrom("/preview/")).toEqual({ kind: "main" });
  });
});

describe("linking to the versions page", () => {
  it("points at the site root, not at this build", () => {
    expect(versionsUrlFrom("/preview/a-branch/")).toBe("/versions/");
    expect(versionsUrlFrom("/v/feb-12/")).toBe("/versions/");
    expect(versionsUrlFrom("/")).toBe("/versions/");
  });

  it("points past the template's angular/ folder", () => {
    expect(versionsUrlFrom("/angular/")).toBe("/versions/");
    expect(versionsUrlFrom("/preview/a-branch/angular/")).toBe("/versions/");
  });

  it("keeps the site's own prefix when there is one", () => {
    expect(siteRootFrom("/design-prototype/v/feb-12/")).toBe("/design-prototype/");
    expect(versionsUrlFrom("/design-prototype/v/feb-12/")).toBe(
      "/design-prototype/versions/",
    );
  });
});

describe("telling someone what they are looking at", () => {
  it("says nothing on the current prototype, so the page stays out of the way", () => {
    expect(describeVersion({ kind: "main" })).toBeNull();
    expect(describeVersion({ kind: "local" })).toBeNull();
  });

  it("warns that a preview moves and a snapshot does not", () => {
    expect(describeVersion({ kind: "preview", name: "a-branch" })).toMatch(
      /changes as that work/,
    );
    expect(describeVersion({ kind: "snapshot", name: "feb-12" })).toMatch(
      /stays exactly as it is/,
    );
  });
});
