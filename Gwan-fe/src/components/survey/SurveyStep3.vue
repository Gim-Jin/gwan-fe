<!-- SurveyStep3.vue -->
<template>
  <div class="survey-card">
    <p class="step-indicator">Step 3 of 4</p>
    <h2 class="title">생활 습관</h2>

    <form class="form">
      <input v-model="formData.sleepHours" type="number" placeholder="수면 시간 (시간)" />
      <input v-model="formData.dailyActivity" type="text" placeholder="일상 활동 (예: 평일에 사무실에서 10시간씩 앉아있음)" />
      <input v-model="formData.exerciseExperience" type="text" placeholder="운동 경험 (예: 웨이트 주 4~5회, 수영 주 3회)" />

    </form>

    <div class="btn-group">
      <button @click="$emit('prev')">이전</button>
      <button @click="$emit('next', formData)">다음</button>
    </div>
  </div>
</template>

<script setup>
import {useSurveyStore} from '@/stores/userSurveyStore'
const {formData} = useSurveyStore();
</script>

<style scoped>
@import './survey-styles.css';
</style>


