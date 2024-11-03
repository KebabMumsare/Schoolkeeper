import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createVuetify } from 'vuetify'; // Import createVuetify from Vuetify
import * as components from 'vuetify/components'; // Import all Vuetify components
import * as directives from 'vuetify/directives'; // Import all Vuetify directives

const vuetify = createVuetify({
  ssr: true, // Enable server-side rendering support
  components,
  directives,
});

const app = createApp(App).use(vuetify)

app.use(router)

app.mount('#app')

// Import Vuetify styles and Material Design Icons
import '@mdi/font/css/materialdesignicons.css'; // Import Material Design Icons
import 'vuetify/styles'; // Import Vuetify styles





