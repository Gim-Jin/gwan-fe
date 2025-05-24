<template>
  <section class="popular-section py-5 bg-white">
    <div class="container">
      <h1 class="section-title fw-bold mb-4">인기 영상</h1>

      <!-- 모든 영상 보기 버튼 -->
      <div class="d-flex justify-content-end mb-4">
        <RouterLink :to="{ name: 'exercises' }" class="btn btn-outline-primary">
          모든 영상 보기
        </RouterLink>
      </div>

      <!-- 인기 영상 그리드 -->
      <div class="row row-cols-1 row-cols-md-3 gx-5 gy-5">
        <div class="col" v-for="video in videoStore.rankedVideoList" :key="video.exerciseVideoId">
          <ExerciseThumbnailCard :video="video" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import ExerciseThumbnailCard from '@/components/exercise/ExerciseThumbnailCard.vue'
import { useExerciseVideoStore } from '@/stores/exerciseVideoStore'

const videoStore = useExerciseVideoStore()

onMounted(() => {
  videoStore.getRankedExerciseVideoList()
})

// const videos = ref([
//     {
//         exerciseVideoId : 1,
//         userId : 1,
//         title : "그만하고싶어",
//         url : "https://youtu.be/Kl9Dmx86Z0Q?si=_yqY4ZeT1L0Xuc2X",
//         youtubeId : "Kl9Dmx86Z0Q",
//         description : "짱 힘듦",
//         createdAt : "2025-01-01",
//         updatedAt : "205-01-01",
//         targetName : "팔뚝",
//     },
//     {
//         exerciseVideoId : 1,
//         userId : 1,
//         title : "그만하고싶어",
//         url : "https://youtu.be/Kl9Dmx86Z0Q?si=_yqY4ZeT1L0Xuc2X",
//         youtubeId : "Kl9Dmx86Z0Q",
//         description : "짱 힘듦",
//         createdAt : "2025-01-01",
//         updatedAt : "205-01-01",
//         targetName : "팔뚝",
//     },
//     {
//         exerciseVideoId : 1,
//         userId : 1,
//         title : "그만하고싶어",
//         url : "https://youtu.be/Kl9Dmx86Z0Q?si=_yqY4ZeT1L0Xuc2X",
//         youtubeId : "Kl9Dmx86Z0Q",
//         description : "짱 힘듦",
//         createdAt : "2025-01-01",
//         updatedAt : "205-01-01",
//         targetName : "팔뚝",
//     },
//     {
//         exerciseVideoId : 1,
//         userId : 1,
//         title : "그만하고싶어",
//         url : "https://youtu.be/Kl9Dmx86Z0Q?si=_yqY4ZeT1L0Xuc2X",
//         youtubeId : "Kl9Dmx86Z0Q",
//         description : "짱 힘듦",
//         createdAt : "2025-01-01",
//         updatedAt : "205-01-01",
//         targetName : "팔뚝",
//     },
//     {
//         exerciseVideoId : 1,
//         userId : 1,
//         title : "그만하고싶어",
//         url : "https://youtu.be/Kl9Dmx86Z0Q?si=_yqY4ZeT1L0Xuc2X",
//         youtubeId : "Kl9Dmx86Z0Q",
//         description : "짱 힘듦",
//         createdAt : "2025-01-01",
//         updatedAt : "205-01-01",
//         targetName : "팔뚝",
//     },
    
// ])

</script>

<style scoped>
.popular-section {
  background-color: #ffffff;
}
.section-title {
  font-size: 2rem;
}
</style>