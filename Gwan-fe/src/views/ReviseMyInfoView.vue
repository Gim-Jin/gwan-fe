<template>
  <div class="container my-5">
    <h2 class="mb-4">내 정보 수정</h2>
    <form @submit.prevent="onSubmit" class="info-form">
      <div class="form-group">
        <label>아이디</label>
        <input v-model="form.loginId" disabled class="disabled-input" />
      </div>
      <div class="form-group">
        <label>이메일</label>
        <input v-model="form.email" disabled class="disabled-input" />
      </div>
      <div class="form-group">
        <label>이름</label>
        <input v-model="form.name" disabled class="disabled-input" />
      </div>
      <div class="form-group">
        <input type="hidden" v-model="form.role" disabled class="disabled-input" />
      </div>
      <div class="form-group">
        <label>닉네임</label>
        <input v-model="form.nickname" required />
      </div>
      <div class="form-group">
        <label>비밀번호</label>
        <input v-model="form.password" type="password" placeholder="비밀번호를 입력하세요" required />
      </div>
      <div class="form-group">
        <label>비밀번호 확인</label>
        <input v-model="form.confirmPassword" type="password" placeholder="비밀번호를 다시 입력하세요" required />
      </div>
      <button type="submit" class="btn btn-primary">수정</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  loginId: '',
  email: '',
  name: '',
  nickname: '',
  password: '',
  confirmPassword: '',
  role: ''
})
let userId = null

onMounted(async () => {
  const res = await api.get('/api/user')
  const data = res.data.data
  form.value = {
    loginId: data.loginId,
    email: data.email,
    name: data.name,
    nickname: data.nickname,
    password: '',
    confirmPassword: '',
    role: data.role
  }
  userId = data.userId // 내부 저장, 화면 노출 X
})

const onSubmit = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }
  await api.put('/api/user', {
    nickname: form.value.nickname,
    loginId: form.value.loginId,
    email: form.value.email,
    password: form.value.password,
    role: form.value.role
  })
  alert('수정 완료!')
  router.push('/mypage')
}
</script>

<style scoped>
.disabled-input {
  background: #f5f5f5;
  color: #aaa;
  cursor: not-allowed;
}
.info-form {
  max-width: 400px;
  margin: 0 auto;
}
.form-group {
  margin-bottom: 1.2rem;
}
label {
  font-weight: 500;
  margin-bottom: 0.3rem;
  display: block;
}
input {
  width: 100%;
  padding: 0.7rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}
.btn-primary {
  width: 100%;
  padding: 0.8rem;
  font-size: 1.1rem;
  border-radius: 8px;
  background-color: #FF8A65;
  color: white;
  border: none;
  font-weight: 600;
  margin-top: 1rem;
}
</style>