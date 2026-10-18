/* Checks the citizen form's answers reach the review page, and that the
 * Change links and Back links go where they should. */

import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { AnswersProvider, type Answers } from "./answers";
import { ReviewPage } from "./ReviewPage";
import { ContactPage } from "./ContactPage";
import { NamePage } from "./NamePage";

function renderPage(path: string, page: ReactElement, answers: Partial<Answers> = {}) {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[path]}>
      <AnswersProvider initial={answers}>
        <Routes>
          <Route path="*" element={page} />
        </Routes>
      </AnswersProvider>
    </MemoryRouter>,
  );
}

describe("the review page", () => {
  it("shows the answers given", () => {
    const markup = renderPage("/apply/review", <ReviewPage />, {
      firstName: "Test",
      lastName: "Person",
      dateOfBirth: "1990-01-06",
      contactMethod: "phone",
      moreInformation: "Nothing else.",
    });
    expect(markup).toContain("Test Person");
    expect(markup).toContain("January 6, 1990");
    expect(markup).toContain("Phone");
    expect(markup).toContain("Nothing else.");
    expect(markup).not.toContain("Not provided");
  });

  it("links each answer back to its question, then back to review", () => {
    const markup = renderPage("/apply/review", <ReviewPage />);
    expect(markup).toContain('href="/apply/name?change=1"');
    expect(markup).toContain('href="/apply/contact?change=1"');
    expect(markup).toContain("Change<span");
  });
});

describe("the question pages", () => {
  it("go back to the previous question", () => {
    expect(renderPage("/apply/contact", <ContactPage />)).toContain('href="/apply/date-of-birth"');
  });

  it("go back to the start page from the first question", () => {
    expect(renderPage("/apply/name", <NamePage />)).toContain('href="/apply"');
  });

  it("go back to the review page when changing an answer", () => {
    expect(renderPage("/apply/contact?change=1", <ContactPage />)).toContain(
      'href="/apply/review"',
    );
  });

  it("show the answer already given", () => {
    expect(renderPage("/apply/name", <NamePage />, { firstName: "Sample" })).toContain(
      'value="Sample"',
    );
  });
});
