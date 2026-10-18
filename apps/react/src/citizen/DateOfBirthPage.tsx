/* Question 2: a date, which must be in the past. Follows the design system's
 * "Ask a user for a birthday" example. */

import { useState } from "react";
import { GoabDatePicker, GoabFormItem } from "@abgov/react-components";
import type { GoabDatePickerOnChangeDetail } from "@abgov/ui-components-common";
import { useAnswers } from "./answers";
import { QuestionPage } from "./QuestionPage";

function isInThePast(value: string) {
  const today = new Date();
  const todayStr = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
  return value < todayStr;
}

export function DateOfBirthPage() {
  const { answers, saveAnswers } = useAnswers();
  const [dateOfBirth, setDateOfBirth] = useState(answers.dateOfBirth);
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!dateOfBirth) {
      setError("Enter your date of birth");
      return false;
    }
    if (!isInThePast(dateOfBirth)) {
      setError("Date of birth must be in the past");
      return false;
    }
    saveAnswers({ dateOfBirth });
    return true;
  };

  return (
    <QuestionPage
      path="/apply/date-of-birth"
      heading="What is your date of birth?"
      onContinue={handleContinue}
    >
      <GoabFormItem label="Date of birth" helpText="For example, January 27 1990" error={error}>
        <GoabDatePicker
          name="date-of-birth"
          type="input"
          value={dateOfBirth || undefined}
          error={!!error}
          onChange={(detail: GoabDatePickerOnChangeDetail) => {
            setDateOfBirth(detail.valueStr ?? "");
            setError("");
          }}
        />
      </GoabFormItem>
    </QuestionPage>
  );
}
