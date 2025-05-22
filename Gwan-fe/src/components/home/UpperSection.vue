<template>
  <section class="hero-section position-relative text-white">
    <!-- 어두운 오버레이 -->
    <div class="overlay position-absolute w-100 h-100"></div>

    <!-- 텍스트 콘텐츠 -->
    <div
      class="content position-absolute top-50 start-50 translate-middle text-center"
    >
      <h1 class="fw-bold display-4 mb-3">건강한 삶을 위한 첫 걸음</h1>
      <p class="lead mb-4">SSAFIT과 함께 운동하고 더 나은 삶을 경험하세요.</p>
      <router-link :to="{name: 'exercises'}" class="btn btn-primary btn-lg">운동 시작하기</router-link>
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
  background-color: rgba(0, 0, 0, 0.4); /* 어두운 반투명 레이어 */
  z-index: 1;
}

.content {
  z-index: 2;
}
</style>
