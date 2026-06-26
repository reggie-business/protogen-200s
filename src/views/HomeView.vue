<template>
  <v-container fluid class="dashboard-content">
    <div class="dashboard-shell">
      <div class="context-line">
        <div class="context-item">
          <span class="context-label">Scope</span>
          <strong>{{ selectedRegionLabel }}</strong>
        </div>
        <div class="context-item">
          <span class="context-label">Last Updated</span>
          <strong>{{ latestPeriodLabel }}</strong>
        </div>
      </div>

      <v-row class="metric-row" style="width: 100%">
        <v-col v-for="tile in metricTiles" :key="tile.label" cols="12" sm="6" lg="3" class="metric-col" style="min-width: 0">
          <MetricCard
            :label="tile.label"
            :value="tile.value"
            :unit="tile.unit"
            :trend="tile.trend"
            :delta="tile.delta"
            :delta-is-good="tile.deltaIsGood"
          />
        </v-col>
      </v-row>

      <v-row class="chart-row" style="width: 100%">
        <v-col cols="12" lg="8" class="chart-col" style="min-width: 0">
          <v-card flat class="panel-card" height="360">
            <div class="panel-content pa-6">
              <div class="panel-header">
                <span class="panel-title">On-Time Delivery Rate</span>
                <span class="panel-sub">12-week trend, filtered by scope</span>
              </div>
              <div class="trend-chart-wrap">
                <Line :data="trendChartData" :options="trendChartOptions" />
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" lg="4" class="regional-col" style="min-width: 0">
          <v-card flat class="panel-card" height="360">
            <div class="panel-content pa-6">
              <div class="panel-header">
                <span class="panel-title">Regional Performance</span>
                <span class="panel-sub">Weekly shipments and on-time %</span>
              </div>
              <v-table density="compact" class="region-table">
                <thead>
                  <tr>
                    <th class="text-left">Region</th>
                    <th class="text-right num-col">Shipments</th>
                    <th class="text-right num-col">On-Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in regionalRows" :key="row.region" class="data-row">
                    <td>{{ row.region }}</td>
                    <td class="text-right num-col">{{ row.shipments }}</td>
                    <td class="text-right num-col" :class="row.onTimeClass">{{ row.onTime }}</td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="exceptions-row" style="width: 100%">
        <v-col cols="12" class="exceptions-col" style="min-width: 0">
          <v-card flat class="panel-card">
            <div class="panel-content pa-6">
              <div class="panel-header">
                <span class="panel-title">Open Exceptions</span>
                <span class="panel-sub">Recent events sorted by severity and recency</span>
              </div>
              <v-table density="compact" class="exceptions-table">
                <thead>
                  <tr>
                    <th class="text-left col-shipment-id">Shipment ID</th>
                    <th class="text-left col-region">Region</th>
                    <th class="text-left col-type">Type</th>
                    <th class="text-left col-severity">Severity</th>
                    <th class="text-left col-period">Period</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="ex in exceptionRows" :key="ex.id" class="data-row">
                    <td class="font-weight-medium col-shipment-id id-code">{{ ex.id }}</td>
                    <td class="col-region">{{ ex.region }}</td>
                    <td class="col-type">{{ ex.type }}</td>
                    <td class="col-severity">
                      <span class="severity-badge" :class="`severity-${ex.severity.toLowerCase()}`">{{ ex.severity }}</span>
                    </td>
                    <td class="text-medium-emphasis col-period period-code">{{ ex.period }}</td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import {
  CategoryScale,
  Chart as ChartJS,
  type ChartOptions,
  Filler,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import MetricCard from '@/components/MetricCard.vue'
import rawMetrics from '@/data/metrics.json'

type TrendDirection = 'up' | 'down' | 'flat'
type Severity = 'low' | 'medium' | 'high'

interface RegionMetrics {
  shipments: number
  onTimePct: number
  exceptions: number
  avgTransitDays: number
}

interface WeeklyRecord {
  period: string
  byRegion: Record<string, RegionMetrics>
}

interface ExceptionRecord {
  id: string
  weekIndex: number
  period: string
  region: string
  type: string
  severity: Severity
}

interface MetricsData {
  regions: string[]
  periods: string[]
  weekly: WeeklyRecord[]
  exceptions: ExceptionRecord[]
}

interface AggregatedMetrics {
  period: string
  shipments: number
  onTimePct: number
  exceptions: number
  avgTransitDays: number
}

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler)

