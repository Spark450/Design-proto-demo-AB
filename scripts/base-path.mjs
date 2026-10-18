/* Where on the site a build is going to live.
 *
 * This is not as obvious as "/<repo-name>/". A public repo is served from a
 * path named after itself; an internal or private one gets a generated
 * subdomain and is served from the root. Guess wrong and every asset URL in the
 * build points somewhere that isn't there — a white page, with a 404 for each
 * script in the console and nothing on screen saying why.
 *
 * So the workflow asks the Pages API and passes the answer in here. The catch
 * is that `gh api` writes its error body to stdout, so a 403 from a missing
 * `pages: read` or an org policy arrives looking exactly like a value. That
 * happened, and the published build had `/{"message":"Resource not
 * accessible..."}/` as its base path. Hence: check the shape, don't trust that
 * something came back.
 */

/** Reads a Pages `html_url` and works out the site's root path. */
export function siteRoot(htmlUrl) {
  if (typeof htmlUrl !== "string" || !/^https?:\/\//.test(htmlUrl)) return null;

  const path = htmlUrl.replace(/^https?:\/\/[^/]+/, "");
  return withTrailingSlash(path === "" ? "/" : path);
}

/** The base path a build in `directory` should be built for. */
export function basePath(root, directory) {
  const base = withTrailingSlash(root || "/");
  const dir = trim(directory);
  return dir ? `${base}${dir}/` : base;
}

/** The address that build will be reachable at, once published. */
export function buildUrl(site, directory) {
  const base = withTrailingSlash(site || "/");
  const dir = trim(directory);
  return dir ? `${base}${dir}/` : base;
}

function withTrailingSlash(value) {
  return value.endsWith("/") ? value : `${value}/`;
}

function trim(value) {
  return (value || "").replace(/^\/+|\/+$/g, "");
}

/* Called from the build-prototype action as:
 *     node scripts/base-path.mjs "<html_url or junk>" "<directory>"
 * and prints GitHub Actions output lines. Anything that isn't a URL falls back
 * to the site root with a warning, so a build still happens — a prototype at
 * the wrong path is recoverable, a workflow that won't run at all is not. */
if (process.argv[1] && process.argv[1].endsWith("base-path.mjs")) {
  const [, , rawSite = "", directory = ""] = process.argv;

  let site = siteRoot(rawSite) === null ? null : rawSite;
  let root = siteRoot(rawSite);

  if (root === null) {
    if (rawSite.trim() !== "") {
      console.log(
        `::warning::Pages settings came back as ${JSON.stringify(
          rawSite.slice(0, 120),
        )}, which is not a URL. Assuming the site root.`,
      );
    } else {
      console.log("::warning::Could not read the Pages settings; assuming the site root.");
    }
    root = "/";
    site = "/";
  }

  const lines = [
    `path=${basePath(root, directory)}`,
    `url=${buildUrl(site, directory)}`,
    `site=${withTrailingSlash(site)}`,
  ];

  console.log(`Site root: ${root}`);
  console.log(`This build: ${basePath(root, directory)}`);

  if (process.env.GITHUB_OUTPUT) {
    const { appendFileSync } = await import("node:fs");
    appendFileSync(process.env.GITHUB_OUTPUT, lines.join("\n") + "\n");
  } else {
    console.log(lines.join("\n"));
  }
}
