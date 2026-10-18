/* The pointer and keyboard handling behind the controls' drag handle.
 *
 * Pointer events, so a touchscreen drags the controls the same way a mouse
 * does. Every position goes through clampOffset first, so the controls can
 * never be dragged somewhere they can't be got back from.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent, RefObject } from "react";
import {
  ANCHORED,
  clampOffset,
  isMoved,
  loadOffset,
  nudge,
  saveOffset,
  type Offset,
  type StackBounds,
} from "./dragPosition";

export type DragPosition = {
  /** Attach to the element being moved. */
  ref: RefObject<HTMLDivElement | null>;
  /** Attach to the same element. Absent until the controls have been moved. */
  style: CSSProperties | undefined;
  dragging: boolean;
  moved: boolean;
  reset: () => void;
  /** Pull the controls back inside the window after something changed their size. */
  clampToViewport: () => void;
  handleProps: {
    onPointerDown: (e: PointerEvent<HTMLElement>) => void;
    onPointerMove: (e: PointerEvent<HTMLElement>) => void;
    onPointerUp: (e: PointerEvent<HTMLElement>) => void;
    onPointerCancel: (e: PointerEvent<HTMLElement>) => void;
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
  };
};

export function useDragPosition(): DragPosition {
  const ref = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState<Offset>(loadOffset);
  const [dragging, setDragging] = useState(false);
  const start = useRef<{ pointerX: number; pointerY: number; offset: Offset } | null>(
    null,
  );

  /* Measured rather than assumed, because the controls get taller when the
     panel opens. */
  const bounds = useCallback((current: Offset): StackBounds | null => {
    const el = ref.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      baseLeft: rect.left - current.x,
      baseTop: rect.top - current.y,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    };
  }, []);

  const moveTo = useCallback(
    (next: Offset) => {
      setOffset((current) => {
        const b = bounds(current);
        const clamped = b ? clampOffset(next, b) : next;
        saveOffset(clamped);
        return clamped;
      });
    },
    [bounds],
  );

  const clampToViewport = useCallback(
    () =>
      setOffset((c) => {
        const b = bounds(c);
        if (!b) return c;
        const clamped = clampOffset(c, b);
        if (clamped.x === c.x && clamped.y === c.y) return c;
        saveOffset(clamped);
        return clamped;
      }),
    [bounds],
  );

  /* A window made smaller after the controls were moved would otherwise leave
     them outside it. */
  useEffect(() => {
    window.addEventListener("resize", clampToViewport);
    return () => window.removeEventListener("resize", clampToViewport);
  }, [clampToViewport]);

  const reset = useCallback(() => {
    saveOffset(ANCHORED);
    setOffset(ANCHORED);
  }, []);

  const onPointerDown = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (e.button !== 0) return;
      e.preventDefault();
      start.current = { pointerX: e.clientX, pointerY: e.clientY, offset };
      setDragging(true);
      e.currentTarget.setPointerCapture?.(e.pointerId);
    },
    [offset],
  );

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      const from = start.current;
      if (!from) return;
      e.preventDefault();
      moveTo({
        x: from.offset.x + (e.clientX - from.pointerX),
        y: from.offset.y + (e.clientY - from.pointerY),
      });
    },
    [moveTo],
  );

  const endDrag = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (!start.current) return;
      start.current = null;
      setDragging(false);
      e.currentTarget.releasePointerCapture?.(e.pointerId);
      clampToViewport();
    },
    [clampToViewport],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      const next = nudge(offset, e.key, e.shiftKey);
      if (next) {
        e.preventDefault();
        moveTo(next);
        return;
      }
      if (e.key === "Escape" && isMoved(offset)) {
        e.preventDefault();
        reset();
      }
    },
    [moveTo, offset, reset],
  );

  return {
    ref,
    style: isMoved(offset)
      ? { transform: `translate(${offset.x}px, ${offset.y}px)` }
      : undefined,
    dragging,
    moved: isMoved(offset),
    reset,
    clampToViewport,
    handleProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onKeyDown,
    },
  };
}
