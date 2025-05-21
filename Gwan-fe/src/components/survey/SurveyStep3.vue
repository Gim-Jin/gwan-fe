<!-- SurveyStep3.vue -->
<template>
  <div class="survey-card">
    <p class="step-indicator">Step 3 of 4</p>
    <h2 class="title">질환 및 수술 이력</h2>

    <textarea v-model="formData.history" placeholder="자유롭게 입력해주세요" class="textarea"></textarea>

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
      history: ''
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

