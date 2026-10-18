/* "Check your answers", following the design system's review page pattern: a
 * table of every answer with a Change link beside each one, then a Submit
 * button.
 *
 * Each Change link goes back to its question with ?change=1, so Continue
 * returns here instead of going on through the rest of the questions.
 */

import { Link, useNavigate } from "react-router-dom";
import {
  GoabButton,
  GoabButtonGroup,
  GoabLink,
  GoabTable,
  GoabText,
} from "@abgov/react-components";
import { formatDate } from "../shared/formatDate";
import { usePageTitleSize } from "../shared/usePageTitleSize";
import { contactMethodLabels, useAnswers } from "./answers";
import { donePath } from "./journey";

export function ReviewPage() {
  const navigate = useNavigate();
  const { answers } = useAnswers();
  const titleSize = usePageTitleSize();

  const rows = [
    {
      question: "Name",
      answer: [answers.firstName, answers.lastName].filter(Boolean).join(" "),
      path: "/apply/name",
    },
    { question: "Date of birth", answer: formatDate(answers.dateOfBirth), path: "/apply/date-of-birth" },
    {
      question: "Contact method",
      answer: answers.contactMethod ? contactMethodLabels[answers.contactMethod] : "",
      path: "/apply/contact",
    },
    { question: "More information", answer: answers.moreInformation, path: "/apply/more-information" },
  ];

  return (
    <>
      <GoabLink leadingIcon="arrow-back" size="small" mb="none">
        <Link to="/apply/more-information">Back</Link>
      </GoabLink>

      <GoabText tag="h1" size={titleSize} mt="xl" mb="m">
        Check your answers
      </GoabText>
      <GoabText size="body-m" mt="none" mb="l">
        Make sure these are right before you submit.
      </GoabText>

      <GoabTable width="100%">
        <tbody>
          {rows.map((row) => (
            <tr key={row.path}>
              <td>
                <strong>{row.question}</strong>
              </td>
              <td>{row.answer || "Not provided"}</td>
              <td>
                <GoabLink size="small">
                  <Link to={`${row.path}?change=1`}>
                    Change<span className="visually-hidden"> {row.question.toLowerCase()}</span>
                  </Link>
                </GoabLink>
              </td>
            </tr>
          ))}
        </tbody>
      </GoabTable>

      <GoabButtonGroup alignment="start" mt="2xl">
        <GoabButton type="primary" onClick={() => navigate(donePath)}>
          Submit application
        </GoabButton>
      </GoabButtonGroup>
    </>
  );
}
