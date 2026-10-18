/* Sample data for the starter screens.
 *
 * Everything here is made up, and meant to look made up. Never put real names,
 * SINs, case details or anything copied from an internal system in this file
 * (or anywhere else in the prototype). If you need more realistic data, ask the
 * AI to invent it.
 */

import type { GoabBadgeType } from "@abgov/ui-components-common";

export type SampleStatus = "New" | "In progress" | "Waiting" | "Done";

export interface SampleCase {
  id: string;
  name: string;
  submitted: string;
  status: SampleStatus;
  dateOfBirth: string;
  contactMethod: "Email" | "Phone" | "Mail";
  notes: string;
}

export const sampleCases: SampleCase[] = [
  {
    id: "SAMPLE-001",
    name: "Test Person A",
    submitted: "2025-01-06",
    status: "New",
    dateOfBirth: "1990-03-14",
    contactMethod: "Email",
    notes: "Asked if they can apply for a family member too.",
  },
  {
    id: "SAMPLE-002",
    name: "Test Person B",
    submitted: "2025-01-04",
    status: "In progress",
    dateOfBirth: "1985-11-02",
    contactMethod: "Phone",
    notes: "",
  },
  {
    id: "SAMPLE-003",
    name: "Test Person C",
    submitted: "2025-01-03",
    status: "Waiting",
    dateOfBirth: "2001-07-21",
    contactMethod: "Mail",
    notes: "Waiting for a document they said they would mail in.",
  },
  {
    id: "SAMPLE-004",
    name: "Test Person D",
    submitted: "2024-12-19",
    status: "Done",
    dateOfBirth: "1978-05-30",
    contactMethod: "Email",
    notes: "",
  },
  {
    id: "SAMPLE-005",
    name: "Test Person E",
    submitted: "2024-12-17",
    status: "In progress",
    dateOfBirth: "1995-09-09",
    contactMethod: "Phone",
    notes: "Prefers calls after 3 pm.",
  },
];

export function findCase(id: string | undefined) {
  return sampleCases.find((c) => c.id === id);
}

/* Which badge colour each status uses. */
export const statusBadge: Record<SampleStatus, GoabBadgeType> = {
  New: "important",
  "In progress": "information",
  Waiting: "default",
  Done: "success",
};

export const sampleWorker = {
  name: "Sample Worker",
  role: "Test team",
};
