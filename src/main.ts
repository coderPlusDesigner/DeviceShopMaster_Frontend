import './assets/main.css'
import 'primeicons/primeicons.css'
import 'primevue/resources/primevue.min.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, { ripple: true })
app.use(ToastService)

axios.defaults.baseURL = 'https://deviceshopmaster-api.ecomputics.uz'

app.mount('#app')
