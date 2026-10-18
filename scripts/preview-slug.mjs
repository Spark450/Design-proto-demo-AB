/* Turns a branch name into the directory a preview lives in.
 *
 * Branch names contain slashes, dots and capitals; a directory in a URL should
 * not. Both the workflow that publishes a preview and the one that deletes it
 * derive the name this way, so they always agree on which directory belongs to
 * which branch — otherwise cleanup silently misses and previews pile up.
 *
 * Usage: node scripts/preview-slug.mjs feat/New-Reasons-Panel  ->  feat-new-reasons-panel
 */

/** @param {string} branch */
export function previewSlug(branch) {
  const full = String(branch)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!full) throw new Error(`Branch name has nothing usable in it: "${branch}"`);
  if (full.length <= 48) return full;

  // Long branch names make unusable URLs, but truncating alone could collide,
  // so keep a readable head and add a short hash of the whole name.
  return `${full.slice(0, 48).replace(/-+$/, "")}-${shortHash(branch)}`;
}

function shortHash(value) {
  let h = 5381;
  for (let i = 0; i < value.length; i++) h = ((h << 5) + h + value.charCodeAt(i)) >>> 0;
  return h.toString(36).slice(0, 6);
}

if (process.argv[1] && process.argv[1].endsWith("preview-slug.mjs")) {
  const branch = process.argv[2];
  if (!branch) {
    console.error("Usage: node scripts/preview-slug.mjs <branch-name>");
    process.exit(1);
  }
  process.stdout.write(previewSlug(branch));
}
