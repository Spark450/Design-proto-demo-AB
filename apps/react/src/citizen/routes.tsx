/* Every citizen page sits inside the citizen layout, under /apply. (The site
 * root is the directory page, which lists both sides.)
 *
 * citizenScreens lists the pages for the prototype controls (the "Prototype"
 * button in the corner) and the directory page. When you add a page, add it
 * there too.
 */

import { Route } from "react-router-dom";
import type { ControlSide } from "../shared/controls/types";
import { CitizenLayout } from "./CitizenLayout";
import { StartPage } from "./StartPage";
import { NamePage } from "./NamePage";
import { DateOfBirthPage } from "./DateOfBirthPage";
import { ContactPage } from "./ContactPage";
import { MoreInformationPage } from "./MoreInformationPage";
import { ReviewPage } from "./ReviewPage";
import { DonePage } from "./DonePage";
import { donePath, questions, reviewPath, startPath } from "./journey";

export const citizenRoutes = (
  <Route element={<CitizenLayout />}>
    <Route path="apply" element={<StartPage />} />
    <Route path="apply/name" element={<NamePage />} />
    <Route path="apply/date-of-birth" element={<DateOfBirthPage />} />
    <Route path="apply/contact" element={<ContactPage />} />
    <Route path="apply/more-information" element={<MoreInformationPage />} />
    <Route path="apply/review" element={<ReviewPage />} />
    <Route path="apply/done" element={<DonePage />} />
  </Route>
);

export const citizenScreens: ControlSide = {
  name: "Citizen side",
  description: "The public form someone fills in to apply, from the start page to the confirmation.",
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
