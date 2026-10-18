---
name: first-run-setup
description: Use when `.template/SETUP-PENDING` exists in a repo other than Spark450/Design-proto-demo-AB, or when the designer says "set this up" in a prototype just created from the template. Walks a designer through turning the template into their own working prototype, with a live URL, in one conversation.
---

# Skill: First-run setup

This repo was just created from the design prototype template. Your job is to
turn it into this designer's own prototype, with a live link, before they start
designing.

**The person you're working with is a designer, not a developer.** Explain each
step in a sentence of plain language. Don't show long command output; summarise
it. Ask **one question at a time**. Fix what you can yourself; only ask them to
act when it needs their account or their permission.

Don't run this in `Spark450/Design-proto-demo-AB` itself, or in any repo that
`gh repo view --json isTemplate` says is a template. That's the template.

---

## 1. Say what's about to happen

Something like:

> "This is a fresh copy of the prototype template. I'll get it running on your
> computer, give it a live link you can share, and ask you a few questions about
> what you're designing. It takes about 10 minutes."

## 2. Check the basics (no questions yet)

Check each one quietly, and only speak up if something fails:

| Check | Command | If it fails |
| --- | --- | --- |
| Signed in to GitHub | `gh auth status` | Ask them to run `gh auth login --scopes workflow` and choose the browser option |
| Can publish workflows | `gh auth status` lists `workflow` under token scopes | Without it, every push that touches `.github/workflows/` is turned down. Ask them to run `gh auth refresh -h github.com -s workflow`, copy the code, press Enter and select **Authorize** in the browser, then wait for "Authentication complete" |
| Which repo this is | `gh repo view --json nameWithOwner,visibility,isTemplate` | — |
| Public | from above | On a free account the live site only works for a public repo. If it's private, explain that and ask before changing it. Either way, the live site and previews are public, so remind them about sample data only |
| Node 24 | `node --version` | Point them to nodejs.org, or use `nvm use` if they have nvm |
| It installs | `npm install` | Read the error and fix it |

## 3. Ask about the prototype

One question at a time. Offer choices where you can.

If you can't ask (for example, the session is on autopilot), choose the most likely answers, say clearly what you chose, and list the choices in the setup pull request so the designer can change them before merging.

1. **"Will the developers who build the real service use React or Angular?"** The template has the same screens in both. The prototype keeps one, so the code it shows developers is in the framework they'll use. If they don't know, suggest asking the development team. If they still can't say, choose **React** and say so in the setup pull request. The template's live demo shows both: React at `/` and Angular at `/angular/`.
2. **"What should we call this prototype?"** Use this for `__PROTOTYPE_NAME__`.
3. **"Who is it for?"**
   - **People working inside government:** keep the worker workspace and remove the citizen form
   - **Members of the public:** keep the citizen form and remove the worker workspace
   - **Both:** keep both
4. **"Is there a Jira project this work belongs to?"** If yes, get the project key (e.g. `STR`) and, if the team has one, the issue key of its story template. If not, leave Jira out. They can add it later.
5. **"Is there existing material I should know about: Miro boards, Figma files, Confluence pages?"** Just note the links in the README under "Sources". Don't read them yet.

## 4. Make it theirs

