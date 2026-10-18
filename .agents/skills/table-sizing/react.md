# Table sizing in React

Read `SKILL.md` first. This file only covers where its pieces live in this
app's React code.

## Where things are

- `.table--list-sizing` and the `goa-table-cell--*` rules are in
  `src/index.css`.
- The cases list is `src/worker/WorkerHomePage.tsx` and the search results are
  `src/worker/SearchPage.tsx`. Both use the class.
- The citizen "Check your answers" summary, `src/citizen/ReviewPage.tsx`, is
  the table that deliberately doesn't.

## Applying it

Put the class on a plain `div` around the table:

```jsx
<div className="table--list-sizing">
  <GoabTable width="100%">…</GoabTable>
</div>
```

`GoabTable` renders the design system's `goa-table` custom element and doesn't
pass a `className` through to it, which is why the wrapper exists.

If the table needs space above it, put the margin on the `div`, or space it
with a `GoabBlock` `gap`. Don't put it on `GoabTable`.

Cells use `className`, not `class`:

```jsx
<td className="goa-table-cell--actions">
  <GoabButton type="tertiary" size="compact">
    Open
  </GoabButton>
</td>
```
