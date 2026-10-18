/* The confirmation page, following the design system's result page pattern.
 * The reference number is made up. */

import { Link } from "react-router-dom";
import { GoabCallout, GoabText } from "@abgov/react-components";
import { usePageTitleSize } from "../shared/usePageTitleSize";
import { useAnswers } from "./answers";
import { startPath } from "./journey";

export function DonePage() {
  const { answers } = useAnswers();
  const titleSize = usePageTitleSize();

  return (
    <>
      <GoabText tag="h1" size={titleSize} mt="none" mb="l">
        Application submitted
      </GoabText>

      <GoabCallout type="success" heading="We've received your application">
        <GoabText size="body-m" mt="none" mb="none">
          Your reference number is <strong>SAMPLE-REF-0001</strong>
        </GoabText>
      </GoabCallout>

      <GoabText tag="h2" size="heading-s" mt="xl" mb="s">
        What happens next
      </GoabText>
      <GoabText size="body-m" mt="none" mb="s">
        We'll review your application within 10 business days.
        {answers.contactMethod === "phone"
          ? " We'll phone you when it's done."
          : answers.contactMethod === "mail"
            ? " We'll send you a letter when it's done."
            : " We'll email you when it's done."}
      </GoabText>
      <GoabText size="body-m" mt="none" mb="s">
        <Link to={startPath}>Go back to the start</Link>
      </GoabText>
    </>
  );
}
