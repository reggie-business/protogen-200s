<template>
  <v-app-bar flat color="primary" height="64">
    <v-app-bar-title>
      <span class="app-title">FastForward Logistics</span>
      <span class="app-subtitle"> — Operations</span>
    </v-app-bar-title>
    <template #append>
      <v-select
        v-model="selectedRegion"
        :items="regions"
        item-title="label"
        item-value="value"
        variant="solo-filled"
        hide-details
        density="compact"
        class="region-filter"
        prepend-inner-icon="mdi-map-marker-outline"
        bg-color="primary-darken-1"
        base-color="white"
      />
    </template>
  </v-app-bar>

  <v-main class="dashboard-main">
    <v-container fluid class="pa-6">

      <!-- ── Metric Tiles Row ── -->
      <v-row class="mb-6">
        <v-col
          v-for="tile in metricTiles"
          :key="tile.label"
          cols="12"
          sm="6"
          lg="3"
        >
          <v-card flat class="metric-tile pa-5" height="130">
            <div class="metric-label">{{ tile.label }}</div>
            <div class="metric-value">{{ tile.value }}</div>
            <div class="metric-trend" :class="tile.trendClass">
              <v-icon size="16">{{ tile.trendIcon }}</v-icon>
              {{ tile.delta }}
              <span class="metric-period">vs prior period</span>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- ── Charts Row ── -->
      <v-row class="mb-6">

        <!-- On-Time Trend Chart -->
        <v-col cols="12" lg="8">
          <v-card flat class="pa-5 panel-card" height="340">
            <div class="panel-header">
              <span class="panel-title">On-Time Delivery Rate</span>
              <span class="panel-sub">Last 12 weeks</span>
            </div>
            <div class="chart-placeholder">
              <v-icon size="48" color="grey-lighten-1">mdi-chart-line</v-icon>
              <p class="placeholder-label">Chart goes here</p>
              <p class="placeholder-sub">vue-chartjs / Chart.js — wired in next increment</p>
            </div>
          </v-card>
        </v-col>

        <!-- Regional Performance -->
        <v-col cols="12" lg="4">
          <v-card flat class="pa-5 panel-card" height="340">
            <div class="panel-header">
              <span class="panel-title">Regional Performance</span>
              <span class="panel-sub">Shipments &amp; on-time %</span>
            </div>
            <v-table density="compact" class="mt-3 region-table">
              <thead>
                <tr>
                  <th class="text-left">Region</th>
                  <th class="text-right">Shipments</th>
                  <th class="text-right">On-Time</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in regionalRows" :key="row.region">
                  <td>{{ row.region }}</td>
                  <td class="text-right">{{ row.shipments }}</td>
                  <td class="text-right" :class="row.onTimeClass">{{ row.onTime }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-col>

      </v-row>

      <!-- ── Open Exceptions List ── -->
      <v-row>
        <v-col cols="12">
          <v-card flat class="pa-5 panel-card">
            <div class="panel-header mb-3">
              <span class="panel-title">Open Exceptions</span>
              <span class="panel-sub">Requires attention</span>
            </div>
            <v-table density="comfortable" class="exceptions-table">
              <thead>
                <tr>
                  <th class="text-left">Shipment ID</th>
                  <th class="text-left">Region</th>
                  <th class="text-left">Type</th>
                  <th class="text-left">Severity</th>
                  <th class="text-left">Since</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ex in exceptionRows" :key="ex.id">
                  <td class="font-weight-medium">{{ ex.id }}</td>
                  <td>{{ ex.region }}</td>
                  <td>{{ ex.type }}</td>
                  <td>
                    <v-chip
                      size="small"
                      :color="ex.severityColor"
                      variant="tonal"
                    >{{ ex.severity }}</v-chip>
                  </td>
                  <td class="text-medium-emphasis">{{ ex.since }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-col>
      </v-row>

    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const regions = [
  { label: 'All Regions', value: 'all' },
  { label: 'Midwest', value: 'midwest' },
  { label: 'Northeast', value: 'northeast' },
  { label: 'South', value: 'south' },
  { label: 'West', value: 'west' },
  { label: 'Mountain', value: 'mountain' },
]

const selectedRegion = ref('all')

// Placeholder metric tiles — real data wired in next increment
const metricTiles = [
  {
    label: 'Total Shipments',
    value: '24,381',
    delta: '+3.2%',
    trendClass: 'trend-up',
    trendIcon: 'mdi-trending-up',
  },
  {
    label: 'On-Time Delivery',
    value: '87.4%',
    delta: '-1.8%',
    trendClass: 'trend-down',
    trendIcon: 'mdi-trending-down',
  },
  {
    label: 'Open Exceptions',
    value: '142',
    delta: '+12',
    trendClass: 'trend-warn',
    trendIcon: 'mdi-trending-up',
  },
  {
    label: 'Avg Transit Time',
    value: '3.6 days',
    delta: '+0.2d',
    trendClass: 'trend-warn',
    trendIcon: 'mdi-trending-up',
  },
]

// Placeholder regional rows — real data in next increment
const regionalRows = [
  { region: 'Midwest', shipments: '6,104', onTime: '91.2%', onTimeClass: 'status-good' },
  { region: 'Northeast', shipments: '5,830', onTime: '89.7%', onTimeClass: 'status-good' },
  { region: 'West', shipments: '5,211', onTime: '88.1%', onTimeClass: 'status-ok' },
  { region: 'Mountain', shipments: '3,924', onTime: '85.3%', onTimeClass: 'status-ok' },
  { region: 'South', shipments: '3,312', onTime: '73.8%', onTimeClass: 'status-bad' },
]

// Placeholder exception rows
const exceptionRows = [
  { id: 'FF-209341', region: 'South', type: 'Missed Pickup', severity: 'High', severityColor: 'error', since: 'Jun 24' },
  { id: 'FF-209187', region: 'South', type: 'Delayed Transit', severity: 'High', severityColor: 'error', since: 'Jun 24' },
  { id: 'FF-209502', region: 'Mountain', type: 'Delayed Transit', severity: 'Medium', severityColor: 'warning', since: 'Jun 25' },
  { id: 'FF-209618', region: 'South', type: 'Damaged Goods', severity: 'High', severityColor: 'error', since: 'Jun 25' },
  { id: 'FF-209744', region: 'West', type: 'Address Correction', severity: 'Low', severityColor: 'success', since: 'Jun 26' },
  { id: 'FF-209801', region: 'South', type: 'Missed Pickup', severity: 'Medium', severityColor: 'warning', since: 'Jun 26' },
]
</script>

<style scoped>
.dashboard-main {
  background-color: #f4f5f7;
}

/* App bar */
.app-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.01em;
}
.app-subtitle {
  font-size: 1.05rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.75);
}
.region-filter {
  min-width: 200px;
  max-width: 220px;
  margin-right: 12px;
  color: white;
}
:deep(.region-filter .v-field__input),
:deep(.region-filter .v-select__selection-text),
:deep(.region-filter .v-icon) {
  color: white !important;
}

