<template>
  <section class="bg-light">  
  <div class="container py-5">
    <h1 class="fw-bold fs-1 mb-4 text-center">HOT 카테고리 🔥</h1>
    <div class="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-4">
      <div class="col" v-for="target in targetStore.targetList" :key="target.targetId">
        <CategoryCard :target="target" />
      </div>
    </div>
  </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import CategoryCard from './CategoryCard.vue'
import { useTargetStore } from '@/stores/category'

const targetStore = useTargetStore();

onMounted(() => {
  targetStore.getRankedTargetList();
})


// const targets = ref([
//   { targetId: 1, name: '팔꿈치' },
//   { targetId: 2, name: '무릎' },
//   { targetId: 3, name: '목' },
//   { targetId: 4, name: '코어' },
//   { targetId: 5, name: '스트레칭' },
// ])
</script>

<style scoped></style>