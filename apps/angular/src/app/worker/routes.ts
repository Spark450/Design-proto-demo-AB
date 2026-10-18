/* Every worker page lives under /internal, inside the workspace shell.
 *
 * workerScreens lists the pages for the prototype controls (the "Prototype"
 * button in the corner) and the directory page. When you add a page, add it
 * there too.
 */

import type { Routes } from "@angular/router";
import type { ControlSide } from "../shared/controls/types";
import { WorkerShell } from "./worker-shell";
import { WorkerHomePage } from "./worker-home-page";
import { CasePage } from "./case-page";
import { SearchPage } from "./search-page";

export const workerRoutes: Routes = [
  {
    path: "internal",
    component: WorkerShell,
    children: [
      { path: "", component: WorkerHomePage },
      { path: "cases/:caseId", component: CasePage },
      { path: "search", component: SearchPage },
    ],
  },
];

export const workerScreens: ControlSide = {
  name: "Worker side",
  description:
    "The workspace staff use to find cases, read the details and record a decision.",
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
