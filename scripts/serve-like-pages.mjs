/* A static server that serves the way GitHub Pages does, so the preview and
 * snapshot routing can be exercised before anything is published for real.
 *
 * The rule that matters: there is exactly one 404 document, at the site root,
 * and it answers every path that isn't a file.
 *
 * Usage: node scripts/serve-like-pages.mjs <site-dir> [port]
 */

import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const site = process.argv[2] || "dist";
const port = Number(process.argv[3] || 8080);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const send = (res, status, file) => {
  res.writeHead(status, { "content-type": TYPES[extname(file)] || "application/octet-stream" });
  createReadStream(file).pipe(res);
};

createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  const target = join(site, normalize(path).replace(/^(\.\.[/\\])+/, ""));

  if (existsSync(target) && statSync(target).isFile()) return send(res, 200, target);

  const index = join(target, "index.html");
  if (path.endsWith("/") && existsSync(index)) return send(res, 200, index);

  const notFound = join(site, "404.html");
  if (existsSync(notFound)) return send(res, 404, notFound);

  res.writeHead(404, { "content-type": "text/plain" });
  res.end("Not found");
}).listen(port, () => console.log(`Serving ${site} like GitHub Pages on http://localhost:${port}`));
