/* The banner must stay out of the way on the current prototype, and speak up on
 * a preview or snapshot, where someone could mistake an old link for the real
 * thing. */

import { TestBed } from "@angular/core/testing";
import { VersionBanner } from "./version-banner";
import type { SiteVersion } from "./version";
import { settle } from "./settle";

async function render(version: SiteVersion) {
  const fixture = TestBed.createComponent(VersionBanner);
  fixture.componentRef.setInput("version", version);
  await settle(fixture);
  return (fixture.nativeElement as HTMLElement).textContent?.trim() ?? "";
}

describe("the version banner", () => {
  it("shows nothing on the current prototype or locally", async () => {
    expect(await render({ kind: "main" })).toBe("");
    expect(await render({ kind: "local" })).toBe("");
  });

  it("names the preview or snapshot and links to every version", async () => {
    const fixture = TestBed.createComponent(VersionBanner);
    fixture.componentRef.setInput("version", { kind: "preview", name: "new-start-page" });
    await settle(fixture);
    const preview = (fixture.nativeElement as HTMLElement).innerHTML;
    expect(preview).toContain("new-start-page");
    expect(preview).toContain("versions/");

    expect(await render({ kind: "snapshot", name: "round-1" })).toContain("round-1");
  });
});
