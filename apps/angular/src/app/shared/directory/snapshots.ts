/* The published snapshots, read from versions.json at the root of the site.
 *
 * Every publish updates that file (see .github/actions/publish-to-pages), so
 * the directory reads it when the page opens rather than baking a list into
 * the build. A list baked in would be out of date the moment the next
 * snapshot was taken.
 */

import { DestroyRef, inject, signal, type Signal } from "@angular/core";
import { basePath } from "../base-path";
import { siteRootFrom, siteVersion } from "../version";

export interface Snapshot {
  slug: string;
  note?: string;
  created?: string;
}

export type SnapshotsState =
  | { status: "local" }
  | { status: "loading" }
  | { status: "failed" }
  | { status: "ready"; snapshots: Snapshot[] };

export const siteRoot = siteRootFrom(basePath);

export function snapshotUrl(root: string, slug: string): string {
  return `${root}v/${slug}/`;
}

/** Newest first, ignoring anything that isn't a snapshot entry. */
export function snapshotsFrom(manifest: unknown): Snapshot[] {
  const list = (manifest as { snapshots?: unknown })?.snapshots;
  if (!Array.isArray(list)) return [];
  return list
    .filter((s): s is Snapshot => typeof s?.slug === "string")
    .sort((a, b) => String(b.created ?? "").localeCompare(String(a.created ?? "")));
}

/* Starts reading the list and gives back its state as it changes. Call it
   while a component is being created (it stops listening when that goes). */
export function loadSnapshots(): Signal<SnapshotsState> {
  const local = siteVersion.kind === "local";
  const state = signal<SnapshotsState>(
    local ? { status: "local" } : { status: "loading" },
  );
  if (local) return state.asReadonly();

  let cancelled = false;
  inject(DestroyRef).onDestroy(() => (cancelled = true));

  fetch(`${siteRoot}versions.json`, { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error(String(response.status));
      return response.json();
    })
    .then((manifest) => {
      if (!cancelled) state.set({ status: "ready", snapshots: snapshotsFrom(manifest) });
    })
    .catch(() => {
      if (!cancelled) state.set({ status: "failed" });
    });

  return state.asReadonly();
}
