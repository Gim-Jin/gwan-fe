<template>
  <div class="survey-wrapper">
    <div class="survey-sidebar">
      <div class="survey-illustration">
        👤
      </div>
      <h1>건강 설문</h1>
      <p>더 나은 운동 경험을 위해 몇 가지 질문에 답해주세요</p>
    </div>
    
    <div class="survey-content">

      
      <div class="survey-card">
        <p class="step-indicator">기본 정보</p>
        <h2 class="title">기본 정보를 입력해주세요</h2>

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
    </div>
  </div>
</template>

<script setup>
import {useSurveyStore} from '@/stores/userSurveyStore'
import { onMounted } from 'vue'

const {formData} = useSurveyStore();

// 컴포넌트 마운트 시 애니메이션 트리거
onMounted(() => {
 
});
</script>

<style scoped>
@import './survey-styles.css';
.radio-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
</style>

