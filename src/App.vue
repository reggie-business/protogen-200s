<template>
  <v-app>
    <template v-if="isUnlocked">
      <v-navigation-drawer
        v-model="drawerOpen"
        :permanent="!isSmallViewport"
        :mobile-breakpoint="960"
        :rail="!drawerOpen && !isSmallViewport"
        width="220"
        rail-width="68"
        class="sidebar"
      >
        <div class="sidebar-brand">
          <div class="brand-mark">FF</div>
          <div>
            <div class="brand-name">FastForward</div>
            <div class="brand-caption">Logistics OS</div>
          </div>
        </div>

        <nav class="sidebar-nav" aria-label="Primary navigation">
          <RouterLink to="/" class="sidebar-link" exact-active-class="sidebar-link-active">
            <v-icon size="18">mdi-view-dashboard-outline</v-icon>
            <span>Dashboard</span>
          </RouterLink>
          <RouterLink to="/about" class="sidebar-link" exact-active-class="sidebar-link-active">
            <v-icon size="18">mdi-information-outline</v-icon>
            <span>Product Info</span>
          </RouterLink>
        </nav>

        <button class="sidebar-footer user-trigger" type="button" @click="operatorCardOpen = true">
          <div class="user-avatar">AR</div>
          <div class="user-details">
            <strong>Andy Rollins</strong>
            <span>Sr. Consultant</span>
          </div>
          <v-icon size="17" class="footer-menu-icon">mdi-dots-horizontal</v-icon>
        </button>
      </v-navigation-drawer>

      <v-dialog v-model="operatorCardOpen" max-width="430" scrim="rgba(2, 6, 23, 0.78)">
        <v-card class="clearance-card">
          <div class="clearance-topline">
            <span class="clearance-label">Internal operator profile</span>
            <span class="agent-badge">⚡ FastForward Agent</span>
          </div>
          <v-card-title class="clearance-title">Operator clearance card</v-card-title>
          <v-card-subtitle class="clearance-subtitle">Regional network oversight</v-card-subtitle>

          <v-card-text>
            <div class="clearance-identity">
              <div class="clearance-avatar">AR</div>
              <div>
                <strong>Andy Rollins</strong>
                <span>Sr. Consultant</span>
              </div>
            </div>

            <dl class="clearance-stats">
              <div>
                <dt>Clearance</dt>
                <dd>Level 4 <span>— Regional Ops</span></dd>
              </div>
              <div>
                <dt>Dashboards reviewed this quarter</dt>
                <dd>47</dd>
              </div>
              <div>
                <dt>Exceptions escalated</dt>
                <dd>3</dd>
              </div>
              <div>
                <dt>Network uptime on watch</dt>
                <dd>99.2%</dd>
              </div>
            </dl>
          </v-card-text>

          <v-card-actions class="clearance-actions">
            <v-spacer />
            <v-btn variant="text" color="primary" @click="operatorCardOpen = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-app-bar flat height="72" class="top-bar">
        <v-container fluid class="top-bar-shell">
          <div class="top-bar-inner">
            <div class="page-heading">
              <v-btn
                icon
                variant="text"
                size="small"
                class="menu-toggle"
                :aria-label="drawerOpen ? 'Collapse navigation' : 'Expand navigation'"
                :title="drawerOpen ? 'Collapse navigation' : 'Expand navigation'"
                @click="drawerOpen = !drawerOpen"
              >
                <v-icon>{{ drawerOpen ? 'mdi-menu-open' : 'mdi-menu' }}</v-icon>
              </v-btn>
              <div class="page-heading-copy">
                <span class="eyebrow">Operations overview</span>
                <span class="app-title">Network performance</span>
              </div>
            </div>
            <div class="region-filter" role="group" aria-label="Filter by region">
              <v-icon size="16">mdi-map-marker-outline</v-icon>
              <button
                v-for="option in regionOptions"
                :key="option.value"
                type="button"
                class="region-pill"
                :class="{ 'region-pill-active': selectedRegion === option.value }"
                @click="selectedRegion = option.value"
              >
                {{ option.label === 'All Regions' ? 'All' : option.label }}
              </button>
            </div>
          </div>
        </v-container>
      </v-app-bar>
    </template>

    <v-main v-if="isUnlocked" class="dashboard-main" :class="{ 'dashboard-main-rail': !drawerOpen }">
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
import { nextTick, onMounted, onUnmounted, provide, ref } from 'vue'
import { RouterView } from 'vue-router'

