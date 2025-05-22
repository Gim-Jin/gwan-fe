<template>
  <div class="signup-wrapper">
    <div class="signup-card">
      <div class="signup-header">
        <i class="bi bi-person-plus" style="font-size: 2rem; color: #3b82f6;"></i>
        <h2>회원가입</h2>
      </div>

      <form class="signup-form" @submit="submit">
        <div class="form-group" v-for="field in fields" :key="field.key">
          <label :for="field.key">{{ field.label }}</label>
          <input
            :type="field.type"
            :id="field.key"
            :placeholder="field.placeholder"
            v-model="form[field.key]"
            :required="field.required !== false"
            :disabled="field.disabled"
          />
        </div>

        <p v-if="errorMsg" class="text-danger small mb-2">{{ errorMsg }}</p>
        <button type="submit" class="signup-btn" :disabled="loading">
          {{ loading ? '처리 중...' : '가입하기' }}
        </button>
      </form>

      <div class="signup-footer">
        <p>이미 계정이 있으신가요? <RouterLink :to="{name : 'login'}">로그인하기</RouterLink></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { signup } from '@/api/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({
  loginUserId: '',
  email: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  name: '',
  role: 'GENERAL'
})

const loading = ref(false)
const errorMsg = ref('')

const fields = [
  { key: 'loginUserId', label: '아이디', type: 'text', placeholder: '아이디를 입력하세요' },
  { key: 'email', label: '이메일', type: 'email', placeholder: '이메일 주소를 입력하세요' },
  { key: 'password', label: '비밀번호', type: 'password', placeholder: '비밀번호를 입력하세요' },
  { key: 'confirmPassword', label: '비밀번호 확인', type: 'password', placeholder: '비밀번호를 다시 입력하세요' },
  { key: 'nickname', label: '닉네임', type: 'text', placeholder: '사용할 닉네임을 입력하세요' },
  { key: 'name', label: '이름', type: 'text', placeholder: '실명을 입력하세요' },
]

const submit = async (e) => {
  e.preventDefault()
  errorMsg.value = ''
  if (form.password !== form.confirmPassword) {
    errorMsg.value = '비밀번호 확인이 일치하지 않습니다.'
    return
  }
  loading.value = true
  try {
    const { confirmPassword, ...signupData } = form
    await signup(signupData)
    alert('회원가입 완료! 로그인 해주세요')
    router.push({ name: 'login' })
  } catch (err) {
    errorMsg.value = err.response?.data?.message || '회원가입 실패'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.signup-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f6fa;
  padding: 2rem;
}

.signup-card {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 2.5rem 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 420px;
  width: 100%;
}

.signup-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.signup-header h2 {
  font-weight: 600;
  margin-top: 0.5rem;
}

.signup-form .form-group {
  margin-bottom: 1.2rem;
}

.signup-form label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.4rem;
  font-size: 0.95rem;
}

.signup-form input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

.signup-btn {
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

.signup-btn:hover {
  background-color: #2563eb;
}

.signup-footer {
  text-align: center;
  margin-top: 1.8rem;
  font-size: 0.9rem;
}

.signup-footer a {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}
</style>
