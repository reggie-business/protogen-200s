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
          primary: '#006D77',
          'primary-darken-1': '#004E56',
          secondary: '#83C5BE',
          background: '#F4F5F7',
          surface: '#FFFFFF',
          error: '#C62828',
          warning: '#E65100',
          success: '#2E7D32',
          info: '#006D77',
        },
      },
    },
  },
})

const app = createApp(App)

app.use(router)
app.use(vuetify)

app.mount('#app')
