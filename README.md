# __PROTOTYPE_NAME__

## Start a new prototype

This repo is a template. Don't change it to build your prototype. Make your own
copy:

1. Select **Use this template → Create a new repository** at the top of this
   page.
2. Set **Owner** to **GovAlta-Lab**, give it a short name, and choose
   **Private**. Then select **Create repository**.
3. In the Copilot app, add your new repo as a project.
4. Start a session in it and say: *"Set this up."*

The AI asks a few questions, gets it running, switches on its live link and
opens your first pull request. It takes about 10 minutes. First time? Work
through [Getting set up](docs/getting-set-up.md) first.

To see what you start with before making a copy, open the template's live demo:
<https://legendary-eureka-kmykeln.pages.github.io/>. The Angular version is at
<https://legendary-eureka-kmykeln.pages.github.io/angular/>.

**Working on the template itself?** The React app lives in `apps/react/`, under
a small wrapper `package.json` that passes `npm run ...` commands through to it.
An Angular version of the same screens lives in `apps/angular/`, with its own
packages: run `npm run setup:angular` once, then `npm run dev:angular`,
`npm run test:angular` or `npm run build:angular`. A change to the screens in
one app should be made in the other too. Setup moves one app to the top of the
repo, so paths in the rest of this README and in the skills (`src/...`,
`index.html`) are written as they'll be after setup. In the template,
`npm run build` writes to `apps/react/dist/`. Text that only applies to one
framework sits between `<!-- REACT -->` or `<!-- ANGULAR -->` markers, which
setup removes.

---

