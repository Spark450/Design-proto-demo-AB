# Getting set up for coded prototyping

A checklist for designers. Work down it in order. Most of it is done once.

---

## 1. Request access (allow about a week)

### If you don't have a GoA-issued computer: get somewhere to install things first

Submit these first. They take the longest.

- [ ] **[Request a personal AVD](https://bernie.gov.ab.ca/esm?id=sc_cat_item&sys_id=2ac11a1b1bdd52905a9743b4bd4bcbc8).** This is the virtual desktop you'll install everything on. A shared (multi-session) AVD won't work. It's usually approved the same day.
- [ ] **[Request a .Z account](https://goa-dio.atlassian.net/wiki/spaces/CD/pages/2541289894/Request+a+.Z+account+New+account+or+adding+to+an+AVD).** You'll need it to install Node.js in step 2. It can take **about a week**. When it's approved, call to activate it and get your credentials.

### Everyone: GitHub, Copilot and Lab access

- [ ] Fill in the **[GitHub access request on Bernie](https://bernie.gov.ab.ca/esm?id=sc_cat_item&sys_id=f3769a161b0a451464f6b99f034bcbdc)**:

  | Field | Choose |
  | --- | --- |
  | Is this related to a rapid response event? | **No** |
  | Requested for | *Your name* |
  | What would you like to do? | **Access to GitHub** |
  | Do you require additional app integrations? | **No** |
  | Do you need GitHub Copilot? | **Yes** (Copilot comes with this request; there's no separate one) |

  - **Rationale:** *"I work collaboratively with the team on updating coded prototypes and automating team workflows."*
  - **In the same request, ask for "Lab" access**, meaning the **GovAlta-Lab** GitHub organisation. That's where the prototype repos live. Without it you can't open them or see their live previews.
- [ ] **Wait a business day after it's approved.** Approval usually comes within hours, but access can take up to 1 business day to work. Signing in before then is the most common reason it "doesn't work".
- [ ] Sign in to GitHub with your GoA credentials by following the **[GoA GitHub setup guide (KB0025978)](https://bernie.gov.ab.ca/esm?id=kb_article_view&sysparm_article=KB0025978)**
- [ ] Accept the GitHub organisation invite (it comes by email)
- [ ] Check that you can open a GovAlta-Lab repo while signed in to GitHub

*Source for these steps: [GoA-Managed Setup (Official): GitHub Copilot + VS Code](https://goa-dio.atlassian.net/wiki/spaces/CD/pages/5106533856/GoA-Managed+Setup+Official+GitHub+Copilot+VS+Code), phases 1–2 and 4.1. That guide goes on to set up VS Code. You don't need that part; you'll work in the Copilot app instead.*

## 2. Install the tools (about 20 minutes)

- [ ] **The GitHub Copilot app.** Sign in with your GitHub account. This is where you'll work.
- [ ] **Node.js 24** from nodejs.org. It runs the prototype on your machine. You won't need to use it directly; the AI does. On a personal AVD, you'll need your .Z account to install it.
- [ ] **Git.** It's usually already on a Mac. If the app asks for it, follow its prompt.
- [ ] *Optional:* **GitHub Desktop**, if you'd like to see changes without the command line

## 3. Start a prototype

Every prototype starts as a copy of the **[prototype template](https://github.com/GovAlta-Lab/Design-proto-demo)**. It already has:

- **Skills**: the design system, visual design (text sizes and spacing), content design, opening a pull request, requirements docs and Jira stories. **You don't need to set these up or call them.** The AI picks them up as it works.
- A **worker workspace** and a **citizen form** to start from, plus a **Prototype** button for jumping between their pages. You keep whichever side you need.
- A **live preview** for every pull request, and a live site that updates when you merge

To make your own:

- [ ] Open the [prototype template](https://github.com/GovAlta-Lab/Design-proto-demo) and select **Use this template → Create a new repository**
- [ ] Set **Owner** to **GovAlta-Lab**, give it a short name (for example `licence-renewal-prototype`), and choose **Private**. Then select **Create repository**
- [ ] In the Copilot app, add your new repo as a project
- [ ] Start a session in it and say: *"Set this up."* The AI asks a few questions about your prototype, gets it running on your computer, switches on its live link and opens your first pull request. It takes about 10 minutes.
- [ ] After that, whenever you want to see it on your computer, ask: *"Run the prototype locally and give me the link."*

## 4. Connect your other tools (MCPs)

These let the AI read Jira, Confluence, Miro and Figma, and write to Jira. They're optional; without them you can paste screenshots and text instead.

Add them in the app's MCP settings, or put this in `~/.copilot/mcp-config.json`:

```json
{
  "mcpServers": {
    "Atlassian Rovo MCP Server": { "type": "http", "url": "https://mcp.atlassian.com/v1/mcp", "tools": ["*"] },
    "miro": { "type": "http", "url": "https://mcp.miro.com/", "tools": ["*"] },
    "figma-desktop": { "type": "http", "url": "http://127.0.0.1:3845/mcp", "tools": ["*"] }
  }
}
```

There are no passwords or keys in this file. Each one asks you to sign in through your browser the first time.

### Atlassian (Jira and Confluence)
- [ ] Sign in when the app prompts you, and allow access to the **goa-dio** site
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
- [ ] **Sample data only.** Never put real names, SINs or case details in a prototype or a story.

---

**Stuck?** Ask the AI first: *"Can you reach the Atlassian MCP?"* or *"Why won't the prototype start?"* It's usually good at diagnosing its own setup. If that doesn't sort it out, ask another designer on your team who has already set up a prototype.
