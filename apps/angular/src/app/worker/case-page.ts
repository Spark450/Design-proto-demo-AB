/* One case, following the design system's "review and action" example: the
 * case details on the left, and a decision form on the right.
 *
 * The decision isn't saved anywhere. It shows a confirmation, and is gone when
 * you leave the page.
 */

import { Component, computed, input, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import {
  GoabBadge,
  GoabBlock,
  GoabButton,
  GoabCallout,
  GoabContainer,
  GoabDropdown,
  GoabDropdownItem,
  GoabFormItem,
  GoabGrid,
  GoabLink,
  GoabRadioGroup,
  GoabRadioItem,
  GoabText,
  GoabTextArea,
} from "@abgov/angular-components";
import type {
  GoabDropdownOnChangeDetail,
  GoabRadioGroupOnChangeDetail,
  GoabTextAreaOnChangeDetail,
} from "@abgov/ui-components-common";

import { findCase, statusBadge } from "../data/sample";
import { formatDate } from "../shared/format-date";

@Component({
  selector: "app-case-detail",
  imports: [GoabBlock, GoabText],
  template: `
    <goab-block direction="column" gap="3xs" width="100%">
      <goab-text size="body-xs" color="secondary" mt="none" mb="none">{{
        label()
      }}</goab-text>
      <goab-text size="body-s" mt="none" mb="none">{{ value() }}</goab-text>
    </goab-block>
  `,
})
export class CaseDetail {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
}

@Component({
  selector: "app-back-to-cases",
  imports: [RouterLink, GoabLink],
  host: { style: "display: contents" },
  template: `
    <goab-link leadingIcon="arrow-back" size="small" mb="none">
      <a routerLink="/internal">Back to cases</a>
    </goab-link>
  `,
})
export class BackToCases {}

@Component({
  selector: "app-case-page",
  imports: [
    BackToCases,
    CaseDetail,
    GoabBadge,
    GoabBlock,
    GoabButton,
    GoabCallout,
    GoabContainer,
    GoabDropdown,
    GoabDropdownItem,
    GoabFormItem,
    GoabGrid,
    GoabRadioGroup,
    GoabRadioItem,
    GoabText,
    GoabTextArea,
  ],
  host: { style: "display: contents" },
  templateUrl: "./case-page.html",
})
export class CasePage {
  /** From the address, /internal/cases/:caseId. */
  readonly caseId = input<string>();

  protected readonly sampleCase = computed(() => findCase(this.caseId()));

  protected readonly decision = signal("");
  protected readonly reason = signal("");
  protected readonly note = signal("");
  protected readonly errors = signal({ decision: "", reason: "" });
  protected readonly recorded = signal(false);

  protected readonly statusBadge = statusBadge;
  protected readonly formatDate = formatDate;

  protected recordDecision() {
    const decision = this.decision();
    const found = {
      decision: decision ? "" : "Select a decision",
      reason: decision === "deny" && !this.reason() ? "Select a reason" : "",
    };
    this.errors.set(found);
    if (found.decision || found.reason) return;
    this.recorded.set(true);
  }

  protected onDecision(detail: GoabRadioGroupOnChangeDetail) {
    this.decision.set(detail.value);
    this.errors.set({ decision: "", reason: "" });
  }

  protected onReason(detail: GoabDropdownOnChangeDetail) {
    this.reason.set(detail.value ?? "");
    this.errors.update((e) => ({ ...e, reason: "" }));
  }

  protected onNote(detail: GoabTextAreaOnChangeDetail) {
    this.note.set(detail.value);
  }
}
