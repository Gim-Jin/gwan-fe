import api from './axios'

// 개인화된 운동 프로그램 추천 요청
export const getRehabPrograms = (surveyData) => {
  return api.post('/api/users/rehab-programs', surveyData)
}

// 설문 결과 저장 (필요시)
export const saveSurveyResult = (surveyData) => {
  return api.post('/api/users/survey', surveyData)
} 