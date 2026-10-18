/* The worker side of the prototype: the design system's workspace pattern.
 *
 * goab-workspace-layout fills the whole window, and the design system says it
 * should sit directly in the router outlet. That's why app.routes.ts keeps each
 * side's routes at the top level rather than nesting them inside a shared
 * layout: each side gets the whole window on its own terms.
 *
 * To add a page: make a component in src/app/worker/, add a route for it in
 * src/app/worker/routes.ts (and to workerScreens there, so the prototype
 * controls can reach it), and add a goab-work-side-menu-item for it below if it
 * belongs in the menu.
 */

import { Component, ViewEncapsulation, inject } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import {
  GoabWorkSideMenu,
  GoabWorkSideMenuItem,
  GoabWorkspaceLayout,
} from "@abgov/angular-components";

import { sampleWorker } from "../data/sample";
import { baseWithoutSlash } from "../shared/base-path";
import { CurrentPath } from "../shared/current-path";
import { prototypeName } from "../shared/prototype";
import { VersionBanner } from "../shared/version-banner";
import { WorkspaceMenuState } from "./workspace-menu-state";

/* Menu item URLs are full addresses, so they include the base path this build
   was published under (a preview or snapshot lives below the site root). The
   router works without it, so it is taken off again when navigating. */
const base = baseWithoutSlash;

@Component({
  selector: "app-worker-shell",
  imports: [
    RouterOutlet,
    GoabWorkSideMenu,
    GoabWorkSideMenuItem,
    GoabWorkspaceLayout,
    VersionBanner,
  ],
  providers: [WorkspaceMenuState],
  styleUrl: "./worker.css",
  encapsulation: ViewEncapsulation.None,
  host: { style: "display: contents" },
  template: `
    <ng-template #sideMenu>
      <goab-work-side-menu
        [heading]="prototypeName"
        [url]="base + '/internal'"
        [userName]="sampleWorker.name"
        [userSecondaryText]="sampleWorker.role"
        [open]="menu.menuOpen()"
        (onToggle)="menu.toggleMenu()"
        (onNavigate)="navigate($event)"
        [primaryContent]="primaryContent"
      />
    </ng-template>

    <ng-template #primaryContent>
      <goab-work-side-menu-item
        icon="list"
        label="Cases"
        [url]="base + '/internal'"
        [current]="pathname() === '/internal' || pathname().startsWith('/internal/cases')"
      />
      <goab-work-side-menu-item
        icon="search"
        label="Search"
        [url]="base + '/internal/search'"
        [current]="pathname() === '/internal/search'"
      />
    </ng-template>

    <goab-workspace-layout [sideMenu]="sideMenu">
      <div class="worker-page">
        <app-version-banner />
        <router-outlet />
      </div>
    </goab-workspace-layout>
  `,
})
export class WorkerShell {
  private readonly router = inject(Router);
  protected readonly menu = inject(WorkspaceMenuState);
  protected readonly pathname = inject(CurrentPath).pathname;

  protected readonly base = base;
  protected readonly prototypeName = prototypeName;
  protected readonly sampleWorker = sampleWorker;

  protected navigate(path: string) {
    this.router.navigateByUrl(path.replace(base, "") || "/");
  }
}
