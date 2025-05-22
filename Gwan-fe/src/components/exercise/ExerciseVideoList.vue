<template>
  <section>
  <h1 class="section-title" style="margin-left:10rem; margin-top:5rem;">전체 영상</h1>
  
  <div class="container px-1 my-5">
    
    <div class="d-flex justify-content-center">
      <div class="row row-cols-1 row-cols-md-3 gx-5 gy-5" style="max-width: 900px; width: 100%;">
        <div class="col" v-for="video in exerciseVideoList" :key="video.exerciseVideoId">
          <ExerciseThumbnailCard :video="video" />
        </div>
      </div>
    </div>

    <div style="height: 80px;"></div>
  </div>
  </section>
</template>


<script setup>
import { onMounted } from 'vue';
import ExerciseThumbnailCard from './ExerciseThumbnailCard.vue';
import { useExerciseVideoStore } from '@/stores/exerciseVideoStore';

const exerciseVideoStore = useExerciseVideoStore();
const { exerciseVideoList, getAllExerciseVideoList } = exerciseVideoStore;

onMounted(() => {
  getAllExerciseVideoList();
});

</script>

<style scoped>

</style>