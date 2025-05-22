<template>
  <header class="header">
    <div class="header-left">
      <h1 class="logo">SSAFIT</h1>
      <nav class="nav-menu">
        <RouterLink :to="{name : 'home'}"><i class="bi bi-house text-primary icon-large"></i> 홈</RouterLink>
        <RouterLink :to="{name : 'exercises'}"><i class="bi bi-lightning-charge text-danger icon-large"></i> 운동</RouterLink>
        <a href="/board"><i class="bi bi-people text-success icon-large"></i> 커뮤니티</a>
        <RouterLink :to="{name : 'myRoutine'}"><i class="bi bi-trophy text-warning icon-large"></i> 나의 루틴</RouterLink>
      </nav>
    </div>

    <div class="header-right">
      <input class="search-input" type="text" placeholder="운동을 검색해보세요" />
      <RouterLink :to="{name : 'signup'}"><i class="bi bi-person text-primary icon-large"></i> 회원가입</RouterLink>
      <RouterLink :to="{name : 'login'}"><i class="bi bi-key text-info icon-large"></i> 로그인</RouterLink>
    </div>
  </header>
</template>


<script setup>
function search() {
  alert('검색 기능은 아직 구현되지 않았습니다.')
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
.search-input {
  padding: 0.4rem 1rem;
  width: clamp(120px, 20vw, 280px); /* 최소 120px, 최대 280px, 기준은 20vw */
  border-radius: 20px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 0.9rem;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: #3b82f6;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 1rem;
  color: #1c1c1c;
}

.nav-menu {
  display: flex;
  gap: 1.2rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

a {
  text-decoration: none;
  color: #333;
}

button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.main-content {
  margin-top: 5rem;
}
.search-input {
  padding: 0.5rem 1rem;
  width: 250px;
  border-radius: 20px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 0.9rem;
}

.icon-large {
  font-size: 1.3rem;
  vertical-align: middle;
  margin-right: 0.2rem;
}

/* 부트스트랩 색상 클래스가 없는 경우를 대비한 커스텀 색상 */
.text-primary {
  color: #0d6efd;
}

.text-danger {
  color: #dc3545;
}

.text-success {
  color: #198754;
}

.text-warning {
  color: #ffc107;
}

.text-info {
  color: #0dcaf0;
}
</style>
