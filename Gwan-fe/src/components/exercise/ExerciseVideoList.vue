<template>
  <section class="video-section py-5">
    <div class="container">
      <h1 class="section-title fw-bold mb-4">전체 영상</h1>

      <!-- 검색 & 필터 -->
      <ExerciseSearchBar />

      <!-- 영상 카드 그리드 -->
      <div class="row row-cols-2 row-cols-md-5 gx-4 gy-5">
        <div class="col" v-for="video in paginatedVideos" :key="video.exerciseVideoId">
          <ExerciseThumbnailCard :video="video" />
        </div>
      </div>

      <!-- 페이지네이션 -->
      <div class="d-flex justify-content-center my-4" v-if="totalPages > 1">
        <button class="btn btn-outline-primary mx-1" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">이전</button>
        <button
          v-for="page in totalPages"
          :key="page"
          class="btn"
          :class="page === currentPage ? 'btn-primary' : 'btn-outline-primary'"
          @click="goToPage(page)"
        >{{ page }}</button>
        <button class="btn btn-outline-primary mx-1" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">다음</button>
      </div>
    </div>
  </section>
</template>


<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import ExerciseThumbnailCard from './ExerciseThumbnailCard.vue';
import { useExerciseVideoStore } from '@/stores/exerciseVideoStore';
import ExerciseSearchBar from './ExerciseSearchBar.vue';
import { useRoute } from 'vue-router';

const exerciseVideoStore = useExerciseVideoStore();
const route = useRoute();

const currentPage = ref(1);
const itemsPerPage = 10;

const fetchByTarget = () => {
  const target = route.query.target;
  if (target) {
    exerciseVideoStore.searchExerciseVideos({ target });
  } else {
    exerciseVideoStore.getAllExerciseVideoList();
  }
  currentPage.value = 1; // 검색/필터 시 첫 페이지로
};

onMounted(fetchByTarget);
watch(() => route.query.target, fetchByTarget);

const paginatedVideos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return exerciseVideoStore.exerciseVideoList.slice(start, start + itemsPerPage);
});

const totalPages = computed(() =>
  Math.ceil(exerciseVideoStore.exerciseVideoList.length / itemsPerPage)
);

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
</script>

<style scoped>

</style>