const metrics = rawMetrics as MetricsData
const selectedRegion = inject<Ref<string>>('selectedRegion', ref('all'))
const numberFormatter = new Intl.NumberFormat('en-US')
const emptyRegionMetrics: RegionMetrics = {
  shipments: 0,
  onTimePct: 0,
  exceptions: 0,
  avgTransitDays: 0,
}

const selectedRegionExists = computed(
  () => selectedRegion.value === 'all' || metrics.regions.includes(selectedRegion.value),
)

const activeRegion = computed(() => (selectedRegionExists.value ? selectedRegion.value : 'all'))

const selectedRegionLabel = computed(() => {
  if (activeRegion.value === 'all') {
    return 'All Regions'
  }
  return activeRegion.value
})

const latestPeriodLabel = computed(() => metrics.periods[metrics.periods.length - 1] ?? '-')

function aggregateWeek(week: WeeklyRecord, region: string): AggregatedMetrics {
  if (region !== 'all') {
    const regionMetrics = week.byRegion[region] ?? emptyRegionMetrics
    return {
      period: week.period,
      shipments: regionMetrics.shipments,
      onTimePct: regionMetrics.onTimePct,
      exceptions: regionMetrics.exceptions,
      avgTransitDays: regionMetrics.avgTransitDays,
    }
  }

  let totalShipments = 0
  let weightedOnTime = 0
  let weightedTransit = 0
  let totalExceptions = 0

  for (const currentRegion of metrics.regions) {
    const regionMetrics = week.byRegion[currentRegion] ?? emptyRegionMetrics
    totalShipments += regionMetrics.shipments
    weightedOnTime += regionMetrics.shipments * regionMetrics.onTimePct
    weightedTransit += regionMetrics.shipments * regionMetrics.avgTransitDays
    totalExceptions += regionMetrics.exceptions
  }

  return {
    period: week.period,
    shipments: totalShipments,
    onTimePct: totalShipments > 0 ? weightedOnTime / totalShipments : 0,
    exceptions: totalExceptions,
    avgTransitDays: totalShipments > 0 ? weightedTransit / totalShipments : 0,
  }
}

const weeklySeries = computed(() => metrics.weekly.map((week) => aggregateWeek(week, activeRegion.value)))

const latestMetrics = computed(() => weeklySeries.value[weeklySeries.value.length - 1])
const previousMetrics = computed(() => weeklySeries.value[weeklySeries.value.length - 2])

function trendDirection(delta: number): TrendDirection {
  if (Math.abs(delta) < 0.01) {
    return 'flat'
  }
  return delta > 0 ? 'up' : 'down'
}

