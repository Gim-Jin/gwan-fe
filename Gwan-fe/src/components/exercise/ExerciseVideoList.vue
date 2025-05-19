<template>
  <section>
  <h1 class="section-title" style="margin-left:10rem; margin-top:5rem;">전체 영상</h1>
  
  <div class="container px-1 my-5">
    
    <div class="d-flex justify-content-center">
      <div class="row row-cols-1 row-cols-md-3 gx-5 gy-5" style="max-width: 900px; width: 100%;">
        <div class="col" v-for="video in videos" :key="video.exerciseVideoId">
          <ExerciseThumbnailCard :video="video" />
        </div>
      </div>
    </div>

    

    <div style="height: 80px;"></div>
  </div>
  </section>
</template>


<script setup>
import { ref } from 'vue';
import ExerciseThumbnailCard from './ExerciseThumbnailCard.vue';

const videos = ref([
    {
        exerciseVideoId : 1,
        userId : 1,
        title : "그만하고싶어",
        url : "https://youtu.be/Kl9Dmx86Z0Q?si=_yqY4ZeT1L0Xuc2X",
        youtubeId : "Kl9Dmx86Z0Q",
        description : "짱 힘듦",
        createdAt : "2025-01-01",
        updatedAt : "205-01-01",
        targetName : "팔뚝",
    },
    {
        exerciseVideoId : 1,
        userId : 1,
        title : "그만하고싶어",
        url : "https://youtu.be/Kl9Dmx86Z0Q?si=_yqY4ZeT1L0Xuc2X",
        youtubeId : "Kl9Dmx86Z0Q",
        description : "짱 힘듦",
        createdAt : "2025-01-01",
        updatedAt : "205-01-01",
        targetName : "팔뚝",
    },
    {
        exerciseVideoId : 1,
        userId : 1,
        title : "그만하고싶어",
        url : "https://youtu.be/Kl9Dmx86Z0Q?si=_yqY4ZeT1L0Xuc2X",
        youtubeId : "Kl9Dmx86Z0Q",
        description : "짱 힘듦",
        createdAt : "2025-01-01",
        updatedAt : "205-01-01",
        targetName : "팔뚝",
    },
    {
        exerciseVideoId : 1,
        userId : 1,
        title : "그만하고싶어",
        url : "https://youtu.be/Kl9Dmx86Z0Q?si=_yqY4ZeT1L0Xuc2X",
        youtubeId : "Kl9Dmx86Z0Q",
        description : "짱 힘듦",
        createdAt : "2025-01-01",
        updatedAt : "205-01-01",
        targetName : "팔뚝",
    },
    {
        exerciseVideoId : 1,
        userId : 1,
        title : "그만하고싶어",
        url : "https://youtu.be/Kl9Dmx86Z0Q?si=_yqY4ZeT1L0Xuc2X",
        youtubeId : "Kl9Dmx86Z0Q",
        description : "짱 힘듦",
        createdAt : "2025-01-01",
        updatedAt : "205-01-01",
        targetName : "팔뚝",
    },
    
])

</script>

<style scoped>

</style>