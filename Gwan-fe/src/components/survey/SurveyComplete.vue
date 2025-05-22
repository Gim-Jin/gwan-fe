<template>
  <div class="survey-card result-card">
    <div v-if="loading" class="loading-container">
      <div class="loading-icon">
        <div class="spinner"></div>
      </div>
      <h3 class="loading-title">설문 분석 중</h3>
      <p class="loading-text">회원님의 데이터를 분석하여 최적의 운동을 추천하고 있습니다.</p>
      <div class="loading-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${loadingProgress}%` }"></div>
        </div>
        <span class="progress-text">{{ loadingProgress }}% 완료</span>
      </div>
    </div>

    <div v-else-if="error" class="error-message">
      <i class="bi bi-exclamation-circle text-danger icon-large"></i>
      <p>{{ error }}</p>
      <button @click="retryAnalysis" class="retry-btn">다시 시도</button>
    </div>

    <div v-else class="result-content">
      <div class="success-icon">
        <i class="bi bi-check-circle-fill text-success icon-large"></i>
      </div>
      <h2 class="title">설문 완료</h2>
      <p class="subtitle">운동 분석 결과</p>

      <div class="result-section">
        <h3><i class="bi bi-lightning-charge text-primary"></i> 추천 운동</h3>
        <ul class="recommendation-list">
          <li v-for="(exercise, index) in result.recommendedExercises" :key="index">
            <span class="exercise-name">{{ exercise.name }}</span>
            <span class="exercise-desc">{{ exercise.description }}</span>
          </li>
        </ul>
      </div>

      <div class="result-section">
        <h3><i class="bi bi-info-circle text-warning"></i> 운동 시 주의사항</h3>
        <p class="caution-text">{{ result.caution }}</p>
      </div>

      <div class="result-section">
        <h3><i class="bi bi-calendar-check text-success"></i> 추천 운동 루틴</h3>
        <div class="routine-info">
          <p>회원님께 맞춤형 운동 루틴이 생성되었습니다. 아래 버튼을 통해 확인하세요.</p>
          <div class="routine-preview">
            <div class="day-item" v-for="(day, index) in result.weeklyRoutine" :key="index">
              <span class="day-label">{{ day.day }}</span>
              <span class="exercise-count">{{ day.count }}개 운동</span>
            </div>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <router-link :to="{name: 'myRoutine'}" class="btn-routine">
          <i class="bi bi-calendar-week"></i> 나의 루틴 확인하기
        </router-link>
        <router-link :to="{name: 'exercises'}" class="btn-exercises">
          <i class="bi bi-play-circle"></i> 운동 시작하기
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSurveyStore } from '@/stores/userSurveyStore'

const surveyStore = useSurveyStore()
const loading = ref(true)
const error = ref(null)
const result = ref(null)
const loadingProgress = ref(0)

// 로딩 진행 상태 업데이트
const updateLoadingProgress = () => {
  const interval = setInterval(() => {
    loadingProgress.value += Math.floor(Math.random() * 10) + 1
    
    if (loadingProgress.value >= 100) {
      loadingProgress.value = 100
      clearInterval(interval)
    }
  }, 400)
  
  return interval
}

// 서버에 데이터 보내고 분석 결과 받기
const analyzeSurvey = async () => {
  loading.value = true
  error.value = null
  loadingProgress.value = 0
  
  // 로딩 진행 상태 시뮬레이션 시작
  const progressInterval = updateLoadingProgress()
  
  try {
    // 실제 API 연동 시 여기에 구현
    
    // 테스트를 위한 지연 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 4000))
    
    // 더미 데이터
    result.value = {
      recommendedExercises: [
        { name: '골반 교정 스트레칭', description: '허리 통증 완화와 자세 교정에 효과적인 운동입니다. 하루 10분씩 진행하세요.' },
        { name: '어깨 안정화 운동', description: '어깨 통증 감소와 기능 향상에 도움이 됩니다. 가벼운 아령으로 시작하세요.' },
        { name: '코어 강화 운동', description: '허리와 복부 근육을 강화하여 전반적인 자세를 개선합니다.' },
        { name: '목 근육 이완 운동', description: '목 통증 완화와 경직된 근육 이완에 도움이 됩니다. 매일 아침 진행하세요.' }
      ],
      caution: '현재 어깨 통증이 있으므로 무리한 운동은 피하고, 통증이 악화될 경우 즉시 운동을 중단하세요. 항상 워밍업을 충분히 하고, 점진적으로 강도를 높여가는 것이 중요합니다. 회원님의 몸 상태에 맞게 조절하세요.',
      weeklyRoutine: [
        { day: '월요일', count: 3 },
        { day: '화요일', count: 0 },
        { day: '수요일', count: 4 },
        { day: '목요일', count: 0 },
        { day: '금요일', count: 3 },
        { day: '토요일', count: 2 },
        { day: '일요일', count: 0 }
      ]
    }
    
  } catch (err) {
    error.value = '결과 분석 중 오류가 발생했습니다. 다시 시도해주세요.'
    console.error('설문 분석 오류:', err)
  } finally {
    // 로딩 진행 상태 업데이트 중지
    clearInterval(progressInterval)
    
    // 로딩 완료 처리 (너무 빨리 완료되면 100%까지 채워줌)
    if (loadingProgress.value < 100) {
      loadingProgress.value = 100
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    loading.value = false
  }
}

const retryAnalysis = () => {
  analyzeSurvey()
}

onMounted(() => {
  analyzeSurvey()
})
</script>

<style scoped>
@import './survey-styles.css';

.result-card {
  max-width: 650px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  height: 100%;
}

.loading-icon {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

.spinner {
  width: 80px;
  height: 80px;
  border: 5px solid rgba(59, 130, 246, 0.2);
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s linear infinite;
}

.loading-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.loading-text {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  max-width: 400px;
}

.loading-progress {
  width: 100%;
  max-width: 400px;
}

.progress-bar {
  height: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background-color: #3b82f6;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.9rem;
  color: #666;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.success-icon {
  text-align: center;
  margin-bottom: 1rem;
}

.icon-large {
  font-size: 2.5rem;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
}

.error-message {
  text-align: center;
  color: #dc3545;
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.retry-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  margin-top: 1rem;
  cursor: pointer;
}

.result-section {
  margin-bottom: 2rem;
  background-color: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.result-section h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.recommendation-list {
  list-style: none;
  padding: 0;
}

.recommendation-list li {
  padding: 1rem;
  border-left: 3px solid #3b82f6;
  background-color: #f8f9fa;
  margin-bottom: 1rem;
  border-radius: 4px;
}

.exercise-name {
  font-weight: 600;
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.exercise-desc {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
}

.caution-text {
  background-color: #fff8e6;
  border-left: 3px solid #ffc107;
  padding: 1rem;
  border-radius: 4px;
  line-height: 1.6;
}

.routine-info {
  margin-top: 0.5rem;
}

.routine-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 1rem;
}

.day-item {
  background-color: #f8f9fa;
  border-radius: 6px;
  padding: 0.8rem;
  min-width: 100px;
  text-align: center;
  border: 1px solid #e9ecef;
}

.day-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.3rem;
}

.exercise-count {
  font-size: 0.9rem;
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-routine, .btn-exercises {
  flex: 1;
  text-align: center;
  padding: 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-routine {
  background-color: #e7f1ff;
  color: #0d6efd;
}

.btn-exercises {
  background-color: #0d6efd;
  color: white;
}

.btn-routine:hover {
  background-color: #d1e7ff;
}

.btn-exercises:hover {
  background-color: #0b5ed7;
}
</style> 