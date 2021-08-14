import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  // onNeedRefresh() {},
  onOfflineReady() {
    confirm('Ready to work offline?')
  },
  onRegisterError() {},
})

createApp(App).mount('#app')
