/* The preview directory name is derived from the branch name in two places: the
 * workflow that publishes a preview, and the workflow that deletes it. If they
 * ever disagreed, cleanup would quietly miss and abandoned previews would stay
 * on the versions page forever, so the derivation lives in one place and is
 * pinned here.
 */

import { describe, expect, it } from "vitest";
import { previewSlug } from "./preview-slug.mjs";

describe("naming a preview directory", () => {
  it("keeps a simple branch name as it is", () => {
    expect(previewSlug("new-reasons-panel")).toBe("new-reasons-panel");
  });

  it("flattens the parts of a branch name that can't be in a directory", () => {
    expect(previewSlug("feat/New_Reasons.Panel")).toBe("feat-new-reasons-panel");
  });

  it("does not leave a name starting or ending in a hyphen", () => {
    expect(previewSlug("--tidy-up--")).toBe("tidy-up");
    expect(previewSlug("feat/")).toBe("feat");
  });

  it("is stable, so publishing and cleanup always agree", () => {
    const branch = "mark-elamatha/goa-prototyping-workflow-ux";
    expect(previewSlug(branch)).toBe(previewSlug(branch));
  });

  it("shortens a long branch name but keeps it unique", () => {
    const a = previewSlug("feature/a-really-quite-long-branch-name-about-the-reasons-panel-one");
    const b = previewSlug("feature/a-really-quite-long-branch-name-about-the-reasons-panel-two");

    expect(a.length).toBeLessThanOrEqual(56);
    expect(a).not.toBe(b);
    expect(a).toMatch(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/);
  });

  it("refuses a branch name with nothing usable in it", () => {
    expect(() => previewSlug("///")).toThrow();
  });
});
