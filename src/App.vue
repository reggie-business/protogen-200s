<template>
  <v-app>
    <v-main v-if="isUnlocked">
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
import { nextTick, onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'

// Demo-only client-side gate for mock data. This is not real authentication.
// The access code is visible in the client bundle and should not protect sensitive data.
const ACCESS_CODE = 'CHANGE_ME'

const enteredCode = ref('')
const isUnlocked = ref(false)
const errorMessage = ref('')
const accessInput = ref<{ focus?: () => void } | null>(null)

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
.gate-main {
  background-color: #f4f5f7;
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
  color: #006d77;
  margin-top: 4px;
}

.gate-note {
  color: #5f6874;
  margin: 12px 0 16px;
}
</style>
