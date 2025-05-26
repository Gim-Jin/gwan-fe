<template>
  <div class="login-wrapper">
    <!-- 로그인 카드 -->
    <div class="login-card">
      <div class="login-header">
        <i class="bi bi-person-circle" style="font-size: 2rem; color: #3b82f6;"></i>
        <h2>로그인</h2>
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="loginUserId">아이디</label>
          <input 
            type="text" 
            id="loginUserId" 
            v-model="form.loginUserId"
            placeholder="아이디를 입력하세요"
            required 
          />
        </div>

        <div class="form-group">
          <label for="password">비밀번호</label>
          <input 
            type="password" 
            id="password" 
            v-model="form.password"
            placeholder="비밀번호를 입력하세요" 
            required
          />
        </div>

        <p v-if="errorMsg" class="error-message">{{ errorMsg }}</p>

        <button 
          type="submit" 
          class="login-btn"
          :disabled="loading"
        >
          {{ loading ? '로그인 중...' : '로그인' }}
        </button>
      </form>

      <div class="login-footer">
        <p>계정이 없으신가요? <RouterLink :to="{ name : 'signup'}">회원가입하기</RouterLink></p>
        <div class="divider"><span>또는</span></div>
        <div class="social-icons">
          <img src="@/assets/btn_kakao.svg" alt="kakao" />
          <img src="@/assets/btn_google.svg" alt="facebook" />
          <img src="@/assets/btn_naver.svg" alt="google" />
          <img src="@/assets/btn_apple.svg" alt="twitter" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const errorMsg = ref('')

// 로그인 폼 데이터
const form = reactive({
  loginUserId: '',
  password: ''
})

// 로그인 처리 함수
const handleLogin = async () => {
  errorMsg.value = ''
  loading.value = true
  
  try {
    const result = await authStore.loginUser(form)
    console.log('로그인 성공, 결과:', result)
    
    // 리다이렉션 처리
    const redirectPath = router.currentRoute.value.query.redirect || '/'
    
    // 페이지 새로고침으로 헤더 업데이트 보장
    window.location.href = redirectPath
  } catch (err) {
    errorMsg.value = err.response?.data?.message || '로그인에 실패했습니다. 아이디와 비밀번호를 확인해 주세요.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f6fa;
  padding: 2rem;
}

.login-card {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 2.5rem 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 420px;
  width: 100%;
}

.login-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.login-header h2 {
  font-weight: 600;
  margin-top: 0.5rem;
}

.login-icon {
  width: 48px;
  height: 48px;
}

.login-form .form-group {
  margin-bottom: 1.2rem;
}

.login-form label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.4rem;
  font-size: 0.95rem;
}

.login-form input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

.error-message {
  color: #ef4444;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.login-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.login-btn:hover:not([disabled]) {
  background-color: #2563eb;
}

.login-btn[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-footer {
  text-align: center;
  margin-top: 1.8rem;
  font-size: 0.9rem;
}

.login-footer a {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #ddd;
}

.divider span {
  margin: 0 1rem;
  color: #888;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.social-icons img {
  width: 36px;
  height: 36px;
  cursor: pointer;
}
</style>
