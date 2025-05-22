<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="m-0">운동 루틴</h5>

      <div class="btn-group">
        <button
          class="btn"
          :class="sortOrder === 'new' ? 'btn-primary' : 'btn-outline-secondary'"
          @click="sortOrder = 'new'"
        >최신순</button>
        <button
          class="btn"
          :class="sortOrder === 'old' ? 'btn-primary' : 'btn-outline-secondary'"
          @click="sortOrder = 'old'"
        >오래된순</button>
      </div>
    </div>

    <div
      v-for="routine in sortedRoutines"
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
        <span class="small text-muted">{{ routine.createdAt }}</span>
      </div>

      <!-- 아코디언 내용 -->
      <div v-if="expandedId === routine.id" class="p-3">
        <ul class="list-group">
          <li
            v-for="exercise in routine.exercises"
            :key="exercise.name"
            class="list-group-item d-flex align-items-center"
          >
            <input type="checkbox" class="form-check-input me-2" disabled />
            <div>
              {{ exercise.name }}
              <span class="text-muted small">
                ({{ exercise.sets }}세트 × {{ exercise.reps }}회)
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const expandedId = ref(null)
const sortOrder = ref('new') // 'new' or 'old'

const toggle = (id) => {
  expandedId.value = expandedId.value === id ? null : id
}

const routines = ref([
  {
    id: 3,
    title: '6주 코어 안정화 프로그램',
    progress: 30,
    createdAt: '2025-05-30',
    exercises: [
      { name: '버드독', sets: 3, reps: 12 },
      { name: '데드버그', sets: 3, reps: 12 },
      { name: '사이드 플랭크', sets: 3, reps: 30 },
    ],
  },
  {
    id: 2,
    title: '3주 어깨 재활 루틴',
    progress: 80,
    createdAt: '2025-05-15',
    exercises: [
      { name: '밴드 외회전', sets: 4, reps: 15 },
      { name: 'Y-T-W', sets: 3, reps: 12 },
      { name: '어깨 스트레칭', sets: 3, reps: 30 },
    ],
  },
  {
    id: 1,
    title: '4주 거북목 치료 루틴',
    progress: 60,
    createdAt: '2025-04-28',
    exercises: [
      { name: '목 신전 스트레칭', sets: 3, reps: 30 },
      { name: '턱 당기기', sets: 4, reps: 15 },
      { name: '흉추 롤링', sets: 3, reps: 12 },
    ],
  }
])

const sortedRoutines = computed(() => {
  return [...routines.value].sort((a, b) => {
    const da = new Date(a.createdAt)
    const db = new Date(b.createdAt)
    return sortOrder.value === 'new' ? db - da : da - db
  })
})
</script>

<style scoped>
.btn {
  min-width: 96px;
}
</style>