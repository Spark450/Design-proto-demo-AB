/* Every citizen page sits inside the citizen layout, under /apply. (The site
 * root is the directory page, which lists both sides.)
 *
 * citizenScreens lists the pages for the prototype controls (the "Prototype"
 * button in the corner) and the directory page. When you add a page, add it
 * there too.
 */

import type { Routes } from "@angular/router";
import type { ControlSide } from "../shared/controls/types";
import { CitizenLayout } from "./citizen-layout";
import { StartPage } from "./start-page";
import { NamePage } from "./name-page";
import { DateOfBirthPage } from "./date-of-birth-page";
import { ContactPage } from "./contact-page";
import { MoreInformationPage } from "./more-information-page";
import { ReviewPage } from "./review-page";
import { DonePage } from "./done-page";
import { donePath, questions, reviewPath, startPath } from "./journey";

export const citizenRoutes: Routes = [
  {
    path: "apply",
    component: CitizenLayout,
    children: [
      { path: "", component: StartPage },
      { path: "name", component: NamePage },
      { path: "date-of-birth", component: DateOfBirthPage },
      { path: "contact", component: ContactPage },
      { path: "more-information", component: MoreInformationPage },
      { path: "review", component: ReviewPage },
      { path: "done", component: DonePage },
    ],
  },
];

export const citizenScreens: ControlSide = {
  name: "Citizen side",
  description:
    "The public form someone fills in to apply, from the start page to the confirmation.",
  home: startPath,
  owns: (pathname) => pathname === startPath || pathname.startsWith(`${startPath}/`),
  sections: [
    { heading: "Start", pages: [{ label: "Start page", path: startPath }] },
    { heading: "Questions", pages: questions },
    {
      heading: "Finish",
      pages: [
        { label: "Check your answers", path: reviewPath },
        { label: "Application submitted", path: donePath },
      ],
    },
  ],
};
