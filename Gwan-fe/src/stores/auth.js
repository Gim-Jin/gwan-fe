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
      const response = await api.get('/api/auth/me')
      
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
      console.error('사용자 정보 조회 실패:', err.response?.status, err.response?.data)
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
      console.log('로그인 응답:', response.data)
      
      // 로그인 응답에서 역할 정보 추출
      // 응답 형태: {"success":true,"code":200,"message":"요청 성공","data":"GENERAL"}
      if (response.data && response.data.success && response.data.data) {
        const role = response.data.data // "GENERAL", "ADMIN", "ADVISOR" 등
        
        user.value = {
          role: role.toUpperCase()
        }
        accessToken.value = true
        localStorage.setItem('userRole', role.toUpperCase())
        
        console.log('로그인 성공, 사용자 역할:', role)
        
        return response
      } else {
        // 로그인은 성공했지만 역할 정보가 없는 경우
        console.log('로그인 응답에 역할 정보가 없음, 사용자 정보 조회 시도')
        await fetchUserInfo()
        
        return response
      }
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
      localStorage.removeItem('userRole')
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
      console.log('토큰 유효성 검사 시작...')
      // 토큰 유효성 검사 및 role 확인
      const response = await api.get('/api/auth/me')
      console.log('토큰 유효성 검사 응답:', response.data)
      
      if (response.data && response.data.success) {
        const role = response.data.data || 'GENERAL'
        user.value = { role: role.toUpperCase() }
        accessToken.value = true
        localStorage.setItem('userRole', role.toUpperCase())
        console.log('사용자 정보 초기화 성공:', user.value)
        return
      } else {
        console.log('토큰 유효성 검사 실패: success가 false')
        accessToken.value = false
        user.value = null
        localStorage.removeItem('userRole')
      }
    } catch (error) {
      console.error('토큰 유효성 검사 에러:', error.response?.status, error.response?.data)
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