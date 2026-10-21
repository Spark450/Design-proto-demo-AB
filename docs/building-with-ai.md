# Building coded prototypes with AI

This is how I've been building coded prototypes with AI. It's one way of
working that's suited my team. It isn't an official process, and it will
probably change, so take what's useful.

- **Prototype template:**
  [Spark450/Design-proto-demo-AB](https://github.com/Spark450/Design-proto-demo-AB).
  It's public, so anyone with a GitHub account can copy it.
- **Live demo of the template:**
  [React](https://spark450.github.io/Design-proto-demo-AB/) or
  [Angular](https://spark450.github.io/Design-proto-demo-AB/angular/)
- **Step-by-step checklist:** [Getting set up](getting-set-up.md)

You don't need to work for the Government of Alberta to use it. The prototype is
built with the [Government of Alberta design system](https://design.alberta.ca),
but all you need is your own GitHub account.

## 1. Get set up (about half an hour)

1. [Sign up for GitHub](https://github.com/signup) if you don't have an account.
   The free plan is enough.
2. Install an **AI coding app**. Any one of these will do:
    - the [Claude desktop app](https://claude.ai/download), in its **Code** tab
    - the **GitHub Copilot** app
    - the [Codex app](https://openai.com/codex/) from OpenAI
3. Install [**Node.js 24**](https://nodejs.org) and the
   [**GitHub command line tool (`gh`)**](https://cli.github.com), then sign
   `gh` in with `gh auth login --scopes workflow`.

**Good to know**

- **GitHub Copilot is a different product from Microsoft Copilot.**
- You won't use Node.js or `gh` directly. The AI does.
- [Getting set up](getting-set-up.md) has every step, including what to choose
  when `gh` signs in and why the `workflow` part matters.

## 2. Start a prototype

1. On the template, select **Use this template → Create a new repository**.
   Leave the owner as your own account and choose **Public**.
2. Open your new repo in your AI app.
3. Start a session and say **"Set this up."** before asking for any changes. It
   asks a few questions, including whether to use React or Angular, then gets
   the prototype running and switches on its live link.

The template comes in **React** and **Angular**. Both have the design system, a
worker workspace and a citizen form built in. During setup, pick the one your
service's developers will use. Setup keeps only the one you pick. To compare
them first, open the live demos linked at the top.

**To share a prototype, send the link.** The live site is public, so anyone can
open it, including research participants. That also means anyone can read the
repo and its history, so use made-up data only.

### Skills built into the template

Skills are written instructions that the AI reads when they're relevant to what
you've asked. They come with every copy of the template. **You don't need to set
them up or call them by name.** The AI picks them up as you work. You can open
them in `.agents/skills/` and edit them to suit your team.

| Skill | What it does for you |
| --- | --- |
| `first-run-setup` | Turns your copy of the template into your own prototype when you say "Set this up": asks about your service and whether to use React or Angular, gets it running and switches on its live link. |
| `using-goa-design-system` | Starts from what you're trying to build (for example "a worker tool for case management") and picks the design system patterns and components that fit. |
| `component-search` | Looks up components on the design system website: their options, usage guidance and accessibility guidance. |
| `visual-design` | Sets heading and text sizes, text colour and spacing so screens look consistent. Also used when a screen "looks off" or feels cramped. |
| `table-sizing` | Keeps tables that list records the same height in every screen, so rows and headings line up. |
| `content-design` | Writes labels, messages, errors and guidance for the right reader: plain language for citizens, denser wording for workers. |
| `requirements-docs` | Keeps a requirements doc for each area of the prototype up to date as you change it. This is what makes the prototype self-documenting. |
| `open-pr` | Opens a pull request for each change, with its own preview link, and saves a snapshot before merging so you can go back to it. |
| `write-github-issue` | Files a bug, idea or task as a GitHub issue that another designer can pick up cold. |
| `write-jira-story` | Drafts Jira stories from the prototype and its requirements docs. It's written in my team's story format, so adapt it to yours before you use it. |

## 3. Connect your other tools (optional)

| Tool | What it does | Things to know |
| --- | --- | --- |
| Atlassian (Jira, Confluence) | Reads both, and drafts and creates Jira issues | The sign-in expires every so often. Reconnect it in the app's settings; signing in to Jira in the browser doesn't fix it. It acts with your permissions, so ask for drafts first. |
| Miro | Reads and writes to boards | Only sees the team you chose when you sign in. |
| Figma | Reads the frame you've selected | Use the **desktop** server: the hosted one has been unreliable for me. Needs the Figma app open and a Dev or Full seat. |

*Without these you can paste screenshots and text instead.*
[Getting set up](getting-set-up.md#4-connect-your-other-tools-mcps) has the
addresses and how to add them in each app.

## 4. How I work

- **One group of changes per pull request.** Every pull request gets its own
  preview link. You can view or share it before merging.
- **Merging publishes.** When a pull request is merged into `main`, the live
  link updates. See [Showing your work](showing-your-work.md) for which link to
  send when.
- **For big changes, use plan mode.** The AI asks questions and proposes a plan
  before touching anything.
- **Effort:** medium for small changes, high for bigger features or when *what*
  to build is still open.
- **The prototype documents itself.** Requirements docs update as the prototype
  changes. Jira stories can be drafted from them, linking to the preview and the
  doc. Adapt the `write-jira-story` skill to your team's format first, then
  refine the stories as a team as usual.
    - The requirements doc is updated in the same pull request as the change, so
      it never falls behind.
    - Each point in the doc is marked as a **decision**, **assumption**, **open
      question** or **prototype-only shortcut**, with who decided and when. Old
      decisions are replaced, not deleted, so you can see what changed and why.
    - The reasoning has to come from you, your Miro boards and Confluence. A doc
      the AI writes just by reading the code describes the screens but not why
      they're that way.
- **Stuck? Ask the AI first.** If something isn't working, including the setup
  or a tool connection, describe it in a session. It can usually work out what's
  wrong and fix it or tell you what to do.
- **Prototype code doesn't go directly to production.** Developers build
  production from it.
- **Use made-up data only.** Never commit real names, SINs, case details,
  research transcripts or screenshots of internal systems. Anything committed
  stays in the history, even after it's deleted.

## Common questions

- **Why public?** On a free GitHub account, the live site only works for a
  public repo. Even on a paid plan, the live site and its previews are public.
- **Which AI app should I use?** Any of Claude, GitHub Copilot or Codex. They
  all read the same house rules (`AGENTS.md`) and skills. Pick the one you
  already have access to.
- **Can I work without installing anything?** Partly. Some apps can work on the
  repo from the GitHub website, but there's no live preview on your computer,
  and the tool connections above probably won't work.
- **Usage limits?** They depend on your app and plan. Match the model and
  effort to how complex the work is.
- **Can I change it live with stakeholders?** Yes. If you're using one of the
  apps above, changes show in the preview on your computer as the AI makes them,
  so you can try ideas during a meeting.
