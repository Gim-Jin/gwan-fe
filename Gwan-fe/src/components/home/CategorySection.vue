<template>
  <section class="bg-light">  
  <div class="container py-5">
    <h1 class="fw-bold fs-1 mb-4 text-center">카테고리</h1>
    <div class="row row-cols-7 row-cols-md-7 row-cols-lg-7 g-4">
      <div class="col" v-for="target in targetStore.popularTargetList" :key="target.targetId">
        <CategoryCard :target="target" @click="goToTargetVideos(target)" style="cursor:pointer;" />
      </div>
    </div>
  </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import CategoryCard from './CategoryCard.vue'
import { useTargetStore } from '@/stores/targetStore';
import { useRouter } from 'vue-router';
const targetStore = useTargetStore();
const router = useRouter();

onMounted(() => {
  targetStore.fetchPopularTargets();
})

const goToTargetVideos = (target) => {
  router.push({ name: 'exercises', query: { target: target.name } })
}
</script>

<style scoped></style>