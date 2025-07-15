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
      console.log('fetchUserInfo 시작...')
      
      // 먼저 /api/auth/me로 역할 정보 조회
      const response = await api.get('/api/auth/me')
      console.log('auth/me 응답:', response.data)
      
      if (response.data && response.data.success) {
        let role = 'GENERAL' // 기본값
        
        // 케이스 1: { success: true, data: "GENERAL" } - 스크린샷에서 확인된 구조
        if (response.data.data && typeof response.data.data === 'string') {
          role = response.data.data
          console.log('역할 추출 성공:', role)
        }
        
        // /api/user로 상세 정보 조회
        try {
          const userResponse = await api.get('/api/user')
          console.log('user 응답:', userResponse.data)
          
          if (userResponse.data && userResponse.data.success && userResponse.data.data) {
            const userData = userResponse.data.data
            user.value = {
              id: userData.userId,
              nickname: userData.nickName || userData.nickname,
              email: userData.email,
              loginId: userData.loginId,
              name: userData.name,
              role: role.toUpperCase()
            }
            console.log('사용자 정보 설정 완료:', user.value)
            accessToken.value = true
            return true
          }
        } catch (userErr) {
          console.error('/api/user 조회 실패:', userErr)
          // 기본 정보만 설정
          user.value = {
            id: null,
            nickname: null,
            role: role.toUpperCase()
          }
          accessToken.value = true
          return true
        }
      }
      
      // 응답이 성공적이지 않은 경우
      console.log('auth/me 응답이 성공적이지 않음:', response.data)
      accessToken.value = false
      user.value = null
      return false
      
    } catch (err) {
      console.error('사용자 정보 조회 실패:', err.response?.status, err.response?.data)
      
      // 401 에러가 아닌 경우에만 재시도 (네트워크 오류 등)
      if (err.response?.status !== 401) {
        try {
          console.log('users/me로 재시도...')
          const userResponse = await api.get('/api/users/me')
          
          if (userResponse.data && userResponse.data.success) {
            const userData = userResponse.data.data
            user.value = {
              id: userData.id,
              nickname: userData.nickname,
              role: userData.role?.toUpperCase() || 'GENERAL'
            }
            console.log('users/me로 사용자 정보 설정:', user.value)
            accessToken.value = true
            return true
          }
        } catch (retryErr) {
          console.error('users/me 재시도도 실패:', retryErr.response?.status, retryErr.response?.data)
        }
      }
      
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
      if (response.data && response.data.success) {
        accessToken.value = true
        
        // 로그인 후 상세 사용자 정보 조회
        await fetchUserInfo()
        
        console.log('로그인 성공, 사용자 정보:', user.value)
        
        return response
      } else {
        throw new Error('로그인 응답이 올바르지 않습니다.')
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
      
      // 사용자 정보 조회로 토큰 유효성 검사
      const isValid = await fetchUserInfo()
      
      if (isValid) {
        console.log('사용자 정보 초기화 성공:', user.value)
        return
      } else {
        console.log('토큰 유효성 검사 실패')
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