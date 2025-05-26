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
import AdminManagement from '@/views/AdminManagement.vue'
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
    },
    {
      path: '/admin/users',
      name: 'adminManagement',
      component: AdminManagement,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/community',
      name: 'community',
      component: () => import('@/views/CommunityView.vue'),
      redirect: { name: 'ArticleList' },
      children: [
        {
          path: '',
          name: 'ArticleList',
          component: () => import('@/components/community/ArticleList.vue'),
        },
        {
          path: 'write',
          name: 'ArticleWrite',
          component: () => import('@/components/community/ArticleForm.vue'),
        },
        {
          path: ':id',
          name: 'ArticleDetail',
          component: () => import('@/components/community/ArticleDetail.vue'),
        },
        {
          path: ':id/edit',
          name: 'ArticleEdit',
          component: () => import('@/components/community/ArticleForm.vue'),
        },
      ]
    }
  ],  
  scrollBehavior(to, from, savedPosition) {
    // 브라우저 뒤/앞 버튼이면 savedPosition이 있으니 그대로 복원
    if (savedPosition) return savedPosition

    // 그 외에는 항상 화면 맨 위로
    // { top: 0 } → 수직 0,  { left: 0, top: 0 } 로 써도 동일
    return { top: 0 }
  }
  
})

// 인증이 필요한 라우트에 대한 가드 추가
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth) {
    // 인증 복구가 필요한 경우 대기
    if (!authStore.isAuthenticated) {
      console.log('라우터 가드: 인증 복구 시도')
      await authStore.initialize()
    }
    
    // 인증 복구 후에도 인증되지 않은 경우
    if (!authStore.isAuthenticated) {
      console.log('라우터 가드: 인증 실패, 로그인으로 이동')
      next({ name: 'login', query: { redirect: to.fullPath } })
      return
    }
    
    // 관리자 권한이 필요한 페이지 체크
    if (to.meta.requiresAdmin) {
      if (!authStore.user || authStore.user.role !== 'ADMIN') {
        console.log('라우터 가드: 관리자 권한 없음, 홈으로 이동')
        alert('관리자 권한이 필요한 페이지입니다.')
        next({ name: 'home' })
        return
      }
    }
    
    console.log('라우터 가드: 인증 성공')
    next()
  } else {
    next()
  }
})

export default router
