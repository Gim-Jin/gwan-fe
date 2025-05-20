<template>
  <div class="signup-wrapper">
    <div class="signup-card">
      <div class="signup-header">
        <i class="bi bi-person-plus" style="font-size: 2rem; color: #3b82f6;"></i>
        <h2>회원가입</h2>
      </div>

      <form class="signup-form">
        <div class="form-group">
          <label for="loginId">아이디</label>
          <input type="text" id="loginId" placeholder="아이디를 입력하세요" />
        </div>

        <div class="form-group">
          <label for="email">이메일</label>
          <input type="email" id="email" placeholder="이메일 주소를 입력하세요" />
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
          <input type="text" id="nickname" placeholder="사용할 닉네임을 입력하세요" />
        </div>

        <div class="form-group">
          <label for="name">이름</label>
          <input type="text" id="name" placeholder="실명을 입력하세요" />
        </div>

        <div class="form-group">
          <label for="age">나이</label>
          <input type="number" id="age" placeholder="나이를 입력하세요" />
        </div>

        <button type="submit" class="signup-btn">가입하기</button>
      </form>

      <div class="signup-footer">
        <p>이미 계정이 있으신가요? <RouterLink :to="{name : 'login'}">로그인하기</RouterLink></p>
      </div>
    </div>
  </div>
</template>

<script setup>

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
