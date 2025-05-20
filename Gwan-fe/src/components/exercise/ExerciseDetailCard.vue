<template>
  <div class="exercise-detail container my-5">
    <h2 class="mb-4">영상 상세보기</h2>

    <div class="card shadow-sm p-4 rounded-4 border-0">
      <div class="text-center mb-4">
        <iframe
          class="video-frame"
          :src="`https://www.youtube.com/embed/${video.youtubeId}`"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>

      <div class="video-content">
        <h4 class="fw-bold">{{ video.title }}</h4>
        <p class="text-primary fw-semibold mb-2">{{ video.targetName }}</p>
        <p class="text-muted">{{ video.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 💡 임시 데이터 (실제 상황에서는 prop 또는 API로 받을 것)
const video = ref({
  exerciseVideoId: 1,
  userId: 1,
  title: '전신 다이어트 최고의 운동 [칼소폭 찐 핵핵매운맛]',
  url: 'https://youtu.be/Kl9Dmx86Z0Q',
  youtubeId: 'Kl9Dmx86Z0Q',
  description: '전신 다이어트 최고의 운동 [칼소폭 찐 핵핵매운맛]의 상세 설명',
  createdAt: '2025-01-01',
  updatedAt: '2025-01-01',
  targetName: '전신',
})
</script>

<style scoped>
.exercise-detail {
  max-width: 800px;
  margin: 0 auto;
}

.video-frame {
  width: 100%;
  max-width: 640px;
  height: 360px;
  border-radius: 1rem;
}

.video-content {
  text-align: center;
}

.card {
  background-color: #ffffff;
}
</style>
