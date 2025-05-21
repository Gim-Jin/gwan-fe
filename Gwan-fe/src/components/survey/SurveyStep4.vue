<!-- SurveyStep4.vue -->
<template>
  <div class="survey-card">
    <p class="step-indicator">Step 4 of 4</p>
    <h2 class="title">통증 정보</h2>

    <form class="form">
      <input v-model="formData.area" type="text" placeholder="통증 부위 (예: 오른쪽 팔꿈치)" />
      <input v-model="formData.intensity" type="text" placeholder="통증 강도 (예: 평소 5점, 심할 때 7점)" />
      <input v-model="formData.pattern" type="text" placeholder="통증 양상 (예: 시큰거림)" />
      <input v-model="formData.condition" type="text" placeholder="통증 발생 조건 (예: 장시간 컴퓨터 사용)" />
      <input v-model="formData.start" type="text" placeholder="통증 시작 시점 (예: 3개월 전부터)" />
    </form>

    <div class="btn-group">
      <button @click="$emit('prev')">이전</button>
      <button @click="$emit('next', formData)">완료</button>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'

export default {
  setup() {
    const formData = reactive({
      area: '',
      intensity: '',
      pattern: '',
      condition: '',
      start: ''
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
