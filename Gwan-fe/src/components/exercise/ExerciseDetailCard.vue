<template>
  <div class="exercise-detail container my-5">
    <h2 class="mb-4 d-flex justify-content-between align-items-center">
      영상 상세보기
      <button class="btn-like" @click="toggleLike" :aria-pressed="isLiked.toString()">
        <i :class="isLiked ? 'bi bi-heart-fill text-danger' : 'bi bi-heart'" class="like-icon"></i>
      </button>
    </h2>

    <div class="card shadow-sm p-4 rounded-4 border-0">
      <div class="text-center mb-4">
        <iframe
          class="video-frame"
          :src="`https://www.youtube.com/embed/${exerciseVideoStore.exerciseVideo.youtubeId}`"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>

      <div class="video-content">
        <h4 class="fw-bold">{{ exerciseVideoStore.exerciseVideo.title }}</h4>
        <p class="text-primary fw-semibold mb-2">{{ exerciseVideoStore.exerciseVideo.targetName }}</p>
        <p class="text-muted">{{ exerciseVideoStore.exerciseVideo.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>


import { useExerciseVideoStore } from '@/stores/exerciseVideoStore';
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router';

const route = useRoute();


const exerciseVideoStore = useExerciseVideoStore();

onMounted(() => {
  const videoId = route.params.id;// PathVariable 가져오는거임
  exerciseVideoStore.getVideoDetailInfo(videoId);
})




// 좋아요 관련된 것 같은데 일단 .... 주석처리 ㅠ
const STORAGE_KEY = 'liked_videos'
const isLiked = ref(false)

const loadLikedList = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch (e) {
    return []
  }
}


const saveLikedList = (list) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

const toggleLike = () => {
  const list = loadLikedList()
  const idx = list.indexOf(video.value.exerciseVideoId)
  if (idx === -1) {
    list.push(video.value.exerciseVideoId)
    isLiked.value = true
  } else {
    list.splice(idx, 1)
    isLiked.value = false
  }
  saveLikedList(list)
}

onMounted(() => {
  const list = loadLikedList()
  isLiked.value = list.includes(video.value.exerciseVideoId)
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

.btn-like {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0;
}

.btn-like:hover .bi-heart {
  color: #dc3545;
}

.like-icon {
  transition: color 0.2s;
}
</style>
