/* Question 3: pick one option from a short list. */

import { Component, inject, signal } from "@angular/core";
import { GoabFormItem, GoabRadioGroup, GoabRadioItem } from "@abgov/angular-components";
import type { GoabRadioGroupOnChangeDetail } from "@abgov/ui-components-common";
import { AnswersStore, contactMethodLabels, type ContactMethod } from "./answers";
import { QuestionPage } from "./question-page";

@Component({
  selector: "app-contact-page",
  imports: [GoabFormItem, GoabRadioGroup, GoabRadioItem, QuestionPage],
  host: { style: "display: contents" },
  template: `
    <app-question-page
      path="/apply/contact"
      heading="How should we contact you?"
      intro="We'll use this to tell you about your application."
      [onContinue]="handleContinue"
    >
      <goab-form-item label="Contact method" [error]="error()">
        <goab-radio-group
          name="contact-method"
          [value]="contactMethod()"
          [error]="!!error()"
          (onChange)="setContactMethod($event)"
        >
          @for (option of options; track option[0]) {
            <goab-radio-item [value]="option[0]" [label]="option[1]" />
          }
        </goab-radio-group>
      </goab-form-item>
    </app-question-page>
  `,
})
export class ContactPage {
  private readonly store = inject(AnswersStore);
  protected readonly contactMethod = signal<ContactMethod>(
    this.store.answers().contactMethod,
  );
  protected readonly error = signal("");
  protected readonly options = Object.entries(contactMethodLabels);

  protected setContactMethod(detail: GoabRadioGroupOnChangeDetail) {
    this.contactMethod.set(detail.value as ContactMethod);
    this.error.set("");
  }

  protected readonly handleContinue = () => {
    const contactMethod = this.contactMethod();
    if (!contactMethod) {
      this.error.set("Select how we should contact you");
      return false;
    }
    this.store.saveAnswers({ contactMethod });
    return true;
  };
}
