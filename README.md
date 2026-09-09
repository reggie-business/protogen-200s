# FastForward Logistics — Executive Operations Dashboard

An internal operations dashboard built for the VP of Operations at FastForward Logistics, a fictional mid-size freight and supply chain company. Designed as a single-screen leadership tool: fast to read, easy to navigate under time pressure, and built to surface what needs attention without requiring analysis.

**Live site:** [protogen-200s.vercel.app](https://protogen-200s.vercel.app)

---

## What it does

The dashboard answers four questions at a glance:

- **How much are we shipping?** — Total shipment volume with trend vs. prior period
- **Are we on time?** — On-time delivery rate with trend and delta
- **How is each region doing?** — Regional breakdown of shipments and on-time performance
- **What needs attention right now?** — Open exceptions list with region, type, and severity

A **region filter** in the header updates all panels simultaneously — metric tiles, trend chart, regional view, and exceptions list — so the VP can isolate any region in one click during a meeting.

---

## Design intent

Built to feel like a real internal ops tool, not a generic dashboard template. Key decisions:

- **One-screen read:** no scrolling required on a standard laptop at meeting scale
- **Neutral base with a single accent:** white/light-gray surfaces, dark slate text, deep teal used deliberately for active states and key highlights only
- **Color as signal:** green/amber/red reserved for on-time health and exception severity — not decoration
- **Responsive:** works on laptop and large display

The mock dataset tells a story: one region underperforms (lower on-time rate, more exceptions), and company-wide on-time rate dips in the most recent periods. The filter reveals this — filtering to the underperforming region shows concentrated exceptions and a steeper recent decline.

---

## Tech stack

- **Vue 3** + TypeScript, scaffolded with Vite
- **Vuetify 3** for component library (app bar, cards, grid)
- **Vue Router** for routing
- **Chart.js / vue-chartjs** for the trend chart
- **Local JSON** (`src/data/metrics.json`) — no backend, no external API calls
- **Deployed on Vercel**

### Custom component

`MetricCard.vue` — a reusable component used for all four KPI tiles. Props: `label`, `value`, `trend` (`'up' | 'down' | 'flat'`), `delta`, and `unit`. Extracts the repeated pattern into a single source of truth.

---

## Repo structure

```
src/
  components/
    MetricCard.vue        # Reusable KPI tile component
  data/
    metrics.json          # Mock dataset with regional and time-series data
  views/
    DashboardView.vue     # Main dashboard layout and filter logic
  router/
    index.ts
  main.ts
BRIEF.md                  # Design spec written before build began
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

Built as part of the Slalom Protogen 200s learning series. The goal was to practice managing an AI-assisted build from spec to deployed product — staying in a reviewer and decision-maker role throughout, using GitHub Copilot for code generation while owning the planning, design direction, and iteration. See `BRIEF.md` for the full design spec written before any code was generated.