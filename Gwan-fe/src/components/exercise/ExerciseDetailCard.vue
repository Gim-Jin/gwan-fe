<template>
  <div class="exercise-detail container my-5">
    <h2 class="mb-4 d-flex justify-content-between align-items-center">
      영상 상세보기
      <div class="d-flex align-items-center gap-2">
        <button class="btn-like" @click="toggleLike" :aria-pressed="likeStore.isLiked.toString()">
          <i :class="likeStore.isLiked ? 'bi bi-heart-fill text-danger' : 'bi bi-heart'" class="like-icon"></i>
        </button>
        <template v-if="isPrescriber">
          <button class="btn btn-outline-warning btn-sm" @click="showEditModal = true">수정</button>
          <button class="btn btn-outline-danger btn-sm" @click="handleDelete">삭제</button>
        </template>
      </div>
    </h2>
    <ExerciseVideoEditModal v-if="showEditModal" @close="showEditModal = false" @refresh="refreshDetail" :video="exerciseVideoStore.exerciseVideo" />

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
import { useLikeStore } from '@/stores/likeStore';

import { useAuthStore } from '@/stores/auth';
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import ExerciseVideoEditModal from './ExerciseVideoEditModal.vue';

const route = useRoute();
const exerciseVideoStore = useExerciseVideoStore();
const likeStore = useLikeStore();

const authStore = useAuthStore();
const router = useRouter();

const showEditModal = ref(false);
const isPrescriber = computed(() => authStore.user?.role === 'PRESCRIBER');

onMounted(async () => {
  // 사용자 정보 초기화
  if (!authStore.user) {
    await authStore.initialize();
  }
  
  const videoId = route.params.id;
  await exerciseVideoStore.getVideoDetailInfo(videoId);
  
  // 로그인된 사용자만 좋아요 상태 확인
  if (authStore.isAuthenticated) {
    await likeStore.checkLike(videoId);
  }
});

const toggleLike = async () => {
  // 로그인 체크
  if (!authStore.isAuthenticated) {
    alert('로그인 후 좋아요를 누를 수 있습니다.');
    return;
  }

  try {
    const videoId = route.params.id;
    await likeStore.toggleLike(videoId);
  } catch (error) {
    if (error.message === '로그인이 필요합니다.') {
      alert('로그인 후 좋아요를 누를 수 있습니다.');
    } else {
      console.error('좋아요 처리 중 오류가 발생했습니다:', error);
    }
  }
};

const handleDelete = async () => {
  if (!confirm('정말로 이 영상을 삭제하시겠습니까?')) return;
  try {
    await exerciseVideoStore.deleteExerciseVideo(exerciseVideoStore.exerciseVideo.exerciseVideoId);
    alert('삭제되었습니다.');
    await router.push('/exercises');
  } catch (e) {
    alert('삭제에 실패했습니다.');
  }
};

const refreshDetail = async () => {
  await exerciseVideoStore.getVideoDetailInfo(route.params.id);
};
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
