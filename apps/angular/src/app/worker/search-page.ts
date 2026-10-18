/* Search the sample cases by name or case ID. The list narrows as you type. */

import { Component, computed, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import {
  GoabBadge,
  GoabFormItem,
  GoabInput,
  GoabTable,
  GoabText,
} from "@abgov/angular-components";
import type { GoabInputOnChangeDetail } from "@abgov/ui-components-common";

import { sampleCases, statusBadge } from "../data/sample";

@Component({
  selector: "app-search-page",
  imports: [RouterLink, GoabBadge, GoabFormItem, GoabInput, GoabTable, GoabText],
  host: { style: "display: contents" },
  template: `
    <goab-text tag="h1" size="heading-m" mt="none" mb="xl">Search</goab-text>

    <goab-form-item
      label="Name or case ID"
      labelSize="compact"
      helpText="For example, Test Person A or SAMPLE-001"
    >
      <goab-input
        name="search"
        size="compact"
        type="search"
        leadingIcon="search"
        width="460px"
        [value]="query()"
        (onChange)="setQuery($event)"
      />
    </goab-form-item>

    @if (term() && matches().length === 0) {
      <goab-text size="body-s" mt="xl" mb="none">
        No cases match "{{ query().trim() }}".
      </goab-text>
    }

    @if (matches().length > 0) {
      <div class="table--list-sizing search-results">
        <goab-table width="100%">
          <thead>
            <tr>
              <th>Status</th>
              <th>Case</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            @for (row of matches(); track row.id) {
              <tr>
                <td>
                  <goab-badge
                    [type]="statusBadge[row.status]"
                    [content]="row.status"
                    [icon]="false"
                  />
                </td>
                <td>
                  <a [routerLink]="'/internal/cases/' + row.id">{{ row.id }}</a>
                </td>
                <td>{{ row.name }}</td>
              </tr>
            }
          </tbody>
        </goab-table>
      </div>
    }
  `,
})
export class SearchPage {
  protected readonly query = signal("");
  protected readonly term = computed(() => this.query().trim().toLowerCase());
  protected readonly matches = computed(() => {
    const term = this.term();
    return term
      ? sampleCases.filter(
          (c) => c.name.toLowerCase().includes(term) || c.id.toLowerCase().includes(term),
        )
      : [];
  });
  protected readonly statusBadge = statusBadge;

  protected setQuery(detail: GoabInputOnChangeDetail) {
    this.query.set(detail.value);
  }
}
