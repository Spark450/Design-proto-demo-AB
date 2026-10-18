/* Question 1: two text inputs, both required. */

import { useState } from "react";
import { GoabFormItem, GoabInput } from "@abgov/react-components";
import type { GoabInputOnChangeDetail } from "@abgov/ui-components-common";
import { useAnswers } from "./answers";
import { QuestionPage } from "./QuestionPage";

export function NamePage() {
  const { answers, saveAnswers } = useAnswers();
  const [firstName, setFirstName] = useState(answers.firstName);
  const [lastName, setLastName] = useState(answers.lastName);
  const [errors, setErrors] = useState({ firstName: "", lastName: "" });

  const handleContinue = () => {
    const found = {
      firstName: firstName.trim() ? "" : "Enter your first name",
      lastName: lastName.trim() ? "" : "Enter your last name",
    };
    setErrors(found);
    if (found.firstName || found.lastName) return false;
    saveAnswers({ firstName: firstName.trim(), lastName: lastName.trim() });
    return true;
  };

  return (
    <QuestionPage
      path="/apply/name"
      heading="What is your name?"
      intro="Use the name on your government-issued ID."
      onContinue={handleContinue}
    >
      <GoabFormItem label="First name" error={errors.firstName}>
        <GoabInput
          name="first-name"
          value={firstName}
          error={!!errors.firstName}
          width="460px"
          onChange={(detail: GoabInputOnChangeDetail) => setFirstName(detail.value)}
        />
      </GoabFormItem>
      <GoabFormItem label="Last name" error={errors.lastName} mt="l">
        <GoabInput
          name="last-name"
          value={lastName}
          error={!!errors.lastName}
          width="460px"
          onChange={(detail: GoabInputOnChangeDetail) => setLastName(detail.value)}
        />
      </GoabFormItem>
    </QuestionPage>
  );
}
