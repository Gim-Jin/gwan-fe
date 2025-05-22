<template>
  <header class="header">
    <h1 class="logo">SSAFIT</h1>
    <nav class="nav-menu">
      <RouterLink :to="{name : 'home'}"><i class="bi bi-house text-primary icon-large"></i> 홈</RouterLink>
      <RouterLink :to="{name : 'exercises'}"><i class="bi bi-lightning-charge text-danger icon-large"></i> 운동</RouterLink>
      <a href="/board"><i class="bi bi-people text-success icon-large"></i> 커뮤니티</a>
      <RouterLink :to="{name : 'myRoutine'}"><i class="bi bi-trophy text-warning icon-large"></i> 나의 루틴</RouterLink>
    </nav>
    <div class="nav-actions">
      <button @click="search"><i class="bi bi-search text-info icon-large"></i></button>
      <RouterLink :to="{name : 'mypage'}">마이페이지</RouterLink>
      <RouterLink :to="{name : 'login'}">로그아웃</RouterLink>
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
