/* Whether the worker side menu is open.
 *
 * On a desktop the designer's choice is remembered between visits. On a phone
 * the design system manages the menu itself (it slides over the page), so it is
 * always "open" as far as the layout is concerned. The breakpoint matches the
 * design system's side menu.
 */

import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 624;
const MENU_STATE_KEY = "workspace-menu-open";

const hasWindow = typeof window !== "undefined";

function getInitialDesktopMenuState(): boolean {
  if (!hasWindow) return true;
  const saved = window.localStorage.getItem(MENU_STATE_KEY);
  return saved === null ? true : saved === "true";
}

export function useWorkspaceMenuState() {
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(getInitialDesktopMenuState);
  const [isMobile, setIsMobile] = useState(hasWindow && window.innerWidth < MOBILE_BREAKPOINT);

  useEffect(() => {
    let previousWidth = window.innerWidth;

    const handleResize = () => {
      const width = window.innerWidth;
      const nowMobile = width < MOBILE_BREAKPOINT;
      setIsMobile(nowMobile);

      // Shrinking a desktop window closes the menu to give the page more room.
      if (width < previousWidth && !nowMobile) {
        setDesktopMenuOpen(false);
      }
      previousWidth = width;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      window.localStorage.setItem(MENU_STATE_KEY, String(desktopMenuOpen));
    }
  }, [desktopMenuOpen, isMobile]);

  const menuOpen = isMobile ? true : desktopMenuOpen;
  const toggleMenu = () => {
    if (!isMobile) setDesktopMenuOpen((open) => !open);
  };

  return { menuOpen, toggleMenu };
}
