import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import StartView from '../views/start.vue'
import NoticeView from '../views/Notice.vue'
import FilerView from '../views/Filer.vue'
import ClassroomView from '../views/Classroom.vue'
import PersonalView from '../views/Personal.vue'
import IndividualStudyPlan from '@/views/IndividualStudyPlan.vue'
import AssignmentView from '../views/Assignment.vue'
import ScheduleCreator from '../views/ScheduleCreator.vue'

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
     path: '/classroom',
     name: 'classroom',
     component: FilerView
   },
   {
     path: '/classroom/:id',
     name: 'classroom',
     component: ClassroomView
   },
   {
     path: '/classroom/:id/assignment/:assignmentId',
     name: 'assignment',
     component: AssignmentView
   },
   {
     path: '/individual-study-plan',
     name: 'IndividualStudyPlan',
     component: IndividualStudyPlan
   },
   {
    path: '/schedulecreator',
    name: 'ScheduleCreator',
    component: ScheduleCreator
   },
 ]
})

export default router
