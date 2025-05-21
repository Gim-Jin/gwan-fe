<!-- SurveyStep2.vue -->
<template>
  <div class="survey-card">
    <p class="step-indicator">Step 2 of 4</p>
    <h2 class="title">생활 습관</h2>

    <form class="form">
      <input v-model="formData.sleep" type="number" placeholder="수면 시간 (시간 단위)" />
      <input v-model="formData.activity" type="text" placeholder="일상 활동 (예: 컴퓨터 12시간)" />
      <input v-model="formData.workout" type="text" placeholder="운동 경험 (예: 웨이트 주 4~5회)" />
      <select v-model="formData.prefer">
        <option disabled value="">운동 선호 여부</option>
        <option>있음</option>
        <option>없음</option>
      </select>
    </form>

    <div class="btn-group">
      <button @click="$emit('prev')">이전</button>
      <button @click="$emit('next', formData)">다음</button>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'

export default {
  setup() {
    const formData = reactive({
      sleep: '',
      activity: '',
      workout: '',
      prefer: ''
    })

    return {
      formData
    }
  }
}
</script>

<style scoped>
@import './survey-styles.css';
</style>


