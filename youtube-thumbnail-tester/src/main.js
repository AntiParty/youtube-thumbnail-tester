import { createApp } from 'vue'
import App from './App.vue'
import { inject } from '@vercel/analytics';
import 'material-icons/iconfont/material-icons.css' 
import 'animate.css'

inject();

const app = createApp(App)
app.mount('#app')