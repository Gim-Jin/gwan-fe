import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, logout } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  // 상태
  const accessToken = ref(null)
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // 게터
  const isAuthenticated = computed(() => !!accessToken.value)

  // 액션
  const loginUser = async (credentials) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await login(credentials)
      // 쿠키는 자동으로 저장되므로 별도 처리 불필요
      accessToken.value = true // 로그인 상태만 표시
      return response
    } catch (err) {
      error.value = err.response?.data?.message || '로그인에 실패했습니다'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logoutUser = async () => {
    try {
      await logout()
      accessToken.value = null
      user.value = null
    } catch (err) {
      console.error('로그아웃 오류:', err)
    }
  }

  // 초기화 함수 - 쿠키 존재 여부로 인증 상태 확인
  const initialize = () => {
    const cookies = document.cookie.split(';')
    const hasAccessToken = cookies.some(cookie => cookie.trim().startsWith('accessToken='))
    accessToken.value = hasAccessToken
  }

  return {
    accessToken,
    user,
    loading,
    error,
    isAuthenticated,
    loginUser,
    logoutUser,
    initialize
  }
}) 