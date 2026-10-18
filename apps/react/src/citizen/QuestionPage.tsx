/* The frame every question page shares, following the design system's
 * question page pattern: a back link, "Question 1 of 4", the question as the
 * page heading, the answer fields, and a Continue button.
 *
 * Each question page passes in its fields and an onContinue that checks the
 * answer. If onContinue returns true, this moves on to the next page.
 */

import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GoabButton,
  GoabButtonGroup,
  GoabLink,
  GoabText,
} from "@abgov/react-components";
import { usePageTitleSize } from "../shared/usePageTitleSize";
import { useStep } from "./journey";

interface QuestionPageProps {
  /** This page's address, as listed in journey.ts. */
  path: string;
  heading: string;
  /** A sentence under the heading. Optional. */
  intro?: ReactNode;
  /** Check the answer and save it. Return false to stay on the page. */
  onContinue: () => boolean;
  children: ReactNode;
}

export function QuestionPage({ path, heading, intro, onContinue, children }: QuestionPageProps) {
  const navigate = useNavigate();
  const step = useStep(path);
  const titleSize = usePageTitleSize();

  return (
    <>
      <GoabLink leadingIcon="arrow-back" size="small" mb="none">
        <Link to={step.back}>Back</Link>
      </GoabLink>

      <GoabText size="body-xs" color="secondary" mt="xl" mb="xs">
        {step.caption}
      </GoabText>
      <GoabText tag="h1" size={titleSize} mt="none" mb="m">
        {heading}
      </GoabText>
      {intro && (
        <GoabText size="body-m" mt="none" mb="xl">
          {intro}
        </GoabText>
      )}

      {children}

      <GoabButtonGroup alignment="start" mt="2xl">
        <GoabButton
          type="primary"
          onClick={() => {
            if (onContinue()) navigate(step.next);
          }}
        >
          Continue
        </GoabButton>
      </GoabButtonGroup>
    </>
  );
}
