<template>
  <v-container fluid class="dashboard-content">
    <div class="context-line mb-5">
      <div class="context-item">
        <span class="context-label">Scope</span>
        <strong>{{ selectedRegionLabel }}</strong>
      </div>
      <div class="context-item">
        <span class="context-label">Last Updated</span>
        <strong>{{ latestPeriodLabel }}</strong>
      </div>
    </div>

    <v-row class="mb-6 metric-row">
      <v-col v-for="tile in metricTiles" :key="tile.label" cols="12" sm="6" lg="3" class="metric-col">
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

    <v-row class="mb-6 chart-row">
      <v-col cols="12" lg="8" class="chart-col">
        <v-card flat class="panel-card" height="348">
          <div class="panel-content pa-6">
            <div class="panel-header">
              <span class="panel-title">On-Time Delivery Rate</span>
              <span class="panel-sub">12-week trend, filtered by scope</span>
            </div>
            <div class="trend-chart-wrap mt-4">
              <Line :data="trendChartData" :options="trendChartOptions" />
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4" class="regional-col">
        <v-card flat class="panel-card" height="348">
          <div class="panel-content pa-6">
            <div class="panel-header">
              <span class="panel-title">Regional Performance</span>
              <span class="panel-sub">Weekly shipments and on-time %</span>
            </div>
            <v-table density="compact" class="mt-4 region-table">
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

    <v-row class="exceptions-row">
      <v-col cols="12" class="exceptions-col">
        <v-card flat class="panel-card">
          <div class="panel-content pa-6">
            <div class="panel-header mb-4">
              <span class="panel-title">Open Exceptions</span>
              <span class="panel-sub">Recent events sorted by severity and recency</span>
            </div>
            <v-table density="comfortable" class="exceptions-table">
              <thead>
                <tr>
                  <th class="text-left">Shipment ID</th>
                  <th class="text-left">Region</th>
                  <th class="text-left">Type</th>
                  <th class="text-left">Severity</th>
                  <th class="text-left">Period</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ex in exceptionRows" :key="ex.id" class="data-row">
                  <td class="font-weight-medium">{{ ex.id }}</td>
                  <td>{{ ex.region }}</td>
                  <td>{{ ex.type }}</td>
                  <td>
                    <v-chip size="small" :color="ex.severityColor" variant="tonal">{{ ex.severity }}</v-chip>
                  </td>
                  <td class="text-medium-emphasis">{{ ex.period }}</td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
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
const selectedRegion = ref<string>('all')
const numberFormatter = new Intl.NumberFormat('en-US')
const emptyRegionMetrics: RegionMetrics = {
  shipments: 0,
  onTimePct: 0,
  exceptions: 0,
  avgTransitDays: 0,
}

const regionOptions = computed(() => [
  { label: 'All Regions', value: 'all' },
  ...metrics.regions.map((region) => ({ label: region, value: region })),
])

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
      borderColor: '#2F6F73',
      backgroundColor: 'rgba(47, 111, 115, 0.14)',
      fill: true,
      tension: 0.34,
      pointRadius: 2.5,
      pointHoverRadius: 5,
      pointBackgroundColor: '#2F6F73',
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
        color: '#6d7780',
      },
    },
    y: {
      min: 78,
      max: 96,
      ticks: {
        color: '#6d7780',
        callback: (value) => `${value}%`,
      },
      grid: {
        color: '#e3e8eb',
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

const severityColor: Record<Severity, string> = {
  high: 'error',
  medium: 'warning',
  low: 'low',
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
      severityColor: severityColor[item.severity],
    })),
)
</script>

<style scoped>
.dashboard-content {
  padding: 24px;
  background: #f6f7f5;
}

.context-line {
  display: flex;
  gap: 24px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.context-item {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 0.82rem;
  color: #4f5d68;
}

.context-label {
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.68rem;
  color: #78848f;
}

.metric-row {
  gap: 24px;
}

.metric-col {
  display: flex;
}

.chart-row {
  gap: 24px;
}

.chart-col,
.regional-col {
  display: flex;
}

.exceptions-row {
  gap: 24px;
}

.exceptions-col {
  display: flex;
}

.panel-card {
  border-radius: 10px;
  border: 1px solid #dce2e5;
  box-shadow: 0 2px 10px rgba(23, 41, 57, 0.05);
  display: flex;
  flex-direction: column;
}

.panel-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.panel-header {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 0;
}

.panel-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1f2a33;
}

.panel-sub {
  font-size: 0.77rem;
  color: #67747f;
}

.trend-chart-wrap {
  height: 255px;
}

.region-table thead th,
.exceptions-table thead th {
  font-size: 0.69rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7782;
  font-weight: 700;
  border-bottom: 1px solid #e0e6ea;
}

.num-col {
  font-variant-numeric: tabular-nums;
}

:deep(.region-table tbody tr:nth-child(even)),
:deep(.exceptions-table tbody tr:nth-child(even)) {
  background: rgba(233, 237, 232, 0.35);
}

:deep(.region-table tbody tr:hover),
:deep(.exceptions-table tbody tr:hover) {
  background: rgba(47, 111, 115, 0.06);
}

.status-good {
  color: #587c74;
  font-weight: 700;
}

.status-ok {
  color: #4f5d68;
  font-weight: 600;
}

.status-bad {
  color: #bf655e;
  font-weight: 700;
}
</style>
