/* "Check your answers", following the design system's review page pattern: a
 * table of every answer with a Change link beside each one, then a Submit
 * button.
 *
 * Each Change link goes back to its question with ?change=1, so Continue
 * returns here instead of going on through the rest of the questions.
 */

import { Component, computed, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import {
  GoabButton,
  GoabButtonGroup,
  GoabLink,
  GoabTable,
  GoabText,
} from "@abgov/angular-components";
import { formatDate } from "../shared/format-date";
import { PageTitleSize } from "../shared/page-title-size";
import { AnswersStore, contactMethodLabels } from "./answers";
import { donePath } from "./journey";

@Component({
  selector: "app-review-page",
  imports: [RouterLink, GoabButton, GoabButtonGroup, GoabLink, GoabTable, GoabText],
  host: { style: "display: contents" },
  template: `
    <goab-link leadingIcon="arrow-back" size="small" mb="none">
      <a routerLink="/apply/more-information">Back</a>
    </goab-link>

    <goab-text tag="h1" [size]="titleSize()" mt="xl" mb="m">Check your answers</goab-text>
    <goab-text size="body-m" mt="none" mb="l">
      Make sure these are right before you submit.
    </goab-text>

    <goab-table width="100%">
      <tbody>
        @for (row of rows(); track row.path) {
          <tr>
            <td>
              <strong>{{ row.question }}</strong>
            </td>
            <td>{{ row.answer || "Not provided" }}</td>
            <td>
              <goab-link size="small">
                <a [routerLink]="row.path" [queryParams]="{ change: 1 }"
                  >Change<span class="visually-hidden">
                    {{ row.question.toLowerCase() }}</span
                  ></a
                >
              </goab-link>
            </td>
          </tr>
        }
      </tbody>
    </goab-table>

    <goab-button-group alignment="start" mt="2xl">
      <goab-button type="primary" (onClick)="submit()">Submit application</goab-button>
    </goab-button-group>
  `,
})
export class ReviewPage {
  private readonly router = inject(Router);
  private readonly answers = inject(AnswersStore).answers;
  protected readonly titleSize = inject(PageTitleSize).size;

  protected readonly rows = computed(() => {
    const answers = this.answers();
    return [
      {
        question: "Name",
        answer: [answers.firstName, answers.lastName].filter(Boolean).join(" "),
        path: "/apply/name",
      },
      {
        question: "Date of birth",
        answer: formatDate(answers.dateOfBirth),
        path: "/apply/date-of-birth",
      },
      {
        question: "Contact method",
        answer: answers.contactMethod ? contactMethodLabels[answers.contactMethod] : "",
        path: "/apply/contact",
      },
      {
        question: "More information",
        answer: answers.moreInformation,
        path: "/apply/more-information",
      },
    ];
  });

  protected submit() {
    this.router.navigateByUrl(donePath);
  }
}
