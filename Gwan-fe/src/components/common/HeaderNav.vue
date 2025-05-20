<template>
  <header class="header">
    <h1 class="logo">SSAFIT</h1>
    <nav class="nav-menu">
      <RouterLink :to="{name : 'home'}">🏠 홈</RouterLink>
      <RouterLink :to="{name : 'exercises'}">💪 운동</RouterLink>
      <a href="/board">👥 커뮤니티</a>
      <RouterLink :to="{name : 'myRoutine'}">🏋🏿 나의 루틴</RouterLink>
    </nav>
    <div class="nav-actions">
      <button @click="search">🔍</button>
      <RouterLink :to="{name : 'signup'}">👤회원가입</RouterLink>
      <RouterLink :to="{name : 'login'}">🔑 로그인</RouterLink>
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

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-menu {
  display: flex;
  gap: 1.5rem;
}

.nav-actions {
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
  margin-top: 4rem; /* 헤더 높이만큼 여백 추가 */
}
</style>
