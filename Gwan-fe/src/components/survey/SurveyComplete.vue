<template>
  <div class="survey-complete-center">
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
          <h3><i class="bi bi-lightning-charge text-primary"></i> 주간 운동 스케줄</h3>
          <p class="schedule-intro">회원님을 위한 맞춤형 주간 운동 프로그램입니다.</p>
          
          <div v-if="result.weeklyRoutine && result.weeklyRoutine.length > 0" class="weekly-schedule">
            <div v-for="(day, index) in result.weeklyRoutine" :key="`day-${index}`" class="day-schedule">
              <div class="day-header">
                <span class="day-name">{{ day.day || `${index + 1}일차` }}</span>
                <span class="exercise-count" v-if="day.exercises && day.exercises.length > 0">
                  {{ day.exercises.length }}개 운동
                </span>
                <span class="rest-day" v-else>휴식일</span>
              </div>
              
              <div v-if="day.exercises && day.exercises.length > 0" class="exercise-list">
                <div v-for="(exercise, exerciseIndex) in day.exercises" :key="`exercise-${index}-${exerciseIndex}`" class="exercise-item">
                  <div class="exercise-header">
                    <span class="exercise-name">{{ exercise.name || '운동명 없음' }}</span>
                    <span class="exercise-duration">{{ exercise.duration || '시간 미정' }}</span>
                  </div>
                  <div class="exercise-details">
                    <span class="exercise-category">{{ exercise.category || '카테고리 없음' }}</span>
                    <span class="exercise-equipment" v-if="exercise.equipment && exercise.equipment !== '없음'">
                      <i class="bi bi-gear"></i> {{ exercise.equipment }}
                    </span>
                  </div>
                  <p class="exercise-note" v-if="exercise.note">{{ exercise.note }}</p>
                </div>
              </div>
              
              <div v-else class="rest-message">
                <i class="bi bi-moon-stars"></i>
                <span>{{ day.note || '충분한 휴식을 취하세요' }}</span>
              </div>
            </div>
          </div>
          
          <div v-else class="no-routine-message">
            <i class="bi bi-exclamation-triangle text-warning"></i>
            <p>운동 프로그램을 생성하지 못했습니다.</p>
            <p class="text-muted">설문을 다시 진행해주세요.</p>
          </div>
        </div>

        <div class="result-section">
          <h3><i class="bi bi-info-circle text-warning"></i> 운동 시 주의사항</h3>
          <p class="caution-text">{{ result.caution }}</p>
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
  
  console.log('🎬 SurveyComplete: analyzeSurvey 시작')
  
  // 로딩 진행 상태 시뮬레이션 시작
  const progressInterval = updateLoadingProgress()
  
  try {
    console.log('📞 SurveyComplete: API 호출 시작')
    
    // 실제 API 호출로 개인화된 운동 프로그램 받기
    const weeklyRoutine = await surveyStore.fetchRehabPrograms()
    
    console.log('📦 SurveyComplete: API에서 받은 weeklyRoutine:', weeklyRoutine)
    console.log('🔢 SurveyComplete: weeklyRoutine 타입:', typeof weeklyRoutine)
    console.log('📏 SurveyComplete: weeklyRoutine 배열 여부:', Array.isArray(weeklyRoutine))
    console.log('📊 SurveyComplete: weeklyRoutine 길이:', weeklyRoutine ? weeklyRoutine.length : 'N/A')
    
    // 데이터 검증
    if (!weeklyRoutine || !Array.isArray(weeklyRoutine)) {
      console.error('❌ SurveyComplete: weeklyRoutine이 배열이 아니거나 존재하지 않습니다:', weeklyRoutine)
      throw new Error('운동 프로그램 데이터가 올바르지 않습니다.')
    }
    
    if (weeklyRoutine.length === 0) {
      console.warn('⚠️ SurveyComplete: weeklyRoutine이 비어있습니다.')
      throw new Error('생성된 운동 프로그램이 없습니다.')
    }
    
    // 각 요일별 데이터 검증 및 로그
    console.log('🔍 SurveyComplete: 각 요일 데이터 검증')
    weeklyRoutine.forEach((day, index) => {
      console.log(`📅 SurveyComplete: ${index + 1}번째 요일 데이터:`, {
        day: day.day,
        date: day.date,
        hasExercises: !!(day.exercises && day.exercises.length > 0),
        exerciseCount: day.exercises ? day.exercises.length : 0,
        note: day.note
      })
      
      if (day.exercises && day.exercises.length > 0) {
        console.log(`   💪 ${day.day} 운동 목록:`)
        day.exercises.forEach((exercise, exIndex) => {
          console.log(`      ${exIndex + 1}. ${exercise.name || '이름없음'} (${exercise.duration || '시간미정'})`)
        })
      } else {
        console.log(`   😴 ${day.day}: 휴식일 또는 운동 없음`)
      }
    })
    
    // 전체 주간 루틴 데이터를 result에 포함
    const resultData = {
      caution: '개인의 건강 상태에 맞춘 운동 프로그램입니다. 통증이 심해지거나 불편함을 느끼시면 즉시 중단하고 전문의와 상담하세요.',
      weeklyRoutine: weeklyRoutine // 전체 운동 데이터 포함
    }
    
    console.log('🎯 SurveyComplete: 최종 result 설정 전 데이터:', resultData)
    console.log('🎯 SurveyComplete: 설정할 weeklyRoutine:', resultData.weeklyRoutine)
    
    result.value = resultData
    
    console.log('✅ SurveyComplete: result.value 설정 완료:', result.value)
    console.log('✅ SurveyComplete: result.value.weeklyRoutine:', result.value.weeklyRoutine)
    console.log('✅ SurveyComplete: result.value.weeklyRoutine 길이:', result.value.weeklyRoutine ? result.value.weeklyRoutine.length : 'N/A')
    
  } catch (err) {
    console.error('❌ SurveyComplete: 설문 분석 오류:', err)
    console.error('❌ SurveyComplete: 에러 스택:', err.stack)
    
    // 구체적인 에러 메시지 설정
    if (err.message.includes('로그인')) {
      error.value = '로그인이 필요합니다. 다시 로그인해주세요.'
    } else if (err.message.includes('파싱')) {
      error.value = '운동 프로그램 데이터를 처리하는 중 오류가 발생했습니다.'
    } else if (err.message.includes('네트워크') || err.code === 'NETWORK_ERROR') {
      error.value = '네트워크 연결을 확인해주세요.'
    } else {
      error.value = err.message || '결과 분석 중 오류가 발생했습니다. 다시 시도해주세요.'
    }
    
    console.log('🚨 SurveyComplete: 최종 에러 메시지:', error.value)
  } finally {
    clearInterval(progressInterval)
    loadingProgress.value = 100
    loading.value = false
    console.log('🏁 SurveyComplete: analyzeSurvey 완료')
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

.survey-complete-center {
  min-height: calc(100vh - 80px);
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  margin-top: 80px;
  padding: 2rem 0;
}

.result-card {
   max-width: 700px;
  width: 100%;
  min-height: 520px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.10);
  margin: 0;
  border-radius: 24px;
  background: #fff;
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  height: 400px;
  min-height: 400px;
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
  margin-bottom: 1.2rem;
}

