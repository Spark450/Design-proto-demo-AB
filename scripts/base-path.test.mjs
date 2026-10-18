import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { basePath, buildUrl, siteRoot } from "./base-path.mjs";

const SCRIPT = fileURLToPath(new URL("./base-path.mjs", import.meta.url));

function run(site, directory = "") {
  return execFileSync("node", [SCRIPT, site, directory], { encoding: "utf8" });
}

describe("siteRoot", () => {
  it("reads the root of a generated Pages subdomain", () => {
    // What a private or internal repo gets.
    expect(siteRoot("https://example-subdomain-abc123.pages.github.io/")).toBe("/");
  });

  it("reads the repo-name path a public repo is served from", () => {
    expect(siteRoot("https://govalta-lab.github.io/Design-proto-demo/")).toBe(
      "/Design-proto-demo/",
    );
  });

  it("adds the trailing slash when Pages leaves it off", () => {
    expect(siteRoot("https://govalta-lab.github.io/repo")).toBe("/repo/");
  });

  /* The bug this file exists for. `gh api` prints its error body to stdout, so
     a 403 looks like a value; the published build ended up with the error JSON
     baked in as its base path. */
  it("refuses an API error body", () => {
    const err = '{"message":"Resource not accessible by integration","status":"403"}';
    expect(siteRoot(err)).toBeNull();
  });

  it("refuses empty, junk and non-strings", () => {
    expect(siteRoot("")).toBeNull();
    expect(siteRoot("not a url")).toBeNull();
    expect(siteRoot(undefined)).toBeNull();
    expect(siteRoot("ftp://example.com/x")).toBeNull();
  });
});

describe("basePath", () => {
  it("puts a build at the site root when no directory is given", () => {
    expect(basePath("/", "")).toBe("/");
    expect(basePath("/repo/", "")).toBe("/repo/");
  });

  it("nests a preview or snapshot under the site root", () => {
    expect(basePath("/", "preview/my-branch")).toBe("/preview/my-branch/");
    expect(basePath("/repo/", "v/feb-12-session")).toBe("/repo/v/feb-12-session/");
  });

  it("tolerates slashes around the directory", () => {
    expect(basePath("/", "/preview/x/")).toBe("/preview/x/");
  });
});

describe("buildUrl", () => {
  it("is the full address the build will answer at", () => {
    expect(buildUrl("https://host.example/", "preview/x")).toBe("https://host.example/preview/x/");
    expect(buildUrl("https://host.example/repo/", "")).toBe("https://host.example/repo/");
  });
});

describe("run as a script", () => {
  it("emits the outputs the action reads", () => {
    const out = run("https://host.example/", "preview/x");
    expect(out).toContain("path=/preview/x/");
    expect(out).toContain("url=https://host.example/preview/x/");
    expect(out).toContain("site=https://host.example/");
  });

  /* Falling back rather than failing: a prototype published at the wrong path
     can be republished, but a workflow that refuses to run leaves the designer
     with nothing and no obvious cause. */
  it("warns and falls back to the root when the API errors", () => {
    const out = run('{"message":"Resource not accessible by integration"}', "preview/x");
    expect(out).toContain("::warning::");
    expect(out).toContain("path=/preview/x/");
    expect(out).not.toContain("Resource not accessible by integration\n");
    expect(out).not.toContain("path=/{");
  });

  it("warns when nothing came back at all", () => {
    const out = run("", "");
    expect(out).toContain("::warning::Could not read the Pages settings");
    expect(out).toContain("path=/");
  });
});
