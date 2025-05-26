<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="m-0">운동 루틴</h5>

      <div class="btn-group">
        <button
          class="btn"
          :class="sortOrder === 'new' ? 'btn-primary' : 'btn-outline-secondary'"
          @click="sortOrder = 'new'"
        >최신순</button>
        <button
          class="btn"
          :class="sortOrder === 'old' ? 'btn-primary' : 'btn-outline-secondary'"
          @click="sortOrder = 'old'"
        >오래된순</button>
      </div>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="text-center p-4">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <!-- 루틴이 없을 때 -->
    <div v-else-if="!routines.length" class="text-center p-4">
      <p class="text-muted">등록된 운동 루틴이 없습니다.</p>
    </div>

    <!-- 루틴 목록 -->
    <div v-else>
      <div
        v-for="(routine, idx) in sortedRoutines"
        :key="routine.rehabProgramId"
        class="mb-4 border rounded"
      >
        <!-- 아코디언 헤더 -->
        <div
          class="d-flex justify-content-between align-items-center bg-primary bg-opacity-25 p-3"
          role="button"
          @click="toggle(routine.rehabProgramId)"
        >
          <div class="fw-bold">
            {{ routine.target?.name || `운동 프로그램 ${idx + 1}` }}
            <span v-if="routine.isdone" class="badge bg-success ms-2">완료</span>
            <span v-else class="badge bg-secondary ms-2">진행중</span>
          </div>
          <span class="small text-muted">{{ formatDate(routine.createdAt) }}</span>
        </div>

        <!-- 아코디언 내용 -->
        <div v-if="expandedId === routine.rehabProgramId" class="p-3">
          <div v-if="routine.parsedPrescription && routine.parsedPrescription.weeklyRoutine">
            <div class="mb-3" v-for="(day, dayIdx) in routine.parsedPrescription.weeklyRoutine" :key="`day-${dayIdx}`">
              <h6 class="text-primary">{{ day.day }}</h6>
              
              <div v-if="day.exercises && day.exercises.length > 0">
                <ul class="list-group">
                  <li
                    v-for="(exercise, exIdx) in day.exercises"
                    :key="`ex-${exIdx}`"
                    class="list-group-item"
                  >
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{{ exercise.name }}</strong>
                        <span class="text-muted ms-2">{{ exercise.duration }}</span>
                      </div>
                      <span class="badge bg-info">{{ exercise.category }}</span>
                    </div>
                    <small class="text-muted d-block mt-1" v-if="exercise.note">{{ exercise.note }}</small>
                  </li>
                </ul>
              </div>
              
              <div v-else class="text-muted">
                <i class="bi bi-moon-stars"></i> 휴식일
              </div>
            </div>
          </div>
          
          <div v-else class="text-muted">
            운동 데이터를 불러올 수 없습니다.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getAllPrescriptions } from '@/api/survey'

const expandedId = ref(null)
const sortOrder = ref('new') // 'new' or 'old'
const routines = ref([])
const isLoading = ref(false)
const error = ref(null)

const toggle = (id) => {
  expandedId.value = expandedId.value === id ? null : id
}

// prescription 문자열 파싱 함수
const parsePrescription = (prescriptionString) => {
  try {
    let cleanedString = prescriptionString.trim()
    
    // 백틱 코드 블록 제거
    if (cleanedString.startsWith('```json')) {
      cleanedString = cleanedString
        .replace(/^```json\s*/m, '')
        .replace(/\s*```$/m, '')
        .trim()
    } else if (cleanedString.startsWith('```')) {
      cleanedString = cleanedString
        .replace(/^```\s*/m, '')
        .replace(/\s*```$/m, '')
        .trim()
    }
    
    return JSON.parse(cleanedString)
  } catch (e) {
    console.error('Prescription 파싱 오류:', e)
    return null
  }
}

// 날짜 포맷팅
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 정렬된 루틴
const sortedRoutines = computed(() => {
  return [...routines.value].sort((a, b) => {
    const da = new Date(a.createdAt)
    const db = new Date(b.createdAt)
    return sortOrder.value === 'new' ? db - da : da - db
  })
})

// 모든 루틴 불러오기
const fetchAllRoutines = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    // isMyRoutinePage=false로 모든 루틴을 가져옴
    const response = await getAllPrescriptions(false)
    const prescriptions = response.data?.data || []
    
    // 각 prescription의 prescription 필드를 파싱하여 추가
    routines.value = prescriptions.map(prescription => ({
      ...prescription,
      parsedPrescription: parsePrescription(prescription.prescription)
    }))
    
  } catch (err) {
    console.error('루틴 불러오기 실패:', err)
    error.value = '운동 루틴을 불러오는데 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchAllRoutines()
})
</script>

<style scoped>
.btn {
  min-width: 96px;
}

.list-group-item {
  border-left: 3px solid #0d6efd;
}

.badge {
  font-size: 0.75rem;
}
</style>