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
    defaultTheme: 'ffLight',
    themes: {
      ffLight: {
        dark: false,
        colors: {
          primary: '#FF5722',
          'primary-darken-1': '#1B2733',
          secondary: '#F7F8FA',
          background: '#F7F8FA',
          surface: '#FFFFFF',
          error: '#D32F2F',
          warning: '#F9A825',
          success: '#2E7D32',
          info: '#1B2733',
          low: '#78909C',
          text: '#1B2733',
        },
      },
    },
  },
})

const app = createApp(App)

app.use(router)
app.use(vuetify)

app.mount('#app')
