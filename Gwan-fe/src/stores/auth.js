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
    } catch (err) {
      console.error('로그아웃 API 오류:', err)
    } finally {
      // API 호출 성공/실패와 관계없이 클라이언트 상태 초기화
      accessToken.value = false
      user.value = null
    }
  }

  // 토큰 재발급 함수
  const reissueToken = async () => {
    try {
      await api.put('/api/auth/reissue')
      return true
    } catch (error) {
      return false
    }
  }

  // 초기화 함수 - 사용자 정보 조회를 통한 인증 상태 확인
  const initialize = async () => {
    // 로그인/회원가입 페이지에서는 인증 확인을 건너뜀
    const currentPath = window.location.pathname
    if (currentPath === '/login' || currentPath === '/signup') {
      accessToken.value = false
      user.value = null
      return
    }
    
    // 1단계: 먼저 사용자 정보 조회 시도
    try {
      const response = await api.get('/api/user/mypage')
      if (response.data && response.data.data) {
        user.value = response.data.data
        accessToken.value = true
        return
      }
    } catch (error) {
      // 2단계: 401 에러인 경우 토큰 재발급 시도
      if (error.response && error.response.status === 401) {
        const reissueSuccess = await reissueToken()
        
        if (reissueSuccess) {
          // 3단계: 토큰 재발급 성공 시 다시 사용자 정보 조회
          try {
            const response = await api.get('/api/user/mypage')
            if (response.data && response.data.data) {
              user.value = response.data.data
              accessToken.value = true
              return
            }
          } catch (retryError) {
            // 재시도 실패
          }
        }
      }
    }
    
    // 모든 시도 실패 시 로그아웃 상태로 설정
    accessToken.value = false
    user.value = null
  }

  return {
    accessToken,
    user,
    loading,
    error,
    isAuthenticated,
    loginUser,
    logoutUser,
    initialize,
    reissueToken
  }
}) 