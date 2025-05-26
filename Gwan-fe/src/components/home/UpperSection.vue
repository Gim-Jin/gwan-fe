<template>
  <section class="hero-section position-relative text-white">
    <!-- 어두운 오버레이 -->
    <div class="overlay position-absolute w-100 h-100"></div>

    <!-- 텍스트 콘텐츠 -->
    <div
      class="content position-absolute top-50 start-50 translate-middle text-center"
    >
      <h1 class="fw-bold display-4 mb-3 animated-slide-fade">건강한 삶을 위한 첫 걸음</h1>
      <p class="lead mb-4 animated-slide-fade" style="animation-delay: 0.2s">MOVEWELL과 함께 운동하고 더 나은 삶을 경험하세요.</p>
      <router-link :to="{name: 'exercises'}" class="btn btn-primary btn-lg animated-btn">운동 시작하기</router-link>
    </div>
  </section>
</template>

<script setup>
// 별도 스크립트 없음
</script>

<style scoped>
.hero-section {
  background-image: url('@/assets/main-upper-banner.jpg'); /* 이미지 경로 설정 */
  background-size: cover;
  background-position: center;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.overlay {
  background: linear-gradient(rgba(255, 138, 101, 0.25), rgba(0, 0, 0, 0.6));
  z-index: 1;
}

.content {
  z-index: 2;
}

.animated-slide-fade {
  opacity: 0;
  transform: translateY(40px);
  animation: slideFadeIn 0.9s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

.animated-slide-fade[style*="animation-delay"] {
  animation-delay: 0.2s;
}

@keyframes slideFadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animated-btn {
  transition: transform 0.2s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.2s;
}
.animated-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 8px 24px rgba(255, 138, 101, 0.2);
}
</style>
