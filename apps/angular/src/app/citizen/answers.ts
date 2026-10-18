/* What the person has answered so far, shared by every page of the form.
 *
 * Answers are kept for this browser tab (sessionStorage), so a page reload
 * doesn't lose them, and closing the tab clears them. "Start over" in the
 * prototype controls clears them too.
 *
 * The citizen layout provides this, so every citizen page shares one copy and
 * it is read fresh from storage each time someone comes to the citizen side.
 */

import { Injectable, signal } from "@angular/core";

export type ContactMethod = "" | "email" | "phone" | "mail";

export interface Answers {
  firstName: string;
  lastName: string;
  /** As the date picker gives it: YYYY-MM-DD. */
  dateOfBirth: string;
  contactMethod: ContactMethod;
  moreInformation: string;
}

export const emptyAnswers: Answers = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  contactMethod: "",
  moreInformation: "",
};

export const contactMethodLabels: Record<Exclude<ContactMethod, "">, string> = {
  email: "Email",
  phone: "Phone",
  mail: "Mail",
};

const STORAGE_KEY = "proto:answers";

function loadAnswers(): Answers {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return { ...emptyAnswers, ...JSON.parse(stored) };
  } catch {
    /* No storage (or something unreadable in it): start empty. */
  }
  return emptyAnswers;
}

@Injectable()
export class AnswersStore {
  private readonly current = signal<Answers>(loadAnswers());

  /** The answers so far. Read it like a function: answers().firstName. */
  readonly answers = this.current.asReadonly();

  saveAnswers(changes: Partial<Answers>) {
    const next = { ...this.current(), ...changes };
    this.current.set(next);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* Storage blocked: the answers still work until the page reloads. */
    }
  }
}