.icon-large {
  font-size: 2.5rem;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #222;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 1.5rem;
}

.result-section {
  margin-bottom: 2rem;
  background-color: #fff;
  border-radius: 18px;
  padding: 2rem 1.5rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
}

.result-section:last-child {
  margin-bottom: 0;
}

.action-buttons {
  display: flex;
  gap: 1.5rem;
  margin-top: 2.5rem;
  width: 100%;
  justify-content: center;
}

.btn-routine, .btn-exercises {
  flex: 1;
  text-align: center;
  padding: 1.1rem 0;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.08);
}

.btn-routine {
  background-color: #fef7f0;
  color: #fa8a65;
}

.btn-exercises {
  background-color: #fa8a65;
  color: white;
}

.btn-routine:hover {
  background-color: #d1e7ff;
}

.btn-exercises:hover {
  background-color: #0b5ed7;
}

.schedule-intro {
  color: #666;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1rem;
}

.weekly-schedule {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.day-schedule {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  overflow: hidden;
  background-color: #fafafa;
}

.day-header {
  background: linear-gradient(135deg, var(--primary-color), #FF7043);
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.day-name {
  font-size: 1.1rem;
  font-weight: 600;
}

.exercise-count {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 500;
}

.rest-day {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 500;
}

.exercise-list {
  padding: 1rem;
  background-color: white;
}

.exercise-item {
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #f8f9ff;
  border-radius: 8px;
  border-left: 3px solid var(--primary-color);
}

.exercise-item:last-child {
  margin-bottom: 0;
}

.exercise-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.exercise-name {
  font-weight: 600;
  font-size: 1rem;
  color: #333;
}

.exercise-duration {
  background-color: var(--primary-color);
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.exercise-details {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.exercise-category {
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
}

.exercise-equipment {
  color: #0d6efd;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.exercise-note {
  color: #555;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 0.5rem;
  border-radius: 4px;
  border-left: 2px solid #ddd;
}

.rest-message {
  padding: 2rem;
  text-align: center;
  color: #666;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.rest-message i {
  font-size: 1.5rem;
  color: #9ca3af;
}

.caution-text {
  background-color: #fff8e6;
  border-left: 3px solid #ffc107;
  padding: 1rem;
  border-radius: 4px;
  line-height: 1.6;
}

.no-routine-message {
  text-align: center;
  padding: 3rem 2rem;
  background-color: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.no-routine-message i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.no-routine-message p {
  margin: 0.5rem 0;
  font-size: 1.1rem;
}

.no-routine-message .text-muted {
  font-size: 0.9rem;
  color: #6c757d;
}

@media (max-width: 900px) {
  .result-card {
    padding: 1.2rem 0.5rem;
    max-width: 98vw;
  }
  .result-section {
    padding: 1.2rem 0.5rem;
    max-width: 98vw;
  }
}
</style> 