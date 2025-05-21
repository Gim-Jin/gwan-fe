<template>
  <section class="my-routine">
    <div class="container mt-5">
      <h1 class="mb-4 fw-bold">나의 루틴</h1>

      <!-- 루틴 추가 버튼 -->
      <div v-if="routines.length === 0" class="text-center">
        <div class="container routine-empty">
          <div
            class="none-exercise"
            :style="{ backgroundImage: `url(${noExerciseImg})` }"
          ></div>
          <button class="btn-add-routine" @click="showSurvey = true">운동 추가</button>
        </div>
      </div>
      <!-- 루틴 목록 -->
      <div 
        v-else
        v-for="routine in routines"
        :key="routine.id"
        class="card mb-4 shadow-sm p-3"
      >
        <h4 class="fw-bold">{{ routine.title }}</h4>
        <p class="text-muted">{{ routine.description }}</p>
        <p><strong>주기:</strong> {{ routine.cron }}</p>
        <ul class="list-group list-group-flush">
          <li class="list-group-item" v-for="exercise in routine.exercises" :key="exercise.id">
            🏋️ {{ exercise.name }} (레벨 {{ exercise.level }})
          </li>
        </ul>
      </div>
    </div>

    <!-- 설문 모달 -->
    <div v-if="showSurvey" class="survey-modal">
      <div class="survey-backdrop" @click="closeSurvey"></div>
      <div class="survey-content">
        <SurveyStep1 v-if="surveyStep === 1" @next="goNextStep" />
        <SurveyStep2 v-if="surveyStep === 2" @prev="goPrevStep" @next="goNextStep" />
        <SurveyStep3 v-if="surveyStep === 3" @prev="goPrevStep" @next="goNextStep" />
        <SurveyStep4 v-if="surveyStep === 4" @prev="goPrevStep" @next="finishSurvey" />
        <button class="close-btn" @click="closeSurvey">닫기</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import noExerciseImg from '@/assets/no-exercise.png'
import SurveyStep1 from '@/components/survey/SurveyStep1.vue'
import SurveyStep2 from '@/components/survey/SurveyStep2.vue'
import SurveyStep3 from '@/components/survey/SurveyStep3.vue'
import SurveyStep4 from '@/components/survey/SurveyStep4.vue'
import SurveyStep from '@/components/survey/SurveyStep.vue'

const showSurvey = ref(false)
const surveyStep = ref(1)

const goNextStep = () => {
  if (surveyStep.value < 4) surveyStep.value++
}
const goPrevStep = () => {
  if (surveyStep.value > 1) surveyStep.value--
}
const closeSurvey = () => {
  showSurvey.value = false
}

// 더미 데이터 (DB 기준 맞춰서)
const routines = ref([
  // {
  //   id: 1,
  //   title: '상체 강화 루틴',
  //   description: '팔, 어깨 위주 루틴',
  //   cron: '7일 반복',
  //   exercises: [
  //     { id: 101, name: '푸쉬업', level: 2 },
  //     { id: 102, name: '숄더프레스', level: 3 },
  //   ],
  // },
  // {
  //   id: 2,
  //   title: '하체 강화 루틴',
  //   description: '고관절, 햄스트링 위주 루틴',
  //   cron: '3일 반복',
  //   exercises: [
  //     { id: 201, name: '스쿼트', level: 3 },
  //     { id: 202, name: '런지', level: 2 },
  //   ],
  // },
])
</script>

<style scoped>
.my-routine {
  background-color: #f8f9fa;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.routine-empty {
  text-align: center;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
}

.none-exercise {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  height: 600px;
  margin-bottom: 1rem;
}

.routine-text {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1rem;
  font-weight: 500;
}

.btn-add-routine {
  padding: 0.6rem 1.2rem;
  background-color: #365FFF;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.2s ease;
}

.btn-add-routine:hover {
  background-color: #2e4ddb;
}

.survey-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.survey-backdrop {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
}
.survey-content {
  position: relative;
  z-index: 10;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  min-width: 350px;
  max-width: 90vw;
}
.close-btn {
  position: absolute;
  top: 1rem; right: 1rem;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}
</style>
