import { createApp } from 'vue'
import App from './App.vue'
import { inject } from '@vercel/analytics';
import router from './router/index'
import 'material-icons/iconfont/material-icons.css' 
import 'animate.css'

inject({});

const app = createApp(App)
app.use(router)
app.mount('#app')