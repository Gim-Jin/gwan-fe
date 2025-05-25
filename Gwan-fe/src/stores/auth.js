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
      
      // 다양한 응답 구조에 대응
      if (response.data) {
        let role = 'GENERAL' // 기본값
        
        // 케이스 1: { success: true, data: "ADMIN" }
        if (response.data.success && response.data.data) {
          role = response.data.data
        }
        // 케이스 2: { role: "ADMIN" } 직접 구조
        else if (response.data.role) {
          role = response.data.role
        }
        // 케이스 3: { data: { role: "ADMIN" } } 중첩 구조
        else if (response.data.data && typeof response.data.data === 'object' && response.data.data.role) {
          role = response.data.data.role
        }
        
        user.value = {
          role: role.toUpperCase()
        }
        
        accessToken.value = true
        return true
      } else {
        accessToken.value = false
        user.value = null
        return false
      }
    } catch (err) {
      console.error('사용자 정보 조회 실패:', err.response?.status)
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
      
      // 로그인 응답에서 바로 역할 정보가 있는지 확인
      if (response.data && response.data.data) {
        // 로그인 응답에서 바로 역할을 설정
        let role = 'GENERAL'
        if (typeof response.data.data === 'string') {
          // "ADMIN 로그인 성공" 같은 문자열에서 역할 추출
          const roleMatch = response.data.data.match(/(ADMIN|ADVISOR|GENERAL)/i)
          if (roleMatch) {
            role = roleMatch[1].toUpperCase()
          }
        } else if (response.data.data.role) {
          role = response.data.data.role.toUpperCase()
        }
        
        user.value = {
          role: role
        }
        accessToken.value = true
        
        return response
      }
      
      // 로그인 응답에 역할이 없으면 별도 조회
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
  const currentPath = window.location.pathname

  if (currentPath === '/login' || currentPath === '/signup') {
    accessToken.value = false
    user.value = null
    localStorage.removeItem('userRole')
    return
  }

  try {
    // 토큰 유효성 검사 및 role 확인
    const response = await api.get('/api/auth/me')
    if (response.data && response.data.success) {
      const role = response.data.data || 'GENERAL'
      user.value = { role: role.toUpperCase() }
      accessToken.value = true
      localStorage.setItem('userRole', role.toUpperCase())
      console.log('사용자 정보 초기화 성공:', user.value)
      return
    }
  } catch (error) {
    accessToken.value = false
    user.value = null
    localStorage.removeItem('userRole')
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
    initialize,
    reissueToken
  }
}) 