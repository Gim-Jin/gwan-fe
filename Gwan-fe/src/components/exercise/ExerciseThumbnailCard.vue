<template>
  <div class="card video-card shadow-sm border-0">
    <img
      class="card-img-top"
      :src="`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`"
      :alt="video.title"
    />
    <div class="card-body d-flex flex-column justify-content-between">
      <div>
        <h5 class="card-title">{{ video.title }}</h5>
        <p class="card-text small text-muted">{{ video.targetName }}</p>
      </div>
      <a :href="video.url" target="_blank" class="btn btn-primary btn-sm mt-3">영상 보기</a>
    </div>
  </div>
</template>

<script setup>
defineProps({
  video: Object,
})
</script>

<style scoped>
.video-card {
  height: 100%;
  max-height: 420px; /* ✅ 카드 세로 충분히 확보 */
  border-radius: 1rem;
  overflow: hidden;
  position: relative;
  margin-bottom: 3rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.video-card:hover {
  transform: translateY(-4px);
  z-index: 2;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.1);
}

.card-img-top {
  height: 210px; /* ✅ 이미지 세로 더 길게 */
  object-fit: cover;
}

.card-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.card-text {
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 0.75rem;
}

.btn {
  font-size: 0.9rem;
  padding: 0.4rem 0.75rem;
  border-radius: 0.5rem;
}
</style>
