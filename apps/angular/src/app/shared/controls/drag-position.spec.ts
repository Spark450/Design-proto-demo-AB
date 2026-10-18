/* The one part of dragging with a wrong answer: can the controls end up
   somewhere nobody can get them back from? */

import { describe, expect, it } from "vitest";
import {
  ANCHORED,
  NUDGE_STEP,
  NUDGE_STEP_LARGE,
  clampOffset,
  isMoved,
  nudge,
  readOffset,
  type StackBounds,
} from "./drag-position";

/* A 200x100 stack anchored bottom-right of a 1000x800 window, 8px in — roughly
   the real thing with the panel closed. */
const bounds: StackBounds = {
  width: 200,
  height: 100,
  baseLeft: 792,
  baseTop: 692,
  viewportWidth: 1000,
  viewportHeight: 800,
};

describe("keeping the prototype controls reachable", () => {
  it("leaves a position inside the window alone", () => {
    expect(clampOffset({ x: -300, y: -200 }, bounds)).toEqual({ x: -300, y: -200 });
  });

  it("stops the stack being dragged off the left or top edge", () => {
    const clamped = clampOffset({ x: -5000, y: -5000 }, bounds);
    expect(clamped.x + bounds.baseLeft).toBe(8);
    expect(clamped.y + bounds.baseTop).toBe(8);
  });

  it("stops the stack being dragged off the right or bottom edge", () => {
    const clamped = clampOffset({ x: 5000, y: 5000 }, bounds);
    expect(clamped.x + bounds.baseLeft + bounds.width).toBe(992);
    expect(clamped.y + bounds.baseTop + bounds.height).toBe(792);
  });

  /* The panel open on a short screen. Pinning to the top keeps the grip and the
     buttons under it on screen; pinning to the bottom would cut off the top of
     the panel and there would be no way to scroll to it. */
  it("pins a stack taller than the window to the top", () => {
    const tall: StackBounds = { ...bounds, height: 900, baseTop: -108 };
    expect(clampOffset({ x: 0, y: 400 }, tall).y + tall.baseTop).toBe(8);
  });

  it("re-clamps a stored position when the window is smaller than it was", () => {
    const small: StackBounds = {
      ...bounds,
      baseLeft: 392,
      baseTop: 292,
      viewportWidth: 600,
      viewportHeight: 400,
    };
    const clamped = clampOffset({ x: -600, y: -500 }, small);
    expect(clamped.x + small.baseLeft).toBe(8);
    expect(clamped.y + small.baseTop).toBe(8);
  });
});

describe("nudging with the keyboard", () => {
  it("moves one step per arrow press, in the direction pressed", () => {
    expect(nudge(ANCHORED, "ArrowLeft")).toEqual({ x: -NUDGE_STEP, y: 0 });
    expect(nudge(ANCHORED, "ArrowRight")).toEqual({ x: NUDGE_STEP, y: 0 });
    expect(nudge(ANCHORED, "ArrowUp")).toEqual({ x: 0, y: -NUDGE_STEP });
    expect(nudge(ANCHORED, "ArrowDown")).toEqual({ x: 0, y: NUDGE_STEP });
  });

  it("takes a larger step with Shift held", () => {
    expect(nudge(ANCHORED, "ArrowUp", true)).toEqual({ x: 0, y: -NUDGE_STEP_LARGE });
  });

  it("ignores keys that are not arrows, so typing still reaches the page", () => {
    expect(nudge(ANCHORED, "Enter")).toBeNull();
    expect(nudge(ANCHORED, "a")).toBeNull();
  });
});

describe("remembering where the controls were left", () => {
  it("reads a stored pair of numbers", () => {
    expect(readOffset({ x: -120, y: -40 })).toEqual({ x: -120, y: -40 });
  });

  it.each([
    ["nothing", null],
    ["a string", "-120,-40"],
    ["a half-written pair", { x: -120 }],
    ["something unparseable", { x: "left", y: NaN }],
  ])("falls back to the corner given %s", (_label, stored) => {
    expect(readOffset(stored)).toEqual(ANCHORED);
  });

  it("knows the difference between moved and anchored", () => {
    expect(isMoved(ANCHORED)).toBe(false);
    expect(isMoved({ x: 0, y: -1 })).toBe(true);
  });
});
