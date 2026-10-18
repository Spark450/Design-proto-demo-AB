# Table sizing in Angular

Read `SKILL.md` first. This file only covers where its pieces live in this
app's Angular code.

## Where things are

- `.table--list-sizing` and the `goa-table-cell--*` rules are in
  `src/styles.css`.
- The cases list is `src/app/worker/worker-home-page.ts` and the search results
  are `src/app/worker/search-page.ts`. Both use the class.
- The citizen "Check your answers" summary, `src/app/citizen/review-page.ts`,
  is the table that deliberately doesn't.

## Applying it

Put the class on a plain `div` around the table:

```html
<div class="table--list-sizing">
  <goab-table width="100%">…</goab-table>
</div>
```

A class on `goab-table` stays on the outer Angular element and doesn't reach the
design system's `goa-table` inside it, which is why the wrapper exists.

If the table needs space above it, put the margin on the `div`, or space it
with a `goab-block` `gap`. Don't put it on `goab-table`.

The rules live in the global stylesheet, not in a component's own styles,
because Angular scopes a component's styles to that component and they wouldn't
reach inside `goa-table`.

Cells use `class`:

```html
<td class="goa-table-cell--actions">
  <goab-button type="tertiary" size="compact">Open</goab-button>
</td>
```
