import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ExerciseView from '@/views/ExerciseView.vue'
import ExerciseDetailView from '@/views/ExerciseDetailView.vue'
import LoginComponent from '@/components/login/LoginComponent.vue'
import SignupComponent from '@/components/signup/SignupComponent.vue'
import MyRoutineView from '@/views/MyRoutineView.vue'
import Mypage from '@/views/MypageView.vue'
import ReviseMyInfoView from '@/views/ReviseMyInfoView.vue'
import MypageView from '@/views/MypageView.vue'
import SurveyComplete from '@/components/survey/SurveyComplete.vue'
import { useAuthStore } from '@/stores/auth'

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
      meta: { requiresAuth: true }
    },
    {
      path: '/mypage',
      name: 'mypage',
      component: MypageView,
      meta: { requiresAuth: true }
    },
    {
      path: '/mypage/info-revise',
      name: 'infoRevise',
      component: ReviseMyInfoView,
      meta: { requiresAuth: true }
    },
    {
      path: '/survey/complete',
      name: 'surveyComplete',
      component: SurveyComplete
    }
  ],
})

// 인증이 필요한 라우트에 대한 가드 추가
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // 인증이 필요한 페이지인데 인증되지 않은 경우
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
