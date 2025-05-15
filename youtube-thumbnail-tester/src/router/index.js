import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  { path: '/', name: 'Root' },
  { path: '/changelog', name: 'Changelog' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router