/* Metric tiles */
.metric-tile {
  border-radius: 8px;
  border: 1px solid #e0e3e8;
}
.metric-label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6b7480;
  margin-bottom: 8px;
}
.metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1a2332;
  line-height: 1.1;
  margin-bottom: 6px;
}
.metric-trend {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 0.8rem;
  font-weight: 600;
}
.metric-period {
  font-weight: 400;
  color: #6b7480;
  margin-left: 4px;
}
.trend-up   { color: #2e7d32; }
.trend-down { color: #c62828; }
.trend-warn { color: #e65100; }

/* Panels */
.panel-card {
  border-radius: 8px;
  border: 1px solid #e0e3e8;
}
.panel-header {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 4px;
}
.panel-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a2332;
}
.panel-sub {
  font-size: 0.78rem;
  color: #6b7480;
}

/* Chart placeholder */
.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 240px;
  gap: 8px;
  border-radius: 6px;
  background-color: #f9fafb;
  border: 1px dashed #d0d4da;
}
.placeholder-label {
  font-size: 0.9rem;
  color: #9aa0aa;
  font-weight: 500;
}
.placeholder-sub {
  font-size: 0.75rem;
  color: #b0b8c1;
}

/* Region table */
.region-table thead th {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7480;
  font-weight: 600;
}
.status-good { color: #2e7d32; font-weight: 600; }
.status-ok   { color: #1a2332; }
.status-bad  { color: #c62828; font-weight: 600; }

/* Exceptions table */
.exceptions-table thead th {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7480;
  font-weight: 600;
}
</style>
