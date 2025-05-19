<template>
  <header class="header">
    <h1 class="logo">SSAFIT</h1>
    <nav class="nav-menu">
      <a href="/">🏠 홈</a>
      <a href="/exercise">💪 운동</a>
      <a href="/board">👥 커뮤니티</a>
      <a href="#">❓ 도움말</a>
    </nav>
    <div class="nav-actions">
      <button @click="search">🔍</button>
      <a href="/register">👤회원가입</a>
      <a href="/login">🔑 로그인</a>
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
</style>
