---
name: open-pr
description: Use when opening a pull request in this prototype repo (__REPO__). Covers branching off main, one focused change, the PR body, the preview URL a PR gets automatically, freezing a snapshot, and how merging deploys the live site.
---

# Skill: Open a pull request

This is a prototype repo, not the design-system library. Keep the process light.
The goal is a PR that's easy for another designer to read and use as a place to
talk about the change.

## 1. Branch off the latest main

```bash
git checkout main
git pull origin main
git checkout -b short-descriptive-name
```

A small typo-level tweak can go straight to `main`. Anything a person might want
to look at first gets a branch.

## 2. One focused change

One idea per PR. If you touched several unrelated things, split them. Squash
follow-up commits rather than stacking noise — the PR merges as a single commit
anyway.

Commit message: a short imperative summary line ("Fix footer position", not
"fixed stuff"). Add a sentence or two of why if it isn't obvious from the diff.

## 3. Update the requirements doc

If you changed how something behaves — a rule, a status, a permission, what a
screen shows or when — bring the area's requirements doc in line **in this same
PR**. They live in `docs/`, one per functional area, named
`<area>-requirements.md`.

This is the moment to do it. Everything you changed is still in front of you,
and after the squash-merge the reasoning only exists in your head.

The `requirements-docs` skill covers how: supersede rather than overwrite, keep
the old reasoning, and mark whether a new claim is a decision, an assumption, an
open question or a prototype-only shortcut.

If the area has no doc yet, only start one if this change settled a real
decision. If nothing behavioural changed — styling, a refactor, docs, skills,
workflow config — skip this and say so in the PR body.

## 4. Open the PR

```bash
gh pr create --base main --title "..." --body "..."
```

In the body:

- **What changed and why** — a couple of plain sentences.
- **Where to look** — the screens that changed, so a reviewer opening the
  preview knows where to go.
- **Screenshots** — before/after for any visual change. Never include real
  personal data; anything committed stays in git history even after it's
  deleted.
- `Fixes #N` if it closes an issue, so the issue closes on merge.

There's no PR template and no required reviewer. A PR is a fine place to have a
design conversation before merging.

Open the PR early. A draft PR gets the same preview as a finished one, and a
link to click is a better way to ask "does this work?" than a description of it.

## 5. Every PR gets a preview URL

Within a couple of minutes of opening or pushing, a comment appears on the PR
with a link to `/preview/<branch>/` — the whole prototype, built from that
branch. The comment updates itself on every push, so the link always points at
the latest version of the change.

This is the thing to send when someone asks to see it. Two competing designs can
each have an open PR, so both are live at once and can be compared side by side.

Two limits worth knowing:

- **The preview disappears** when the branch is merged or deleted. It's for a
  conversation happening now, not a link someone needs next month.
- **Anyone with the link can open it.** The site is public, with no sign-in.
  That's handy for sharing, but it means a preview is never the place for real
  data. For research participants, send a snapshot instead: it doesn't
  disappear partway through a study.

If you need a link that survives — one you used in a research session, say — go
to **Actions → Snapshot the prototype → Run workflow**, point it at your branch
and give it a name. That freezes a copy at `/v/<name>/` that never changes.
Names can't be reused. This also happens automatically before every merge — see
below.

Everything that exists is listed at `/versions/`.

## 6. Snapshot before merging

**Take a snapshot of the branch before every merge**, without being asked:

```bash
gh workflow run snapshot.yml --ref <branch> \
  -f name=<short-slug> \
  -f note="What this was, in one sentence." \
  -f ref=<branch>
```

Wait for it to go green and confirm the name appears under `/v/`.

Merging is the moment the branch's own record disappears — the preview URL dies
with the branch, and the squashed commit on `main` is the only thing left. A
snapshot costs half a minute and leaves a clickable copy of exactly what was
merged, which is the thing you want later when someone asks what a decision
looked like at the time. Reconstructing it from a commit is possible; nobody
does it.

Name it after the change, not the date — `new-start-page`, not
`sep-4`. Names are lowercase letters, numbers and hyphens, and can never be
reused.

The exception is a change that doesn't alter the built prototype — docs, agent
skills, workflow config. There's nothing to freeze, because the screens are
identical to the last snapshot. Skip it and say why.

This is a standing default set in September 2026, to be revisited once there
are enough snapshots to judge whether they're being used.

## 7. Merging deploys the site

Squash and merge from the GitHub UI. The branch deletes itself, and its preview
is removed with it. **Merging to `main` publishes to the main prototype URL**
via `.github/workflows/deploy.yml`, so only merge when the change is demo-ready.
Branches don't touch that URL — they only ever publish to their own preview
directory.

From a worktree, `gh pr merge <n> --squash --delete-branch` does the same job.
It merges and deletes the remote branch correctly, then reports
`fatal: 'main' is already used by worktree` when it tries to check `main` out
locally. That error is after the fact and can be ignored — confirm with
`gh pr view <n> --json state`.

If `gh` isn't available, push the branch and report that the PR must be opened
in the GitHub UI.
