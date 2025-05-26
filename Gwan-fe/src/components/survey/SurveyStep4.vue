<!-- SurveyStep4.vue -->
<template>
  <div class="survey-wrapper">
    <div class="survey-sidebar">
      <div class="survey-illustration">
        🏥
      </div>
      <h1>건강 설문</h1>
      <p>더 나은 운동 경험을 위해 몇 가지 질문에 답해주세요</p>
    </div>
    
    <div class="survey-content">
      <div class="progress-bar-container progress-100">
        <div class="progress-bar">
          <div class="progress-bar-fill"></div>
        </div>
        <div class="progress-info">
          <span>단계 4/4</span>
          <span>100%</span>
        </div>
      </div>
      
      <div class="survey-card">
        <p class="step-indicator">의료 정보</p>
        <h2 class="title">질환 및 수술 이력이 있으신가요?</h2>

        <textarea v-model="formData.medicalHistory" placeholder="자유롭게 입력해주세요" class="textarea"></textarea>

        <div class="btn-group">
          <button @click="$emit('prev')">이전</button>
          <button @click="submitSurvey" :disabled="isSubmitting">
            <span v-if="isSubmitting">제출 중...</span>
            <span v-else>완료</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSurveyStore } from '@/stores/userSurveyStore'
import { useRouter } from 'vue-router'

const surveyStore = useSurveyStore()
const { formData } = surveyStore
const router = useRouter()
const isSubmitting = ref(false)

// 컴포넌트 마운트 시 애니메이션 트리거
onMounted(() => {
  // 약간의 지연 후 애니메이션 시작
  setTimeout(() => {
    const progressBar = document.querySelector('.progress-bar-fill');
    if (progressBar) {
      progressBar.style.width = '100%';
    }
  }, 100);
});

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

.textarea {
  width: 100%;
  min-height: 150px;
  padding: 1rem 1.25rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
  resize: vertical;
}

.textarea:focus {
  outline: none;
  border-color: #667eea;
  background-color: #fff;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>

