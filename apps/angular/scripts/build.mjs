/* Builds the prototype the way the site's build step expects.
 *
 * The workflows run `npm run build -- --outDir <folder> --emptyOutDir` with a
 * BASE_PATH such as /preview/my-branch/. Those are Vite's flags; `ng build`
 * names them differently and always writes to dist/ (see angular.json), so
 * this builds there and copies the result across. With no arguments it builds
 * into dist/ for the site root, like a plain `ng build`.
 */

import { spawnSync } from "node:child_process";
import { cpSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    outDir: { type: "string", default: "dist" },
    emptyOutDir: { type: "boolean", default: false },
  },
});

const base = process.env.BASE_PATH || "/";
const built = resolve("dist");
const target = resolve(values.outDir);

const result = spawnSync(
  "npx",
  ["ng", "build", "--base-href", base.endsWith("/") ? base : `${base}/`],
  {
    stdio: "inherit",
    shell: process.platform === "win32",
  },
);
if (result.status !== 0) process.exit(result.status ?? 1);

if (target !== built) {
  if (values.emptyOutDir) rmSync(target, { recursive: true, force: true });
  cpSync(built, target, { recursive: true });
  rmSync(built, { recursive: true, force: true });
}
