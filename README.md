# cyc1ke

A live progress tracker for a summer cycling challenge: biking 1,000 miles each between Memorial Day and Labor Day 2026.

Built with Svelte, Tailwind and Vercel serverless functions backed by the Strava API.

## What it does

Ride data is fetched live from Strava on each page load. No database, no caching — just a serverless function that refreshes the OAuth token, pulls activities since May 25 2026, and computes stats on the fly.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Svelte, Tailwind |
| Backend | Vercel serverless functions (`/api`) |
| Data | Strava API v3 |
| Deploy | Vercel |

## Local development

Ride data requires real Strava credentials. Without them the cards show "Could not load data", which is expected.

```bash
npm install
npm run dev
```

For full end-to-end testing with live data, use `vercel dev` (requires the [Vercel CLI](https://vercel.com/docs/cli)) with a `.env` file:

```
STRAVA_CLIENT_ID=
STRAVA_CLIENT_SECRET=
STRAVA_USER1_REFRESH_TOKEN=
STRAVA_USER2_REFRESH_TOKEN=
```

## Strava setup (one-time per athlete)

1. Create a Strava API application at [strava.com/settings/api](https://www.strava.com/settings/api)
2. Set `STRAVA_CLIENT_ID` and `STRAVA_CLIENT_SECRET` in Vercel environment variables
3. Each athlete visits `/setup.html`, clicks **Authorize with Strava**, and copies their refresh token from the callback page
4. Add both tokens to Vercel as `STRAVA_USER1_REFRESH_TOKEN` and `STRAVA_USER2_REFRESH_TOKEN`
5. Redeploy

## Project structure

```
src/
  App.svelte               # root: fetch orchestration, scroll observer, layout
  app.css                  # Tailwind + design tokens
  components/
    Hero.svelte            # section 1
    CardsSection.svelte    # section 2 shell
    UserCard.svelte        # per-rider stat card with tween animations
    ProgressTracker.svelte # horizontal (desktop) + vertical (mobile) rail
    RideTimeline.svelte    # dot-connected recent rides list
    RoutePreview.svelte    # polyline map preview for last ride
    PaceChart.svelte       # cumulative miles vs. ideal pace sparkline
    DotNav.svelte          # fixed left-side dot nav (mobile only)
api/
  strava.js                # GET ?user=1|2 → stats JSON
  auth-callback.js         # one-time OAuth code → refresh token
  setup.js                 # redirects to Strava OAuth using server-side client ID
public/
  setup.html               # one-time setup UI for each athlete
  photos/                  # alex.jpg, ellie.jpg (not committed)
```