1. **Make a branch:** `git checkout -b set-up-prototype`. If the session is already on its own branch (app sessions often are), stay on it. Rename it to `set-up-prototype` if you can.
2. **Move their framework's app to the top of the repo, and remove the other one.** In the template the React app lives in `apps/react/` and the Angular app in `apps/angular/`, under a small wrapper `package.json`. Their prototype only needs one, so replace the wrapper with it. Start by clearing out installed packages and build output:
   ```bash
   rm -rf node_modules apps/react/node_modules apps/react/dist apps/angular/node_modules apps/angular/dist apps/angular/.angular
   ```
   **For React:**
   ```bash
   git rm -q package.json
   git mv apps/react/* .
   git rm -rq apps/angular
   rm -rf apps
   npm install
   node -e 'const fs=require("fs"),f="package-lock.json",l=JSON.parse(fs.readFileSync(f));delete l.packages["apps/react"];fs.writeFileSync(f,JSON.stringify(l,null,2)+"\n")'
   git add package-lock.json
   ```
   The `node` line removes the one entry npm leaves behind in `package-lock.json` for the old folder.

   **For Angular:**
   ```bash
   git rm -q package.json package-lock.json
   git rm -rq apps/react
   git mv apps/angular/scripts/build.mjs scripts/
   rm -rf apps/angular/scripts
   git mv apps/angular/* .
   rm -rf apps
   npm install
   ```
   Angular's build helper goes into the shared `scripts/` folder, because a folder with that name is already at the top.

   Either way, keep `package-lock.json`: it holds the exact package versions the template was tested with. Check that `npm run build` and `npm test` pass. Every path from here on (`src/...`, `public/...`) is at the top of the repo.

   Then remove the framework markers. In the README, `AGENTS.md` and the skills, text that only applies to React sits between a `<!-- REACT -->` line and a `<!-- /REACT -->` line, and text that only applies to Angular sits between `<!-- ANGULAR -->` and `<!-- /ANGULAR -->`. Keep their framework's text and delete its marker lines. Delete the other framework's blocks completely, along with the skills' file for it. First set which is which, running only the line for their framework:
   ```bash
   keep=REACT; drop=ANGULAR; dropfile=angular.md    # React
   keep=ANGULAR; drop=REACT; dropfile=react.md      # Angular
   ```
   Then, in the same shell:
   ```bash
   grep -rlE --include='*.md' --exclude-dir=node_modules --exclude-dir=first-run-setup '^<!-- /?(REACT|ANGULAR) -->$' . | xargs perl -0pi -e "s/^<!-- $drop -->\n.*?^<!-- \/$drop -->\n//msg; s/^<!-- \/?$keep -->\n//mg; s/\n{3,}/\n\n/g"
   git rm -q .agents/skills/*/$dropfile
   grep -rnE --include='*.md' --exclude-dir=node_modules --exclude-dir=first-run-setup "^<!-- /?(REACT|ANGULAR) -->\$|$dropfile" .
   ```
   The last command should return nothing. The first-run rule in `AGENTS.md` still describes the `apps/` folders; step 6 removes it.