function formatSigned(value: number, digits = 1, suffix = ''): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(digits)}${suffix}`
}

const metricTiles = computed(() => {
  const current = latestMetrics.value
  const prior = previousMetrics.value

  if (!current || !prior) {
    return []
  }

  const shipmentsDelta = current.shipments - prior.shipments
  const onTimeDelta = current.onTimePct - prior.onTimePct
  const exceptionsDelta = current.exceptions - prior.exceptions
  const transitDelta = current.avgTransitDays - prior.avgTransitDays

  return [
    {
      label: 'Total Shipments',
      value: numberFormatter.format(current.shipments),
      trend: trendDirection(shipmentsDelta),
      delta: formatSigned(shipmentsDelta, 0),
      deltaIsGood: shipmentsDelta >= 0,
    },
    {
      label: 'On-Time Delivery %',
      value: `${current.onTimePct.toFixed(1)}%`,
      trend: trendDirection(onTimeDelta),
      delta: `${formatSigned(onTimeDelta, 1)} pts`,
      deltaIsGood: onTimeDelta >= 0,
    },
    {
      label: 'Open Exceptions',
      value: numberFormatter.format(current.exceptions),
      trend: trendDirection(exceptionsDelta),
      delta: formatSigned(exceptionsDelta, 0),
      deltaIsGood: exceptionsDelta <= 0,
    },
    {
      label: 'Avg Transit Time',
      value: current.avgTransitDays.toFixed(1),
      unit: 'days',
      trend: trendDirection(transitDelta),
      delta: `${formatSigned(transitDelta, 1)}d`,
      deltaIsGood: transitDelta <= 0,
    },
  ]
})

const trendChartData = computed(() => ({
  labels: metrics.periods,
  datasets: [
    {
      label: 'On-Time %',
      data: weeklySeries.value.map((entry) => Number(entry.onTimePct.toFixed(2))),
      borderColor: '#1B2733',
      backgroundColor: 'rgba(27, 39, 51, 0.08)',
      fill: true,
      tension: 0.3,
      pointRadius: 2,
      pointHoverRadius: 4,
      pointBackgroundColor: '#1B2733',
    },
  ],
}))

const trendChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const yValue = typeof context.parsed.y === 'number' ? context.parsed.y : 0
          return `${yValue.toFixed(1)}% on-time`
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#5f6b77',
        font: {
          size: 12,
          family: 'Inter',
        },
      },
    },
    y: {
      min: 78,
      max: 96,
      ticks: {
        color: '#5f6b77',
        font: {
          size: 12,
          family: 'Inter',
        },
        callback: (value) => `${value}%`,
      },
      grid: {
        color: '#E2E6EB',
      },
    },
  },
}

const regionalRows = computed(() => {
  const latestWeek = metrics.weekly[metrics.weekly.length - 1]
  if (!latestWeek) {
    return []
  }

  const regionsToShow = activeRegion.value === 'all' ? metrics.regions : [activeRegion.value]

  return regionsToShow.map((region) => {
    const regionMetrics = latestWeek.byRegion[region] ?? emptyRegionMetrics
    const onTime = regionMetrics.onTimePct

    let onTimeClass = 'status-bad'
    if (onTime >= 92) {
      onTimeClass = 'status-good'
    } else if (onTime >= 88) {
      onTimeClass = 'status-ok'
    }

    return {
      region,
      shipments: numberFormatter.format(regionMetrics.shipments),
      onTime: `${onTime.toFixed(1)}%`,
      onTimeClass,
    }
  })
})

const severityRank: Record<Severity, number> = {
  high: 3,
  medium: 2,
  low: 1,
}

const exceptionRows = computed(() =>
  metrics.exceptions
    .filter((item) => activeRegion.value === 'all' || item.region === activeRegion.value)
    .sort((a, b) => {
      if (b.weekIndex !== a.weekIndex) {
        return b.weekIndex - a.weekIndex
      }
      return severityRank[b.severity] - severityRank[a.severity]
    })
    .slice(0, 14)
    .map((item) => ({
      ...item,
      severity: item.severity.charAt(0).toUpperCase() + item.severity.slice(1),
    })),
)
</script>

<style scoped>
.dashboard-content {
  padding: 40px 24px 72px;
  background: var(--ff-page-bg);
}

.dashboard-shell {
  max-width: 1360px;
  margin: 0 auto;
}

.context-line {
  display: flex;
  gap: 28px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.context-item {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 0.875rem;
  color: #495867;
}

.context-label {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  color: #607080;
}

.metric-row {
  row-gap: 16px;
  margin-bottom: 52px;
}

.metric-col {
  display: flex;
}

.chart-row {
  gap: 32px;
  margin-bottom: 56px;
}

.chart-col,
.regional-col {
  display: flex;
  width: 100%;
}

.exceptions-row {
  gap: 32px;
}

.exceptions-col {
  display: flex;
  width: 100%;
}

.panel-card {
  border-radius: 6px;
  border: 1px solid var(--ff-border);
  box-shadow: 0 1px 3px rgba(27, 39, 51, 0.04);
  display: flex;
  flex-direction: column;
  width: 100%;
  background: var(--ff-surface);
}

.panel-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 24px !important;
}

.panel-header {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
  padding-left: 2px;
}

.panel-title {
  font-size: 1.375rem;
  font-weight: 700;
  line-height: 1.25;
  color: var(--ff-text);
}

.panel-sub {
  font-size: 0.875rem;
  color: #607080;
  line-height: 1.45;
}

.trend-chart-wrap {
  height: 250px;
}

.region-table,
.exceptions-table {
  margin-top: 4px;
}

.region-table thead th,
.exceptions-table thead th {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #5f6b77;
  font-weight: 700;
  border-bottom: 1px solid var(--ff-border);
  padding: 0 12px;
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--ff-surface);
  height: 34px;
}

.region-table thead th:first-child,
.exceptions-table thead th:first-child {
  padding-left: 16px;
}

.region-table thead th:last-child,
.exceptions-table thead th:last-child {
  padding-right: 16px;
}

:deep(.region-table tbody td),
:deep(.exceptions-table tbody td) {
  padding: 0 12px;
  font-size: 0.875rem;
  color: var(--ff-text);
  height: 34px;
}

:deep(.region-table tbody td:first-child),
:deep(.exceptions-table tbody td:first-child) {
  padding-left: 16px;
}

:deep(.region-table tbody td:last-child),
:deep(.exceptions-table tbody td:last-child) {
  padding-right: 16px;
}

.num-col {
  font-variant-numeric: tabular-nums;
}

:deep(.region-table tbody tr:nth-child(even)),
:deep(.exceptions-table tbody tr:nth-child(even)) {
  background: #fafbfd;
}

:deep(.region-table tbody tr:hover),
:deep(.exceptions-table tbody tr:hover) {
  background: rgba(27, 39, 51, 0.04);
}

.status-good {
  color: var(--ff-success);
  font-weight: 700;
}

.status-ok {
  color: #7a6a2a;
  font-weight: 600;
}

.status-bad {
  color: var(--ff-error);
  font-weight: 700;
}

.id-code,
.period-code {
  font-family: var(--ff-mono);
  letter-spacing: 0.01em;
}

.severity-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid transparent;
  line-height: 1.2;
}

.severity-high {
  color: var(--ff-error);
  background: rgba(211, 47, 47, 0.09);
  border-color: rgba(211, 47, 47, 0.22);
}

.severity-medium {
  color: #8f6200;
  background: rgba(249, 168, 37, 0.14);
  border-color: rgba(249, 168, 37, 0.35);
}

.severity-low {
  color: #607080;
  background: rgba(96, 112, 128, 0.1);
  border-color: rgba(96, 112, 128, 0.28);
}

/* Exceptions table column widths */
:deep(.col-shipment-id) {
  width: 18%;
  min-width: 120px;
  padding-left: 16px !important;
  padding-right: 12px !important;
}

:deep(.col-region) {
  width: 16%;
  min-width: 100px;
  padding-left: 12px !important;
  padding-right: 12px !important;
}

:deep(.col-type) {
  width: 28%;
  min-width: 140px;
  padding-left: 12px !important;
  padding-right: 12px !important;
}

:deep(.col-severity) {
  width: 18%;
  min-width: 100px;
  padding-left: 12px !important;
  padding-right: 12px !important;
}

:deep(.col-period) {
  width: 20%;
  min-width: 110px;
  padding-left: 12px !important;
  padding-right: 16px !important;
}

:deep(.exceptions-table tbody td) {
  vertical-align: middle;
}
</style>
