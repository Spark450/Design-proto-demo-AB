/* What each side tells the prototype controls and the directory page about
 * itself: its name, where it starts, which addresses belong to it, and the
 * pages to list.
 * Each side's list lives in its own routes.ts, next to its routes.
 */

export interface ControlPage {
  label: string;
  path: string;
}

export interface ControlSection {
  heading: string;
  pages: ControlPage[];
}

export interface ControlSide {
  name: string;
  /** A sentence about this side, shown on the directory page. */
  description?: string;
  /** Where "switch to this side" goes. */
  home: string;
  /** True for every address on this side, so the menu knows where you are. */
  owns: (pathname: string) => boolean;
  sections: ControlSection[];
}
