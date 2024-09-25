import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import start from '../views/start.vue'
import filer from '../views/Filer.vue'
import personal from '../views/Personal.vue'


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
  },
  {
    path: '/filer',
    name: 'filer',
    component: filer
  },
  {
    path: '/Personal',
    name: 'personal',
    component: personal
  },
 ]
})


export default router