<template>
  <div class="survey-card">
    <p class="step-indicator">Step 2 of 4</p>
    <h2 class="title">기본 정보</h2>

    <form class="form">
      <input v-model="formData.age" type="number" placeholder="나이를 입력하세요" />
      <input v-model="formData.height" type="number" placeholder="키를 입력하세요 (cm)" />
      <input v-model="formData.weight" type="number" placeholder="몸무게를 입력하세요 (kg)" />
      <div class="radio-group">
        <label>
          <input type="radio" value="남성" v-model="formData.gender" />
          남성
        </label>
        <label>
          <input type="radio" value="여성" v-model="formData.gender" />
          여성
        </label>
      </div>
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
.radio-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
</style>

