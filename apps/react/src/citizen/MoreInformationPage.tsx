/* Question 4: a longer answer that people can skip. */

import { useState } from "react";
import { GoabFormItem, GoabTextArea } from "@abgov/react-components";
import type { GoabTextAreaOnChangeDetail } from "@abgov/ui-components-common";
import { useAnswers } from "./answers";
import { QuestionPage } from "./QuestionPage";

export function MoreInformationPage() {
  const { answers, saveAnswers } = useAnswers();
  const [moreInformation, setMoreInformation] = useState(answers.moreInformation);

  return (
    <QuestionPage
      path="/apply/more-information"
      heading="Is there anything else you'd like us to know?"
      intro="This is optional. You can leave it blank."
      onContinue={() => {
        saveAnswers({ moreInformation: moreInformation.trim() });
        return true;
      }}
    >
      <GoabFormItem label="More information" requirement="optional">
        <GoabTextArea
          name="more-information"
          value={moreInformation}
          rows={5}
          width="100%"
          onChange={(detail: GoabTextAreaOnChangeDetail) => setMoreInformation(detail.value)}
        />
      </GoabFormItem>
    </QuestionPage>
  );
}
