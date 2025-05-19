<template>
  <footer class="footer">
    <div class="footer-top">
      <div class="footer-logo">
        <h2>SSAFIT</h2>
        <p>건강한 개발자 생활을 위한 운동 플랫폼</p>
      </div>
      <div class="footer-links">
        <div>
          <h3>바로가기</h3>
          <ul>
            <li><a href="/">홈</a></li>
            <li><a href="/exercise">운동 영상</a></li>
            <li><a href="/board">커뮤니티</a></li>
            <li><a href="#">자주 묻는 질문</a></li>
            <li><a href="#">개인정보처리방침</a></li>
          </ul>
        </div>
        <div>
          <h3>소셜 미디어</h3>
          <ul>
            <li>📍 대전광역시 유성구 덕명동 124</li>
            <li>📧 contact@ssafit.com</li>
            <li>📞 1234-5678</li>
          </ul>
          <form @submit.prevent="subscribe">
            <input v-model="email" type="email" placeholder="이메일 주소" />
            <button>구독</button>
          </form>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>Figam | Brainstorming | Online whiteboard | Team collaboration</p>
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
.footer { padding: 2rem; background: #f5f5f5; color: #333; }
.footer-top { display: flex; justify-content: space-between; flex-wrap: wrap; }
.footer-logo h2 { margin: 0 0 0.5rem 0; }
.footer-links { display: flex; gap: 2rem; }
.footer-links h3 { margin-bottom: 0.5rem; }
.footer-links ul { list-style: none; padding: 0; }
.footer-links li { margin-bottom: 0.3rem; }
form { margin-top: 1rem; display: flex; gap: 0.5rem; }
input { padding: 0.5rem; flex: 1; }
button { padding: 0.5rem 1rem; }
.footer-bottom { margin-top: 2rem; text-align: center; font-size: 0.875rem; }
</style>
