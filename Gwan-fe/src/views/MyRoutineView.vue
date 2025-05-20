<template>
  <section class="my-routine">
    <div class="container mt-5">
      <h1 class="mb-4 fw-bold">나의 루틴</h1>

      <!-- 루틴 목록 -->
      <div v-for="routine in routines" :key="routine.id" class="card mb-4 shadow-sm p-3">
        <h4 class="fw-bold">{{ routine.title }}</h4>
        <p class="text-muted">{{ routine.description }}</p>
        <p><strong>주기:</strong> {{ routine.cron }}</p>

        <ul class="list-group list-group-flush">
          <li class="list-group-item" v-for="exercise in routine.exercises" :key="exercise.id">
            🏋️ {{ exercise.name }} (레벨 {{ exercise.level }})
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// 더미 데이터 (DB 기준 맞춰서)
const routines = ref([
  {
    id: 1,
    title: '상체 강화 루틴',
    description: '팔, 어깨 위주 루틴',
    cron: '7일 반복',
    exercises: [
      { id: 101, name: '푸쉬업', level: 2 },
      { id: 102, name: '숄더프레스', level: 3 },
    ],
  },
  {
    id: 2,
    title: '하체 강화 루틴',
    description: '고관절, 햄스트링 위주 루틴',
    cron: '3일 반복',
    exercises: [
      { id: 201, name: '스쿼트', level: 3 },
      { id: 202, name: '런지', level: 2 },
    ],
  },
])
</script>

<style scoped>
.my-routine {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding-bottom: 5rem;
}
</style>
