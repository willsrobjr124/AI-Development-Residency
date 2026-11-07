# Week 4 Coding Challenge

**Challenge:** build an MVP of the ADHD budgeting app, with a focus on UI and UX design.

- `steady-money/`: the Expo app (working folder name)
- `CLAUDE.md`: what Claude Code reads first, including which design skill wins when skills disagree
- `.claude/skills/`: 27 skills (5 new design skills plus the 22 from Week 3)
- [`skills-lock.json`](skills-lock.json): the exact source and version (hash) of each installed skill
- [`.claude/agents/engineer.md`](.claude/agents/engineer.md): the (@_@) Engineer subagent, which reviews specs and features for technical feasibility, effort, risks and open questions
- [`.claude/agents/executive.md`](.claude/agents/executive.md): the (ಠ_ಠ) Executive subagent, a strategic communication specialist that writes executive summaries and business cases and advises on stakeholder alignment
- [`.claude/agents/a11y-reviewer.md`](.claude/agents/a11y-reviewer.md): the accessibility subagent, which critiques designs and audits UI components against WCAG 2.2 AA

## New design skills (5)

| Skill | Source | What it does |
|---|---|---|
| [`design-brief`](.claude/skills/design-brief) | [julianoczkowski/designer-skills](https://github.com/julianoczkowski/designer-skills) | Interviews us and writes a design brief: problem, experience principles, tone, components and accessibility needs. |
| [`information-architecture`](.claude/skills/information-architecture) | julianoczkowski/designer-skills | Maps screens, navigation, user flows and the words the app uses. |
| [`design-tokens`](.claude/skills/design-tokens) | julianoczkowski/designer-skills | Turns the brief into colors, spacing, type sizes, corner radius and motion values, in light and dark mode. |
| [`design-review`](.claude/skills/design-review) | julianoczkowski/designer-skills | Screenshots the running app and critiques it against the brief: hierarchy, consistency, states and accessibility. |
| [`mobile-app-ui-design`](.claude/skills/mobile-app-ui-design) | [ceorkm/mobile-app-ui-design](https://github.com/ceorkm/mobile-app-ui-design) | Mobile layout craft: 8-point spacing, thumb-zone actions, visual hierarchy and useful empty states. |

These work alongside the design skills we already had: `expo-design-system` and `expo-native-ui` (Expo), plus our own `adhd-ux-guidelines` and `mobile-accessibility`.

## Safety review

Each skill went through the same four checks as Weeks 1 and 2.

| Skill | Gen | Socket | Snyk | Notes |
|---|---|---|---|---|
| design-brief | Pass | Pass | Pass | Instructions only. |
| information-architecture | Pass | Pass | Pass | Instructions only. |
| design-tokens | Pass | Pass | Pass | Instructions only. |
| design-review | Pass | Pass | Pass | Instructions only. Takes screenshots of the app running on our own computer (localhost). |
| mobile-app-ui-design | Pass | Pass | Pass | Instructions plus one reference file. Its only command is a suggestion to install a separate screenshots skill, which we did not install. |

**Manual read:** every file was read in full, and the installed copies were checked against the reviewed copies. None contain scripts, downloads, or requests for passwords or API keys.

**Conflict check:** two conflicts were found and resolved with priority rules in `CLAUDE.md`:

- `mobile-app-ui-design` suggests sparkles, badges and streaks or levels. Our ADHD research says streaks and reward loops push people away after a slip, so `adhd-ux-guidelines` wins. Its build notes target websites (Tailwind, Lucide, Recharts), so we use only its layout advice.
- `design-tokens` defaults to CSS files. In an Expo app, `expo-design-system` decides where tokens live (a TypeScript theme), and `design-tokens` decides the values.

### Reviewed and not installed

| Skill | Reason |
|---|---|
| `react-native-design` (wshobson/agents) | Passes the audits, but it is built on React Navigation and Reanimated 3, which conflict with this app's Expo Router and Reanimated 4. |
| `design-mobile-apps` (designed-by-ai) | Rated High Risk in Week 1: it sends app descriptions to a paid outside service and needs an API key. |
| `ios-design` (uizze.sh) | No registry page or audit results, so its source can't be verified. |
| `extract-design-system`, `tailwind-design-system` | Built for websites and Tailwind, not a React Native app. |