3. **Replace the placeholders** everywhere except `node_modules` and this skill's folder:
   - `__REPO__` → the repo's `owner/name`
   - `__PROTOTYPE_NAME__` → their answer
   - `__JIRA_PROJECT__`, `__JIRA_STORY_TEMPLATE__` → their answers. If they have a project but no story template, set `__JIRA_STORY_TEMPLATE__` to `none`. If there's no Jira project, replace the whole "This prototype's Jira settings" section of the `write-jira-story` skill (including its paragraphs about `none` and a missing project) with: "No Jira project set yet: draft stories only and don't create them."
   - The name also appears in `src/shared/prototype.ts` (React) or `src/app/shared/prototype.ts` (Angular), which the screens read it from.
   - Confirm with `grep -rn '__[A-Z][A-Z_]*__' --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist --exclude-dir=first-run-setup .`. It should return nothing. (The pattern needs a letter after `__`, so the `____` blanks in the content design skill don't match.)
4. **Remove the surface they don't need.** The README's "Which files belong to each side" table lists them for their framework, now that step 2 has removed the other one: the folder, the import line and block marked `WORKER` or `CITIZEN` in the routes file (`src/App.tsx` or `src/app/app.routes.ts`), the matching line in its `sides` list (it feeds the prototype controls), and the matching block in the tests (`src/App.test.tsx` or `src/app/app.spec.ts`). The directory page at `/` lists whichever sides are left, so it needs no change. If you remove the worker side, also remove the mobile menu rule at the top of the main stylesheet (`src/index.css` or `src/styles.css`). Then search `src/` and the README for the removed side's name (`grep -rni 'citizen\|worker' src README.md`) and tidy anything that now describes something that isn't there, including code comments. Update the README's "Which files belong to each side" section so it describes only what's left, and check that `npm run build` and `npm test` still pass.
5. **Name things:** `package.json` `name` (kebab-case), the `<title>` in `index.html` (React) or `src/index.html` (Angular), the `name` and `short_name` in `public/site.webmanifest`, and the README heading.
6. **Remove the template-only bits:**
   - delete `.template/`
   - remove the "Start a new prototype" section from the README
   - remove the first-run rule from `AGENTS.md`
   - remove the "Build the Angular version" step from `.github/actions/build-prototype/action.yml`
   - remove `"apps/angular/**/*.html", ` from `.prettierrc`
   - delete this skill folder (`.agents/skills/first-run-setup/`)
7. **Run it locally:** start `npm run dev` in the background, so you can carry on. Give them the `localhost` link. React picks another port if 5173 is taken; Angular stops instead, so run `npm run dev -- --port 4200` if it does and ask them to open it. Stop it before you finish, and tell them they can ask you to run it again any time.

## 5. Switch on the live site

Repos made from a template don't copy GitHub settings, so Pages needs turning on.

1. **Check for a first deploy:** `gh run list --workflow deploy.yml --limit 1`. If there isn't one, run `gh workflow run deploy.yml --ref main` and wait for it to finish (`gh run watch`). This creates the `gh-pages` branch.
2. **Point Pages at it:**
   ```bash
   gh api -X POST repos/<owner>/<name>/pages \
     -f "source[branch]=gh-pages" -f "source[path]=/"
   ```
   If it already exists, use `-X PUT` with the same fields.
3. **Redeploy:** the first deploy was built before Pages existed, so its links point at the wrong folder. Run `gh workflow run deploy.yml --ref main` again and wait for it. The site is served from `https://<owner>.github.io/<name>/` and is public. Tell them so in one sentence.
4. **If anything here fails with 403 or 404:** the designer probably isn't an admin on the repo, or the repo is private on a free account. Give them the manual steps: **Settings → Pages → Source: Deploy from a branch → `gh-pages` → `/` → Save.** If Pages isn't offered, the repo needs to be public or on a paid plan.
5. **If a workflow fails with a permissions error:** **Settings → Actions → General → Workflow permissions → Read and write.** If that's locked, the repo's owner needs to change it.
6. **Put the live link on the repo page.** The README tells people the link is in the repo's **About** box, so set it:
   ```bash
   gh repo edit <owner>/<name> --homepage "$(gh api repos/<owner>/<name>/pages --jq .html_url)"
   ```

## 6. Their first pull request

This shows them the whole loop on a change that matters to them.

1. Commit with a message like `Set up <prototype name>`.
2. Open a PR using the `open-pr` skill. The body should say what was set up, which framework was chosen and which surface was kept. **This is a setup change, so skip the requirements doc step and the snapshot, and say so.**
3. Wait for the preview comment, then send them the preview link: *"This is what every change will look like: its own link, before it goes live."*
4. Ask: **"Happy with it? I'll merge it and it becomes your live prototype."** Merge only when they say yes (`gh pr merge --squash --delete-branch`).
5. Wait for `deploy.yml`, then give them the live link and `/versions/`.

## 7. Check their connectors (optional, don't block)

Ask: **"Do you want to check your Jira, Miro and Figma connections now?"** If yes, try one small read for each that's set up:

- **Atlassian:** look up one issue from their Jira project
- **Miro:** read one of the board links they gave you
- **Figma:** ask them to open the desktop app, turn on Dev Mode and select a frame, then describe it

If a connection isn't there or has expired, point them to the matching section of `docs/getting-set-up.md`. In particular: **for Atlassian, signing in to Jira in the browser doesn't fix it. They need to reconnect it in the app.**

## 8. Hand over

Finish with a short summary:

> "You're set up.
> - **Live:** <url>
> - **All versions:** <url>versions/
> - **On your computer:** `npm run dev`
>
> Some good first things to ask me:
> - *'Change the heading and intro to describe <their service>.'*
> - *'Here's a screenshot of the current screen: rebuild it with the design system.'*
> - *'Read this Miro board and draft a requirements doc for <area>.'*
>
> For bigger changes, switch on **plan mode** and I'll ask questions and propose a plan before changing anything."

---

## If something goes wrong partway

The marker file is gone only once the setup PR merges, so a new session will
offer to set up again. Before starting over, check what's already done
(`git branch`, `gh pr list`, `gh api repos/<owner>/<name>/pages`) and pick up
from there. Don't redo steps that are already finished.
