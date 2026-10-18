/* The route table: every address in the prototype, and which page it shows.
 *
 * The worker and citizen sides sit side by side here rather than one inside the
 * other, because each needs the whole window for its own layout. Each side's
 * routes live in its own folder, so removing a side means deleting its folder
 * and its block below (the README lists the files).
 *
 * The site root is the directory page: it lists each side's pages and the
 * published snapshots. The "Prototype" button in the corner (the prototype
 * controls) lists the same pages. The sides list below says which sides both
 * of them show.
 */

import { Route, Routes } from "react-router-dom";

// ---- WORKER (remove this line and the block below to drop the worker side) ----
import { workerRoutes, workerScreens } from "./worker/routes";
// ---- CITIZEN (remove this line and the block below to drop the citizen side) ----
import { citizenRoutes, citizenScreens } from "./citizen/routes";

import { NotFoundPage } from "./shared/NotFoundPage";
import { ServerErrorPage } from "./shared/ServerErrorPage";
import { DirectoryPage } from "./shared/directory/DirectoryPage";
import { PrototypeControls } from "./shared/controls/PrototypeControls";
import type { ControlSide } from "./shared/controls/types";

/* The sides the prototype controls and the directory page list. Remove a side's entry here
   when you remove that side. */
export const sides: ControlSide[] = [
  citizenScreens, // CITIZEN
  workerScreens, // WORKER
];

export function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<DirectoryPage sides={sides} />} />

        {/* ---- WORKER: everything under /internal ---- */}
        {workerRoutes}

        {/* ---- CITIZEN: everything under /apply ---- */}
        {citizenRoutes}

        <Route path="/error" element={<ServerErrorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <PrototypeControls sides={sides} />
    </>
  );
}
