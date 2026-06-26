<template>
  <v-card flat class="metric-card pa-5" height="138">
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
  border-radius: 10px;
  border: 1px solid #dbe1e4;
  box-shadow: 0 2px 8px rgba(24, 39, 55, 0.04);
}

.metric-label {
  font-size: 0.69rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6f7b85;
  margin-bottom: 10px;
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2a33;
  line-height: 1.08;
  margin-bottom: 8px;
}

.metric-unit {
  font-size: 1rem;
  font-weight: 600;
}

.metric-trend {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.78rem;
  font-weight: 700;
  border-radius: 999px;
  padding: 3px 9px;
}

.metric-period {
  font-weight: 500;
  color: #6f7b85;
  margin-left: 4px;
}

.trend-good {
  color: #587c74;
  background: rgba(138, 167, 160, 0.16);
}

.trend-bad {
  color: #b85c56;
  background: rgba(207, 106, 99, 0.14);
}

.trend-flat {
  color: #677782;
  background: rgba(103, 119, 130, 0.1);
}
</style>
