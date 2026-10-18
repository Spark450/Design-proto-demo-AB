/* Which build of the prototype am I looking at?
 *
 * The same app is published several times over: once at the site root as the
 * current prototype, once per open pull request under /preview/<branch>/, and
 * once per frozen snapshot under /v/<name>/. They look identical, which is a
 * problem — someone sent a preview link a fortnight ago can easily believe
 * they're looking at the current thing, and act on it.
 *
 * Vite bakes the base path into each build, so the build already knows where it
 * lives. This reads that back and says so out loud.
 */

export type SiteVersion =
  | { kind: "main" }
  | { kind: "preview"; name: string }
  | { kind: "snapshot"; name: string }
  | { kind: "local" };

const VERSION_DIRECTORY = /^(.*?\/)(preview|v)\/([^/]+)\/$/;

/** Where this build sits, worked out from the path it was built for. */
export function versionFrom(base: string): SiteVersion {
  const match = withSlashes(base).match(VERSION_DIRECTORY);
  if (!match) return { kind: "main" };

  return match[2] === "preview"
    ? { kind: "preview", name: match[3] }
    : { kind: "snapshot", name: match[3] };
}

/* The versions page is published once, at the root of the site — not once per
   build. A preview linking to its own directory would 404. */
export function siteRootFrom(base: string): string {
  const path = withSlashes(base);
  return path.match(VERSION_DIRECTORY)?.[1] ?? path;
}

export function versionsUrlFrom(base: string): string {
  return `${siteRootFrom(base)}versions/`;
}

function withSlashes(base: string): string {
  const start = base.startsWith("/") ? base : `/${base}`;
  return start.endsWith("/") ? start : `${start}/`;
}

/** How to describe this build to someone who has just been sent the link. */
export function describeVersion(version: SiteVersion): string | null {
  switch (version.kind) {
    case "preview":
      return `A preview of the “${version.name}” branch. It changes as that work continues, and disappears when the branch is merged or deleted.`;
    case "snapshot":
      return `The frozen “${version.name}” snapshot. It stays exactly as it is and won't pick up later changes.`;
    default:
      return null;
  }
}

export const siteVersion: SiteVersion = import.meta.env.DEV
  ? { kind: "local" }
  : versionFrom(import.meta.env.BASE_URL);

export const versionsUrl = versionsUrlFrom(import.meta.env.BASE_URL);
