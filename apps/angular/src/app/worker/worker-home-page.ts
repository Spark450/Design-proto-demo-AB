/* The worker landing page: a heading and a short list of sample cases.
 *
 * The table follows the design system's "Show status in a table" example. The
 * data comes from src/app/data/sample.ts and is all made up.
 */

import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { GoabBadge, GoabTable, GoabText } from "@abgov/angular-components";

import { sampleCases, statusBadge } from "../data/sample";
import { formatDate } from "../shared/format-date";

@Component({
  selector: "app-worker-home-page",
  imports: [RouterLink, GoabBadge, GoabTable, GoabText],
  host: { style: "display: contents" },
  template: `
    <goab-text tag="h1" size="heading-m" mt="none" mb="xs">Cases</goab-text>
    <goab-text size="body-s" color="secondary" mt="none" mb="xl">
      Sample cases to show how a worker screen looks. None of this is real.
    </goab-text>

    <div class="table--list-sizing">
      <goab-table width="100%">
        <thead>
          <tr>
            <th>Status</th>
            <th>Case</th>
            <th>Name</th>
            <th>Submitted</th>
          </tr>
        </thead>
        <tbody>
          @for (row of sampleCases; track row.id) {
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
              <td>{{ formatDate(row.submitted) }}</td>
            </tr>
          }
        </tbody>
      </goab-table>
    </div>
  `,
})
export class WorkerHomePage {
  protected readonly sampleCases = sampleCases;
  protected readonly statusBadge = statusBadge;
  protected readonly formatDate = formatDate;
}
