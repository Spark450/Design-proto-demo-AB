/* The address of the page on screen, without the base path or any ?query,
 * such as "/apply/name". Kept up to date as people move around, so the
 * prototype controls and the side menus can show where they are.
 */

import { Injectable, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router } from "@angular/router";
import { filter, map } from "rxjs";

function pathOf(url: string): string {
  return url.split(/[?#]/)[0] || "/";
}

@Injectable({ providedIn: "root" })
export class CurrentPath {
  private readonly router = inject(Router);

  readonly pathname = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => pathOf(e.urlAfterRedirects)),
    ),
    { initialValue: pathOf(this.router.url) },
  );
}
