<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-column">
        <h2 class="logo-footer">MOVE<br/>WELL</h2>
        <p>건강한 개발자 생활을 위한 운동 플랫폼</p>
        <p><i class="bi bi-geo-alt text-danger icon-large"></i> 대전광역시 유성구 덕명동 124</p>
        <p><i class="bi bi-envelope text-primary icon-large"></i> contact@movewell.com</p>
        <p><i class="bi bi-telephone text-success icon-large"></i> 1588-3357</p>
      </div>

      <div class="footer-column">
        <h3>바로가기</h3>
        <ul>
          <li><RouterLink :to="{ name: 'home' }">홈</RouterLink></li>
          <li><RouterLink :to="{ name: 'exercises' }">운동 영상</RouterLink></li>
          <li><RouterLink :to="{ name: 'article' }">커뮤니티</RouterLink></li>
          <li><a href="#">자주 묻는 질문</a></li>
          <li><a href="#">개인정보처리방침</a></li>
        </ul>
      </div>

<!-- 고객 지원 섹션 추가 -->
<div class="footer-column">
  <h3>고객 지원</h3>
  <ul>
    <li><a href="#">이용약관</a></li>
    <li><a href="#">문의하기</a></li>
    <li><a href="#">버그 제보</a></li>
    <li><a href="#">채용 안내</a></li>
  </ul>
</div>


      <div class="footer-column">
        <h3>소셜 미디어</h3>
        <div class="social-icons">
          <i class="bi bi-twitter-x"></i>
          <i class="bi bi-instagram"></i>
          <i class="bi bi-youtube"></i>
          <i class="bi bi-linkedin"></i>
        </div>
        <form @submit.prevent="subscribe" class="subscribe-form">
          <input v-model="email" type="email" placeholder="이메일 주소" />
          <button type="submit">구독</button>
        </form>
      </div>
    </div>

    <div class="footer-bottom">
      <hr />
      <p>© 2025 SSAFY 13 Daejeon class 3 Kim & Jin. All Rights Reserved.</p>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')

function subscribe() {
  alert(`구독 신청 완료: ${email.value}`)
  email.value = ''
}
</script>

<style scoped>
.footer {
  background-color: var(--text-color);
  color: var(--secondary-color);
  padding: 3rem 2rem;
  font-size: 0.95rem;
}

.footer-container {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  gap: 2rem;
}

.footer-column h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.logo-footer {
  font-weight: 700;
  line-height: 1.1;
}

.footer-column .brand {
  color: #3b82f6;
  font-weight: bold;
}

.footer-column ul {
  list-style: none;
  padding: 0;
}
.footer-column li {
  margin-bottom: 0.5rem;
}
.footer-column a {
  color: var(--secondary-color);
  text-decoration: none;
}
.footer-column a:hover {
  color: var(--primary-color);
}

.social-icons {
  font-size: 1.5rem;
  display: flex;
  gap: 1rem;
  margin: 0.5rem 0 1rem;
}

.subscribe-form {
  display: flex;
  background-color: var(--secondary-color);
  border-radius: 6px;
  overflow: hidden;
  max-width: 280px;
}

.subscribe-form input {
  border: none;
  padding: 0.6rem 0.8rem;
  flex: 1 1 auto;
  font-size: 0.9rem;
}

.subscribe-form button {
  flex: 0 0 90px;
  background-color: var(--primary-color);
  color: var(--secondary-color);
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.subscribe-form button:hover {
  background-color: var(--primary-hover-color);
}

.footer-bottom {
  margin-top: 2rem;
  text-align: center;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.6);
}

hr {
  border: 0;
  border-top: 1px solid #333;
  margin-bottom: 1rem;
}

.icon-large {
  font-size: 1.3rem;
  vertical-align: middle;
  margin-right: 0.3rem;
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
