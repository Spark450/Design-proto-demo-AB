/* The worker side of the prototype: the design system's workspace pattern.
 *
 * GoabWorkspaceLayout fills the whole window, and the design system says it
 * should sit directly in the router outlet. That's why App.tsx keeps each
 * side's routes at the top level rather than nesting them inside a shared
 * layout: each side gets the whole window on its own terms.
 *
 * To add a page: make a component in src/worker/, add a route for it in
 * src/worker/routes.tsx (and to workerScreens there, so the prototype controls
 * can reach it), and add a GoabWorkSideMenuItem for it below if it belongs in
 * the menu.
 */

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  GoabWorkSideMenu,
  GoabWorkSideMenuItem,
  GoabWorkspaceLayout,
} from "@abgov/react-components";

import { sampleWorker } from "../data/sample";
import { prototypeName } from "../shared/prototype";
import { VersionBanner } from "../shared/VersionBanner";
import { useWorkspaceMenuState } from "./useWorkspaceMenuState";
import "./worker.css";

/* Menu item URLs are full addresses, so they include the base path this build
   was published under (a preview or snapshot lives below the site root). The
   router works without it, so it is taken off again when navigating. */
const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export function WorkerShell() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { menuOpen, toggleMenu } = useWorkspaceMenuState();

  const sideMenu = (
    <GoabWorkSideMenu
      heading={prototypeName}
      url={`${base}/internal`}
      userName={sampleWorker.name}
      userSecondaryText={sampleWorker.role}
      open={menuOpen}
      onToggle={toggleMenu}
      onNavigate={(path: string) => navigate(path.replace(base, "") || "/")}
      primaryContent={
        <>
          <GoabWorkSideMenuItem
            icon="list"
            label="Cases"
            url={`${base}/internal`}
            current={pathname === "/internal" || pathname.startsWith("/internal/cases")}
          />
          <GoabWorkSideMenuItem
            icon="search"
            label="Search"
            url={`${base}/internal/search`}
            current={pathname === "/internal/search"}
          />
        </>
      }
    />
  );

  return (
    <GoabWorkspaceLayout sideMenu={sideMenu}>
      {/* The layout only creates its content area if it has something in it
          when it first appears. A route that starts with a redirect renders
          nothing on that first pass, and the page it forwards to then has
          nowhere to go: a blank screen. This keeps one child there from the
          start. */}
      <span hidden aria-hidden="true" />
      <div className="worker-page">
        <VersionBanner />
        <Outlet />
      </div>
    </GoabWorkspaceLayout>
  );
}
