---
name: write-github-issue
description: Use when filing a GitHub issue in this prototype repo (__REPO__) — a bug, an idea, or a task. Covers a light title and body format so another designer can pick it up cold.
---

# Skill: Write a GitHub issue

This is a prototype repo. Issues don't need labels, priorities, or a project
board — the goal is just enough detail that another designer (or their AI
assistant) can pick the work up without asking you what you meant.

## Title

Short, specific, imperative. Name the screen or flow it's about.

- Good: `Start button goes nowhere`, `Confirmation screen missing back link`.
- Vague: `bug`, `fix the page`.

## Body

Use whichever of these apply, in order:

- **What's going on** — the problem or the idea, in plain language.
- **Expected** — what it should do instead. For visual issues, name the design
  token or spacing you'd expect rather than leaving it to guess.
- **Steps to reproduce** (bugs) — numbered.
- **Screenshots** — for anything visual. Never include real personal data;
  anything committed stays in git history even after it's deleted.
- **Which version** — if the problem is on a preview or a snapshot rather than
  the current prototype, say which, and paste the link. They diverge on purpose.
- **Done when** — a short checklist of what "finished" looks like.

If you don't know a value (a token name, a colour), say so and flag it as a
question rather than inventing one. The body is the source of truth for scope.

## Filing it

```bash
gh issue create --title "..." --body "..."
```

Reference it from a PR with `Fixes #N` so it closes on merge (see the `open-pr`
skill).
