/* The prototype controls: a small panel in the bottom-right corner for jumping
 * to the directory page, between the citizen and worker sides, and to any
 * page on either.
 *
 * It's styled apart from the service on purpose (dashed border, uppercase
 * labels, a "Prototype" badge) so nobody in a demo or a research session
 * mistakes it for part of the product. It can be dragged aside if it covers
 * something.
 *
 * The pages it lists come from each side's routes.tsx (citizenScreens and
 * workerScreens). App.tsx passes them in. When you add a page, add it to its
 * side's list so the controls can reach it.
 */

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";

import { POSITION_KEY } from "./dragPosition";
import { useDragPosition } from "./useDragPosition";
import type { ControlSide } from "./types";
import "./controls.css";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

/* Clears everything the prototype remembers for this browser tab (answers
   typed into forms, for example) and reloads, so the next run starts fresh.
   Where the controls sit is kept. */
function startOver(home: string) {
  try {
    for (const key of Object.keys(sessionStorage)) {
      if (key.startsWith("proto:") && key !== POSITION_KEY) sessionStorage.removeItem(key);
    }
  } catch {
    /* Storage blocked. The reload still happens. */
  }
  window.location.assign(`${base}${home}`);
}

export function PrototypeControls({ sides }: { sides: ControlSide[] }) {
  const stack = useDragPosition();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();

  const currentSide = sides.find((side) => side.owns(pathname));
  /* On a page that belongs to neither side (the directory or an error page),
     list every side's pages so there's always a way back. */
  const listed = currentSide ? [currentSide] : sides;

  /* A click anywhere outside the controls puts the panel away. */
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const root = stack.ref.current;
      if (root && e.target instanceof Node && root.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, stack.ref]);

  /* Opening the panel makes the controls taller. If they've been dragged near
     the top of the window, this keeps the whole panel on screen. */
  useEffect(() => {
    stack.clampToViewport();
  }, [open, pathname, stack.clampToViewport]);

  const closeOnChoice = (e: MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest(".controls__item")) setOpen(false);
  };

  const closeOnEscape = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== "Escape") return;
    e.preventDefault();
    setOpen(false);
    toggleRef.current?.focus();
  };

  return (
    <div
      className={"controls" + (stack.dragging ? " controls--dragging" : "")}
      ref={stack.ref}
      style={stack.style}
    >
      {open && (
        <nav
          id="prototype-controls-panel"
          className="controls__panel"
          aria-label="Prototype pages"
          onClick={closeOnChoice}
          onKeyDown={closeOnEscape}
        >
          <div className="controls__section">
            <Link
              to="/"
              className={"controls__item" + (pathname === "/" ? " controls__item--current" : "")}
              aria-current={pathname === "/" ? "page" : undefined}
            >
              Directory
            </Link>
          </div>

          <div className="controls__section">
            <p className="controls__label">Side</p>
            {sides.map((side) => {
              const isCurrent = side === currentSide;
              return (
                <Link
                  key={side.name}
                  to={side.home}
                  className={"controls__item" + (isCurrent ? " controls__item--current" : "")}
                  aria-current={isCurrent ? "true" : undefined}
                >
                  {side.name}
                </Link>
              );
            })}
          </div>

          {listed.flatMap((side) =>
            side.sections.map((section) => (
              <div className="controls__section" key={`${side.name}/${section.heading}`}>
                <p className="controls__label">
                  {currentSide ? section.heading : `${side.name}: ${section.heading}`}
                </p>
                {section.pages.map((page) => {
                  const isCurrent = pathname === page.path;
                  return (
                    <Link
                      key={page.path}
                      to={page.path}
                      className={
                        "controls__item" + (isCurrent ? " controls__item--current" : "")
                      }
                      aria-current={isCurrent ? "page" : undefined}
                    >
                      {page.label}
                    </Link>
                  );
                })}
              </div>
            )),
          )}

          <div className="controls__section">
            <button
              type="button"
              className="controls__item"
              onClick={() => startOver(currentSide?.home ?? "/")}
            >
              Start over
            </button>
            {/* Only once the controls have been moved. Offering to put them
                back where they already are would look like a broken button. */}
            {stack.moved && (
              <button type="button" className="controls__item" onClick={stack.reset}>
                Return controls to corner
              </button>
            )}
          </div>
        </nav>
      )}

      <div className="controls__bar">
        <button
          type="button"
          className="controls__handle"
          aria-label="Move the prototype controls"
          title="Drag to move. Arrow keys move it too (hold Shift to move further). Double-click or press Escape to put it back in the corner."
          onDoubleClick={stack.reset}
          {...stack.handleProps}
        >
          <span aria-hidden="true">⠿</span>
        </button>

        <button
          ref={toggleRef}
          type="button"
          className="controls__toggle"
          aria-expanded={open}
          aria-controls="prototype-controls-panel"
          onClick={() => setOpen((v) => !v)}
          onKeyDown={closeOnEscape}
        >
          <span className="controls__badge">Prototype</span>
          Pages <span aria-hidden="true">{open ? "▾" : "▴"}</span>
        </button>
      </div>
    </div>
  );
}
