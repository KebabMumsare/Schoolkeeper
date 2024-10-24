import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import StartView from '../views/start.vue'
import NoticeView from '../views/Notice.vue'
import FilerView from '../views/Filer.vue'
import ClassroomView from '../views/Classroom.vue'
import PersonalView from '../views/Personal.vue'
import IndividualStudyPlan from '@/views/IndividualStudyPlan.vue'

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
     component: StartView
   },
   {
     path: '/notice',
     name: 'notice',
     component: NoticeView
   },
   {
    path: '/personal',
    name: 'personal',
    component: PersonalView
  },
   {
     path: '/filer',
     name: 'filer',
     component: FilerView
   },
   {
     path: '/classroom/:id',
     name: 'classroom',
     component: ClassroomView,
     meta: { showSecondaryNav: true }
   },
   {
     path: '/individual-study-plan',
     name: 'IndividualStudyPlan',
     component: IndividualStudyPlan
   }
 ]
})

export default router
