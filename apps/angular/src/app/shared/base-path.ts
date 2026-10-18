/* The path this copy of the prototype was built for, such as "/" or
 * "/Design-proto-demo/preview/new-reasons-panel/".
 *
 * The build writes it into the <base href> in index.html (see
 * scripts/build.mjs), so the same app works at the site root, under
 * /preview/<branch>/ and under /v/<name>/. This reads it back, always with a
 * slash at the end.
 */

function readBasePath(): string {
  if (typeof document === "undefined") return "/";
  const href = document.querySelector("base")?.getAttribute("href") ?? "/";
  const path = new URL(href, "http://localhost").pathname;
  return path.endsWith("/") ? path : `${path}/`;
}

export const basePath = readBasePath();

/** The base path without its trailing slash, for gluing onto "/internal" and the like. */
export const baseWithoutSlash = basePath.replace(/\/$/, "");
