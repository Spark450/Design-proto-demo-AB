---
name: table-sizing
description: Use when adding a table that lists records (cases, people, documents, search results) to this prototype, or when two tables don't line up — rows or heading rows of different heights between screens — so every list is sized the same way instead of being measured again by hand.
---

# Table sizing

Adapted from the funding assessment prototype
(GovAlta-Lab/CC-Proto-Funding-Assessment), where three tables in one service
ended up three different heights.

## The short version

Every table in this prototype that lists records is the same height:

|             | Height     | What it is made of                                                     |
| ----------- | ---------- | ---------------------------------------------------------------------- |
| Heading row | **55.5px** | 18 + 16 padding, a 20px line, 1.5px of rule                            |
| Body row    | **55px**   | a 40px compact button inside 7px + 7px of cell padding, and a 1px rule |

Neither number is arbitrary. 55px is what a row holding a button renders at with
the design system's own action-cell padding, so stating it makes a list the same
height whether or not its rows happen to offer an action. Buttons in table cells
are always `size="compact"`; a default 56px button would make the row 71px.

Put `.table--list-sizing` (in the app's global stylesheet) on a box around the
table and you get both. Don't measure a table by hand and add a height to a
page's stylesheet.

The rest of this file applies to any framework. For file paths and code in this
app, read the framework file:

<!-- REACT -->

- `react.md`: the stylesheet and screens, and the React code for the wrapper
  and cell classes.
<!-- /REACT -->
<!-- ANGULAR -->

- `angular.md`: the stylesheet and screens, and the Angular code for the
  wrapper and cell classes.
<!-- /ANGULAR -->

## When to use

- Adding a table that lists records a worker scans: cases, people, documents,
  search results. The worker cases list and search results already use it.
- Two tables in the prototype don't line up, or one screen's table looks cramped
  or tall beside another's.
- A table's rows change height when a column gains a button, a badge or a second
  line.

When **not** to use it:

- Tables whose cells hold sentences, not records. The citizen "Check your
  answers" summary is one; its rows are meant to grow with the answer. A
  scanning height would only stretch them.
- A table with one row of summary figures. It's a layout, not a list.

## How to apply it

Put the class on a plain `div` around the table, and set the table's `width` to
`100%` inside it.

The class has to sit on an element you own, above the table. The design
system's table component renders a `goa-table` custom element, and a class
given to the component isn't reliably passed down to it. A plain wrapper works
the same way in every framework.

If the table needs space above it, put the margin on the wrapper (or space it
with a Block `gap`), not on the table. See "The inline host" below.

## Diagnosing a table that is the wrong height

Work from the rendered box, not the stylesheet. The declared padding usually
already agrees and the heights still differ, because **the height of a row is
decided by the tallest thing in it**.

1. Measure both tables, the suspect one and the cases list:
   `document.querySelector('goa-table thead tr').getBoundingClientRect().height`
   and the same for a `tbody tr`.
2. Compare what the cells _hold_, column by column: a button, a badge, a sort
   header, two lines of text. That is nearly always the difference.
3. Only then look at padding. If the numbers in both stylesheets match, the
   answer is in step 2.

## Three traps

**The inline host.** `goa-table`, `goa-button`, `goa-input` and `goa-popover`
render hosts that are `display: inline`. An inline box drops vertical margins, so
a `margin-top` on `goa-table` computes, reports itself faithfully to
`getComputedStyle`, and draws nothing. Set `display: block`, or put the margin on
a wrapper, before treating one as a layout box. A table inside a flex container
(a Block, for example) doesn't hit this, because a flex item is blockified.

**The sort header's 2px.** `goa-table-sort-header` wraps its label in a span with
`var(--goa-space-3xs)` of padding top and bottom, which is where the focus ring
lands. That's 4px a sortable column has and a fixed one doesn't, so a heading row
measures 59.5px if you can sort it and 55.5px if you can't.
`.table--list-sizing` gives the 4px back through `--goa-table-padding-heading`,
scoped to `th:has(goa-table-sort-header)` so plain-text headings aren't shrunk to
51.5px instead.

That this works at all is worth knowing: the design system reads its own heading
padding from `--goa-table-padding-heading`, and a custom property inherits into
the shadow DOM. Setting it on the `th` from the light DOM reaches inside the
component.

**`:has()` and `:not()` outweigh you.** The design system insets the first and
last headings by 24px with selectors like
`goa-table[version="2"] thead th:first-child:has(goa-table-sort-header):not(:last-child)`.
An override of equal specificity ties and then loses on source order, because the
design system's sheet loads last. `.table--list-sizing` doubles its class
(`.table--list-sizing.table--list-sizing …`) on those rules to win outright.

## The cell classes are a separate mechanism

Alongside the sizing class, the global stylesheet centres cells and corrects the
padding of a cell holding a button, keyed on the design system's
`goa-table-cell--*` classes (`--text`, `--badge`, `--actions`, `--checkbox`). Add
those classes to your `td`s when a column holds a button or checkbox. A plain
`td` without them still gets `vertical-align: middle` from `.table--list-sizing`,
but if a column's rows come out at 65px where a button is offered and 55px where
it isn't, a missing `goa-table-cell--text` (or `--actions`) class is the reason.
