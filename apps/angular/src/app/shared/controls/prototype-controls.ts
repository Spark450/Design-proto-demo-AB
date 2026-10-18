/* The prototype controls: a small panel in the bottom-right corner for jumping
 * to the directory page, between the citizen and worker sides, and to any
 * page on either.
 *
 * It's styled apart from the service on purpose (dashed border, uppercase
 * labels, a "Prototype" badge) so nobody in a demo or a research session
 * mistakes it for part of the product. It can be dragged aside if it covers
 * something.
 *
 * The pages it lists come from each side's routes.ts (citizenScreens and
 * workerScreens). app.ts passes them in. When you add a page, add it to its
 * side's list so the controls can reach it.
 */

import {
  Component,
  ElementRef,
  ViewEncapsulation,
  afterRenderEffect,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChild,
} from "@angular/core";
import { RouterLink } from "@angular/router";

import { baseWithoutSlash } from "../base-path";
import { CurrentPath } from "../current-path";
import { POSITION_KEY } from "./drag-position";
import { DragHandle, Draggable } from "./draggable";
import type { ControlSide } from "./types";

/* Clears everything the prototype remembers for this browser tab (answers
   typed into forms, for example) and reloads, so the next run starts fresh.
   Where the controls sit is kept. */
function startOver(home: string) {
  try {
    for (const key of Object.keys(sessionStorage)) {
      if (key.startsWith("proto:") && key !== POSITION_KEY)
        sessionStorage.removeItem(key);
    }
  } catch {
    /* Storage blocked. The reload still happens. */
  }
  window.location.assign(`${baseWithoutSlash}${home}`);
}

@Component({
  selector: "app-prototype-controls",
  imports: [RouterLink, Draggable, DragHandle],
  templateUrl: "./prototype-controls.html",
  styleUrl: "./controls.css",
  encapsulation: ViewEncapsulation.None,
})
export class PrototypeControls {
  readonly sides = input.required<ControlSide[]>();

  protected readonly open = signal(false);
  protected readonly pathname = inject(CurrentPath).pathname;
  protected readonly stack = viewChild.required(Draggable);
  private readonly stackElement = viewChild.required("stackElement", {
    read: ElementRef,
  });
  private readonly toggle = viewChild.required<ElementRef<HTMLButtonElement>>("toggle");

  protected readonly currentSide = computed(() =>
    this.sides().find((side) => side.owns(this.pathname())),
  );
  /* On a page that belongs to neither side (the directory or an error page),
     list every side's pages so there's always a way back. */
  protected readonly listed = computed(() => {
    const current = this.currentSide();
    return current ? [current] : this.sides();
  });

  constructor() {
    /* A click anywhere outside the controls puts the panel away. */
    effect((onCleanup) => {
      if (!this.open()) return;
      const onPointerDown = (e: PointerEvent) => {
        const root: HTMLElement = this.stackElement().nativeElement;
        if (e.target instanceof Node && root.contains(e.target)) return;
        this.open.set(false);
      };
      document.addEventListener("pointerdown", onPointerDown);
      onCleanup(() => document.removeEventListener("pointerdown", onPointerDown));
    });

    /* Opening the panel makes the controls taller. If they've been dragged near
       the top of the window, this keeps the whole panel on screen. */
    afterRenderEffect(() => {
      this.open();
      this.pathname();
      /* untracked: the clamp reads where the controls are, and moving them
         shouldn't run this again. */
      untracked(() => this.stack().clampToViewport());
    });
  }

  protected toggleOpen() {
    this.open.update((v) => !v);
  }

  protected closeOnChoice(e: MouseEvent) {
    if ((e.target as HTMLElement).closest(".controls__item")) this.open.set(false);
  }

  protected closeOnEscape(e: KeyboardEvent) {
    if (e.key !== "Escape") return;
    e.preventDefault();
    this.open.set(false);
    this.toggle().nativeElement.focus();
  }

  protected startOver() {
    startOver(this.currentSide()?.home ?? "/");
  }
}
