# Visual design in Angular

Read `SKILL.md` first. This file only covers how its rules are written in this
app's Angular code.

## Component names

`SKILL.md` names components the way the design system does. In Angular they come
from `@abgov/angular-components`, with the same inputs and values. Import the
class into the component's `imports` list, and write the element in its template:

| Design system name   | Angular class             | Element in a template         |
| -------------------- | ------------------------- | ----------------------------- |
| Text                 | `GoabText`                | `<goab-text>`                 |
| Block                | `GoabBlock`               | `<goab-block>`                |
| Grid                 | `GoabGrid`                | `<goab-grid>`                 |
| Container            | `GoabContainer`           | `<goab-container>`            |
| Button               | `GoabButton`              | `<goab-button>`               |
| Menu button          | `GoabMenuButton`          | `<goab-menu-button>`          |
| Button group         | `GoabButtonGroup`         | `<goab-button-group>`         |
| Input                | `GoabInput`               | `<goab-input>`                |
| Dropdown             | `GoabDropdown`            | `<goab-dropdown>`             |
| Dropdown multiselect | `GoabDropdownMultiselect` | `<goab-dropdown-multiselect>` |
| Text area            | `GoabTextArea`            | `<goab-textarea>`             |
| Radio group          | `GoabRadioGroup`          | `<goab-radio-group>`          |
| Checkbox             | `GoabCheckbox`            | `<goab-checkbox>`             |
| Checkbox list        | `GoabCheckboxList`        | `<goab-checkbox-list>`        |
| Form item            | `GoabFormItem`            | `<goab-form-item>`            |
| Notification         | `GoabNotification`        | `<goab-notification>`         |
| Date picker          | `GoabDatePicker`          | `<goab-date-picker>`          |

A fixed value is a plain attribute: `size="heading-xs"`. A value from the
component's code goes in square brackets: `[value]="name()"`. An input with no
value, like the notification's `compact`, is written on its own:
`<goab-notification compact …>`.

## Example: a worker card

This example shows text roles, spacing tiers and compact padding. It is not a
layout template.

**Before:**

```html
<goab-container type="non-interactive" accent="thin" mb="l">
  <!-- h2 at heading-m: page-title size used for a card title -->
  <goab-text tag="h2" size="heading-m" mt="none" mb="xs">Applicant details</goab-text>
  <!-- every child carries its own mt/mb -->
  <goab-text tag="p" size="body-m" color="secondary" mt="none" mb="l">
    What the applicant told us
  </goab-text>
  <app-detail-row label="Name" [value]="sampleCase.name" />
  <app-detail-row label="Date of birth" [value]="formatDate(sampleCase.dateOfBirth)" />
  <!-- raw size and weight -->
  <div style="font-size: 13px; font-weight: 600">Case ID</div>
  <div>{{ sampleCase.id }}</div>
</goab-container>
```

**After:**

```html
<goab-container type="non-interactive" accent="thin" padding="compact" mb="l">
  <goab-block direction="column" gap="m" width="100%">
    <goab-block direction="column" gap="2xs" width="100%">
      <goab-text tag="h2" size="heading-xs" mt="none" mb="none"
        >Applicant details</goab-text
      >
      <goab-text tag="p" size="body-xs" color="secondary" mt="none" mb="none">
        What the applicant told us
      </goab-text>
    </goab-block>
    <goab-block direction="column" gap="s" width="100%">
      @for (field of fields; track field.label) {
      <goab-block direction="column" gap="3xs" width="100%">
        <goab-text tag="div" size="body-xs" color="secondary" mt="none" mb="none">
          {{ field.label }}
        </goab-text>
        <goab-text tag="div" size="body-s" mt="none" mb="none"
          >{{ field.value }}</goab-text
        >
      </goab-block>
      }
    </goab-block>
  </goab-block>
</goab-container>
```

```ts
fields = [
  { label: "Name", value: sampleCase.name },
  { label: "Date of birth", value: formatDate(sampleCase.dateOfBirth) },
  { label: "Case ID", value: sampleCase.id },
];
```

What changed:

- **Roles:** on a worker screen, the card title is `heading-xs`, values are
  `body-s` and labels are `body-xs` secondary. Three sizes; colour separates
  labels from values.
- **Tiers:** label to value `3xs` (tier 1), field to field `s` (tier 2),
  heading group to fields `m`. Each step is bigger than the last, and none is
  bigger than the card's compact padding.
- **Containers own spacing:** `goab-block` `gap` replaces per-child margins, so
  every `goab-text` margin is `none`.
- **No raw values:** the case ID label uses the same field markup as the others.

On a citizen screen the card title and values are the same sizes, but the card
keeps its default padding and its form controls keep their default size. See
the citizen table in `SKILL.md`.
