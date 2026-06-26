# BRIEF.md — FastForward Logistics: Executive Operations Dashboard

## Summary
An internal dashboard for the VP of Operations at FastForward Logistics, a mid-size
freight & supply-chain company. She pulls it up in leadership meetings to see, at a
glance, how the business is running. It must answer four questions instantly:
how much are we shipping, are we on time, how is each region doing, and what needs
attention right now. Audience: one senior operations leader, glancing under time
pressure, not a data analyst. Clarity beats cleverness everywhere.

## Users & context
- Primary user: VP of Operations. Reviews in meetings, on a laptop/large screen.
- Needs: triage ("anything on fire?") plus a quick performance read for discussion.
- Not for: deep analysis, drill-downs, data export. Keep scope to a one-screen read.

## Layout (top to bottom)
1. App bar / header: "FastForward Logistics — Operations" + a region filter control.
2. Metric tile row (4 tiles, the top-line numbers): Total Shipments, On-Time
   Delivery %, Open Exceptions, Avg Transit Time. Each shows value + trend vs prior
   period (up/down + delta).
3. Trend chart: On-Time Delivery Rate over the last ~12 periods (weeks or months).
4. Regional performance: breakdown by region (bar or table) — shipments + on-time %
   per region, so weak regions are obvious.
5. Open exceptions list: the rows that need attention (e.g. delayed shipment, missed
   pickup), with region, type, and severity.

## Interactions (required)
- Region filter (the graded interactive element): selecting a region (or "All")
  updates the metric tiles, trend chart, regional view, and exceptions list to that
  region. "All" shows company-wide. (Optional stretch: a date-range toggle.)

## Data (mock, realistic, with a story)
- A JSON file at src/data/metrics.json. Numbers should be realistic for a mid-size
  freight company AND tell a subtle story so the dashboard feels real and the filter
  reveals something:
  - ~5 regions (e.g. Midwest, Northeast, South, West, Mountain).
  - One region clearly underperforming (lower on-time %, more exceptions) — so
    filtering to it tells a story.
  - On-time rate dips in the most recent 1-2 periods company-wide (a visible, mild
    downward wobble), not a flat line.
  - Exceptions concentrated in the weak region + recent periods.
  - Plausible magnitudes: thousands of shipments/period, on-time % in the 80s-90s,
    transit times in days.

## Tech
- Vue 3 + Vuetify 3, Vite, TypeScript, Vue Router. No Pinia/testing/jsx/eslint/prettier.
- Chart: a lightweight Vue-friendly chart lib (e.g. vue-chartjs/Chart.js or
  ApexCharts) -- Copilot's choice, kept simple.
- Deployed on Vercel. Data is local JSON (no backend).

## Components
- Custom reusable component: MetricCard, props: label, value, trend ('up'|'down'|
  'flat'), delta (e.g. "+2.1%"), and unit/format. Used for all four metric tiles.

## Style (restraint + one confident accent)
- Clean, legible, "real internal ops tool" -- NOT a generic template, NOT the warm
  personal-site palette.
- Neutral base (white/light-gray surfaces, dark slate text) with ONE strong brand
  accent used deliberately (links, active filter, key highlights). Pick a confident,
  logistics-appropriate accent (a deep teal or signal-blue, not corporate-default).
- Strong information hierarchy: big readable numbers on tiles, clear section headers,
  generous spacing, restrained color. Status uses color meaningfully (green/amber/red
  for on-time health and exception severity) -- color as signal, not decoration.
- Responsive: usable on a laptop and a large meeting screen.

## Definition of Done
- Live on Vercel; region filter updates all panels; data tells its small story;
  MetricCard is a real reusable component; reads cleanly as an exec ops tool.

## Nice to haves (only if time)
- Date-range toggle; sortable exceptions; subtle loading states.
