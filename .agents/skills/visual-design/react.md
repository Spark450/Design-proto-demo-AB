# Visual design in React

Read `SKILL.md` first. This file only covers how its rules are written in this
app's React code.

## Component names

`SKILL.md` names components the way the design system does. In React they come
from `@abgov/react-components`, with the same props and values:

| Design system name   | React component           |
| -------------------- | ------------------------- |
| Text                 | `GoabText`                |
| Block                | `GoabBlock`               |
| Grid                 | `GoabGrid`                |
| Container            | `GoabContainer`           |
| Button               | `GoabButton`              |
| Menu button          | `GoabMenuButton`          |
| Button group         | `GoabButtonGroup`         |
| Input                | `GoabInput`               |
| Dropdown             | `GoabDropdown`            |
| Dropdown multiselect | `GoabDropdownMultiselect` |
| Text area            | `GoabTextArea`            |
| Radio group          | `GoabRadioGroup`          |
| Checkbox             | `GoabCheckbox`            |
| Checkbox list        | `GoabCheckboxList`        |
| Form item            | `GoabFormItem`            |
| Notification         | `GoabNotification`        |
| Date picker          | `GoabDatePicker`          |

A prop with no value, like the notification's `compact`, is written on its own:
`<GoabNotification compact …>`.

## Example: a worker card

This example shows text roles, spacing tiers and compact padding. It is not a
layout template.

**Before:**

```tsx
<GoabContainer type="non-interactive" accent="thin" mb="l">
  {/* h2 at heading-m: page-title size used for a card title */}
  <GoabText tag="h2" size="heading-m" mt="none" mb="xs">
    Applicant details
  </GoabText>
  {/* every child carries its own mt/mb */}
  <GoabText tag="p" size="body-m" color="secondary" mt="none" mb="l">
    What the applicant told us
  </GoabText>
  <DetailRow label="Name" value={sampleCase.name} />
  <DetailRow label="Date of birth" value={formatDate(sampleCase.dateOfBirth)} />
  {/* raw size and weight */}
  <div style={{ fontSize: 13, fontWeight: 600 }}>Case ID</div>
  <div>{sampleCase.id}</div>
</GoabContainer>
```

**After:**

```tsx
<GoabContainer type="non-interactive" accent="thin" padding="compact" mb="l">
  <GoabBlock direction="column" gap="m" width="100%">
    <GoabBlock direction="column" gap="2xs" width="100%">
      <GoabText tag="h2" size="heading-xs" mt="none" mb="none">
        Applicant details
      </GoabText>
      <GoabText tag="p" size="body-xs" color="secondary" mt="none" mb="none">
        What the applicant told us
      </GoabText>
    </GoabBlock>
    <GoabBlock direction="column" gap="s" width="100%">
      <Field label="Name" value={sampleCase.name} />
      <Field label="Date of birth" value={formatDate(sampleCase.dateOfBirth)} />
      <Field label="Case ID" value={sampleCase.id} />
    </GoabBlock>
  </GoabBlock>
</GoabContainer>;

function Field({ label, value }) {
  return (
    <GoabBlock direction="column" gap="3xs" width="100%">
      <GoabText tag="div" size="body-xs" color="secondary" mt="none" mb="none">
        {label}
      </GoabText>
      <GoabText tag="div" size="body-s" mt="none" mb="none">
        {value}
      </GoabText>
    </GoabBlock>
  );
}
```

What changed:

- **Roles:** on a worker screen, the card title is `heading-xs`, values are
  `body-s` and labels are `body-xs` secondary. Three sizes; colour separates
  labels from values.
- **Tiers:** label to value `3xs` (tier 1), field to field `s` (tier 2),
  heading group to fields `m`. Each step is bigger than the last, and none is
  bigger than the card's compact padding.
- **Containers own spacing:** `GoabBlock` `gap` replaces per-child margins, so
  every `GoabText` margin is `none`.
- **No raw values:** the case ID label uses the same `Field` as the others.

On a citizen screen the card title and values are the same sizes, but the card
keeps its default padding and its form controls keep their default size. See
the citizen table in `SKILL.md`.
