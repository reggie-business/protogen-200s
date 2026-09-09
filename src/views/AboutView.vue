<template>
  <v-container fluid class="about-content">
    <div class="about-shell">
      <header class="product-header">
        <div>
          <span class="eyebrow">Product information</span>
          <h1>FastForward Logistics <span>· Operations Dashboard</span></h1>
          <p class="header-summary">A shared operating view for freight network performance.</p>
        </div>
        <div class="product-meta">
          <span class="version-badge">v2.1.0</span>
          <span>Last updated Sep 9, 2026</span>
        </div>
      </header>

      <section class="about-grid" aria-label="About the dashboard">
        <article class="about-panel about-panel-wide">
          <div class="section-kicker">About this tool</div>
          <h2>One clear view of the freight network</h2>
          <p>
            FastForward Logistics brings shipment volume, delivery performance, transit time, and open exceptions
            into one operating view. It is designed for VPs of Operations, freight operations teams, and leadership
            meetings that need a concise read on network health.
          </p>
        </article>

        <article class="about-panel">
          <div class="section-kicker">Data scope</div>
          <dl class="scope-list">
            <div>
              <dt>Regions covered</dt>
              <dd>Midwest, Northeast, South, West, Mountain</dd>
            </div>
            <div>
              <dt>Refresh cadence</dt>
              <dd>Weekly</dd>
            </div>
            <div>
              <dt>Metrics tracked</dt>
              <dd>Shipment volume, on-time delivery %, open exceptions, avg transit time</dd>
            </div>
          </dl>
        </article>
      </section>

      <section class="about-panel usage-panel">
        <div class="section-kicker">How to use</div>
        <div class="usage-grid">
          <div class="usage-item">
            <span class="usage-index">01</span>
            <div>
              <h3>Filter by region</h3>
              <p>Use the region pills in the header to focus every KPI, chart, and table on one operating area.</p>
            </div>
          </div>
          <div class="usage-item">
            <span class="usage-index">02</span>
            <div>
              <h3>Read the trend</h3>
              <p>Follow the delivery chart across the latest 12 weeks and compare performance with the 90% target.</p>
            </div>
          </div>
          <div class="usage-item">
            <span class="usage-index">03</span>
            <div>
              <h3>Prioritize exceptions</h3>
              <p>Use the severity markers and recent periods in the exceptions table to focus the next action.</p>
            </div>
          </div>
          <div class="usage-item">
            <span class="usage-index">04</span>
            <div>
              <h3>Scan the KPIs</h3>
              <p>Compare the current value, week-over-week delta, and sparkline to spot movement at a glance.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="support-panel">
        <div>
          <div class="section-kicker">Support &amp; feedback</div>
          <h2>Help improve the operating view</h2>
          <p>Questions, corrections, or ideas for the next release? Contact the internal dashboard team.</p>
          <a class="support-email" href="mailto:ops-dashboard@fastforward.com">ops-dashboard@fastforward.com</a>
        </div>
        <v-btn variant="outlined" color="primary" class="feedback-button" type="button">
          <v-icon start size="17">mdi-message-text-outline</v-icon>
          Submit feedback
        </v-btn>
      </section>
    </div>
  </v-container>
</template>

<style scoped>
.about-content {
  min-height: 100%;
  padding: 66px 32px 72px;
  background: var(--ff-page-bg);
}

.about-shell {
  max-width: 1100px;
  margin: 0 auto;
}

.product-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 28px;
  margin-bottom: 28px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--ff-border);
}

.eyebrow,
.section-kicker {
  color: var(--ff-secondary);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h1 {
  margin-top: 8px;
  color: var(--ff-text);
  font-size: clamp(1.65rem, 3vw, 2.35rem);
  font-weight: 700;
  line-height: 1.15;
}

h1 span {
  color: var(--ff-secondary);
  font-weight: 500;
}

.header-summary {
  margin-top: 10px;
  color: var(--ff-secondary);
  font-size: 0.9rem;
}

.product-meta {
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  gap: 8px;
  color: var(--ff-secondary);
  font-size: 0.75rem;
  white-space: nowrap;
}

.version-badge {
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.12);
  color: #93c5fd;
  font-weight: 700;
  padding: 5px 10px;
}

.about-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
  gap: 20px;
  margin-bottom: 20px;
}

.about-panel,
.support-panel {
  border: 1px solid var(--ff-border);
  border-radius: 14px;
  background: var(--ff-surface);
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.14);
  padding: 20px;
}

.about-panel-wide {
  min-height: 220px;
}

h2 {
  margin-top: 10px;
  color: var(--ff-text);
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.25;
}

.about-panel p,
.support-panel p {
  max-width: 680px;
  margin-top: 14px;
  color: var(--ff-secondary);
  font-size: 0.9rem;
  line-height: 1.65;
}

.scope-list {
  display: grid;
  gap: 16px;
  margin-top: 18px;
}

.scope-list div {
  display: grid;
  gap: 4px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--ff-border);
}

.scope-list div:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

dt {
  color: var(--ff-secondary);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

dd {
  color: var(--ff-text);
  font-size: 0.82rem;
  line-height: 1.45;
}

.usage-panel {
  margin-bottom: 20px;
}

.usage-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px 32px;
  margin-top: 20px;
}

.usage-item {
  display: flex;
  gap: 14px;
}

.usage-index {
  color: var(--ff-accent);
  font-family: var(--ff-mono);
  font-size: 0.75rem;
  font-weight: 700;
  padding-top: 2px;
}

h3 {
  color: var(--ff-text);
  font-size: 0.9rem;
  font-weight: 700;
}

.usage-item p {
  margin-top: 5px;
  color: var(--ff-secondary);
  font-size: 0.8rem;
  line-height: 1.55;
}

.support-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  border-color: rgba(59, 130, 246, 0.2);
}

.support-panel h2 {
  margin-top: 8px;
}

.support-email {
  display: inline-block;
  margin-top: 12px;
  color: #93c5fd;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
}

.support-email:hover {
  color: #bfdbfe;
  text-decoration: underline;
}

.feedback-button {
  flex: 0 0 auto;
  border-radius: 999px;
  padding: 12px 20px !important;
}

@media (max-width: 800px) {
  .product-header,
  .support-panel {
    align-items: flex-start;
    flex-direction: column;
  }

  .product-meta {
    align-items: flex-start;
  }

  .about-grid,
  .usage-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 599px) {
  .about-content {
    padding: 24px 16px 48px;
  }

  .about-panel,
  .support-panel {
    padding: 20px;
  }

  h1 {
    font-size: 1.55rem;
  }
}
</style>
