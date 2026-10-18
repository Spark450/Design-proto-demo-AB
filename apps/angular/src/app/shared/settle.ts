/* For the tests. The design system's Angular components draw their inner
 * element a moment after they appear, so wait for that a few times: once for
 * the page, then for anything the page shows inside those components. */

import type { ComponentFixture } from "@angular/core/testing";

export async function settle(fixture: ComponentFixture<unknown>) {
  for (let i = 0; i < 3; i++) {
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve));
    fixture.detectChanges();
  }
}
