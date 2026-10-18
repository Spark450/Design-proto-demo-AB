/* The banner must stay out of the way on the current prototype, and speak up on
 * a preview or snapshot, where someone could mistake an old link for the real
 * thing. */

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { VersionBanner } from "./VersionBanner";

describe("the version banner", () => {
  it("shows nothing on the current prototype or locally", () => {
    expect(renderToStaticMarkup(<VersionBanner version={{ kind: "main" }} />)).toBe("");
    expect(renderToStaticMarkup(<VersionBanner version={{ kind: "local" }} />)).toBe("");
  });

  it("names the preview or snapshot and links to every version", () => {
    const preview = renderToStaticMarkup(
      <VersionBanner version={{ kind: "preview", name: "new-start-page" }} />,
    );
    expect(preview).toContain("new-start-page");
    expect(preview).toContain("versions/");

    const snapshot = renderToStaticMarkup(
      <VersionBanner version={{ kind: "snapshot", name: "round-1" }} />,
    );
    expect(snapshot).toContain("round-1");
  });
});
