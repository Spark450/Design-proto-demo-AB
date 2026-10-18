# Docs

This folder holds the guides for this prototype and its requirements docs.

## Guides

- [Getting set up](getting-set-up.md): access, tools and connections, done once
- [Showing your work](showing-your-work.md): which link to send, and when

## Requirements docs

Each area of the prototype that has had a real design conversation gets its own
requirements doc here. Name it `<area>-requirements.md`, for example
`eligibility-requirements.md`. Keep to one doc per area.

A requirements doc isn't a description of the screens. The prototype already
shows those. It holds what the prototype can't show:

- what was decided, by whom and when
- what was tried and rejected, and why
- what's an assumption the team is living with for now
- what's still an open question, and who needs to answer it
- what exists only because the prototype needed something on screen, and
  shouldn't be built as-is

That's what makes these worth reading when you write stories or hand work to
developers.

**Update the doc in the same pull request as the change.** Afterwards, the
reasoning only exists in somebody's head. You don't have to remember how: the
AI follows the `requirements-docs` skill (in `.agents/skills/`), which covers
starting a doc, updating one without losing old decisions, and marking what
kind of claim each thing is.

There are no requirements docs yet. Start one when an area has had its first
real decision: a design session, a review round or a rejected idea.
