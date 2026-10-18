/* Question 3: pick one option from a short list. */

import { useState } from "react";
import { GoabFormItem, GoabRadioGroup, GoabRadioItem } from "@abgov/react-components";
import type { GoabRadioGroupOnChangeDetail } from "@abgov/ui-components-common";
import { contactMethodLabels, useAnswers, type ContactMethod } from "./answers";
import { QuestionPage } from "./QuestionPage";

export function ContactPage() {
  const { answers, saveAnswers } = useAnswers();
  const [contactMethod, setContactMethod] = useState<ContactMethod>(answers.contactMethod);
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!contactMethod) {
      setError("Select how we should contact you");
      return false;
    }
    saveAnswers({ contactMethod });
    return true;
  };

  return (
    <QuestionPage
      path="/apply/contact"
      heading="How should we contact you?"
      intro="We'll use this to tell you about your application."
      onContinue={handleContinue}
    >
      <GoabFormItem label="Contact method" error={error}>
        <GoabRadioGroup
          name="contact-method"
          value={contactMethod}
          error={!!error}
          onChange={(detail: GoabRadioGroupOnChangeDetail) => {
            setContactMethod(detail.value as ContactMethod);
            setError("");
          }}
        >
          {Object.entries(contactMethodLabels).map(([value, label]) => (
            <GoabRadioItem key={value} value={value} label={label} />
          ))}
        </GoabRadioGroup>
      </GoabFormItem>
    </QuestionPage>
  );
}
