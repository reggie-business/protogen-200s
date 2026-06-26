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
          primary: '#2F6F73',
          'primary-darken-1': '#245A5E',
          secondary: '#E9EDE8',
          background: '#F6F7F5',
          surface: '#FFFFFF',
          error: '#CF6A63',
          warning: '#D2A24C',
          success: '#8AA7A0',
          info: '#2F6F73',
          low: '#95AA9D',
          text: '#1F2A33',
        },
      },
    },
  },
})

const app = createApp(App)

app.use(router)
app.use(vuetify)

app.mount('#app')
