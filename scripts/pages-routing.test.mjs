/* Guards the one piece of this setup that is both subtle and invisible when it
 * breaks: how a shared link finds its way to the right build.
 *
 * GitHub Pages serves exactly one 404 document, at the site root, for every
 * path that isn't a file — there is no per-directory 404. So a deep link into
 * /preview/<name>/ lands on the *main* app's fallback and has to be bounced to
 * the right build, carrying its path and query intact.
 *
 * The failure mode is quiet: a stakeholder opens the link you sent and sees the
 * wrong version of the prototype, with no error to tell either of you. These
 * tests run the real shipped scripts — the prelude from make-404.mjs and the
 * decoder from index.html — against a stand-in for Pages' serving rules.
 */

import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildFourOhFour } from "./make-404.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

/* In the template the apps live in apps/react/ and apps/angular/. First-run
   setup moves one of them to the repo root, so look in each place. The decoder
   script is the same in both. */
const indexPath = [
  "index.html",
  "src/index.html",
  "apps/react/index.html",
  "apps/angular/src/index.html",
]
  .map((file) => join(repoRoot, file))
  .find((file) => existsSync(file));
if (!indexPath) throw new Error("Couldn't find the app's index.html");
const sourceIndex = readFileSync(indexPath, "utf8");

/* Stands in for a built index.html. The real build only rewrites asset URLs;
   the inline scripts, which are all this exercises, pass through untouched. */
const rootIndex = sourceIndex;
const previewIndex = sourceIndex;
const fourOhFour = buildFourOhFour(rootIndex);

/* What the deployed site looks like: the main build at the root, one preview in
   a subdirectory, and a single 404 document. */
const site = {
  "/index.html": rootIndex,
  "/404.html": fourOhFour,
  "/preview/my-branch/index.html": previewIndex,
  "/v/feb-12-session/index.html": previewIndex,
};

/* The template's site: the same, plus the Angular version in an angular/ folder
   inside the main build and the preview. The snapshot was frozen before there
   was one. */
const templateSite = {
  "/index.html": rootIndex,
  "/404.html": buildFourOhFour(rootIndex, { angular: true }),
  "/angular/index.html": rootIndex,
  "/preview/my-branch/index.html": previewIndex,
  "/preview/my-branch/angular/index.html": previewIndex,
  "/v/feb-12-session/index.html": previewIndex,
};

/** GitHub Pages: an exact file, or <dir>/index.html, else the *root* 404. */
function serve(files, pathname) {
  if (files[pathname]) return pathname;
  const asIndex = pathname.replace(/\/$/, "") + "/index.html";
  if (files[asIndex]) return asIndex;
  return "/404.html";
}

const inlineScripts = (files, doc) =>
  [...files[doc].matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\b[^>]*>/gi)].map((m) => m[1]);

/** Follow a URL the way a browser would, running whatever the server hands back. */
function visit(url, files = site) {
  let current = url;

  for (let hop = 0; hop < 10; hop++) {
    const u = new URL(current, "https://prototype.test");
    const doc = serve(files, u.pathname);

    let redirectedTo = null;
    let finalUrl = `${u.pathname}${u.search}${u.hash}`;

    const location = {
      pathname: u.pathname,
      search: u.search,
      hash: u.hash,
      replace: (to) => {
        redirectedTo = to;
      },
    };
    const history = {
      replaceState: (_state, _title, to) => {
        finalUrl = to;
      },
    };

    // The shipped scripts are self-invoking and reach for window.location.
    for (const src of inlineScripts(files, doc)) {
      new Function("window", src)({ location, history });
    }

    if (redirectedTo) {
      current = redirectedTo;
      continue;
    }
    return { doc, url: finalUrl };
  }

  throw new Error(`Redirect loop starting at ${url}`);
}

describe("the main build at the site root", () => {
  it("serves its own index directly", () => {
    expect(visit("/")).toEqual({ doc: "/index.html", url: "/" });
  });

  /* This is the behaviour that already worked before previews existed, and the
     one most likely to be broken by the prelude sitting in front of it. */
  it("answers a deep link from the 404 fallback, without a redirect", () => {
    expect(visit("/internal/cases")).toEqual({
      doc: "/404.html",
      url: "/internal/cases",
    });
  });

  it("keeps the query string on a deep link", () => {
    expect(visit("/internal/cases?page=2")).toEqual({
      doc: "/404.html",
      url: "/internal/cases?page=2",
    });
  });
});

