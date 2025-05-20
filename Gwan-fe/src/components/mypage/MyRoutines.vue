<template>
  <div>
    <h5 class="mb-3">운동 루틴</h5>

    <div
      v-for="routine in routines"
      :key="routine.id"
      class="mb-4 border rounded"
    >
      <!-- 아코디언 헤더 -->
      <div
        class="d-flex justify-content-between align-items-center bg-primary bg-opacity-25 p-3"
        role="button"
        @click="toggle(routine.id)"
      >
        <div class="fw-bold">
          {{ routine.title }}
          <span class="badge bg-secondary ms-2">{{ routine.progress }}% 완료</span>
        </div>
        <span>{{ expandedId === routine.id ? '▲' : '▼' }}</span>
      </div>

      <!-- 아코디언 내용 -->
      <div v-if="expandedId === routine.id" class="p-3">
        <p class="text-muted small">생성일 : {{ routine.createdAt }}</p>

        <ul class="list-group">
          <li
            v-for="exercise in routine.exercises"
            :key="exercise.name"
            class="list-group-item d-flex align-items-center"
          >
            <input type="checkbox" class="form-check-input me-2" disabled />
            <div>
              {{ exercise.name }} <span class="text-muted small">({{ exercise.sets }}세트 × {{ exercise.reps }}회)</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const expandedId = ref(null)

const toggle = (id) => {
  expandedId.value = expandedId.value === id ? null : id
}

const routines = [
  {
    id: 1,
    title: '4주 거북목 치료 루틴',
    progress: 60,
    createdAt: '2025-04-28',
    exercises: [
      { name: '스쿼트', sets: 3, reps: 12 },
      { name: '푸쉬업', sets: 4, reps: 15 },
      { name: '플랭크', sets: 3, reps: 30 },
    ],
  },
  // 다른 루틴도 추가 가능
]
</script>