/* Question 2: a date, which must be in the past. Follows the design system's
 * "Ask a user for a birthday" example. */

import { Component, inject, signal } from "@angular/core";
import { GoabDatePicker, GoabFormItem } from "@abgov/angular-components";
import type { GoabDatePickerOnChangeDetail } from "@abgov/ui-components-common";
import { AnswersStore } from "./answers";
import { QuestionPage } from "./question-page";

function isInThePast(value: string) {
  const today = new Date();
  const todayStr = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
  return value < todayStr;
}

@Component({
  selector: "app-date-of-birth-page",
  imports: [GoabDatePicker, GoabFormItem, QuestionPage],
  host: { style: "display: contents" },
  template: `
    <app-question-page
      path="/apply/date-of-birth"
      heading="What is your date of birth?"
      [onContinue]="handleContinue"
    >
      <goab-form-item
        label="Date of birth"
        helpText="For example, January 27 1990"
        [error]="error()"
      >
        <goab-date-picker
          name="date-of-birth"
          type="input"
          [value]="dateOfBirth() || undefined"
          [error]="!!error()"
          (onChange)="setDateOfBirth($event)"
        />
      </goab-form-item>
    </app-question-page>
  `,
})
export class DateOfBirthPage {
  private readonly store = inject(AnswersStore);
  protected readonly dateOfBirth = signal(this.store.answers().dateOfBirth);
  protected readonly error = signal("");

  protected setDateOfBirth(detail: GoabDatePickerOnChangeDetail) {
    this.dateOfBirth.set(detail.valueStr ?? "");
    this.error.set("");
  }

  protected readonly handleContinue = () => {
    const dateOfBirth = this.dateOfBirth();
    if (!dateOfBirth) {
      this.error.set("Enter your date of birth");
      return false;
    }
    if (!isInThePast(dateOfBirth)) {
      this.error.set("Date of birth must be in the past");
      return false;
    }
    this.store.saveAnswers({ dateOfBirth });
    return true;
  };
}