// Demo-only client-side gate for mock data. This is not real authentication.
// The access code is visible in the client bundle and should not protect sensitive data.
const PASSWORD_PROTECTION_ENABLED = true
const ACCESS_CODE = 'eagle'

const enteredCode = ref('')
const isUnlocked = ref(!PASSWORD_PROTECTION_ENABLED)
const errorMessage = ref('')
const accessInput = ref<{ focus?: () => void } | null>(null)
const selectedRegion = ref<string>('all')
const isSmallViewport = ref(typeof window !== 'undefined' && window.innerWidth < 960)
const drawerOpen = ref(!isSmallViewport.value && (typeof window === 'undefined' || window.innerWidth >= 1280))
const operatorCardOpen = ref(false)

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

const syncViewportMode = () => {
  const isSmall = window.innerWidth < 960
  if (isSmall) {
    drawerOpen.value = false
  }
  isSmallViewport.value = isSmall
}

onMounted(() => {
  window.addEventListener('resize', syncViewportMode)
  nextTick(() => {
    accessInput.value?.focus?.()
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', syncViewportMode)
})
</script>

<style scoped>
.dashboard-main {
  background: var(--ff-page-bg);
  margin-left: 220px;
  transition: margin-left 0.2s ease;
}

.dashboard-main-rail {
  margin-left: 68px;
}

.menu-toggle {
  color: var(--ff-secondary) !important;
  flex: 0 0 auto;
}

.page-heading {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-heading-copy {
  display: flex;
  flex-direction: column;
  gap: 1px;
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
  border-bottom: 1px solid var(--ff-border);
  background: var(--ff-page-bg) !important;
}

.top-bar-shell {
  height: 100%;
  padding: 0 32px;
}

.top-bar-inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

.app-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--ff-text);
}

.eyebrow {
  color: var(--ff-secondary);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.region-filter {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 6px;
  color: var(--ff-secondary);
}

.region-pill {
  border: 1px solid rgba(15, 23, 42, 0.22);
  border-radius: 999px;
  color: var(--ff-text);
  cursor: pointer;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  background: transparent;
  padding: 7px 11px;
  transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}

.region-pill:hover {
  border-color: var(--ff-accent);
  color: #ffffff;
  background: rgba(255, 255, 255, 0.06);
}

.region-pill-active {
  background: var(--ff-accent);
  border-color: #60a5fa;
  color: #ffffff;
}

.region-pill-active:hover {
  background: #2563eb;
  border-color: #bfdbfe;
  color: #ffffff;
}

.sidebar {
  border-right: 1px solid var(--ff-border) !important;
  background: #070d1d !important;
  color: var(--ff-text);
}

:deep(.sidebar.v-navigation-drawer--rail) .sidebar-brand {
  justify-content: center;
  padding-right: 10px;
  padding-left: 10px;
}

:deep(.sidebar.v-navigation-drawer--rail) .brand-name,
:deep(.sidebar.v-navigation-drawer--rail) .brand-caption,
:deep(.sidebar.v-navigation-drawer--rail) .user-details,
:deep(.sidebar.v-navigation-drawer--rail) .footer-menu-icon {
  display: none;
}

:deep(.sidebar.v-navigation-drawer--rail) .sidebar-footer {
  justify-content: center;
  right: 10px;
  left: 10px;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 28px 22px 34px;
}

.brand-mark,
.gate-brand-mark {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #3b82f6;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.brand-name {
  color: var(--ff-text);
  font-size: 0.95rem;
  font-weight: 700;
}

.brand-caption {
  color: var(--ff-secondary);
  font-size: 0.68rem;
  margin-top: 1px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0 12px;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 9px;
  color: var(--ff-secondary);
  font-size: 0.82rem;
  font-weight: 600;
  padding: 11px 12px;
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease;
}

.sidebar-link:hover,
.sidebar-link-active {
  background: rgba(59, 130, 246, 0.12);
  color: #bfdbfe;
}

.sidebar-footer {
  position: absolute;
  right: 16px;
  bottom: 20px;
  left: 16px;
  display: flex;
  align-items: center;
  gap: 9px;
  border-top: 1px solid var(--ff-border);
  padding-top: 18px;
}

.user-trigger {
  display: flex;
  align-items: center;
  width: auto;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  text-align: left;
  transition: background 0.2s ease;
}

.user-trigger:hover {
  border-radius: 9px;
  background: rgba(59, 130, 246, 0.08);
}

.user-avatar {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  margin: 0;
  border-radius: 50%;
  background: #1e293b;
  color: #cbd5e1;
  font-size: 0.65rem;
  font-weight: 700;
}

.user-details {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.user-details strong {
  color: var(--ff-text);
  font-size: 0.72rem;
  font-weight: 600;
}

.user-details span {
  color: var(--ff-secondary);
  font-size: 0.64rem;
  white-space: nowrap;
}

.footer-menu-icon {
  color: var(--ff-muted);
}

.clearance-card {
  border: 1px solid rgba(59, 130, 246, 0.28);
  border-radius: 14px;
  background: var(--ff-surface);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.4);
}

.clearance-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 24px 0;
}

.clearance-label {
  color: var(--ff-secondary);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.agent-badge {
  border: 1px solid rgba(251, 191, 36, 0.26);
  border-radius: 999px;
  background: rgba(251, 191, 36, 0.1);
  color: #fcd34d;
  font-size: 0.67rem;
  font-weight: 700;
  padding: 5px 8px;
  white-space: nowrap;
}

.clearance-title {
  padding-top: 22px;
  padding-left: 24px;
  color: var(--ff-text);
  font-size: 1.35rem;
  font-weight: 700;
}

.clearance-subtitle {
  padding-left: 24px;
  color: var(--ff-secondary) !important;
}

:deep(.clearance-card .v-card-text) {
  padding-left: 24px;
  padding-right: 24px;
}

.clearance-identity {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 4px 0 22px;
  padding: 14px;
  border: 1px solid var(--ff-border);
  border-radius: 10px;
  background: rgba(59, 130, 246, 0.06);
}

.clearance-avatar {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #1d4ed8;
  color: #dbeafe;
  font-size: 0.72rem;
  font-weight: 800;
}

.clearance-identity div:last-child {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.clearance-identity strong {
  color: var(--ff-text);
  font-size: 0.9rem;
}

.clearance-identity span {
  color: var(--ff-secondary);
  font-size: 0.75rem;
}

.clearance-stats {
  display: grid;
  gap: 0;
}

.clearance-stats div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  padding: 11px 0;
  border-bottom: 1px solid var(--ff-border);
}

.clearance-stats div:last-child {
  border-bottom: 0;
}

.clearance-stats dt {
  color: var(--ff-secondary);
  font-size: 0.75rem;
}

.clearance-stats dd {
  color: var(--ff-text);
  font-size: 0.82rem;
  font-weight: 700;
  text-align: right;
}

.clearance-stats dd span {
  color: var(--ff-secondary);
  font-weight: 500;
}

.clearance-actions {
  border-top: 1px solid var(--ff-border);
  padding: 12px 16px;
}

@media (max-width: 959px) {
  .dashboard-main,
  .dashboard-main-rail {
    margin-left: 0;
  }

  .top-bar-shell {
    padding: 0 20px;
  }

  .top-bar-inner {
    gap: 16px;
  }

  .region-filter {
    gap: 4px;
  }

  .region-pill {
    padding-right: 8px;
    padding-left: 8px;
  }
}

@media (max-width: 599px) {
  .top-bar-shell {
    padding: 0 12px;
  }

  .top-bar-inner {
    align-items: flex-start;
    padding-top: 10px;
  }

  .page-heading-copy {
    display: none;
  }

  .region-filter {
    flex: 1;
    justify-content: flex-end;
  }

  .region-pill {
    font-size: 0.68rem;
    padding: 6px 7px;
  }
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
