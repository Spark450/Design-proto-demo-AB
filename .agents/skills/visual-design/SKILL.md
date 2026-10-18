---
name: visual-design
description: Use when building a new screen, section, card or component in this prototype, or changing how an existing one looks — choosing heading sizes, text sizes, text colour, or the space between things. Also use when a screen "looks off", feels cramped or loose, or a designer says the hierarchy is unclear.
---

# Visual design: typography and spacing

## The short version

Good-looking screens come from a few decisions made the same way every time, not
from tuning each element. Before writing any markup, decide three things:

1. **The role of every piece of text** (page title, section, card title, body,
   supporting). Each role has one size. Look it up in the table below.
2. **How things group.** Every gap is one of four tiers. Space between groups is
   at least twice the space inside them.
3. **Who reads it.** Citizen screens and worker screens use different scales,
   and worker screens use the design system's compact components.

Use design system tokens and component props only. No raw `px` font sizes, no
literal font weights, no hand-tuned margins.

## Component names

This skill names components the way the design system does: Text, Block, Grid,
Container, Button, Form item. Their props and values (`size`, `gap`, `mt`,
`mb`, `padding`, `labelSize`, `compact`) are the same in every framework. For
this app's component names and a worked example, read the framework file:

<!-- REACT -->

- `react.md`: the React component for each name, and a worked worker card.
<!-- /REACT -->
<!-- ANGULAR -->

- `angular.md`: the Angular component and element for each name, and a worked
  worker card.
<!-- /ANGULAR -->

## When to use

- Adding a page, section, card, panel, list or form.
- Choosing a `size`, `mt`, `mb` or `gap` value, or a component's `size` or
  `padding`.
- A screen looks unbalanced, cramped, loose, or "flat".

When **not** to use it:

- Which component to use — use `using-goa-design-system` or `component-search`.
- Wording — use `content-design`.

## 1. Text roles

One role, one size, everywhere. Heading levels step down one size at a time.

### Citizen screens (public-facing)

| Role                           | Usual element | Text `size`   | Notes                                 |
| ------------------------------ | ------------- | ------------- | ------------------------------------- |
| Page title (start or landing)  | `h1`          | `heading-xl`  | Only on the first page of a service   |
| Page title (task or step)      | `h1`          | `heading-l`   | `heading-m` on mobile                 |
| Section                        | `h2`          | `heading-s`   |                                       |
| Card or subsection title       | `h3`          | `heading-xs`  |                                       |
| Group label                    | `h4`          | `heading-2xs` |                                       |
| Key figure (date, amount)      | `p`           | `heading-xs`  | Label above it in `body-xs` secondary |
| Lead paragraph                 | `p`           | `body-l`      | One per page at most, under the title |
| Instructions and prose         | `p`           | `body-m`      |                                       |
| Content inside cards and lists | `p`           | `body-s`      |                                       |
| Supporting text, metadata      | `p`           | `body-xs`     | `color="secondary"`                   |

### Worker screens (workspace, case lists, case pages)

| Role                    | Usual element | Text `size`   | Notes               |
| ----------------------- | ------------- | ------------- | ------------------- |
| Page title              | `h1`          | `heading-m`   |                     |
| Section                 | `h2`          | `heading-s`   |                     |
| Card or panel title     | `h3`          | `heading-xs`  |                     |
| Group label             | `h4`          | `heading-2xs` | `color="secondary"` |
| Body and field values   | `p`           | `body-s`      |                     |
| Labels, metadata, hints | `p`           | `body-xs`     | `color="secondary"` |

A card title has to stand above the form labels inside the card. A compact
Form item label is 16px semibold, the same as `heading-2xs`, so card titles
are `heading-xs` (20px). The steps go 28, 24, 20, 16: page, section, card,
label.

### Rules

- **Always set `size` explicitly.** Text maps `h2` to `heading-l` by
  default, which is one step too large for these screens.
- **One role, one size.** Size follows the role (section, card title, group
  label), not the tag. A card title looks the same on every screen, whether it
  is an `h2` or an `h3`.
- **Tag follows the outline.** Choose `h1`–`h4` so headings nest without
  skipping levels, then set `size` from the role.
- **Few sizes; use colour and weight first.** A card or panel usually needs
  three or four text sizes, not counting text inside components (buttons,
  badges, links). To separate roles or make something quieter, use
  `color="secondary"` or weight before adding a size or a heading level.
- **Line length:** keep Text's default `maxWidth` (65ch). Single-column
  forms and reading content sit in a column of about `40rem`.
