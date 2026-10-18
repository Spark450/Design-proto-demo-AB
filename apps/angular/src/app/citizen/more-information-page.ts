/* Question 4: a longer answer that people can skip. */

import { Component, inject, signal } from "@angular/core";
import { GoabFormItem, GoabTextArea } from "@abgov/angular-components";
import type { GoabTextAreaOnChangeDetail } from "@abgov/ui-components-common";
import { AnswersStore } from "./answers";
import { QuestionPage } from "./question-page";

@Component({
  selector: "app-more-information-page",
  imports: [GoabFormItem, GoabTextArea, QuestionPage],
  host: { style: "display: contents" },
  template: `
    <app-question-page
      path="/apply/more-information"
      heading="Is there anything else you'd like us to know?"
      intro="This is optional. You can leave it blank."
      [onContinue]="handleContinue"
    >
      <goab-form-item label="More information" requirement="optional">
        <goab-textarea
          name="more-information"
          [value]="moreInformation()"
          [rows]="5"
          width="100%"
          (onChange)="setMoreInformation($event)"
        />
      </goab-form-item>
    </app-question-page>
  `,
})
export class MoreInformationPage {
  private readonly store = inject(AnswersStore);
  protected readonly moreInformation = signal(this.store.answers().moreInformation);

  protected setMoreInformation(detail: GoabTextAreaOnChangeDetail) {
    this.moreInformation.set(detail.value);
  }

  protected readonly handleContinue = () => {
    this.store.saveAnswers({ moreInformation: this.moreInformation().trim() });
    return true;
  };
}
