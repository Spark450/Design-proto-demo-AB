/* What publishing must never do.
 *
 * The published site holds several builds at once — the main prototype at the
 * root, previews under preview/, frozen snapshots under v/. Every publish edits
 * one branch that they all share. The failure modes are quiet and expensive: a
 * deploy that takes the previews with it, a preview cleanup that eats a
 * snapshot, a race that flattens someone else's work. None of them would show
 * up until a link someone had already handed out stopped working.
 *
 * So these run the real publish.sh against a throwaway repository standing in
 * for GitHub, and check what survived.
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

/* Each test runs real git commands, which can be slow on a busy machine. */
vi.setConfig({ testTimeout: 30_000, hookTimeout: 30_000 });

const here = fileURLToPath(new URL(".", import.meta.url));
const actionDir = join(here, "..", ".github", "actions", "publish-to-pages");
const publishScript = join(actionDir, "publish.sh");

let lab;
let remote;

/* A bare repository on disk is treated as suspicious by git unless it is asked
   for by name. Ours is a stand-in for GitHub, not a checkout someone wandered
   into, so the guard is turned off for these tests only. */
const gitEnv = {
  ...process.env,
  GIT_CONFIG_COUNT: "1",
  GIT_CONFIG_KEY_0: "safe.bareRepository",
  GIT_CONFIG_VALUE_0: "all",
  GIT_TERMINAL_PROMPT: "0",
};

const git = (args, cwd) =>
  execFileSync("git", args, { cwd, env: gitEnv, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });

/** Everything published, as paths. */
const publishedFiles = () =>
  git(["-C", remote, "ls-tree", "-r", "--name-only", "gh-pages"]).trim().split("\n").filter(Boolean);

const manifest = () => JSON.parse(git(["-C", remote, "show", "gh-pages:versions.json"]));

/** A directory of built files, so each publish has something distinguishable. */
function build(name, files) {
  const dir = join(lab, name);
  mkdirSync(dir, { recursive: true });
  for (const [file, contents] of Object.entries(files)) writeFileSync(join(dir, file), contents);
  return dir;
}

function publish(env, extraPath) {
  return execFileSync("bash", [publishScript], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    env: {
      ...gitEnv,
      ...(extraPath ? { PATH: `${extraPath}:${process.env.PATH}` } : {}),
      REMOTE: remote,
      BRANCH: "gh-pages",
      ACTION_PATH: actionDir,
      MESSAGE: "publish",
      GITHUB_REPOSITORY: "GovAlta-Lab/Design-proto-demo",
      ...env,
    },
  });
}

beforeAll(() => {
  lab = mkdtempSync(join(tmpdir(), "pages-publish-"));
  remote = join(lab, "remote.git");
  git(["init", "-q", "--bare", remote]);
});

afterAll(() => rmSync(lab, { recursive: true, force: true }));

describe("publishing to the Pages branch", () => {
  it("starts the branch when it does not exist yet", () => {
    publish({ SOURCE: build("main-1", { "index.html": "main v1", "asset-v1.js": "a" }) });

    expect(publishedFiles()).toEqual(
      expect.arrayContaining(["index.html", "asset-v1.js", ".nojekyll", "versions/index.html"]),
    );
  });

  it("puts a preview in its own directory without disturbing the main build", () => {
    publish({
      SOURCE: build("preview-1", { "index.html": "preview", "asset-p.js": "b" }),
      DESTINATION: "preview/my-branch",
      ENTRY: JSON.stringify({
        kind: "preview",
        slug: "my-branch",
        branch: "my/branch",
        pr: "7",
        title: "A change",
        commit: "deadbeef",
      }),
    });

    expect(publishedFiles()).toEqual(
      expect.arrayContaining(["index.html", "preview/my-branch/index.html", "preview/my-branch/asset-p.js"]),
    );
    expect(manifest().previews.map((p) => p.slug)).toEqual(["my-branch"]);
  });

  it("records a snapshot", () => {
    publish({
      SOURCE: build("snap-1", { "index.html": "snapshot" }),
      DESTINATION: "v/feb-12",
      ENTRY: JSON.stringify({ kind: "snapshot", slug: "feb-12", note: "Session build", ref: "main" }),
    });

    expect(publishedFiles()).toContain("v/feb-12/index.html");
    expect(manifest().snapshots.map((s) => s.slug)).toEqual(["feb-12"]);
  });

  /* The one that matters most. A deploy is the most frequent publish, and the
     obvious implementation — replace everything — would delete every preview
     and every snapshot on the next merge to main. */
  it("replacing the main build leaves previews and snapshots standing", () => {
    publish({ SOURCE: build("main-2", { "index.html": "main v2", "asset-v2.js": "c" }) });

    const files = publishedFiles();
    expect(files).toContain("preview/my-branch/index.html");
    expect(files).toContain("v/feb-12/index.html");
    // The main build's own stale files still go, or hashed bundles pile up forever.
    expect(files).toContain("asset-v2.js");
    expect(files).not.toContain("asset-v1.js");
  });

  it("removes a preview without touching the snapshots", () => {
    publish({
      REMOVE: "true",
      DESTINATION: "preview/my-branch",
      ENTRY: JSON.stringify({ kind: "remove-preview", slug: "my-branch" }),
    });

    const files = publishedFiles();
    expect(files).not.toContain("preview/my-branch/index.html");
    expect(files).toContain("v/feb-12/index.html");
    expect(manifest().previews).toEqual([]);
    expect(manifest().snapshots.map((s) => s.slug)).toEqual(["feb-12"]);
  });

  it("refuses to remove the site root", () => {
    expect(() => publish({ REMOVE: "true", DESTINATION: "" })).toThrow();
    expect(publishedFiles()).toContain("index.html");
  });
});

