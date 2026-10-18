/* Keeps the site's version manifest and renders the page people actually read.
 *
 * A snapshot nobody can find is a screenshot in a folder, so every publish
 * updates one manifest and re-renders one index from it. The manifest is the
 * record; the page is a view of it.
 *
 * Usage: node render-versions.mjs <site-dir> [op-json]
 *
 *   op-json is one of:
 *     {"kind":"preview","slug":…,"branch":…,"pr":…,"title":…,"commit":…}
 *     {"kind":"snapshot","slug":…,"note":…,"commit":…,"ref":…}
 *     {"kind":"remove-preview","slug":…}
 *
 * Called with no op it just re-renders, which is what makes the page
 * self-healing if it is ever deleted.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const site = process.argv[2];
if (!site) throw new Error("Usage: render-versions.mjs <site-dir> [op-json]");
const op = process.argv[3] ? JSON.parse(process.argv[3]) : null;

const manifestPath = join(site, "versions.json");
const manifest = existsSync(manifestPath)
  ? JSON.parse(readFileSync(manifestPath, "utf8"))
  : { previews: [], snapshots: [] };
manifest.previews ??= [];
manifest.snapshots ??= [];

const now = new Date().toISOString();

if (op?.kind === "preview") {
  const { kind, ...entry } = op;
  const existing = manifest.previews.find((p) => p.slug === op.slug);
  if (existing) Object.assign(existing, entry, { updated: now });
  else manifest.previews.push({ ...entry, created: now, updated: now });
} else if (op?.kind === "snapshot") {
  const { kind, ...entry } = op;
  // Snapshots are frozen by definition; the workflow refuses to reuse a name.
  if (!manifest.snapshots.some((s) => s.slug === op.slug)) {
    manifest.snapshots.push({ ...entry, created: now });
  }
} else if (op?.kind === "remove-preview") {
  manifest.previews = manifest.previews.filter((p) => p.slug !== op.slug);
} else if (op) {
  throw new Error(`Unknown op: ${op.kind}`);
}

manifest.snapshots.sort((a, b) => String(b.created).localeCompare(String(a.created)));
manifest.previews.sort((a, b) => String(b.updated).localeCompare(String(a.updated)));

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

/* ---------------------------------------------------------------- rendering */

const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );

const day = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(+d)
    ? ""
    : d.toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
};

const repo = process.env.GITHUB_REPOSITORY || "";
const commitLink = (sha) =>
  sha && repo
    ? `<a href="https://github.com/${esc(repo)}/commit/${esc(sha)}">${esc(sha.slice(0, 7))}</a>`
    : sha
      ? esc(sha.slice(0, 7))
      : "";

function card({ href, title, meta, note, tag }) {
  return `        <li class="item">
          <a class="item__title" href="${esc(href)}">${esc(title)}</a>
          ${tag ? `<span class="tag">${esc(tag)}</span>` : ""}
          ${note ? `<p class="item__note">${esc(note)}</p>` : ""}
          <p class="item__meta">${meta}</p>
        </li>`;
}

const snapshots = manifest.snapshots.map((s) =>
  card({
    href: `../v/${s.slug}/`,
    title: s.slug,
    note: s.note,
    meta: [day(s.created), s.ref ? `from <code>${esc(s.ref)}</code>` : "", commitLink(s.commit)]
      .filter(Boolean)
      .join(" · "),
  }),
);

const previews = manifest.previews.map((p) =>
  card({
    href: `../preview/${p.slug}/`,
    title: p.title || p.branch || p.slug,
    tag: p.pr ? `#${p.pr}` : "",
    meta: [
      p.branch ? `<code>${esc(p.branch)}</code>` : "",
      p.updated ? `updated ${day(p.updated)}` : "",
      commitLink(p.commit),
      p.pr && repo
        ? `<a href="https://github.com/${esc(repo)}/pull/${esc(p.pr)}">pull request</a>`
        : "",
    ]
      .filter(Boolean)
      .join(" · "),
  }),
);

const empty = (what) => `        <li class="empty">${what}</li>`;

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Versions — prototype</title>
    <style>
      :root { --ink: #333; --muted: #666; --line: #dcdcdc; --link: #0070c4; }
      * { box-sizing: border-box; }
      body {
        margin: 0; padding: 2.5rem 1.5rem 4rem;
        font: 16px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        color: var(--ink);
      }
      main { max-width: 44rem; margin: 0 auto; }
      h1 { font-size: 1.9rem; margin: 0 0 .5rem; }
      h2 { font-size: 1.15rem; margin: 2.5rem 0 .25rem; }
      a { color: var(--link); }
      .lede, .blurb { color: var(--muted); margin: 0 0 1rem; }
      .blurb { font-size: .95rem; margin: .25rem 0 1rem; }
      .banner {
        border: 1px dashed #b58100; background: #fdf7e6; color: #6b4e00;
        padding: .75rem 1rem; border-radius: 4px; font-size: .9rem; margin: 1.5rem 0 0;
      }
      ul { list-style: none; margin: 0; padding: 0; }
      .item { border-top: 1px solid var(--line); padding: .9rem 0; }
      .item__title { font-weight: 600; text-decoration: none; font-size: 1.05rem; }
      .item__title:hover { text-decoration: underline; }
      .item__note { margin: .3rem 0 0; }
      .item__meta { margin: .3rem 0 0; color: var(--muted); font-size: .85rem; }
      .item__meta a { color: var(--muted); }
      .tag {
        margin-left: .5rem; font-size: .75rem; color: var(--muted);
        border: 1px solid var(--line); border-radius: 999px; padding: .05rem .5rem;
      }
      .empty { border-top: 1px solid var(--line); padding: .9rem 0; color: var(--muted); }
      code { background: #f3f3f3; padding: .05rem .3rem; border-radius: 3px; font-size: .85em; }
      footer { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid var(--line);
               color: var(--muted); font-size: .85rem; }
    </style>
  </head>
  <body>
    <main>
      <h1>Versions of this prototype</h1>
      <p class="lede">
        <a href="../">Open the current prototype →</a>
      </p>

      <div class="banner">
        This is a prototype, not a service. Nothing here is connected to a real
        government system and no data is saved. Every link on this page needs a
        GitHub account with access to the repository — they can't be sent to
        research participants outside the organisation.
      </div>

      <h2>Snapshots</h2>
      <p class="blurb">
        Frozen. Each one stays exactly as it was, so what you showed in a session
        stays reachable afterwards.
      </p>
      <ul>
${snapshots.length ? snapshots.join("\n") : empty("No snapshots yet.")}
      </ul>

      <h2>Previews</h2>
      <p class="blurb">
        Work in progress, one per open pull request. These move as work continues
        and disappear when the branch is merged or deleted — good for a review,
        not for a link you need next month.
      </p>
      <ul>
${previews.length ? previews.join("\n") : empty("No previews open right now.")}
      </ul>

      <footer>Generated ${esc(day(now))}.</footer>
    </main>
  </body>
</html>
`;

mkdirSync(join(site, "versions"), { recursive: true });
writeFileSync(join(site, "versions", "index.html"), html);

console.log(
  `versions: ${manifest.snapshots.length} snapshot(s), ${manifest.previews.length} preview(s)`,
);
