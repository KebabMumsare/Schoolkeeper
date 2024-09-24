import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import start from '../views/start.vue'


const router = createRouter({
 history: createWebHistory(import.meta.env.BASE_URL),
 routes: [
   {
     path: '/',
     name: 'home',
     component: HomeView
   },
   {
    path: '/start',
    name: 'start',
    component: start
  }
 ]
})


export default router