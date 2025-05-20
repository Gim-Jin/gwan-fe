import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ExerciseView from '@/views/ExerciseView.vue'
import ExerciseDetailView from '@/views/ExerciseDetailView.vue'
import LoginComponent from '@/components/login/LoginComponent.vue'
import SignupComponent from '@/components/signup/SignupComponent.vue'
import MyRoutineView from '@/views/MyRoutineView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: "/exercises",
      name: "exercises",
      component: ExerciseView,
      children: [
       
      ],
    },
    {
        path: "/exercises/:id",
        name: "exerciseDetail",
        component: ExerciseDetailView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginComponent,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupComponent,
    },
    {
      path: '/my-routine',
      name: 'myRoutine',
      component: MyRoutineView,
    }
  ],
})

export default router
