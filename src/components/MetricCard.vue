<template>
  <v-card flat class="metric-card pa-5" height="130">
    <div class="metric-label">{{ label }}</div>
    <div class="metric-value">
      {{ displayValue }}<span v-if="unit" class="metric-unit"> {{ unit }}</span>
    </div>
    <div class="metric-trend" :class="trendClass">
      <v-icon size="16">{{ trendIcon }}</v-icon>
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
.metric-unit {
  font-size: 1rem;
  font-weight: 600;
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
.trend-good {
  color: #2e7d32;
}
.trend-bad {
  color: #c62828;
}
.trend-flat {
  color: #6b7480;
}
</style>
