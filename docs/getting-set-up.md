# Getting set up for coded prototyping

A checklist for designers. Work down it in order. Most of it is done once.

You don't need to work for the Government of Alberta to use this. The prototype
is built with the
[Government of Alberta design system](https://design.alberta.ca), but all you
need is your own GitHub account.

---

## 1. Get a GitHub account (5 minutes)

- [ ] **[Sign up for GitHub](https://github.com/signup)** if you don't have an account. The free plan is enough.
- [ ] Turn on two-factor authentication when GitHub asks. It's needed to publish from your account.

## 2. Install the tools (about 20 minutes)

- [ ] **An AI coding app.** This is where you'll work. Any one of these will do. They all read the same house rules (`AGENTS.md`) and skills (`.agents/skills/`):
  - **Claude**: the [Claude desktop app](https://claude.ai/download), in its **Code** tab
  - **GitHub Copilot**: the GitHub Copilot app
  - **Codex**: the [Codex app](https://openai.com/codex/) from OpenAI
- [ ] **Node.js 24** from [nodejs.org](https://nodejs.org). It runs the prototype on your computer. You won't need to use it directly; the AI does.
- [ ] **Git.** It's usually already on a Mac. If the app asks for it, follow its prompt.
- [ ] **The GitHub command line tool (`gh`)** from [cli.github.com](https://cli.github.com). The AI uses it to open pull requests and switch on the live site.
- [ ] **Sign `gh` in to GitHub**, with permission to publish workflows. In a terminal, run:

  ```bash
  gh auth login --scopes workflow
  ```

  Choose **GitHub.com**, **HTTPS** and **Login with a web browser**. Copy the one-time code it shows, press Enter, paste the code into the page that opens and select **Authorize**. Wait until the terminal says **Authentication complete**.

  The `workflow` part matters. Without it, GitHub turns down any push that includes the files that publish the prototype. If you've already signed in without it, run `gh auth refresh -h github.com -s workflow` to add it.
- [ ] *Optional:* **GitHub Desktop**, if you'd like to see changes without the command line

## 3. Start a prototype

Every prototype starts as a copy of the **[prototype template](https://github.com/Spark450/Design-proto-demo-AB)**. It already has:

- **Skills**: the design system, visual design (text sizes and spacing), content design, opening a pull request, requirements docs and Jira stories. **You don't need to set these up or call them.** The AI picks them up as it works.
- A **worker workspace** and a **citizen form** to start from, plus a **Prototype** button for jumping between their pages. You keep whichever side you need.
- A **live preview** for every pull request, and a live site that updates when you merge

To make your own:

- [ ] Open the [prototype template](https://github.com/Spark450/Design-proto-demo-AB) and select **Use this template → Create a new repository**. Don't download it as a ZIP: a copy made with the button is already connected to GitHub, which saves a lot of fiddly steps.
- [ ] Leave **Owner** as your own account, give it a short name (for example `licence-renewal-prototype`) and choose **Public**. Then select **Create repository**. (Why public? See [below](#public-or-private).)
- [ ] In your AI app, open your new repo. Ask it to *"clone `<your-account>/<repo-name>` from GitHub and open it"* if the app doesn't offer to.
- [ ] Start a session in it and say: *"Set this up."* The AI asks a few questions about your prototype, gets it running on your computer, switches on its live link and opens your first pull request. It takes about 10 minutes.
- [ ] After that, whenever you want to see it on your computer, ask: *"Run the prototype locally and give me the link."*

### Public or private?

On a free GitHub account, the live site only works for a **public** repo. With
a paid plan (GitHub Pro or a paid organisation) a private repo can have one too,
but **the live site and its previews are still public**. Only GitHub
Enterprise can hide them behind a sign-in.

So assume that **anyone with a link can open your prototype**, and that anyone
can read the repo, including its history. That's what lets you send a link to a
research participant. It's also why the house rule about sample data matters:
never commit real names, real case details, research transcripts or screenshots
of real systems.

## 4. Connect your other tools (MCPs)

These let the AI read Jira, Confluence, Miro and Figma, and write to Jira. They're optional; without them you can paste screenshots and text instead.

The three addresses are:

| Tool | Address |
| --- | --- |
| Atlassian (Jira and Confluence) | `https://mcp.atlassian.com/v1/mcp` |
| Miro | `https://mcp.miro.com/` |
| Figma (desktop app) | `http://127.0.0.1:3845/mcp` |

How you add them depends on your app:

- **Claude:** add Atlassian, Miro and Figma under **Settings → Connectors**. Or run `claude mcp add --transport http <name> <address>` once for each.
- **GitHub Copilot:** add them in the app's MCP settings, or put this in `~/.copilot/mcp-config.json`:

  ```json
  {
    "mcpServers": {
      "Atlassian Rovo MCP Server": { "type": "http", "url": "https://mcp.atlassian.com/v1/mcp", "tools": ["*"] },
      "miro": { "type": "http", "url": "https://mcp.miro.com/", "tools": ["*"] },
      "figma-desktop": { "type": "http", "url": "http://127.0.0.1:3845/mcp", "tools": ["*"] }
    }
  }
  ```

- **Codex:** add them to `~/.codex/config.toml`:

  ```toml
  [mcp_servers.atlassian]
  url = "https://mcp.atlassian.com/v1/mcp"

  [mcp_servers.miro]
  url = "https://mcp.miro.com/"

  [mcp_servers.figma-desktop]
  url = "http://127.0.0.1:3845/mcp"
  ```

There are no passwords or keys in any of these. Each one asks you to sign in through your browser the first time.

### Atlassian (Jira and Confluence)
- [ ] Sign in when the app prompts you, and allow access to your team's Atlassian site
- [ ] Test it: ask for the summary of one of your team's issues, for example *"What's the summary of ABC-123?"*
- **Quirks**
  - **The connection expires every so often.** The AI will say it can't reach Atlassian. **Signing in to Jira in your browser doesn't fix it.** Reconnect the integration in the app's settings.
  - **It acts with your permissions.** Ask for a draft first, and confirm before it creates or changes anything.
  - Broad "search everything" requests use Rovo credits. Asking for specific issue keys, or using a JQL query, doesn't.
  - Atlassian now recommends `https://mcp.atlassian.com/v2/mcp` for new setups. `v1` still works.

### Miro
- [ ] Sign in when prompted, and **choose the team** your boards are in
- [ ] Test it: paste a board link and ask *"Summarise this board."*
- **Quirks**
  - **It only sees boards in the team you chose.** For another team's boards, reconnect and choose that team.
  - **Link to a specific frame:** right-click it → *Copy link*. Links to several selected items don't always work.
  - Large boards are slow. Point it at a frame rather than the whole board.

### Figma
- [ ] Needs a **Dev or Full seat** on a paid plan
- [ ] Open the **Figma desktop app** (not the browser) and open a design file
- [ ] Turn on **Dev Mode** (Shift+D) → in the Inspect panel, **enable the desktop MCP server**
- [ ] Test it: select a frame and ask *"Describe the frame I have selected in Figma."*
- **Quirks**
  - **It only works while the Figma desktop app is open.** Close Figma and the AI can't reach it.
  - It reads **what you've selected**, or a frame link (right-click → *Copy link to selection*).
  - If the desktop server won't run, Figma also has a hosted server (`https://mcp.figma.com/mcp`) that you sign in to instead.

## 5. Habits worth starting with

- [ ] **Reconnect before anything important:** a demo, a research session or a story-writing session
- [ ] **One change per pull request.** Check the preview yourself before you merge.
- [ ] **Effort:** use **high** when *what* to build is still open, and **medium** when the brief is already clear
- [ ] **Big changes:** turn on **plan mode** so it asks questions and proposes a plan before changing anything
- [ ] **Sample data only.** Never put real names, SINs or case details in a prototype or a story. Everything here is public.

---

**Stuck?** Ask the AI first: *"Can you reach the Atlassian MCP?"* or *"Why won't the prototype start?"* It's usually good at diagnosing its own setup. If that doesn't sort it out, [open an issue on the template](https://github.com/Spark450/Design-proto-demo-AB/issues).
