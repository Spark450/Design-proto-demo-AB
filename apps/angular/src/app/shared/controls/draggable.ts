/* The pointer and keyboard handling behind the controls' drag handle.
 *
 * Pointer events, so a touchscreen drags the controls the same way a mouse
 * does. Every position goes through clampOffset first, so the controls can
 * never be dragged somewhere they can't be got back from.
 *
 * Two directives: appDraggable goes on the element being moved, appDragHandle
 * on the part you grab (inside it).
 */

import {
  DestroyRef,
  Directive,
  ElementRef,
  computed,
  inject,
  signal,
} from "@angular/core";
import {
  ANCHORED,
  clampOffset,
  isMoved,
  loadOffset,
  nudge,
  saveOffset,
  type Offset,
  type StackBounds,
} from "./drag-position";

@Directive({
  selector: "[appDraggable]",
  exportAs: "draggable",
  host: {
    "[style.transform]": "transform()",
    "[class.controls--dragging]": "dragging()",
  },
})
export class Draggable {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly offset = signal<Offset>(loadOffset());

  readonly dragging = signal(false);
  readonly moved = computed(() => isMoved(this.offset()));
  /* Absent until the controls have been moved. */
  protected readonly transform = computed(() => {
    const offset = this.offset();
    return isMoved(offset) ? `translate(${offset.x}px, ${offset.y}px)` : null;
  });

  private start: { pointerX: number; pointerY: number; offset: Offset } | null = null;

  constructor() {
    /* A window made smaller after the controls were moved would otherwise leave
       them outside it. */
    const onResize = () => this.clampToViewport();
    window.addEventListener("resize", onResize);
    inject(DestroyRef).onDestroy(() => window.removeEventListener("resize", onResize));
  }

  /* Measured rather than assumed, because the controls get taller when the
     panel opens. */
  private bounds(current: Offset): StackBounds {
    const rect = this.el.nativeElement.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      baseLeft: rect.left - current.x,
      baseTop: rect.top - current.y,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    };
  }

  private moveTo(next: Offset) {
    const clamped = clampOffset(next, this.bounds(this.offset()));
    saveOffset(clamped);
    this.offset.set(clamped);
  }

  /** Pull the controls back inside the window after something changed their size. */
  clampToViewport() {
    const current = this.offset();
    const clamped = clampOffset(current, this.bounds(current));
    if (clamped.x === current.x && clamped.y === current.y) return;
    saveOffset(clamped);
    this.offset.set(clamped);
  }

  reset() {
    saveOffset(ANCHORED);
    this.offset.set(ANCHORED);
  }

  pointerDown(e: PointerEvent) {
    if (e.button !== 0) return;
    e.preventDefault();
    this.start = { pointerX: e.clientX, pointerY: e.clientY, offset: this.offset() };
    this.dragging.set(true);
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  }

  pointerMove(e: PointerEvent) {
    const from = this.start;
    if (!from) return;
    e.preventDefault();
    this.moveTo({
      x: from.offset.x + (e.clientX - from.pointerX),
      y: from.offset.y + (e.clientY - from.pointerY),
    });
  }

  endDrag(e: PointerEvent) {
    if (!this.start) return;
    this.start = null;
    this.dragging.set(false);
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    this.clampToViewport();
  }

  keyDown(e: KeyboardEvent) {
    const offset = this.offset();
    const next = nudge(offset, e.key, e.shiftKey);
    if (next) {
      e.preventDefault();
      this.moveTo(next);
      return;
    }
    if (e.key === "Escape" && isMoved(offset)) {
      e.preventDefault();
      this.reset();
    }
  }
}

@Directive({
  selector: "[appDragHandle]",
  host: {
    "(pointerdown)": "draggable.pointerDown($event)",
    "(pointermove)": "draggable.pointerMove($event)",
    "(pointerup)": "draggable.endDrag($event)",
    "(pointercancel)": "draggable.endDrag($event)",
    "(keydown)": "draggable.keyDown($event)",
    "(dblclick)": "draggable.reset()",
  },
})
export class DragHandle {
  protected readonly draggable = inject(Draggable);
}
