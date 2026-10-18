/* The order of the form's questions. Change the order here and the Back and
 * Continue buttons, and the "Question 1 of 4" captions, follow.
 *
 * To add a question: make a page for it (copy name-page.ts), add it here, add
 * a route in routes.ts, add it to citizenScreens there, and add a row for it
 * on the review page.
 */

export const startPath = "/apply";

export const questions = [
  { path: "/apply/name", label: "Your name" },
  { path: "/apply/date-of-birth", label: "Date of birth" },
  { path: "/apply/contact", label: "How to contact you" },
  { path: "/apply/more-information", label: "Anything else" },
];

export const reviewPath = "/apply/review";
export const donePath = "/apply/done";

export interface Step {
  caption: string;
  back: string;
  next: string;
}

/* Links from the review page add ?change=1, so Back and Continue go straight
   back to the review page instead of on through the rest of the questions. */
export function stepFor(path: string, changing: boolean): Step {
  const index = questions.findIndex((q) => q.path === path);

  return {
    caption: `Question ${index + 1} of ${questions.length}`,
    back: changing ? reviewPath : index > 0 ? questions[index - 1].path : startPath,
    next: changing ? reviewPath : (questions[index + 1]?.path ?? reviewPath),
  };
}
