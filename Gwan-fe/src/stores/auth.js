import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, logout } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  // 상태
  const accessToken = ref(localStorage.getItem('accessToken') || null)
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
      accessToken.value = response.data.data.accessToken
      localStorage.setItem('accessToken', accessToken.value)
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
      localStorage.removeItem('accessToken')
    } catch (err) {
      console.error('로그아웃 오류:', err)
    }
  }

  // 초기화 함수
  const initialize = () => {
    accessToken.value = localStorage.getItem('accessToken')
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