A coded prototype built with the
[Government of Alberta design system](https://design.alberta.ca). It's for
showing and testing ideas. It is not a real service, and everything in it is
made up.

## See it

**The live link is in the About box** at the top right of this repo's page on
GitHub. It always shows the latest version of `main`. You don't need to install
anything to click through it.

The live link opens on the **directory**: a list of every page on each side, and
every snapshot. Add `versions/` to the end of the live link to see everything
that exists, including open previews.

| | Where | Changes when | Use it for |
| --- | --- | --- | --- |
| **Current** | `/` | A change is merged into `main` | The link to share: stories, refinement, anyone who wants "the prototype" |
| **Preview** | `/preview/<branch>/` | You push to that pull request | Showing a change before it's final, or two designs side by side |
| **Snapshot** | `/v/<name>/` | Never | What you showed in a research session, still clickable weeks later |
| **All versions** | `/versions/` | Any of the above | Finding out what exists |

[Showing your work](docs/showing-your-work.md) walks through the common
situations.

### Who can open these links

**Anyone you send a link to needs a GitHub account with access to this repo.**
The site is private, so people outside the organisation see an error page
instead of the prototype. Moderated research still works: share your screen, or
let the participant use your computer.

## How to work on it

Open this repo in the GitHub Copilot app and say what you want in plain words,
for example *"Add a page that asks for the applicant's address."* The AI already
knows how this repo works. It uses the design system, writes plain-language
content and opens pull requests the right way, without you having to ask.

A few habits keep it easy:

- **One change per pull request.** Every pull request gets its own preview link
  within a couple of minutes. Check it yourself before you merge.
- **Merging publishes.** When a pull request is merged into `main`, the live
  link updates. The preview link goes away.
- **Snapshot anything worth going back to.** The AI takes a snapshot before
  every merge. You can also take one yourself after a research session: go to
  **Actions → Snapshot the prototype → Run workflow**.
- **Keep the requirements docs current.** When a change affects how something
  works, update its requirements doc in the same pull request. See
  [docs/README.md](docs/README.md).
- **Made-up data only.** Never put real names, SINs, case details or
  screenshots of internal systems in here. Anything committed stays in the
  history, even after it's deleted.
- **Big changes:** turn on **plan mode**, so the AI asks questions and proposes
  a plan before it changes anything.

New to all this? Start with [Getting set up](docs/getting-set-up.md).

### Running it on your computer

You'll rarely need to do this yourself. You can ask the AI to *"run the
prototype and give me the link."* To do it yourself, you need
[Node.js](https://nodejs.org) 24:

```bash
npm install     # once, and again when someone adds a package
npm run dev     # starts the prototype at http://localhost:5173
```

Leave `npm run dev` running. Save a file and the page updates by itself.

| Command | What it does |
| --- | --- |
| `npm run dev` | Runs the prototype on your computer, updating as you save |
| `npm test` | Runs the tests once |
| `npm run build` | Builds the site into `dist/`, the same way the live site is built |
| `npm run typecheck` | A stricter check for code problems. Optional |

## Where things live

<!-- REACT -->

| Folder or file | What's in it |
| --- | --- |
| `src/worker/` | The worker side: a workspace for people inside government, at `/internal`. A case list, a case page where you record a decision, and search |
| `src/citizen/` | The citizen side: a public form. A start page at `/apply`, four questions, a check-your-answers page and a done page |
| `src/shared/` | Used by both sides: the directory page at `/`, the prototype controls, the not-found and error pages, the version banner and the prototype's name |
| `src/data/sample.ts` | Made-up sample data |
| `src/App.tsx` | The list of every page address, and which sides the directory and the prototype controls show |
| `docs/` | Requirements docs and guides |
| `.agents/skills/` | Instructions the AI follows on its own. You don't need to open these |
| `AGENTS.md` | House rules for the AI |

### Which files belong to each side

This prototype can have a worker side, a citizen side, or both. To remove a
side, delete everything in its column.

| | Worker side | Citizen side |
| --- | --- | --- |
| Folder | `src/worker/` (all of it) | `src/citizen/` (all of it) |
| Routes in `src/App.tsx` | The `WORKER` import line, the `WORKER` block and the `// WORKER` line in `sides` | The `CITIZEN` import line, the `CITIZEN` block and the `// CITIZEN` line in `sides` |
| Tests in `src/App.test.tsx` | The `WORKER` block | The `CITIZEN` block |
| Also | The mobile menu rule at the top of `src/index.css`. `src/data/sample.ts` is only used by this side: keep the file as a home for made-up data | Nothing else |

Keep `src/shared/`: both sides use it. Run `npm test` and `npm run build`
afterwards to check nothing else needed it.

<!-- /REACT -->
<!-- ANGULAR -->

| Folder or file | What's in it |
| --- | --- |
| `src/app/worker/` | The worker side: a workspace for people inside government, at `/internal`. A case list, a case page where you record a decision, and search |
| `src/app/citizen/` | The citizen side: a public form. A start page at `/apply`, four questions, a check-your-answers page and a done page |
| `src/app/shared/` | Used by both sides: the directory page at `/`, the prototype controls, the not-found and error pages, the version banner and the prototype's name |
| `src/app/data/sample.ts` | Made-up sample data |
| `src/app/app.routes.ts` | The list of every page address, and which sides the directory and the prototype controls show |
| `src/styles.css` | Styles for the whole prototype, including the table rules |
| `docs/` | Requirements docs and guides |
| `.agents/skills/` | Instructions the AI follows on its own. You don't need to open these |
| `AGENTS.md` | House rules for the AI |

### Which files belong to each side

This prototype can have a worker side, a citizen side, or both. To remove a
side, delete everything in its column.

| | Worker side | Citizen side |
| --- | --- | --- |
| Folder | `src/app/worker/` (all of it) | `src/app/citizen/` (all of it) |
| Routes in `src/app/app.routes.ts` | The `WORKER` import line, the `WORKER` block and the `// WORKER` line in `sides` | The `CITIZEN` import line, the `CITIZEN` block and the `// CITIZEN` line in `sides` |
| Tests in `src/app/app.spec.ts` | The `WORKER` block | The `CITIZEN` block |
| Also | The mobile menu rule at the top of `src/styles.css`. `src/app/data/sample.ts` is only used by this side: keep the file as a home for made-up data | Nothing else |

Keep `src/app/shared/`: both sides use it. Run `npm test` and `npm run build`
afterwards to check nothing else needed it.

<!-- /ANGULAR -->

### Prototype controls

The dashed **Prototype** button in the bottom corner opens a list of every page.
Use it in a demo to switch between the citizen and worker sides, or to jump
straight to a page without filling in the form first. **Directory** at the top
goes back to the directory page. **Start over** clears any
answers and goes back to the start. Drag the ⠿ handle if the button covers
something. Double-click the handle to put it back.

The controls aren't part of the design. They show on every page, including in
previews and snapshots.

- **Adding a page?** Add it to its side's list in its routes file
  (`citizenScreens` or `workerScreens`), so it shows up in the controls and on
  the directory page. A test
  checks that every page in those lists opens.

<!-- REACT -->

- **Don't want the controls?** For example, for a session where the participant
  drives. Delete the `<PrototypeControls sides={sides} />` line in
  `src/App.tsx`.

<!-- /REACT -->
<!-- ANGULAR -->

- **Don't want the controls?** For example, for a session where the participant
  drives. Delete the `<app-prototype-controls [sides]="sides" />` line in
  `src/app/app.ts`.

<!-- /ANGULAR -->

## Sources

Links to the Miro boards, Figma files and Confluence pages this prototype is
based on.

- None yet.

## How it works

The technical reasons behind how this is set up. You don't need these to use
the prototype.

### Publishing

Everything publishes to one `gh-pages` branch, which is what the site is served
from. Four workflows write to it:

| Workflow | Runs when | Publishes to |
| --- | --- | --- |
| `deploy.yml` | A push to `main` | `/` |
| `preview.yml` | A pull request is opened or pushed to | `/preview/<branch>/` |
| `cleanup-preview.yml` | A pull request is closed or its branch is deleted | Removes its preview |
| `snapshot.yml` | You run it by hand | `/v/<name>/` |

Each workflow has its own concurrency group, so a run only ever waits behind
another run of the same workflow. They once shared one group, and the preview
cleanup started by a merge cancelled that merge's deploy before it began.
Publishing at the same time is safe because each workflow only touches its own
folder, and `publish-to-pages` rebuilds its commit on top of the latest
`gh-pages` when a push is rejected.

**One-time setup:** in **Settings → Pages**, set **Source** to **Deploy from a
branch**, branch `gh-pages`, folder `/`. Run `deploy.yml` once first so the
branch exists. In a new copy of the template, first-run setup does this.

### Notes

- **Real URLs, not hash routing.** Addresses look like `/internal`, not
  `/#/internal`. GitHub Pages can't rewrite addresses on the server, so a
  `404.html` at the site root stands in for that. It's what makes a deep link
  like `/internal` work.
- **Deep links into previews take a detour.** Pages only serves the one 404 page
  at the site root, so a link like `/preview/x/apply/name` would otherwise be
  answered by the *main* build, quietly showing the wrong version. The root 404
  spots those paths and sends them to the right build, which puts the address
  back. `scripts/make-404.mjs` and the script in `index.html` are the two
  halves, and `scripts/pages-routing.test.mjs` keeps them honest.

<!-- REACT -->

- **TypeScript is relaxed on purpose.** `strict` is off and `npm run build`
  doesn't type-check, so a half-finished page never blocks a demo. Run
  `npm run typecheck` when you want the stricter check.

<!-- /REACT -->
<!-- ANGULAR -->

- **TypeScript is relaxed on purpose.** `strict` and Angular's strict template
  checks are off, so a half-finished page is less likely to block a demo.
  `npm run build` still stops on real code errors.

<!-- /ANGULAR -->

- **The page is marked `noindex`.** The site is already private, but a prototype
  turning up in search results is a real enough risk to guard against twice.
- **Never commit real data.** The repo is private today, but that can change,
  and anything committed stays in git history even after it's deleted. That
  includes research transcripts, screenshots of internal systems and keys.
