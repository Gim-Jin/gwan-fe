import api from './axios'

// 개인화된 운동 프로그램 추천 요청
export const getRehabPrograms = (surveyData) => {
  return api.post('/api/users/rehab-programs', surveyData)
}

// 설문 결과 저장 (필요시)
export const saveSurveyResult = (surveyData) => {
  return api.post('/api/users/survey', surveyData)
}

// 유저의 모든 운동 루틴(처방) 가져오기
export const getAllPrescriptions = (isMyRoutinePage = false) => {
  return api.get('/api/users/rehab-programs', {
    params: { isMyRoutinePage }
  })
}

// 운동 루틴 완료 처리
export const doneRehabProgram = (rehabProgramId) => {
  return api.put(`/api/users/rehab-programs/${rehabProgramId}`)
} 