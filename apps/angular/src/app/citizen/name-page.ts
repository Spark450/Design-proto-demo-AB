/* Question 1: two text inputs, both required. */

import { Component, inject, signal } from "@angular/core";
import { GoabFormItem, GoabInput } from "@abgov/angular-components";
import type { GoabInputOnChangeDetail } from "@abgov/ui-components-common";
import { AnswersStore } from "./answers";
import { QuestionPage } from "./question-page";

@Component({
  selector: "app-name-page",
  imports: [GoabFormItem, GoabInput, QuestionPage],
  host: { style: "display: contents" },
  template: `
    <app-question-page
      path="/apply/name"
      heading="What is your name?"
      intro="Use the name on your government-issued ID."
      [onContinue]="handleContinue"
    >
      <goab-form-item label="First name" [error]="errors().firstName">
        <goab-input
          name="first-name"
          [value]="firstName()"
          [error]="!!errors().firstName"
          width="460px"
          (onChange)="setFirstName($event)"
        />
      </goab-form-item>
      <goab-form-item label="Last name" [error]="errors().lastName" mt="l">
        <goab-input
          name="last-name"
          [value]="lastName()"
          [error]="!!errors().lastName"
          width="460px"
          (onChange)="setLastName($event)"
        />
      </goab-form-item>
    </app-question-page>
  `,
})
export class NamePage {
  private readonly store = inject(AnswersStore);
  protected readonly firstName = signal(this.store.answers().firstName);
  protected readonly lastName = signal(this.store.answers().lastName);
  protected readonly errors = signal({ firstName: "", lastName: "" });

  protected setFirstName(detail: GoabInputOnChangeDetail) {
    this.firstName.set(detail.value);
  }

  protected setLastName(detail: GoabInputOnChangeDetail) {
    this.lastName.set(detail.value);
  }

  protected readonly handleContinue = () => {
    const firstName = this.firstName().trim();
    const lastName = this.lastName().trim();
    const found = {
      firstName: firstName ? "" : "Enter your first name",
      lastName: lastName ? "" : "Enter your last name",
    };
    this.errors.set(found);
    if (found.firstName || found.lastName) return false;
    this.store.saveAnswers({ firstName, lastName });
    return true;
  };
}