describe("a preview build in a subdirectory", () => {
  it("serves its own index directly", () => {
    expect(visit("/preview/my-branch/")).toEqual({
      doc: "/preview/my-branch/index.html",
      url: "/preview/my-branch/",
    });
  });

  it("routes a deep link to the preview, not to the main app", () => {
    expect(visit("/preview/my-branch/internal/cases")).toEqual({
      doc: "/preview/my-branch/index.html",
      url: "/preview/my-branch/internal/cases",
    });
  });

  it("carries the query string through the bounce", () => {
    expect(visit("/preview/my-branch/internal/cases?page=2")).toEqual({
      doc: "/preview/my-branch/index.html",
      url: "/preview/my-branch/internal/cases?page=2",
    });
  });

  /* The path travels as ?/<path>, so every & in the original URL has to be
     escaped and put back or the second parameter onwards is lost. */
  it("survives a query with several parameters", () => {
    expect(
      visit("/preview/my-branch/start/question?answer=yes&a=1&b=2"),
    ).toEqual({
      doc: "/preview/my-branch/index.html",
      url: "/preview/my-branch/start/question?answer=yes&a=1&b=2",
    });
  });
});

describe("a frozen snapshot", () => {
  it("routes a deep link the same way a preview does", () => {
    expect(visit("/v/feb-12-session/start/question?answer=yes")).toEqual({
      doc: "/v/feb-12-session/index.html",
      url: "/v/feb-12-session/start/question?answer=yes",
    });
  });
});

describe("a preview that is no longer there", () => {
  /* Previews are deleted with their branch, but links to them outlive them. The
     prelude must not bounce a path whose build is gone, or the redirect has
     nowhere to land and repeats. */
  it("stops at the not-found page instead of looping", () => {
    expect(visit("/preview/deleted-branch/internal/cases")).toEqual({
      doc: "/404.html",
      url: "/preview/deleted-branch/internal/cases",
    });
  });
});

describe("the template's Angular version in an angular/ folder", () => {
  it("serves its own index directly", () => {
    expect(visit("/angular/", templateSite)).toEqual({
      doc: "/angular/index.html",
      url: "/angular/",
    });
  });

  it("routes a deep link to the Angular build, not the React one", () => {
    expect(visit("/angular/internal/cases?page=2", templateSite)).toEqual({
      doc: "/angular/index.html",
      url: "/angular/internal/cases?page=2",
    });
  });

  it("does the same inside a preview", () => {
    expect(
      visit("/preview/my-branch/angular/start/question?a=1&b=2", templateSite),
    ).toEqual({
      doc: "/preview/my-branch/angular/index.html",
      url: "/preview/my-branch/angular/start/question?a=1&b=2",
    });
  });

  it("still sends the React side of a preview to React", () => {
    expect(visit("/preview/my-branch/internal/cases", templateSite)).toEqual({
      doc: "/preview/my-branch/index.html",
      url: "/preview/my-branch/internal/cases",
    });
  });

  it("still answers a React deep link at the root without a redirect", () => {
    expect(visit("/internal/cases", templateSite)).toEqual({
      doc: "/404.html",
      url: "/internal/cases",
    });
  });

  /* Snapshots taken before the Angular version existed have no angular/ folder. */
  it("stops at the not-found page when the snapshot has no Angular build", () => {
    expect(visit("/v/feb-12-session/angular/internal", templateSite)).toEqual({
      doc: "/404.html",
      url: "/v/feb-12-session/angular/internal",
    });
  });
});

describe("a prototype set up for one framework", () => {
  /* Without an Angular build the rule is left out, so /angular/... is just
     another deep link for the main app to answer. */
  it("doesn't treat angular/ as a separate build", () => {
    expect(visit("/angular/internal")).toEqual({
      doc: "/404.html",
      url: "/angular/internal",
    });
  });
});