- **No all-caps eyebrow labels.** Use `heading-2xs` or `body-xs` secondary.

## 2. Spacing tiers

Pick the tier from the relationship between two things, then pick the token.

| Tier | Relationship                                             | Tokens             |
| ---- | -------------------------------------------------------- | ------------------ |
| 1    | Parts of one thing: label and value, icon and text       | `3xs`, `2xs`, `xs` |
| 2    | Siblings in a group: fields, list items, cards in a grid | `s`, `m`           |
| 3    | Groups and sections                                      | `l`, `xl`          |
| 4    | Page regions: header to content, content to actions      | `xl`, `2xl`        |

### Rules

- **Proximity:** the gap between groups is at least twice the gap inside them.
  If items inside a card are `s` apart, cards are at least `l` apart.
- **A heading belongs to what follows it.** Space above a heading is at least
  twice the space below it (for example `mt="xl" mb="xs"`).
- **Containers own spacing.** Lay out siblings with
  a column Block's `gap` or a Grid's `gap`, not with
  `mt`/`mb` on each child.
- **Give column blocks `width="100%"`.** A Block is `max-content` wide
  by default, so a long line of text inside one doesn't wrap. It pushes the
  block, and the card around it, wider than the screen.
- **Inside a Block, zero the text margins.** Text adds its own
  margins (headings get `xl`–`2xl` above, body text gets `l` above and below),
  so set `mt="none" mb="none"` and let `gap` do the work.
- **In flowing prose** (headings and paragraphs, no cards), the Text
  default margins are fine, but still set `size` explicitly.
- **Be consistent within a screen.** Every card on a screen uses the same
  padding and the same inner gap.
- **Padding is the largest space inside a card.** No gap inside a card is
  bigger than the card's padding. A compact card (16px padding) uses `m` or
  smaller between its parts.

## 3. Component size

Worker screens are dense: people scan many records and fill in the same forms
all day. On worker screens, **use the compact version of every design system
component that has one.** Citizen screens never use compact: keep the default
sizes, which give bigger text and bigger targets to tap.

| Component                             | Worker screens        | What changes                             |
| ------------------------------------- | --------------------- | ---------------------------------------- |
| Button, Menu button                   | `size="compact"`      | 40px tall instead of 56px                |
| Button group                          | `gap="compact"`       | Matches compact buttons                  |
| Input, Dropdown, Dropdown multiselect | `size="compact"`      | 40px tall instead of 56px, `body-s` text |
| Text area                             | `size="compact"`      | Less padding, `body-s` text              |
| Radio group, Checkbox, Checkbox list  | `size="compact"`      | Smaller labels and gaps                  |
| Form item                             | `labelSize="compact"` | Smaller label, closer to its field       |
| Container                             | `padding="compact"`   | 16px padding instead of 32px             |
| Notification                          | `compact`             | Less padding                             |

### Rules

- **All or nothing on a screen.** Don't mix compact and default controls on the
  same worker screen. A default button next to a compact input looks broken.
- **The form item and its control match.** A compact Input sits in a
  Form item with `labelSize="compact"`.
- **Tables:** keep the default `variant` (not `relaxed`), put compact buttons in
  cells, and follow the `table-sizing` skill.
- **No compact option, no workaround.** If a component has no compact prop (for
  example Date picker in this version), use it as it is. Don't shrink it
  with CSS.
- **Check the prop exists** in `component-search` before using it. Names
  differ: `size`, `labelSize`, `padding`, `gap`, or a plain `compact`.

## 4. Composition

- One focal point per screen: the page title, then one primary action.
- Align to one left edge. Avoid centring body text.
- Group related fields or facts into a card or section with a heading, instead
  of one long list.
- Use dividers sparingly; space usually separates groups well enough.

## 5. Check before you finish

1. Open the screen in the browser at desktop (`1280px`) and mobile (`375px`)
   widths and take a screenshot.
2. Look at the desktop screenshot and list the three most prominent things on
   it, in order. They should be the page title, then the section headings or
   main content, then the primary action. If anything else is in that list (a
   badge, a card title, a secondary button), reduce its size, weight or colour.
3. Check every heading's `size` against the role tables above.
4. On worker screens, check every component in the "Component size" table has
   its compact prop set. On citizen screens, check none do.
5. Check that groups read as groups: inner gaps visibly smaller than outer gaps.
6. Search the files you touched for off-system values:

   ```sh
   grep -nE "font-size: *[0-9]|font-weight: *[0-9]|[0-9]+px" <files>
   ```

   Every hit should be a border width or have a reason.
