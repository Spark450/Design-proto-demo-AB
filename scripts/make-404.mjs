/* Build the site's single 404 page.
 *
 * GitHub Pages has no server-side rewrite and serves exactly one 404 document,
 * at the site root, for every path that isn't a file. That one page therefore
 * has two jobs.
 *
 * For the main build it's the SPA fallback, same as it always was: a deep link
 * like /internal/cases is answered with the app itself, which then reads
 * the URL and routes. No redirect, nothing visible.
 *
 * For a preview or snapshot it can't do that — those live under /preview/<name>/
 * and /v/<name>/ and are different builds, with their own asset paths and their
 * own router basename. Serving the main app there would quietly show the wrong
 * prototype, which is worse than an error. So a prelude runs first and bounces
 * those paths to the right build, carrying the path in the query where a static
 * host will preserve it. The decoder in index.html puts it back.
 *
 * The template also publishes its Angular version in an angular/ folder inside
 * each build (/angular/, /preview/<name>/angular/, /v/<name>/angular/). That's
 * another separate build, bounced the same way — but only when the site has
 * one, so a prototype set up for a single framework doesn't carry the rule.
 *
 * Usage: node scripts/make-404.mjs <dist-dir>
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/* Runs before anything else on the page, so a bounced request never boots the
   wrong app. Deliberately plain ES5 in a blocking script — this has to work
   before any bundle loads.

   The ~and~ substitution is the long-standing spa-github-pages convention: the
   real path is carried as ?/<path>, so any & already in the URL has to be
   escaped to survive the round trip. */
const BUILD_DIRECTORY = String.raw`\/(?:preview|v)\/[^/]+\/`;
const ANGULAR_DIRECTORY = String.raw`\/(?:(?:preview|v)\/[^/]+\/)?angular\/`;

export function prelude({ angular = false } = {}) {
  const directory = angular ? `${ANGULAR_DIRECTORY}|${BUILD_DIRECTORY}` : BUILD_DIRECTORY;
  return `
    <!-- Preview and snapshot builds live in a subdirectory and are separate
         builds. Send them to their own index rather than letting the main app
         answer for them. See scripts/make-404.mjs. -->
    <script>
      (function (l) {
        var m = l.pathname.match(/^(${directory})(.*)$/);
        if (!m) return;
        var base = m[1];
        var rest = m[2];
        // The build's own index is missing, not the path within it. Falling
        // through shows the not-found page instead of redirecting forever.
        if (rest === "") return;
        l.replace(
          base +
            "?/" +
            rest.replace(/&/g, "~and~") +
            (l.search ? "&" + l.search.slice(1).replace(/&/g, "~and~") : "") +
            l.hash,
        );
      })(window.location);
    </script>
`;
}

/** The main build's index.html, with the subdirectory router in front of it. */
export function buildFourOhFour(indexHtml, options) {
  if (!indexHtml.includes("<head>")) {
    throw new Error("No <head> in the built index.html — cannot build the 404 page.");
  }
  return indexHtml.replace("<head>", `<head>\n${prelude(options)}`);
}

/* Only when run as a command, so the test can import the parts above. */
if (process.argv[1] && process.argv[1].endsWith("make-404.mjs")) {
  const dist = process.argv[2] || "dist";
  const out = join(dist, "404.html");
  const angular = existsSync(join(dist, "angular", "index.html"));
  writeFileSync(
    out,
    buildFourOhFour(readFileSync(join(dist, "index.html"), "utf8"), { angular }),
  );
  console.log(`Wrote ${out}`);
}
