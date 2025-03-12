import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import StartView from '../views/start.vue'
import NoticeView from '../views/Notice.vue'
import ClassroomsView from '../views/Classrooms.vue'
import ClassroomView from '../views/Classroom.vue'
import PersonalView from '../views/Personal.vue'
import IndividualStudyPlan from '@/views/IndividualStudyPlan.vue'
import ScheduleCreator from '../views/AdminTools/ScheduleCreator.vue'
import AdminTools from '../views/AdminTools/AdminTools.vue'
import AddNewUser from '../views/AdminTools/AddNewUser.vue'
import GroupCreator from '../views/AdminTools/GroupCreator.vue'
import RoomsCreator from '../views/AdminTools/RoomsCreator.vue'
import KurserView from '../views/AdminTools/Kurser.vue'
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
    path: '/admintools',
    name: 'AdminTools',
    component: AdminTools
   },
   {
    path: '/admintools/ScheduleCreator',
    name: 'ScheduleCreator',
    component: ScheduleCreator
   },
   {
    path: '/admintools/addnewuser',
    name: 'AddNewUser',
    component: AddNewUser
   },
   {
    path: '/admintools/groupcreator',
    name: 'GroupCreator',
    component: GroupCreator
   },
   {
    path: '/admintools/roomscreator',
    name: 'RoomsCreator',
    component: RoomsCreator
   },
   {
    path: '/admintools/kurser',
    name: 'Kurser',
    component: KurserView
   }
 ]
})


export default router
