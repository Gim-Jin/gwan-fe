<template>
  <section class="my-routine">
    <div class="container-fluid">
      <div class="routine-header">
        <h1 class="routine-title">나의 루틴</h1>
        <button class="btn-add" @click="showSurvey = true">
          <i class="bi bi-plus-circle"></i> 운동 추가
        </button>
      </div>

      <!-- 루틴 추가 버튼 -->
      <div v-if="weeklyRoutine.length === 0" class="text-center">
        <div class="container routine-empty">
          <div
            class="none-exercise"
            :style="{ backgroundImage: `url(${noExerciseImg})` }"
          ></div>
          <p class="empty-message">아직 등록된 운동 루틴이 없습니다.</p>
          <button class="btn-add-routine" @click="showSurvey = true">운동 추가</button>
        </div>
      </div>
      
      <!-- 캘린더 뷰 -->
      <div v-else class="calendar-section">
        <ExerciseCalendar 
          :weekly-routine="weeklyRoutine" 
          @exercise-selected="handleExerciseSelected"
        />
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

        <button class="close-btn" @click="closeSurvey">
          <i class="bi bi-x-lg"></i>
        </button>

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
import ExerciseCalendar from '@/components/calendar/ExerciseCalendar.vue'

const showSurvey = ref(false)
const surveyStep = ref(1)
const selectedExercise = ref(null)

const goNextStep = () => {
  if (surveyStep.value < 4) surveyStep.value++
}
const goPrevStep = () => {
  if (surveyStep.value > 1) surveyStep.value--
}
const closeSurvey = () => {
  showSurvey.value = false
}
const handleExerciseSelected = (exercise) => {
  selectedExercise.value = exercise
}

const finishSurvey = () => {
  // 설문 완료 후 루틴 추가 로직
  showSurvey.value = false
  // API 호출 등의 로직 추가
}

