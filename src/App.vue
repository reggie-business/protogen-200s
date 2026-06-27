<template>
  <v-app>
    <v-app-bar flat color="#1B2733" height="64" class="top-bar" v-if="isUnlocked">
      <v-container fluid class="top-bar-shell">
        <div class="top-bar-inner">
          <v-app-bar-title class="app-bar-title-wrap">
            <span class="app-title">FastForward Logistics</span>
            <span class="app-subtitle"> - Operations</span>
          </v-app-bar-title>
          <v-select
            v-model="selectedRegion"
            :items="regionOptions"
            item-title="label"
            item-value="value"
            variant="outlined"
            hide-details
            density="compact"
            class="region-filter"
            prepend-inner-icon="mdi-map-marker-outline"
            bg-color="white"
          />
        </div>
      </v-container>
    </v-app-bar>

    <v-main v-if="isUnlocked" class="dashboard-main">
      <RouterView />
    </v-main>

    <v-main v-else class="gate-main">
      <div class="gate-center-shell">
        <v-card class="gate-card" elevation="2">
          <div class="gate-header">
            <div class="gate-title">FastForward Logistics</div>
            <div class="gate-subtitle">Operations Dashboard Access</div>
          </div>
          <p class="gate-note">Enter the demo access code to continue.</p>

          <v-form @submit.prevent="submitAccessCode" class="gate-form">
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
              class="access-input"
            />

            <v-btn block color="primary" class="mt-4" type="submit">Unlock Dashboard</v-btn>
          </v-form>
        </v-card>
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { nextTick, onMounted, provide, ref } from 'vue'
import { RouterView } from 'vue-router'

// Demo-only client-side gate for mock data. This is not real authentication.
// The access code is visible in the client bundle and should not protect sensitive data.
const ACCESS_CODE = 'fastforward'

const enteredCode = ref('')
const isUnlocked = ref(false)
const errorMessage = ref('')
const accessInput = ref<{ focus?: () => void } | null>(null)
const selectedRegion = ref<string>('all')

const regionOptions = ref([
  { label: 'All Regions', value: 'all' },
  { label: 'Midwest', value: 'Midwest' },
  { label: 'Northeast', value: 'Northeast' },
  { label: 'South', value: 'South' },
  { label: 'West', value: 'West' },
  { label: 'Mountain', value: 'Mountain' },
])

provide('selectedRegion', selectedRegion)

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
  background: var(--ff-page-bg);
  padding-top: 64px;
}

.gate-main {
  background-color: var(--ff-page-bg);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.top-bar {
  border-bottom: 1px solid rgba(226, 230, 235, 0.18);
}

.top-bar-shell {
  max-width: 1360px;
  height: 100%;
  margin: 0 auto;
  padding: 0 24px;
}

.top-bar-inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.app-bar-title-wrap {
  min-width: 0;
  padding-inline-start: 0;
}

.app-title {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.02em;
}

.app-subtitle {
  font-size: 0.95rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
}

.region-filter {
  min-width: 232px;
  max-width: 252px;
  margin-right: 8px;
  flex: 0 0 auto;
}

:deep(.region-filter .v-field) {
  border-radius: 6px;
  background: #ffffff;
}

:deep(.region-filter .v-field__outline) {
  --v-field-border-opacity: 1;
  color: var(--ff-border);
}

:deep(.region-filter .v-field--focused .v-field__outline) {
  color: var(--ff-accent);
}

:deep(.region-filter .v-select__selection-text),
:deep(.region-filter .v-field__input),
:deep(.region-filter .v-icon) {
  color: var(--ff-text);
}

:deep(.v-overlay .v-list-item--active) {
  background: rgba(255, 87, 34, 0.1);
}

:deep(.v-overlay .v-list-item--active .v-list-item-title) {
  color: var(--ff-accent);
  font-weight: 600;
}

.gate-card {
  border: 1px solid var(--ff-border);
  border-radius: 6px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(27, 39, 51, 0.06);
}

.gate-center-shell {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gate-header {
  margin-bottom: 20px;
}

.gate-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--ff-text);
  margin-bottom: 4px;
}

.gate-subtitle {
  font-size: 0.875rem;
  font-weight: 600;
  color: #495867;
}

.gate-note {
  color: #5f6b77;
  font-size: 0.875rem;
  margin: 0 0 24px 0;
}

.gate-form {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

:deep(.access-input .v-field__outline) {
  --v-field-border-opacity: 1;
  color: var(--ff-border);
}

:deep(.access-input .v-field__input) {
  padding-left: 12px;
}

:deep(.access-input .v-field--focused .v-field__outline) {
  color: #6b7785;
}

:deep(.access-input .v-label) {
  color: #5f6b77;
}

:deep(.access-input .v-icon) {
  color: #5f6b77;
}

:deep(.gate-form .v-btn) {
  background: var(--ff-accent) !important;
  color: #ffffff !important;
  font-weight: 600;
  letter-spacing: 0.01em;
}
</style>
