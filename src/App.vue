<template>
  <v-app>
    <v-app-bar flat color="primary-darken-1" height="66" class="top-bar" v-if="isUnlocked">
      <v-app-bar-title>
        <span class="app-title">FastForward Logistics</span>
        <span class="app-subtitle"> - Operations</span>
      </v-app-bar-title>
      <template #append>
        <v-select
          v-model="selectedRegion"
          :items="regionOptions"
          item-title="label"
          item-value="value"
          variant="solo-filled"
          hide-details
          density="compact"
          class="region-filter"
          prepend-inner-icon="mdi-map-marker-outline"
          bg-color="primary"
          base-color="white"
        />
      </template>
    </v-app-bar>

    <v-main v-if="isUnlocked" class="dashboard-main">
      <RouterView />
    </v-main>

    <v-main v-else class="gate-main">
      <v-container class="fill-height d-flex align-center justify-center">
        <v-card class="gate-card pa-6" width="420" elevation="2">
          <div class="gate-title">FastForward Logistics</div>
          <div class="gate-subtitle">Operations Dashboard Access</div>
          <p class="gate-note">Enter the demo access code to continue.</p>

          <v-form @submit.prevent="submitAccessCode">
            <v-text-field
              ref="accessInput"
              v-model="enteredCode"
              label="Access Code"
              type="password"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-lock-outline"
              :error-messages="errorMessage ? [errorMessage] : []"
              @keydown.enter="submitAccessCode"
            />

            <v-btn block color="primary" class="mt-2" type="submit">Unlock Dashboard</v-btn>
          </v-form>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, computed } from 'vue'
import { RouterView } from 'vue-router'

// Demo-only client-side gate for mock data. This is not real authentication.
// The access code is visible in the client bundle and should not protect sensitive data.
const ACCESS_CODE = 'protogen'

const enteredCode = ref('')
const isUnlocked = ref(false)
const errorMessage = ref('')
const accessInput = ref<{ focus?: () => void } | null>(null)
const selectedRegion = ref<string>('all')

const regionOptions = ref([
  { label: 'All Regions', value: 'all' },
  { label: 'Midwest', value: 'midwest' },
  { label: 'Northeast', value: 'northeast' },
  { label: 'South', value: 'south' },
  { label: 'West', value: 'west' },
  { label: 'Mountain', value: 'mountain' },
])

const submitAccessCode = () => {
  if (enteredCode.value === ACCESS_CODE) {
    isUnlocked.value = true
    errorMessage.value = ''
    return
  }

  errorMessage.value = 'Incorrect code. Please try again.'
}

onMounted(() => {
  nextTick(() => {
    accessInput.value?.focus?.()
  })
})
</script>

<style scoped>
.dashboard-main {
  background: #f6f7f5;
}

.gate-main {
  background-color: #f4f5f7;
}

.top-bar {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.app-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.01em;
}

.app-subtitle {
  font-size: 1.02rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
}

.region-filter {
  min-width: 230px;
  max-width: 250px;
  margin-right: 10px;
  color: white;
}

:deep(.region-filter .v-field__input),
:deep(.region-filter .v-select__selection-text),
:deep(.region-filter .v-icon) {
  color: white !important;
}

.gate-card {
  border: 1px solid #e0e3e8;
  border-radius: 10px;
}

.gate-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a2332;
}

.gate-subtitle {
  font-size: 0.95rem;
  font-weight: 600;
  color: #2f6f73;
  margin-top: 4px;
}

.gate-note {
  color: #5f6874;
  margin: 12px 0 16px;
}
</style>
