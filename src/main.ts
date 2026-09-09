import './assets/main.css'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
  theme: {
    defaultTheme: 'ffDark',
    themes: {
      ffDark: {
        dark: true,
        colors: {
          primary: '#3B82F6',
          'primary-darken-1': '#2563EB',
          secondary: '#64748B',
          background: '#05091A',
          surface: '#0A1120',
          error: '#F87171',
          warning: '#FBBF24',
          success: '#34D399',
          info: '#60A5FA',
          low: '#334155',
          text: '#F1F5F9',
        },
      },
    },
  },
})

const app = createApp(App)

app.use(router)
app.use(vuetify)

app.mount('#app')
