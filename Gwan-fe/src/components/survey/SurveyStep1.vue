<!-- SurveyStep1.vue -->
<template>
  <div class="survey-card">
    <p class="step-indicator">Step 1 of 4</p>
    <h2 class="title">통증 정보</h2>

    <form class="form">
      <select v-model="formData.painArea">
        <option disabled value="">통증 부위를 선택해주세요</option>
        <option value="NECK">목</option>
        <option value="SHOULDER">어깨</option>
        <option value="BACK">등</option>
        <option value="KNEE">무릎</option>
        <option value="ANKLE">발목</option>
        <option value="WRIST">손목</option>
        <option value="ELBOW">팔꿈치</option>
      </select>
      <div class="slider-box">
        <label>통증 강도: {{ formData.painLevel }}점</label>
        <input type="range" min="0" max="10" v-model="formData.painLevel" />
      </div>
      <input v-model="formData.painPattern" type="text" placeholder="통증 양상 (예: 시큰거림)" />
      <input v-model="formData.painTrigger" type="text" placeholder="통증 발생 조건 (예: 장시간 컴퓨터 사용)" />
      <input v-model="formData.painStartTime" type="text" placeholder="통증 시작 시점 (예: 3개월 전부터)" />
    </form>

    <div class="btn-group">
      <button @click="$emit('next')">다음</button>
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
