# Week 2 Coding Challenge

**Challenge:** write a product requirements document (PRD) for an app that helps people with ADHD budget their money.

This folder holds the market research and product management [Agent Skills](https://docs.claude.com/en/docs/claude-code/skills) added for this challenge. They live in [`.claude/skills/`](.claude/skills) inside this folder, so Claude Code loads them automatically when it is opened here. [`skills-lock.json`](skills-lock.json) records the exact source and version (hash) of each skill.

All nine come from one collection, [phuryn/pm-skills](https://github.com/phuryn/pm-skills) by Paweł Huryn (Product Compass), so their frameworks and templates fit together.

## Skills

### Market research (4)

| Skill | What it does | Use in this PRD |
|---|---|---|
| [`market-sizing`](.claude/skills/market-sizing) | Estimates TAM, SAM and SOM with top-down and bottom-up methods, with sources and stated assumptions. | How many adults with ADHD need budgeting help, and what that market is worth. |
| [`competitor-analysis`](.claude/skills/competitor-analysis) | Profiles 5 direct competitors (strengths, weaknesses, pricing) and finds differentiation gaps. | How existing budgeting apps fall short for ADHD users. |
| [`user-personas`](.claude/skills/user-personas) | Builds 3 research-based personas with jobs-to-be-done, pains, gains and an unexpected insight. | Who the app is for, and what gets in their way. |
| [`customer-journey-map`](.claude/skills/customer-journey-map) | Maps each stage from awareness to advocacy, with emotions, pain points and drop-off risks. | Where ADHD users typically abandon budgeting tools, and how to keep them engaged. |

### Product management (5)

| Skill | What it does | Use in this PRD |
|---|---|---|
| [`create-prd`](.claude/skills/create-prd) | Writes a lean, 8-section PRD: summary, contacts, background, objective, market segments, value propositions, solution and release. | **The main deliverable.** |
| [`value-proposition`](.claude/skills/value-proposition) | 6-part JTBD template: Who, Why, What before, How, What after, Alternatives. | Section 6 of the PRD: why ADHD users would choose this over a regular budgeting app. |
| [`user-stories`](.claude/skills/user-stories) | Turns features into "As a…, I want…, so that…" stories with acceptance criteria. | Turns the PRD's key features into buildable work items. |
| [`prioritize-features`](.claude/skills/prioritize-features) | Ranks features by impact, effort, risk and strategic fit, and picks the top 5. | Decides what goes in version 1 and what waits. |
| [`pre-mortem`](.claude/skills/pre-mortem) | Imagines the launch failed and sorts risks into Tigers, Paper Tigers and Elephants, with action plans. | Stress-tests the PRD before it's final. |

## Suggested workflow

1. `market-sizing` → `competitor-analysis` → `user-personas`: understand the market and the users.
2. `customer-journey-map`: find where ADHD users struggle with today's tools.
3. `value-proposition` → `create-prd`: write the PRD.
4. `prioritize-features` → `user-stories`: scope version 1 and break it into stories.
5. `pre-mortem`: review the PRD for risks and update it.

## Safety review

Each skill went through the same four checks as Week 1: the installer's automated scan, a source check, a full manual read, and a conflict check against existing skills.

| Skill | Snyk rating | Notes |
|---|---|---|
| market-sizing | Medium | Instructions only. Tells Claude to search the web for market data and cite sources. |
| competitor-analysis | Medium | Instructions only. Tells Claude to research competitor websites, pricing and reviews online. |
| user-personas | Low | Instructions only. |
| customer-journey-map | Medium | Instructions only. May look up the product online if given a URL. |
| create-prd | Medium | Instructions only. Encourages web research to support PRD decisions, with citations. |
| value-proposition | Low | Instructions only. Links to a Google Slides template. |
| user-stories | Low | Instructions only. |
| prioritize-features | Low | Instructions only. |
| pre-mortem | Medium | Instructions only. May use web search for market conditions. |

**Why the Medium ratings were accepted:** every skill is a single text file. None contains scripts, downloads, or requests for passwords or API keys. The Medium ratings line up exactly with the skills that tell Claude to do web research, which these tasks need. The source repository is non-forked, actively maintained, and has about 27,000 stars.

**Conflict check:** no conflicts. `create-prd` and `value-proposition` share the same 6-part value proposition template by the same author, and none of these skills overlap with the Week 1 design and coding skills.

## Using these skills

Open this folder with Claude Code and ask for the work in plain language, for example "Create a PRD for a budgeting app for adults with ADHD." You can also call a skill by name, for example `/market-sizing`.

To install one of these skills in another project, run the installer from that project's folder:

```bash
npx skills add https://github.com/phuryn/pm-skills --skill create-prd
```