// 운동 루틴 데이터
const weeklyRoutine = ref([
  {
    "day": "월요일",
    "date": "2025-05-26",
    "exercises": [
      {
        "category": "준비 운동 / 근막이완",
        "name": "폼롤러 상완 삼두 마사지",
        "duration": "2분",
        "equipment": "폼롤러",
        "note": "팔꿈치 위 삼두근을 집중적으로 부드럽게 굴려주세요."
      },
      {
        "category": "신경 활주 운동",
        "name": "정중신경 활주",
        "duration": "3분",
        "equipment": "없음",
        "note": "팔을 옆으로 뻗고 손바닥을 하늘로 향하게 한 채 손목을 위아래로 움직입니다."
      },
      {
        "category": "팔꿈치 및 손목 근육 강화",
        "name": "손가락 저항 운동",
        "duration": "3분",
        "equipment": "고무 밴드",
        "note": "손가락을 벌리고 모으는 동작을 반복합니다."
      },
      {
        "category": "어깨 및 회전근 안정화",
        "name": "밴드 외회전 운동",
        "duration": "4분",
        "equipment": "테라밴드",
        "note": "팔꿈치를 90도 굽히고 몸통 옆에 붙인 채, 밴드를 바깥쪽으로 당깁니다."
      },
      {
        "category": "등척성 유지 운동",
        "name": "팔꿈치 굴곡 등척성 유지",
        "duration": "3분",
        "equipment": "없음",
        "note": "90도 굽힌 팔을 반대 손으로 저항하면서 10초간 힘을 유지하고 반복합니다."
      },
      {
        "category": "마무리 스트레칭",
        "name": "손목 신전근 스트레칭",
        "duration": "3분",
        "equipment": "없음",
        "note": "손바닥을 아래로 향한 채 손등을 눌러 스트레칭합니다."
      }
    ]
  },
  {
    "day": "화요일",
    "date": "2025-05-27",
    "exercises": [
      {
        "category": "준비 운동 / 근막이완",
        "name": "마사지볼 손바닥/팔꿈치 근막 이완",
        "duration": "2분",
        "equipment": "마사지볼",
        "note": "탁자 위에서 팔을 마사지볼로 천천히 굴립니다."
      },
      {
        "category": "신경 활주 운동",
        "name": "척골신경 활주",
        "duration": "3분",
        "equipment": "없음",
        "note": "팔을 앞으로 뻗고 손목을 바깥쪽으로 틀며 신경을 부드럽게 늘립니다."
      },
      {
        "category": "팔꿈치 및 손목 근육 강화",
        "name": "손목 회전 저항 운동",
        "duration": "3분",
        "equipment": "테라밴드",
        "note": "밴드를 이용해 손목을 시계방향, 반시계 방향으로 저항을 줍니다."
      },
      {
        "category": "어깨 및 회전근 안정화",
        "name": "Y-T-W 밴드운동",
        "duration": "4분",
        "equipment": "테라밴드",
        "note": "가슴을 편 상태에서 Y, T, W자 모양으로 팔을 벌리며 어깨 후면 자극."
      },
      {
        "category": "등척성 유지 운동",
        "name": "손목 굴곡 등척성 유지",
        "duration": "2분",
        "equipment": "없음",
        "note": "손바닥을 위로 한 상태로 저항을 주며 유지."
      },
      {
        "category": "마무리 스트레칭",
        "name": "손목 회전 스트레칭",
        "duration": "3분",
        "equipment": "없음",
        "note": "손목을 천천히 좌우로 돌리며 이완."
      }
    ]
  },
  {
    "day": "수요일",
    "date": "2025-05-28",
    "exercises": [],
    "note": "휴식 또는 가벼운 스트레칭만 진행"
  },
  {
    "day": "목요일",
    "date": "2025-05-29",
    "exercises": [
      {
        "category": "준비 운동 / 근막이완",
        "name": "폼롤러 상완 삼두 마사지",
        "duration": "2분",
        "equipment": "폼롤러",
        "note": "팔꿈치 위 삼두근을 집중적으로 부드럽게 굴려주세요."
      },
      {
        "category": "신경 활주 운동",
        "name": "정중신경 활주",
        "duration": "3분",
        "equipment": "없음",
        "note": "팔을 옆으로 뻗고 손바닥을 하늘로 향하게 한 채 손목을 위아래로 움직입니다."
      },
      {
        "category": "팔꿈치 및 손목 근육 강화",
        "name": "손가락 저항 운동",
        "duration": "3분",
        "equipment": "고무 밴드",
        "note": "손가락을 벌리고 모으는 동작을 반복합니다."
      },
      {
        "category": "어깨 및 회전근 안정화",
        "name": "밴드 외회전 운동",
        "duration": "4분",
        "equipment": "테라밴드",
        "note": "팔꿈치를 90도 굽히고 몸통 옆에 붙인 채, 밴드를 바깥쪽으로 당깁니다."
      },
      {
        "category": "등척성 유지 운동",
        "name": "팔꿈치 굴곡 등척성 유지",
        "duration": "3분",
        "equipment": "없음",
        "note": "90도 굽힌 팔을 반대 손으로 저항하면서 10초간 힘을 유지하고 반복합니다."
      },
      {
        "category": "마무리 스트레칭",
        "name": "손목 신전근 스트레칭",
        "duration": "3분",
        "equipment": "없음",
        "note": "손바닥을 아래로 향한 채 손등을 눌러 스트레칭합니다."
      }
    ]
  },
  {
    "day": "금요일",
    "date": "2025-05-30",
    "exercises": [
      {
        "category": "준비 운동 / 근막이완",
        "name": "마사지볼 손바닥/팔꿈치 근막 이완",
        "duration": "2분",
        "equipment": "마사지볼",
        "note": "탁자 위에서 팔을 마사지볼로 천천히 굴립니다."
      },
      {
        "category": "신경 활주 운동",
        "name": "척골신경 활주",
        "duration": "3분",
        "equipment": "없음",
        "note": "팔을 앞으로 뻗고 손목을 바깥쪽으로 틀며 신경을 부드럽게 늘립니다."
      },
      {
        "category": "팔꿈치 및 손목 근육 강화",
        "name": "손목 회전 저항 운동",
        "duration": "3분",
        "equipment": "테라밴드",
        "note": "밴드를 이용해 손목을 시계방향, 반시계 방향으로 저항을 줍니다."
      },
      {
        "category": "어깨 및 회전근 안정화",
        "name": "Y-T-W 밴드운동",
        "duration": "4분",
        "equipment": "테라밴드",
        "note": "가슴을 편 상태에서 Y, T, W자 모양으로 팔을 벌리며 어깨 후면 자극."
      },
      {
        "category": "등척성 유지 운동",
        "name": "손목 굴곡 등척성 유지",
        "duration": "2분",
        "equipment": "없음",
        "note": "손바닥을 위로 한 상태로 저항을 주며 유지."
      },
      {
        "category": "마무리 스트레칭",
        "name": "손목 회전 스트레칭",
        "duration": "3분",
        "equipment": "없음",
        "note": "손목을 천천히 좌우로 돌리며 이완."
      }
    ]
  }
])
</script>

<style scoped>
.my-routine {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 2rem 0;
}

.container-fluid {
  width: 95%;
  margin: 0 auto;
}

.routine-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.routine-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.btn-add {
  background-color: #365FFF;
  color: white;
  border: none;
  padding: 0.7rem 1.2rem;
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add:hover {
  background-color: #2f4edb;
}

.routine-empty {
  text-align: center;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
}

.none-exercise {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  height: 350px;
  margin-bottom: 1.5rem;
}

.empty-message {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1.5rem;
}

.btn-add-routine {
  padding: 0.8rem 1.5rem;
  background-color: #365FFF;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.2s ease;
}

.btn-add-routine:hover {
  background-color: #2e4ddb;
  transform: translateY(-2px);
}

.calendar-section {
  width: 100%;
  margin: 0 auto;
}

/* 모달 스타일 */
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
  background: rgba(0,0,0,0.5);
}
.survey-content {
  position: relative;
  z-index: 10;
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  min-width: 700px;
  max-width: 90vw;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}
.close-btn {
  position: absolute;
  top: 1.2rem; right: 1.2rem;
  background: none;
  border: none;
  font-size: 1.3rem;
  color: #666;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.close-btn:hover {
  background-color: #f5f5f5;
  color: #333;
}
</style>
