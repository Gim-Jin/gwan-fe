import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, logout } from '@/api/auth'
import api from '@/api/axios'

export const useAuthStore = defineStore('auth', () => {
  // 상태
  const accessToken = ref(false)
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // 게터
  const isAuthenticated = computed(() => !!accessToken.value)

  // 사용자 정보 조회
  const fetchUserInfo = async () => {
    try {
      const response = await api.get('/api/user/mypage')
      user.value = response.data.data
      accessToken.value = true
      return true
    } catch (err) {
      console.error('사용자 정보 조회 실패:', err)
      accessToken.value = false
      user.value = null
      return false
    }
  }

  // 액션
  const loginUser = async (credentials) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await login(credentials)
      // 로그인 성공 후 사용자 정보 조회
      await fetchUserInfo()
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
      accessToken.value = false
      user.value = null
    } catch (err) {
      console.error('로그아웃 오류:', err)
    }
  }

  // 초기화 함수 - 사용자 정보 조회를 통한 인증 상태 확인
  const initialize = async () => {
    try {
      await fetchUserInfo()
    } catch (err) {
      console.error('초기화 중 오류:', err)
      accessToken.value = false
      user.value = null
    }
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