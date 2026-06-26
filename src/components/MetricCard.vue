<template>
  <v-card flat class="metric-card" height="176">
    <div class="metric-label">{{ label }}</div>
    <div class="metric-value">
      {{ displayValue }}<span v-if="unit" class="metric-unit"> {{ unit }}</span>
    </div>
    <div class="metric-trend" :class="trendClass">
      <v-icon size="15">{{ trendIcon }}</v-icon>
      {{ delta }}
      <span class="metric-period">vs prior week</span>
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
</script>

<style scoped>
.metric-card {
  border-radius: 6px;
  border: 1px solid var(--ff-border);
  box-shadow: 0 1px 3px rgba(27, 39, 51, 0.04);
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 14px;
  background: var(--ff-surface);
}

.metric-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: #5f6b77;
  margin-bottom: 0;
}

.metric-value {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--ff-text);
  line-height: 1.05;
  margin-bottom: 4px;
  word-break: break-word;
  font-variant-numeric: tabular-nums;
}

.metric-unit {
  font-size: 1rem;
  font-weight: 600;
}

.metric-trend {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 4px;
  padding: 3px 8px;
  width: fit-content;
  border: 1px solid transparent;
  margin-top: auto;
}

.metric-period {
  font-weight: 500;
  color: #667483;
  margin-left: 4px;
}

.trend-good {
  color: var(--ff-success);
  background: rgba(46, 125, 50, 0.08);
  border-color: rgba(46, 125, 50, 0.2);
}

.trend-bad {
  color: var(--ff-error);
  background: rgba(211, 47, 47, 0.08);
  border-color: rgba(211, 47, 47, 0.2);
}

.trend-flat {
  color: #607080;
  background: rgba(96, 112, 128, 0.08);
  border-color: rgba(96, 112, 128, 0.2);
}
</style>

