<template>
  <section class="community-section position-relative text-dark">
    <!-- 배경 어둡게 처리 -->
    <div class="overlay position-absolute w-100 h-100"></div>

    <!-- 콘텐츠 -->
    <div class="content position-relative py-5" style="margin-left:10rem;">
      <div class="col-lg-6">
        <h2 class="fw-bold mb-2">커뮤니티</h2>
        <p class="lead mb-4">커뮤니티에 대한 소개</p>
        <ul class="mb-4 fs-6">
          <li>치료 후기와 팁 공유</li>
          <li>함께하는 챌린지</li>
          <li>효과적인 운동 찾기</li>
          <li>건강한 생활 습관 형성</li>
        </ul>
        <RouterLink :to="{name : 'article'}" class="btn btn-primary btn-lg">커뮤니티 방문하기</RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
// 별도 script 없음
</script>

<style scoped>
.community-section {
  background-image: url('@/assets/community-banner.jpg'); /* 실제 배경 이미지 경로로 교체 */
  background-size: cover;
  background-position: center;
  height: 41vh;
  position: relative;
  overflow: hidden;
}

.overlay {
  background-color: rgba(255, 255, 255, 0.75); /* 밝은 오버레이 */
  z-index: 1;
}

.content {
  z-index: 2;
}
</style>
