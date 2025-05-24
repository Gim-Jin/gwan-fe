<template>
  <div>
    <h5 class="mb-3">찜한 영상</h5>
    <div
      v-for="video in likedVideos"
      :key="video.id"
      class="card mb-3 p-3 d-flex flex-row align-items-center"
    >
    <img
        class="me-4"
        :src="`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`"
        :alt="video.title"
        style="width: 300px; height: 200px; object-fit: cover; border-radius: 0.5rem;"
      />
      <div class="flex-grow-1">
        <h6>{{ video.title }}</h6>
        <small>{{ video.date }}</small>
      </div>
      <button class="btn btn-danger btn-sm ms-auto">찜 취소</button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useLikeStore } from '@/stores/likeStore';




// const likedVideos = [
//   { id: 1, title: '전신 운동 루틴', date: '2024-01-15' },
//   { id: 2, title: '스트레칭 가이드', date: '2024-01-14' },
//   { id: 3, title: '고관절 내회전 운동', date: '2024-01-14' },
//   { id: 3, title: '고관절 내회전 운동', date: '2024-01-14' },
// ]


const likeStore = useLikeStore();
const likedVideos = computed(() => likeStore.likedVideos);

onMounted(()=> {
  likeStore.getLikedVideos();
})
</script>