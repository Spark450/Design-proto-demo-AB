/* The order of the form's questions. Change the order here and the Back and
 * Continue buttons, and the "Question 1 of 4" captions, follow.
 *
 * To add a question: make a page for it (copy NamePage.tsx), add it here, add
 * a route in routes.tsx, add it to citizenScreens there, and add a row for it
 * on the review page.
 */

import { useLocation } from "react-router-dom";

export const startPath = "/apply";

export const questions = [
  { path: "/apply/name", label: "Your name" },
  { path: "/apply/date-of-birth", label: "Date of birth" },
  { path: "/apply/contact", label: "How to contact you" },
  { path: "/apply/more-information", label: "Anything else" },
];

export const reviewPath = "/apply/review";
export const donePath = "/apply/done";

/* Links from the review page add ?change=1, so Back and Continue go straight
   back to the review page instead of on through the rest of the questions. */
export function useStep(path: string) {
  const { search } = useLocation();
  const changing = new URLSearchParams(search).get("change") === "1";
  const index = questions.findIndex((q) => q.path === path);

  return {
    caption: `Question ${index + 1} of ${questions.length}`,
    back: changing ? reviewPath : index > 0 ? questions[index - 1].path : startPath,
    next: changing ? reviewPath : (questions[index + 1]?.path ?? reviewPath),
  };
}
