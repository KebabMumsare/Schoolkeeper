import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import StartView from '../views/start.vue'
import NoticeView from '../views/Notice.vue'
import ClassroomsView from '../views/Classrooms.vue'
import ClassroomView from '../views/Classroom.vue'
import PersonalView from '../views/Personal.vue'
import IndividualStudyPlan from '@/views/IndividualStudyPlan.vue'
import ScheduleCreator from '../views/ScheduleCreator.vue'
import AdminTools from '../views/AdminTools.vue'
import AddNewUser from '../views/AddNewUser.vue'
import SchedualCreatorTest from '../views/SchedualCreatorTest.vue'
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
     path: '/classrooms',
     name: 'classrooms',
     component: ClassroomsView
   },
   {
     path: '/classroom/:id',
     name: 'classroom',
     component: ClassroomView
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
   {
    path: '/admintools',
    name: 'AdminTools',
    component: AdminTools
   },
   {
    path: '/addnewuser',
    name: 'AddNewUser',
    component: AddNewUser
   },
   {
    path: '/schedualcreatortest',
    name: 'SchedualCreatorTest',
    component: SchedualCreatorTest
  },
 ]
})

export default router
