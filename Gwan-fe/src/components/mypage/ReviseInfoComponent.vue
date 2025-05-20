<template>
  <div class="revise-wrapper">
    <div class="revise-card">
      <div class="revise-header">
        <i class="bi bi-lightning" style="font-size: 2rem; color: #3b82f6;"></i>
        <h2>내 정보 수정</h2>
      </div>

      <form class="revise-form">
        <div class="form-group">
          <label for="loginId">아이디</label>
          <input type="text" id="loginId" placeholder="아이디를 입력하세요" v-model="user.loginId" readonly />
        </div>

        <div class="form-group">
          <label for="email">이메일</label>
          <input type="email" id="email" placeholder="이메일 주소를 입력하세요" v-model="user.email" />
        </div>

        <div class="form-group">
          <label for="password">비밀번호</label>
          <input type="password" id="password" placeholder="비밀번호를 입력하세요" />
        </div>

        <div class="form-group">
          <label for="confirmPassword">비밀번호 확인</label>
          <input type="password" id="confirmPassword" placeholder="비밀번호를 다시 입력하세요" />
        </div>

        <div class="form-group">
          <label for="nickname">닉네임</label>
          <input type="text" id="nickname" placeholder="사용할 닉네임을 입력하세요" v-model="user.nickname" />
        </div>

        <div class="form-group">
          <label for="name">이름</label>
          <input type="text" id="name" placeholder="실명을 입력하세요" v-model="user.name" readonly />
        </div>

        <div class="form-group">
          <label for="age">나이</label>
          <input type="number" id="age" placeholder="나이를 입력하세요" readonly />
        </div>

        <button type="submit" class="revise-btn" >수정하기</button>
      </form>

    </div>
  </div>
</template>

<script setup>


import { ref } from 'vue';

const user = ref({
  loginId : 'hope0514',
  nickname: 'HopeKim',
  name: '김희망',
  email: 'minsu@ssafit.com',
  exerciseCount: 24,
  commentCount: 8
})


</script>

<style scoped>
.revise-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f6fa;
  padding: 2rem;
}

.revise-card {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 2.5rem 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 420px;
  width: 100%;
}

.revise-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.revise-header h2 {
  font-weight: 600;
  margin-top: 0.5rem;
}

.revise-form .form-group {
  margin-bottom: 1.2rem;
}

.revise-form label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.4rem;
  font-size: 0.95rem;
}

.revise-form input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

.revise-btn {
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

.revise-btn:hover {
  background-color: #2563eb;
}

.revise-footer {
  text-align: center;
  margin-top: 1.8rem;
  font-size: 0.9rem;
}

.revise-footer a {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}
</style>