describe("when another publish lands mid-flight", () => {
  let raceLab;
  let raceRemote;

  beforeAll(() => {
    raceLab = mkdtempSync(join(tmpdir(), "pages-race-"));
    raceRemote = join(raceLab, "remote.git");
    git(["init", "-q", "--bare", raceRemote]);

    const seed = join(raceLab, "seed");
    mkdirSync(seed);
    git(["init", "-q", seed]);
    git(["config", "user.email", "t@example.com"], seed);
    git(["config", "user.name", "t"], seed);
    git(["checkout", "-q", "-b", "gh-pages"], seed);
    writeFileSync(join(seed, "index.html"), "main v1");
    mkdirSync(join(seed, "v", "old"), { recursive: true });
    writeFileSync(join(seed, "v", "old", "index.html"), "old");
    writeFileSync(
      join(seed, "versions.json"),
      JSON.stringify({ previews: [], snapshots: [{ slug: "old", created: "2020-01-01T00:00:00.000Z" }] }),
    );
    git(["add", "-A"], seed);
    git(["commit", "-qm", "seed"], seed);
    git(["push", "-q", raceRemote, "gh-pages"], seed);
  });

  afterAll(() => rmSync(raceLab, { recursive: true, force: true }));

  it("rebuilds on top of it rather than flattening it", () => {
    /* Forcing the race by hand: a git on PATH that slips a competing publish in
       just before ours is pushed, so ours is rejected and has to retry. */
    const shimDir = join(raceLab, "bin");
    mkdirSync(shimDir);
    const realGit = execFileSync("bash", ["-c", "command -v git"], { encoding: "utf8" }).trim();
    const other = join(raceLab, "other");
    const flag = join(raceLab, "interfered");

    writeFileSync(
      join(shimDir, "git"),
      `#!/usr/bin/env bash
if [ "\${GIT_SHIM_OFF:-}" != "1" ] && [ "$1" = "push" ] && [ ! -f "${flag}" ]; then
  touch "${flag}"
  (
    export GIT_SHIM_OFF=1
    rm -rf "${other}"
    "${realGit}" clone -q --branch gh-pages "${raceRemote}" "${other}"
    cd "${other}"
    "${realGit}" config user.email o@example.com
    "${realGit}" config user.name o
    mkdir -p preview/someone-else
    echo "their work" > preview/someone-else/index.html
    "${realGit}" add -A && "${realGit}" commit -qm "their preview"
    "${realGit}" push -q origin gh-pages
  ) >/dev/null 2>&1
fi
exec "${realGit}" "$@"
`,
      { mode: 0o755 },
    );

    publish(
      {
        REMOTE: raceRemote,
        SOURCE: build("ours", { "index.html": "our preview" }),
        DESTINATION: "preview/ours",
        ENTRY: JSON.stringify({ kind: "preview", slug: "ours", branch: "ours", pr: "9" }),
      },
      shimDir,
    );

    const files = git(["-C", raceRemote, "ls-tree", "-r", "--name-only", "gh-pages"]).trim().split("\n");
    const versions = JSON.parse(git(["-C", raceRemote, "show", "gh-pages:versions.json"]));

    expect(files).toContain("preview/ours/index.html");
    expect(files).toContain("preview/someone-else/index.html");
    expect(files).toContain("v/old/index.html");
    expect(versions.snapshots.map((s) => s.slug)).toContain("old");
    expect(versions.previews.map((p) => p.slug)).toContain("ours");
  }, 30_000);
});
