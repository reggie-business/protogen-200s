<template>
  <v-card flat class="metric-card" :class="accentClass" height="176">
    <div class="metric-label">{{ label }}</div>
    <div class="metric-value">
      {{ displayValue }}<span v-if="unit" class="metric-unit"> {{ unit }}</span>
    </div>
    <div class="metric-footer">
      <div class="metric-trend" :class="trendClass">
        <v-icon size="14">{{ trendIcon }}</v-icon>
        {{ delta }}
      </div>
      <svg class="metric-sparkline" viewBox="0 0 120 34" role="img" :aria-label="`${label} trend over the last 8 weeks`">
        <polyline :points="sparklinePoints" fill="none" :stroke="accentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type TrendDirection = 'up' | 'down' | 'flat'

const props = defineProps<{
  label: string
  value: string | number
  unit?: string
  trend: TrendDirection
  delta: string
  deltaIsGood: boolean
  sparkline: number[]
}>()

const displayValue = computed(() =>
  typeof props.value === 'number' ? new Intl.NumberFormat('en-US').format(props.value) : props.value,
)

const trendIcon = computed(() => {
  if (props.trend === 'up') return 'mdi-trending-up'
  if (props.trend === 'down') return 'mdi-trending-down'
  return 'mdi-trending-neutral'
})

const trendClass = computed(() => {
  if (props.trend === 'flat') return 'trend-flat'
  return props.deltaIsGood ? 'trend-good' : 'trend-bad'
})

const accentClass = computed(() => `accent-${props.label.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '')}`)

const accentColor = computed(() => {
  if (props.label === 'Total Shipments') return '#3b82f6'
  if (props.label === 'On-Time Delivery %') return '#f87171'
  if (props.label === 'Open Exceptions') return '#fbbf24'
  return '#a78bfa'
})

const sparklinePoints = computed(() => {
  const values = props.sparkline.slice(-8)
  if (values.length < 2) return ''
  const min = Math.min(...values)
  const max = Math.max(...values)
  const spread = max - min || 1
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 116 + 2
      const y = 30 - ((value - min) / spread) * 26
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
})
</script>

<style scoped>
.metric-card {
  position: relative;
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid var(--ff-border);
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.16);
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
  background: var(--ff-surface);
}

.metric-card::before {
  position: absolute;
  top: -1px;
  right: 0;
  left: 0;
  height: 2px;
  content: '';
}

.accent-total-shipments::before { background: #3b82f6; }
.accent-on-time-delivery::before { background: #f87171; }
.accent-open-exceptions::before { background: #fbbf24; }
.accent-avg-transit-time::before { background: #a78bfa; }

.metric-footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
}

.metric-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: var(--ff-secondary);
  margin-bottom: 0;
}

.metric-value {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--ff-text);
  line-height: 1.05;
  margin-bottom: 0;
  word-break: break-word;
  font-variant-numeric: tabular-nums;
}

.metric-unit {
  font-size: 1rem;
  font-weight: 600;
}

.metric-sparkline {
  width: 92px;
  height: 28px;
  opacity: 0.9;
  overflow: visible;
}

.metric-trend {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 999px;
  padding: 3px 8px;
  width: fit-content;
  border: 0;
}

.trend-good {
  color: var(--ff-success);
  background: rgba(52, 211, 153, 0.12);
}

.trend-bad {
  color: var(--ff-error);
  background: rgba(248, 113, 113, 0.12);
}

.trend-flat {
  color: var(--ff-secondary);
  background: rgba(100, 116, 139, 0.14);
}
</style>

