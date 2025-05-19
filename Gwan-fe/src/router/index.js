import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ExerciseView from '@/views/ExerciseView.vue'

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
        // {
        //   path: ":id",
        //   name: "exerciseDetail",
        //   component: BoardList,
        // },
      ],
    },
  ],
})

export default router
