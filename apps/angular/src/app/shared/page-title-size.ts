/* Task and step page titles are heading-l, and heading-m on a phone (see the
 * visual-design skill). The design system's type tokens don't shrink on their
 * own, so this picks the size from the window width. */

import { Injectable, computed, signal } from "@angular/core";

const PHONE = "(max-width: 623px)";

@Injectable({ providedIn: "root" })
export class PageTitleSize {
  private readonly query =
    typeof window !== "undefined" ? window.matchMedia?.(PHONE) : undefined;
  private readonly phone = signal(this.query?.matches === true);

  /** "heading-m" on a phone, "heading-l" everywhere else. */
  readonly size = computed(() => (this.phone() ? "heading-m" : "heading-l"));

  constructor() {
    this.query?.addEventListener("change", () => this.phone.set(this.query.matches));
  }
}
