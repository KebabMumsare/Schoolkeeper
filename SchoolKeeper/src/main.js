import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')

import { createApp } from 'vue'

// Import Vuetify styles and Material Design Icons
import '@mdi/font/css/materialdesignicons.css'; // Import Material Design Icons
import 'vuetify/styles'; // Import Vuetify styles

import { createVuetify } from 'vuetify'; // Import createVuetify from Vuetify
import * as components from 'vuetify/components'; // Import all Vuetify components
import * as directives from 'vuetify/directives'; // Import all Vuetify directives

// Components
import App from './App.vue'; // Import your main App component

// Create a Vuetify instance with SSR support
const vuetify = createVuetify({
  ssr: true, // Enable server-side rendering support
  components,
  directives,
});

// Create and mount the Vue app
createApp(App).use(vuetify).mount('#app');


