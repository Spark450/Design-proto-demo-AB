/* The prototype's name, shown in the side menu or the page header.
 *
 * The first-run setup swaps the placeholder below for the real name. Until then
 * (on the template itself) the screens say "Design prototype" instead.
 */

const name = "__PROTOTYPE_NAME__";

export const prototypeName = name.startsWith("__") ? "Design prototype" : name;
