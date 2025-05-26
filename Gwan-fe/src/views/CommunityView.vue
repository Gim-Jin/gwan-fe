<template>
  <div class="community-wrapper">
    <div class="community-container">
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
// 커뮤니티 메인 뷰: 라우터 뷰만 렌더링
</script>

<style scoped>
.community-wrapper {
  min-height: calc(100vh - 60px); /* 헤더 높이 제외 */
  background: #f5f7fa;
  padding-top: 60px; /* 헤더 아래 여백 */
}

.community-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem 4rem; /* 상단, 측면, 하단 여백 */
  min-height: calc(100vh - 120px); /* 헤더/푸터 제외 */
}

/* 페이지 전환 애니메이션 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .community-wrapper {
    padding-top: 50px; /* 모바일 헤더 높이 */
  }
  
  .community-container {
    padding: 1.5rem 0.5rem 3rem;
  }
}
</style> 