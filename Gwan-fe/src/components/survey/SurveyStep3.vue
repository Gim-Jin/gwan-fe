<!-- SurveyStep3.vue -->
<template>
  <div class="survey-wrapper">
    <div class="survey-sidebar">
      <div class="survey-illustration">
        💪
      </div>
      <h1>건강 설문</h1>
      <p>더 나은 운동 경험을 위해 몇 가지 질문에 답해주세요</p>
    </div>
    
    <div class="survey-content">
      <div class="progress-bar-container progress-75">
        <div class="progress-bar">
          <div class="progress-bar-fill"></div>
        </div>
        <div class="progress-info">
          <span>단계 3/4</span>
          <span>75%</span>
        </div>
      </div>
      
      <div class="survey-card">
        <p class="step-indicator">생활 습관</p>
        <h2 class="title">생활 습관에 대해 알려주세요</h2>

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
    </div>
  </div>
</template>

<script setup>
import {useSurveyStore} from '@/stores/userSurveyStore'
import { onMounted } from 'vue'

const {formData} = useSurveyStore();

// 컴포넌트 마운트 시 애니메이션 트리거
onMounted(() => {
  // 약간의 지연 후 애니메이션 시작
  setTimeout(() => {
    const progressBar = document.querySelector('.progress-bar-fill');
    if (progressBar) {
      progressBar.style.width = '75%';
    }
  }, 100);
});
</script>

<style scoped>
@import './survey-styles.css';
</style>


