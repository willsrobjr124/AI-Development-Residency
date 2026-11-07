# ADR 0002: Vercel for the public web app

- **Status:** Accepted
- **Date:** November 7, 2026

## Context

The app must be live at a public address that visitors anywhere can open. App store review and fees don't fit the timeline.

## Decision

Publish Expo's web export on Vercel at a free `vercel.app` address, deploying from GitHub. Settings live in `ADHDbudget-App/vercel.json`. An Android install link is a second, separate way to share the app.

## Consequences

- Anyone can open the app with no install.
- A push to the production branch publishes the site.
- Phone-only features behave differently on the web. The 5-minute lock is a tap on Unlock, and the app-switcher cover doesn't apply.
- The site is a single page, so every address is sent to `index.html`.

## Alternatives considered

- **EAS Hosting:** works well with Expo, but the requirements name Vercel.
- **Google Play and the App Store:** fees and review time don't fit this week.
