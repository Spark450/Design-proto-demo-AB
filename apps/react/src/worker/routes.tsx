/* Every worker page lives under /internal, inside the workspace shell.
 *
 * workerScreens lists the pages for the prototype controls (the "Prototype"
 * button in the corner) and the directory page. When you add a page, add it
 * there too.
 */

import { Route } from "react-router-dom";
import type { ControlSide } from "../shared/controls/types";
import { WorkerShell } from "./WorkerShell";
import { WorkerHomePage } from "./WorkerHomePage";
import { CasePage } from "./CasePage";
import { SearchPage } from "./SearchPage";

export const workerRoutes = (
  <Route path="/internal" element={<WorkerShell />}>
    <Route index element={<WorkerHomePage />} />
    <Route path="cases/:caseId" element={<CasePage />} />
    <Route path="search" element={<SearchPage />} />
  </Route>
);

export const workerScreens: ControlSide = {
  name: "Worker side",
  description: "The workspace staff use to find cases, read the details and record a decision.",
  home: "/internal",
  owns: (pathname) => pathname === "/internal" || pathname.startsWith("/internal/"),
  sections: [
    {
      heading: "Workspace",
      pages: [
        { label: "Cases", path: "/internal" },
        { label: "A case", path: "/internal/cases/SAMPLE-001" },
        { label: "Search", path: "/internal/search" },
      ],
    },
  ],
};
