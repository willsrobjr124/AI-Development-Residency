# Week 1 - Coding Challenge

A collection of [Agent Skills](https://docs.claude.com/en/docs/claude-code/skills) for Claude Code, chosen to support front-end design, web and mobile app development, back-end work, and good engineering habits.

Skills live in [`.claude/skills/`](.claude/skills) inside this folder. When Claude Code is opened in this folder, it loads them automatically and uses each one when a task matches its description. [`skills-lock.json`](skills-lock.json) records the exact source and version (hash) of every skill.

## Skills

### Design (4)

| Skill | Source | What it does |
|---|---|---|
| [`frontend-design`](.claude/skills/frontend-design) | [anthropics/skills](https://github.com/anthropics/skills) | Guides Claude to make deliberate, distinctive visual choices (typography, color, layout) instead of generic, templated defaults. |
| [`web-design-guidelines`](.claude/skills/web-design-guidelines) | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | Reviews UI code against Vercel's Web Interface Guidelines (accessibility, UX, best practices) and reports issues by file and line. |
| [`ui-ux-pro-max`](.claude/skills/ui-ux-pro-max) | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | A searchable design library: styles, color palettes, font pairings, UX/accessibility rules, and guidance for 22 frameworks (React, Next.js, Flutter, SwiftUI, and more). |
| [`design-taste-frontend`](.claude/skills/design-taste-frontend) | [leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill) | Art direction for websites and landing pages, based on a study of 247 award-winning sites, with a browser-based screenshot-and-fix loop. |

### Coding (6)

| Skill | Source | What it does |
|---|---|---|
| [`vercel-react-best-practices`](.claude/skills/vercel-react-best-practices) | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | React and Next.js performance patterns: data fetching, bundle size, re-renders. |
| [`react-native-best-practices`](.claude/skills/react-native-best-practices) | [callstackincubator/agent-skills](https://github.com/callstackincubator/agent-skills) | React Native performance: frame rate, startup time, memory, lists, and animations. |
| [`supabase`](.claude/skills/supabase) | [supabase/agent-skills](https://github.com/supabase/agent-skills) | Back-end work with Supabase (database, auth, storage, edge functions), including a security checklist for row-level security and API keys. |
| [`systematic-debugging`](.claude/skills/systematic-debugging) | [obra/superpowers](https://github.com/obra/superpowers) | Finds the root cause of a bug before proposing a fix, instead of guessing. |
| [`verification-before-completion`](.claude/skills/verification-before-completion) | [obra/superpowers](https://github.com/obra/superpowers) | Requires Claude to run tests or checks and show evidence before claiming work is done. |
| [`webapp-testing`](.claude/skills/webapp-testing) | [anthropics/skills](https://github.com/anthropics/skills) | Tests local web apps in a headless browser with Playwright: clicks, screenshots, console logs. |

## Safety review

Skills run with the same permissions as Claude, so every skill was reviewed before being committed:

1. **Automated scan:** the `skills` installer reports Gen, Socket, and Snyk risk ratings for each skill.
2. **Source check:** confirmed the skill comes from its official or original publisher (stars, owner, age of the repository), not an unofficial copy.
3. **Manual read:** read each `SKILL.md` and searched any scripts for network calls, shell commands, file deletion, and requests for credentials.
4. **Conflict check:** made sure a new skill's rules don't contradict skills already installed.

| Skill | Snyk rating | Notes |
|---|---|---|
| frontend-design | Low | Instructions only. |
| web-design-guidelines | Low | Instructions only; downloads the latest guideline text from Vercel's GitHub when used. |
| ui-ux-pro-max | Low | Python scripts only read the skill's own data files; no network access. |
| design-taste-frontend | Low | Scripts fetch public-domain / Creative Commons images from public archives (Wikimedia, the Met, NASA, archive.org) and use a separate, temporary headless browser profile for screenshots. No API keys. |
| vercel-react-best-practices | Low | Instructions only. |
| react-native-best-practices | Low | Instructions and reference screenshots. |
| supabase | Medium | Official Supabase skill. Flagged because it fetches live Supabase docs and discusses keys and tokens; the content mostly warns *against* exposing them. Accepted. |
| systematic-debugging | Low | Includes a small test-bisection shell script; no network access. |
| verification-before-completion | Low | Instructions only. |
| webapp-testing | Medium | Official Anthropic skill. Flagged because its helper script starts local dev servers via shell commands, which is its stated purpose. Accepted. |

### Skills reviewed and removed

| Skill | Source | Reason |
|---|---|---|
| `design-mobile-apps` | designed-by-ai/skills | Rated **High Risk** by Snyk. It's a connector to a paid third-party design service (Sleek) that requires an API key and sends app descriptions to an outside server, and it came from a new, unofficial account republishing Sleek's skill rather than from Sleek itself. Never committed. |
| `high-end-visual-design` | leonxlnx/taste-skill | Low risk, but its rules **conflicted** with the other design skills: it required patterns (all-caps labels, fade-in on every section, glassy gradients) that `frontend-design` and `design-taste-frontend` treat as signs of generic AI design. Removed to keep guidance consistent. |

## Using these skills

Clone the repository, then open the `Week 1 - Coding Challenge` folder with Claude Code; the skills load automatically:

```bash
git clone https://github.com/willsrobjr124/AI-Development-Residency.git
```

To add any of these skills to another project, run the installer from that project's folder, for example:

```bash
npx skills add https://github.com/anthropics/skills --skill frontend-design
```

### Requirements

- **Node.js 22+**: for the `skills` installer and `design-taste-frontend` scripts
- **Python 3**: for `ui-ux-pro-max` search and `webapp-testing`
- **Chrome or Edge**: for `design-taste-frontend` screenshots
- **Playwright** (`pip install playwright`): for `webapp-testing`, installed when first needed
