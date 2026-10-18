/* Whether the worker side menu is open.
 *
 * On a desktop the designer's choice is remembered between visits. On a phone
 * the design system manages the menu itself (it slides over the page), so it is
 * always "open" as far as the layout is concerned. The breakpoint matches the
 * design system's side menu.
 */

import { DestroyRef, Injectable, computed, effect, inject, signal } from "@angular/core";

const MOBILE_BREAKPOINT = 624;
const MENU_STATE_KEY = "workspace-menu-open";

const hasWindow = typeof window !== "undefined";

function getInitialDesktopMenuState(): boolean {
  if (!hasWindow) return true;
  const saved = window.localStorage.getItem(MENU_STATE_KEY);
  return saved === null ? true : saved === "true";
}

/* Provided by the worker shell, so it lives as long as the shell does. */
@Injectable()
export class WorkspaceMenuState {
  private readonly desktopMenuOpen = signal(getInitialDesktopMenuState());
  private readonly isMobile = signal(hasWindow && window.innerWidth < MOBILE_BREAKPOINT);

  readonly menuOpen = computed(() => (this.isMobile() ? true : this.desktopMenuOpen()));

  constructor() {
    let previousWidth = window.innerWidth;

    const handleResize = () => {
      const width = window.innerWidth;
      const nowMobile = width < MOBILE_BREAKPOINT;
      this.isMobile.set(nowMobile);

      // Shrinking a desktop window closes the menu to give the page more room.
      if (width < previousWidth && !nowMobile) {
        this.desktopMenuOpen.set(false);
      }
      previousWidth = width;
    };

    window.addEventListener("resize", handleResize);
    inject(DestroyRef).onDestroy(() =>
      window.removeEventListener("resize", handleResize),
    );

    effect(() => {
      if (!this.isMobile()) {
        window.localStorage.setItem(MENU_STATE_KEY, String(this.desktopMenuOpen()));
      }
    });
  }

  toggleMenu() {
    if (!this.isMobile()) this.desktopMenuOpen.update((open) => !open);
  }
}
