---
name: requirements-docs
description: Use when writing or updating a requirements document for an area of this prototype (docs/*-requirements.md) — after changing how a screen behaves, after a decision session or review round, when starting a doc for an area that has none, or when pulling requirements out of one to write stories.
---

# Requirements docs

## What these are

One document per functional area, in `docs/`, named `<area>-requirements.md`.
Once this prototype has a few, the most thorough one is the reference for the
rest. When this page and that document disagree, the document is right and this
page is out of date.

**A requirements doc is not a description of the code.** The code describes
itself, and a doc that paraphrases it drifts the moment anyone touches a file.
What these hold is the half a developer can't recover from the repo: what was
decided, by whom, when, what was rejected and why, what's a guess everyone is
living with, and what nobody has answered yet.

The test for whether something belongs here:

| Could a developer get it from `src/`? | Then |
| --- | --- |
| Yes, by reading the code | Leave it out |
| Only by attending a meeting from four months ago | It goes in |

This is why these docs are worth the effort for story writing and the production
build. A story written from the prototype alone reproduces the prototype's
shortcuts. A story written from the prototype *and* its requirements doc knows
which parts are load-bearing.

## Every claim carries its standing

This is the discipline the whole thing rests on. Four kinds of claim, and a
reader must never have to guess which one they're looking at.

**Decided.** Name where and when. Not "the list is one row per application" but
the round or session that settled it, so a reader knows who to go back to:

> **The March review settled it.** In session with the product owner and service
> designer:

**Assumed.** Things chosen to keep moving. They live under an `Assumptions`
heading that says as much — "Made to keep moving, each cheap to change" — so
nobody mistakes the list for policy.

**Open.** Under `Still open`, with who has to answer it and why this document
can't. "Whether this step needs its own service standard is a policy question
this prototype cannot answer."

**Prototype-only.** The most important one, and the easiest to lose. Behaviour
that exists because something had to go on screen. Say so in the open, in plain
words — "Invented", "Derived and unconfirmed", "Nobody should quote this list
until the product owner has looked at it".

The failure all four exist to prevent: a shortcut someone took on a Tuesday
afternoon, read six months later as an approved requirement and built.

## Updating one after a change

The usual path — you changed behaviour, and a claim in the doc is now wrong.

1. **Find what your change contradicts.** Grep the doc for the names of things
   you touched: a field, a status, a role, a column, a button label.

2. **Supersede; don't overwrite.** The old reasoning is the reason the doc is
   worth having. Leave the passage where it is and append a forward pointer:

   > *Both column sets have since changed — the labels were renamed and
   > reviewers lost `Assigned to` and `View` entirely. See
   > [The stakeholder round](#the-stakeholder-round).*

   Deleting a superseded decision destroys the record of a decision having been
   made, which is the one thing the code genuinely cannot tell anyone.

3. **Write why, not what.** The diff already says what. Say what the first
   attempt was and on what grounds it was rejected. Quote the reviewer or the
   session directly where you have their words — a quotation settles an argument
   that a paraphrase reopens.

4. **Mark the standing of anything new** — decided, assumed, open or
   prototype-only, per above. New material with no standing is the main way
   these documents rot.

5. **Re-read `Assumptions` and `Still open`.** A change often answers one or
   creates one. An assumption your change has now settled moves up into the body
   as a decision, with its date.

## Starting a new one

Only when an area has had a real decision — a session, a review round, a
rejected alternative. An area nobody has argued about yet produces a doc that is
pure code description, which is the kind that drifts and teaches people to
distrust the rest.

Open with what the area is for and where the material came from: the Miro board
and its dates, the sessions, the Confluence pages, linked. The README's
"Sources" section is a good place to start looking. Then, roughly:

- **What it's for** — the problem in plain terms, including how it's handled today.
- **The domain sections** — whatever the area actually turns on. Not a fixed list.
- **Review rounds** — one heading per round, kept as history rather than folded in.
- **Assumptions**
- **Still open**
- **Out of scope** — with the reasoning, so it isn't re-litigated annually.

Prose over bullets. These get read start to finish by someone new to the area,
and a wall of fragments doesn't survive that.

## What not to do

- **Don't regenerate a doc from the code.** An agent reading `src/` can only
  produce "what it currently does" — the least useful part, and it will quietly
  overwrite decisions and assumptions with implementation detail.
- **Don't promote an assumption because it's been there a while.** Age isn't
  approval, and neither is the code doing it.
- **Don't add a changelog section.** History belongs inline, next to the claim it
  changed.
- **Don't let the doc and the implementation silently disagree.** Where they
  differ, say so and say which is which.

## Research findings are a different thing

Research findings record what participants did and said. Keep them in their own
doc in `docs/` (for example `<area>-research-findings.md`). That's evidence, and
it doesn't change when the prototype does. A requirements doc cites it; it
doesn't absorb it.
