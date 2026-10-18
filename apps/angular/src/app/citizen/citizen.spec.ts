/* Checks the citizen form's answers reach the review page, and that the
 * Change links and Back links go where they should. */

import { Type } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { RouterTestingHarness } from "@angular/router/testing";

import { AnswersStore, type Answers } from "./answers";
import { ReviewPage } from "./review-page";
import { ContactPage } from "./contact-page";
import { NamePage } from "./name-page";
import { settle } from "../shared/settle";

async function renderPage(
  path: string,
  page: Type<unknown>,
  answers: Partial<Answers> = {},
) {
  /* The answers are read from the tab's storage, so put them there first. */
  sessionStorage.setItem("proto:answers", JSON.stringify(answers));
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [
      AnswersStore,
      provideRouter([{ path: "**", component: page }], withComponentInputBinding()),
    ],
  });
  const harness = await RouterTestingHarness.create(path);
  await settle(harness.fixture);
  const markup = (harness.fixture.nativeElement as HTMLElement).innerHTML;
  sessionStorage.clear();
  return markup;
}

describe("the review page", () => {
  it("shows the answers given", async () => {
    const markup = await renderPage("/apply/review", ReviewPage, {
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

  it("links each answer back to its question, then back to review", async () => {
    const markup = await renderPage("/apply/review", ReviewPage);
    expect(markup).toContain('href="/apply/name?change=1"');
    expect(markup).toContain('href="/apply/contact?change=1"');
    expect(markup).toContain("Change<span");
  });
});

describe("the question pages", () => {
  it("go back to the previous question", async () => {
    expect(await renderPage("/apply/contact", ContactPage)).toContain(
      'href="/apply/date-of-birth"',
    );
  });

  it("go back to the start page from the first question", async () => {
    expect(await renderPage("/apply/name", NamePage)).toContain('href="/apply"');
  });

  it("go back to the review page when changing an answer", async () => {
    expect(await renderPage("/apply/contact?change=1", ContactPage)).toContain(
      'href="/apply/review"',
    );
  });

  it("show the answer already given", async () => {
    expect(await renderPage("/apply/name", NamePage, { firstName: "Sample" })).toContain(
      'value="Sample"',
    );
  });
});
