/* Starts the prototype.
 *
 * The design system's web components are loaded once, here, before anything
 * draws. The goab-* Angular components are thin wrappers around them.
 *
 * The router's base comes from the <base href> the build writes into
 * index.html, so the same app works at the site root, under /preview/<branch>/
 * and under /v/<name>/. Pages use real addresses (not #/ ones), so any link can
 * be shared and reloaded.
 */

import "@abgov/web-components";
import { bootstrapApplication } from "@angular/platform-browser";

import { appConfig } from "./app/app.config";
import { App } from "./app/app";

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
