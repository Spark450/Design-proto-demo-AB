# Showing your work

The README covers how this repo is put together. This page covers the questions
that come up once you start sharing what you've made.

The short version: **you don't need a second copy of the repo, a screenshot, or
a copy of a screen with `-test` on the end.** Those were all workarounds for
having only one live link. There's more than one now.

---

## "I want to show someone a change before it's final"

Ask the AI to open a pull request, even a draft one. Within a couple of
minutes, a comment appears on it with a preview link. The link updates every
time the change does.

Send that link. It's the whole prototype built from your change, so people can
click through it, not just look at a picture of it.

The link goes away when the change is merged or the branch is deleted. That's
usually right: by then the change is in the main prototype.

---

## "I want two versions alive at the same time"

Put each one in its own pull request. Both get a preview link, both stay live,
and you can open them side by side in two tabs.

This replaces keeping two copies of the repo, such as "current designs" and
"future designs".

If you need to keep comparing the two after one of them is merged, take a
snapshot of each before it goes (see below).

---

## "I need to show what we tested on the 12th"

Take a snapshot, ideally on the day.

Go to **Actions → Snapshot the prototype → Run workflow**. Point it at the
branch you used, give it a name (`feb-12-session`, `round-2-usability`) and a
one-line note about what it was for. Or ask the AI to do it for you.

It builds a copy at `/v/<name>/` and leaves it there. Nothing later changes it:
not a merge to `main`, not another snapshot. Names can't be reused, which is
what makes the link worth handing to someone weeks later. It's listed on the
directory page and at `/versions/`, so you don't need to keep the link
yourself.

This is what a screenshot in Figma was standing in for, except it's still
clickable. Someone can walk through exactly what the participant walked through.

Take a snapshot when there's something worth going back to: after a research
session, before a big rework, at the end of a round. Not on a schedule. The AI
also takes one before every merge.

---

## "Can I send a link to a research participant?"

Yes. The site is public, so anyone with the link can open it, with no GitHub
account needed. That works for unmoderated testing too, where a participant
opens the link on their own computer in their own time.

A few things make it go smoothly:

- **Send a snapshot, not a preview.** A preview disappears when its pull
  request is merged, which could be halfway through a study. A snapshot never
  changes, so every participant sees the same thing.
- **Link straight to the first page.** Use the directory or the **Prototype**
  button to find the page you want them to start on, and send that address.
- **For moderated sessions,** you can still share your screen and drive, or
  let the participant use your computer.

Because the links are public, anyone a participant forwards one to can open it
too. That's fine for a prototype full of made-up data, and another reason never
to put real data in it.

---

## "I built something in another tool. Can I bring it in?"

Yes, and it's worth doing rather than leaving it stranded.

Give the files to the AI and ask it to open a pull request with them. Say where
they came from and what they're meant to show. The preview build will show
whether it works in this repo before anyone has to read the code.

Expect the design system components to need swapping in. That's usually most of
the work, and it's the part that makes the prototype useful in a real
conversation with developers.

---

## "What's the link I give people?"

The main one, `/`, which is in the About box on the repo's GitHub page. It shows
whatever was last merged to `main`, and the address doesn't change. It opens on
the directory, which links to every page on each side and lists every snapshot.

Put it in the story, the refinement invite and the chat message. Developers use
it to read real values off the screen instead of guessing from a static design,
so it's worth keeping current.

If you're not sure which link you want, start at `/versions/`. It lists the
current prototype, every open preview and every snapshot, with dates.

---

## "How do I keep track of what exists?"

You don't have to. `/versions/` is built from what's actually published, so it
can't go out of date the way a hand-kept list does.

---

## "Which of these should I be using?"

| You want to… | Use |
| --- | --- |
| Show a change you're still working on | A preview, from a pull request |
| Compare two designs | Two pull requests, each with its own preview |
| Keep something reachable after a session | A snapshot |
| Give someone "the prototype" | `/` |
| Find a page or a snapshot | The directory, at `/` |
| Find out what exists, including previews | `/versions/` |

When in doubt: a preview for now, a snapshot for later.
