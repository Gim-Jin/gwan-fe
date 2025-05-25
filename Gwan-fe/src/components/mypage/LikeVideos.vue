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
      <button class="btn btn-danger btn-sm ms-auto" @click="removeLike(video.exerciseVideoId)">찜 취소</button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useLikeStore } from '@/stores/likeStore';

const likeStore = useLikeStore();
const likedVideos = computed(() => likeStore.likedVideos);

const removeLike = async (videoId) => {
  try {
    await likeStore.toggleLike(videoId);
    await likeStore.getLikedVideos();
  } catch (error) {
    if (error.message === '로그인이 필요합니다.') {
      alert('로그인 후 좋아요를 취소할 수 있습니다.');
    } else {
      console.error('좋아요 취소 중 오류가 발생했습니다:', error);
    }
  }
}

onMounted(()=> {
  likeStore.getLikedVideos();
})
</script>