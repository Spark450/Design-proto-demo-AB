/* Where the prototype controls sit, and the arithmetic that keeps them reachable.
 *
 * The controls are anchored bottom-right. That corner is sometimes where a
 * dialog's buttons or a table's last column is, so they can be dragged aside.
 * The position is an offset from the corner rather than a point on screen, so
 * controls nobody has moved stay in the corner when the window is resized.
 *
 * The arithmetic lives here, apart from the pointer handling, because "can the
 * controls end up somewhere you can't reach them" is the part worth testing.
 */

export type Offset = { x: number; y: number };

/** Anchored in the corner: the default, and what a reset returns to. */
export const ANCHORED: Offset = { x: 0, y: 0 };

/* Kept for the browser tab only, so controls moved aside for one demo are back
   in the corner next time. */
export const POSITION_KEY = "proto:controls-position";

/** How far one arrow-key press moves the controls, and one held with Shift. */
export const NUDGE_STEP = 16;
export const NUDGE_STEP_LARGE = 64;

/** Breathing room kept between the controls and every edge of the window. */
const EDGE_MARGIN = 8;

/* Everything clamping needs, measured by the caller. `baseLeft`/`baseTop` are
   where the controls' top-left would sit at zero offset — that is, the corner the
   CSS puts it in — so the clamp can reason about the window without having to
   know the anchor. */
export type StackBounds = {
  width: number;
  height: number;
  baseLeft: number;
  baseTop: number;
  viewportWidth: number;
  viewportHeight: number;
};

function clampAxis(value: number, min: number, max: number): number {
  /* Controls taller than the window (the panel open on a short screen) would
     otherwise be pinned to the bottom with their top cut off. Pinning to the top
     keeps them reachable, and the panel scrolls. */
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

/** Keep the controls inside the window, whatever the drag or the resize asked for. */
export function clampOffset(offset: Offset, bounds: StackBounds): Offset {
  const { width, height, baseLeft, baseTop, viewportWidth, viewportHeight } = bounds;

  return {
    x: clampAxis(
      offset.x,
      EDGE_MARGIN - baseLeft,
      viewportWidth - width - EDGE_MARGIN - baseLeft,
    ),
    y: clampAxis(
      offset.y,
      EDGE_MARGIN - baseTop,
      viewportHeight - height - EDGE_MARGIN - baseTop,
    ),
  };
}

/** True when the controls have been moved off its anchor. */
export function isMoved(offset: Offset): boolean {
  return offset.x !== 0 || offset.y !== 0;
}

/* Arrow keys, so the controls can be moved without a mouse too. */
export function nudge(offset: Offset, key: string, large = false): Offset | null {
  const step = large ? NUDGE_STEP_LARGE : NUDGE_STEP;

  switch (key) {
    case "ArrowLeft":
      return { x: offset.x - step, y: offset.y };
    case "ArrowRight":
      return { x: offset.x + step, y: offset.y };
    case "ArrowUp":
      return { x: offset.x, y: offset.y - step };
    case "ArrowDown":
      return { x: offset.x, y: offset.y + step };
    default:
      return null;
  }
}

export function loadOffset(): Offset {
  try {
    if (typeof sessionStorage === "undefined") return ANCHORED;
    const stored = sessionStorage.getItem(POSITION_KEY);
    if (!stored) return ANCHORED;
    const parsed: unknown = JSON.parse(stored);
    return readOffset(parsed);
  } catch {
    /* Anything unreadable means the corner, never a crash mid-demo. */
    return ANCHORED;
  }
}

/** Accept only a pair of real numbers; anything else means the corner. */
export function readOffset(value: unknown): Offset {
  if (typeof value !== "object" || value === null) return ANCHORED;
  const { x, y } = value as { x?: unknown; y?: unknown };
  if (!Number.isFinite(x) || !Number.isFinite(y)) return ANCHORED;
  return { x: x as number, y: y as number };
}

export function saveOffset(offset: Offset): void {
  try {
    if (typeof sessionStorage === "undefined") return;
    if (!isMoved(offset)) sessionStorage.removeItem(POSITION_KEY);
    else sessionStorage.setItem(POSITION_KEY, JSON.stringify(offset));
  } catch {
    /* Storage full or blocked. The controls still move, it just forgets. */
  }
}
