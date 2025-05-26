<!-- SurveyStep4.vue -->
<template>
  <div class="survey-card">
    <p class="step-indicator">Step 4 of 4</p>
    <h2 class="title">질환 및 수술 이력</h2>

    <textarea v-model="formData.medicalHistory" placeholder="자유롭게 입력해주세요" class="textarea"></textarea>

    <div class="btn-group">
      <button @click="$emit('prev')">이전</button>
      <button @click="submitSurvey" :disabled="isSubmitting">
        <span v-if="isSubmitting">제출 중...</span>
        <span v-else>완료</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSurveyStore } from '@/stores/userSurveyStore'
import { useRouter } from 'vue-router'

const surveyStore = useSurveyStore()
const { formData } = surveyStore
const router = useRouter()
const isSubmitting = ref(false)

const submitSurvey = async () => {
  try {
    isSubmitting.value = true
    
    // 데이터 검증 없이 저장 진행
    surveyStore.saveSurvey()
    
    // 간단한 지연 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 결과 페이지로 이동
    router.push({ name: 'surveyComplete' })
  } catch (error) {
    console.error('설문 제출 오류:', error)
    alert('설문 제출 중 오류가 발생했습니다. 다시 시도해주세요.')
    isSubmitting.value = false
  }
}
</script>

<style scoped>
@import './survey-styles.css';

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>

