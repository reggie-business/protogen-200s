# FastForward Logistics — Executive Operations Dashboard

An internal operations dashboard built for the VP of Operations at FastForward Logistics, a fictional mid-size freight and supply chain company. Designed as a leadership meeting tool: fast to scan, regionally filterable, and built to surface what needs attention without requiring analysis.

**Live site:** [protogen-200s.vercel.app](https://protogen-200s.vercel.app)  
**Access code:** `fastforward`

---

## What it does

The dashboard answers four questions at a glance:

- **How much are we shipping?** — Total shipment volume with week-over-week trend and sparkline
- **Are we on time?** — On-time delivery rate with delta and directional indicator
- **How is each region doing?** — 12-week trend chart plus a regional breakdown table (shipments and on-time % by region)
- **What needs attention right now?** — Open exceptions table sorted by severity and recency, with shipment ID, region, type, and severity badge

A **region chip filter** in the header updates all panels simultaneously — KPI tiles, trend chart, regional table, and exceptions list — so the VP can isolate any region in one tap during a meeting.

---

## Design intent

Built to feel like a real internal ops tool, not a generic dashboard template. Key decisions:

- **Dark navy theme:** chosen for meeting-room legibility and strong visual hierarchy on data-heavy panels
- **Region chips over dropdown:** all five regions visible at once in the header — faster to scan and switch than a dropdown during a live meeting
- **2x2 KPI tile layout + Regional Performance side panel:** KPI tiles sit in a 2×2 grid alongside the Regional Performance table, so the most critical numbers and the regional breakdown are always in view together
- **Sparklines in every KPI tile:** directional context without requiring the user to scroll to the chart
- **Color as signal:** green/amber/red reserved for on-time health and exception severity — not decoration
- **Sidebar navigation:** Dashboard and Product Info routes; collapses to a hamburger drawer below 960px
- **Responsive:** usable on laptop and large meeting screen; cards stack 2×2 at tablet width

The mock dataset tells a story: Mountain region underperforms (lower on-time rate, more exceptions concentrated in recent periods), and company-wide on-time rate shows a visible downward trend over the last 12 weeks. The region filter reveals this — filtering to Mountain shows a steeper decline and a high exception count.

---

## Tech stack

- **Vue 3** + TypeScript, scaffolded with Vite
- **Vuetify 3** for component library (app bar, chip group, cards, grid, navigation drawer)
- **Vue Router** for Dashboard and Product Info routes
- **Chart.js / vue-chartjs** for the 12-week on-time delivery trend chart
- **Local JSON** (`src/data/metrics.json`) — no backend, no external API calls
- **Deployed on Vercel** with client-side password gate

### Custom component

`MetricCard.vue` — reusable component used for all four KPI tiles. Props: `label`, `value`, `trend` (`'up' | 'down' | 'flat'`), `delta`, `deltaIsGood`, and `unit`. Handles number formatting, sparkline, trend icon, and color state internally.

---

## Repo structure

```
src/
  components/
    MetricCard.vue        # Reusable KPI tile component
  data/
    metrics.json          # Mock dataset — regional and 12-week time-series data
  views/
    DashboardView.vue     # Main dashboard layout and region filter logic
    AboutView.vue         # Product Info page
  router/
    index.ts
  main.ts
BRIEF.md                  # Design spec written before build began
RUNBOOK.md                # Bootstrap commands used to initialize the project
```

---

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project context

Built as part of the Slalom Protogen 200s learning series. The goal was to practice managing an AI-assisted build from spec to deployed product — staying in a reviewer and decision-maker role throughout, using GitHub Copilot for code generation while owning the planning, design direction, and iteration decisions. Key redirects during the build included the chip filter over dropdown, the dark theme shift, the 2×2 card layout, and responsive drawer behavior. See `BRIEF.md` for the full design spec.