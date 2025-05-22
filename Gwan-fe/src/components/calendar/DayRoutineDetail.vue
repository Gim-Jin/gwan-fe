<template>
  <div class="detail-wrapper">
    <div class="detail-header">
      <h3>
        <i class="bi bi-calendar2-week"></i>
        {{ dayLabel }} ({{ formattedDate }}) 운동 루틴
      </h3>
      <button class="btn-close" @click="$emit('close')">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <div v-if="hasExercises" class="exercise-list">
      <RoutineCard
        v-for="(exercise, idx) in routine.exercises"
        :key="idx"
        :exercise="exercise"
      />
    </div>

    <div v-else class="rest-message">
      <i class="bi bi-emoji-smile"></i>
      <p>오늘은 휴식일입니다. 충분한 휴식을 취하세요!</p>
    </div>

    <div class="detail-actions" v-if="hasExercises">
      <button class="btn-primary" @click="$emit('complete')">
        <i class="bi bi-check-circle-fill"></i> 완료하기
      </button>
      <button class="btn-outline" @click="$emit('reschedule')">
        <i class="bi bi-arrow-clockwise"></i> 일정 변경
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import RoutineCard from './RoutineCard.vue'

const props = defineProps({
  routine: {
    type: Object,
    required: true
  }
})

const hasExercises = computed(() => props.routine.exercises && props.routine.exercises.length)

const dayLabel = props.routine.day || '오늘'

const formattedDate = (() => {
  if (!props.routine.date) return ''
  const d = new Date(props.routine.date)
  return `${d.getMonth() + 1}월 ${d.getDate()}일`
})()
</script>

<style scoped>
.detail-wrapper {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
}

.detail-header h3 {
  margin: 0;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #1c1c1c;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
}
.btn-close:hover {
  color: #000;
}

.exercise-list {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 0.3rem;
}

.rest-message {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
  font-size: 1rem;
}
.rest-message i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #5cdb95;
}

.detail-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-primary {
  flex: 1;
  background-color: #365fff;
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}
.btn-primary:hover {
  background-color: #2647d6;
}

.btn-outline {
  flex: 1;
  background-color: transparent;
  color: #555;
  border: 2px solid #ccc;
  padding: 0.8rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.2s, border-color 0.2s;
}
.btn-outline:hover {
  background-color: #f5f5f5;
  border-color: #999;
}
</style> 