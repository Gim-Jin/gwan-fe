import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { getRehabPrograms, getAllPrescriptions } from '@/api/survey'
import { useAuthStore } from './auth'

export const useSurveyStore = defineStore('survey', () => {
    const formData = reactive({
        // Step 1
        painArea: '',
        painLevel: '',
        painPattern: '',
        painTrigger: '',
        painStartTime: '',

        // Step 2
        age: '',
        height: '',
        weight: '',
        gender: '',

        // Step 3
        sleepHours: '',
        dailyActivity: '',
        exerciseExperience: '',

        // Step 4
        medicalHistory: ''
    })

    // API 응답 데이터
    const rehabPrograms = ref([])
    const isLoading = ref(false)
    const error = ref(null)

    const updateForm = (payload) => {
        Object.assign(formData, payload)
    }

    const resetForm = () => {
        for (const key in formData) {
            formData[key] = ''
        }
        rehabPrograms.value = []
        error.value = null
    }

    // 개인화된 운동 프로그램 요청
    const fetchRehabPrograms = async () => {
        const authStore = useAuthStore()
        
        // 인증 상태 확인
        if (!authStore.isAuthenticated) {
            throw new Error('로그인이 필요한 서비스입니다.')
        }

        isLoading.value = true
        error.value = null
        
        try {
            console.log('🚀 설문 데이터 전송 시작:', formData)
            const response = await getRehabPrograms(formData)
            
            console.log('📡 API 원본 응답 전체:', response)
            console.log('📦 response.data:', response.data)
            console.log('📋 response.data.data:', response.data.data)
            
            // API 응답 구조 검증
            if (!response.data || !response.data.data) {
                throw new Error('API 응답 구조가 올바르지 않습니다.')
            }
            
            const apiData = response.data.data
            console.log('🔍 추출한 apiData:', apiData)
            console.log('📄 prescription 필드 존재 여부:', 'prescription' in apiData)
            console.log('📄 prescription 타입:', typeof apiData.prescription)
            console.log('📄 prescription 길이:', apiData.prescription ? apiData.prescription.length : 'N/A')
            
            if (!apiData.prescription) {
                throw new Error('prescription 필드가 응답에 없습니다.')
            }
            
            // API 응답에서 prescription 필드 추출 및 파싱
            const prescriptionData = parsePrescription(apiData.prescription)
            
            console.log('✅ 파싱 완료된 prescriptionData:', prescriptionData)
            console.log('📅 weeklyRoutine 추출:', prescriptionData.weeklyRoutine)
            
            // rehabProgramId를 weeklyRoutine에 추가
            const routineWithId = prescriptionData.weeklyRoutine.map(day => ({
                ...day,
                rehabProgramId: apiData.rehabProgramId
            }))
            
            rehabPrograms.value = routineWithId || []
            
            console.log('🎯 최종 저장된 rehabPrograms:', rehabPrograms.value)
            console.log('📊 총 요일 수:', rehabPrograms.value.length)
            
            // 각 요일별 상세 정보 로그
            rehabPrograms.value.forEach((day, index) => {
                console.log(`📅 ${index + 1}번째 요일:`, {
                    day: day.day,
                    date: day.date,
                    exerciseCount: day.exercises ? day.exercises.length : 0,
                    exercises: day.exercises,
                    note: day.note
                })
            })
            
            return rehabPrograms.value
        } catch (err) {
            console.error('❌ 운동 프로그램 요청 실패:', err)
            console.error('❌ 에러 스택:', err.stack)
            
            if (err.response?.status === 401 || err.response?.status === 403) {
                error.value = '로그인이 만료되었습니다. 다시 로그인해주세요.'
            } else {
                error.value = err.response?.data?.message || err.message || '운동 프로그램을 불러오는데 실패했습니다.'
            }
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // prescription 문자열에서 JSON 데이터 파싱
    const parsePrescription = (prescriptionString) => {
        try {
            console.log('🔧 prescription 파싱 시작')
            console.log('📥 원본 prescription:', prescriptionString)
            console.log('📏 원본 길이:', prescriptionString ? prescriptionString.length : 'N/A')
            console.log('🔤 원본 타입:', typeof prescriptionString)
            
            // null 또는 undefined 체크
            if (!prescriptionString || typeof prescriptionString !== 'string') {
                console.error('❌ prescription이 문자열이 아님:', { prescriptionString, type: typeof prescriptionString })
                throw new Error('prescription 데이터가 비어있거나 문자열이 아닙니다.')
            }

            // ```json과 ``` 제거
            let cleanedString = prescriptionString.trim()
            console.log('🧹 trim 후:', cleanedString.length + '자')
            console.log('🧹 시작 20자:', cleanedString.substring(0, 20))
            console.log('🧹 끝 20자:', cleanedString.substring(cleanedString.length - 20))
            
            // 백틱 코드 블록 제거
            if (cleanedString.startsWith('```json')) {
                console.log('🔍 ```json 블록 감지, 제거 중...')
                cleanedString = cleanedString
                    .replace(/^```json\s*/m, '')  // 시작 부분 제거 (multiline)
                    .replace(/\s*```$/m, '')     // 끝 부분 제거 (multiline)
                    .trim()
                console.log('✂️ ```json 제거 후 길이:', cleanedString.length)
            } else if (cleanedString.startsWith('```')) {
                console.log('🔍 ``` 블록 감지, 제거 중...')
                cleanedString = cleanedString
                    .replace(/^```\s*/m, '')     // 시작 부분 제거
                    .replace(/\s*```$/m, '')     // 끝 부분 제거
                    .trim()
                console.log('✂️ ``` 제거 후 길이:', cleanedString.length)
            } else {
                console.log('📝 코드 블록 없음, 그대로 진행')
            }
            
            console.log('🧼 정리된 JSON 문자열 (첫 100자):', cleanedString.substring(0, 100))
            console.log('🧼 정리된 JSON 문자열 (마지막 100자):', cleanedString.substring(cleanedString.length - 100))
            
            // JSON 파싱 시도
            console.log('🔄 JSON.parse 시도 중...')
            const parsedData = JSON.parse(cleanedString)
            console.log('✅ JSON 파싱 성공!')
            console.log('🏗️ 파싱된 데이터 구조:', Object.keys(parsedData))
            console.log('📊 파싱된 전체 데이터:', parsedData)
            
            // weeklyRoutine 존재 여부 확인
            console.log('🔍 weeklyRoutine 검증 중...')
            console.log('📋 weeklyRoutine 존재 여부:', 'weeklyRoutine' in parsedData)
            console.log('📋 weeklyRoutine 타입:', typeof parsedData.weeklyRoutine)
            console.log('📋 weeklyRoutine 배열 여부:', Array.isArray(parsedData.weeklyRoutine))
            
            if (!parsedData.weeklyRoutine || !Array.isArray(parsedData.weeklyRoutine)) {
                console.warn('⚠️ weeklyRoutine이 배열이 아니거나 존재하지 않습니다:', parsedData.weeklyRoutine)
                return {
                    weeklyRoutine: [],
                    userId: parsedData.userId || null,
                    startDate: parsedData.startDate || null
                }
            }
            
            console.log('📅 weeklyRoutine 배열 길이:', parsedData.weeklyRoutine.length)
            
            // 각 요일 데이터 검증
            console.log('🔍 각 요일 데이터 검증 시작...')
            const validatedRoutine = parsedData.weeklyRoutine.map((dayData, index) => {
                console.log(`📅 ${index + 1}번째 요일 검증:`, dayData)
                console.log(`   - day: "${dayData.day}" (타입: ${typeof dayData.day})`)
                console.log(`   - date: "${dayData.date}" (타입: ${typeof dayData.date})`)
                console.log(`   - exercises: 배열여부=${Array.isArray(dayData.exercises)}, 길이=${dayData.exercises ? dayData.exercises.length : 'N/A'}`)
                console.log(`   - note: "${dayData.note}" (타입: ${typeof dayData.note})`)
                
                if (!dayData.day) {
                    console.warn(`⚠️ ${index}번째 요일 데이터에 day 속성이 없습니다:`, dayData)
                    return {
                        day: `${index + 1}일차`,
                        date: dayData.date || '',
                        exercises: dayData.exercises || [],
                        note: dayData.note || ''
                    }
                }
                
                // 운동 데이터 상세 검증
                if (dayData.exercises && Array.isArray(dayData.exercises)) {
                    console.log(`   💪 ${dayData.day} 운동 상세:`)
                    dayData.exercises.forEach((exercise, exIndex) => {
                        console.log(`      ${exIndex + 1}. ${exercise.name} (${exercise.duration}) - ${exercise.category}`)
                    })
                }
                
                return {
                    day: dayData.day,
                    date: dayData.date || '',
                    exercises: Array.isArray(dayData.exercises) ? dayData.exercises : [],
                    note: dayData.note || ''
                }
            })
            
            const result = {
                ...parsedData,
                weeklyRoutine: validatedRoutine
            }
            
            console.log('🎉 검증된 최종 데이터:', result)
            console.log('📊 최종 요일 수:', result.weeklyRoutine.length)
            
            return result
            
        } catch (parseError) {
            console.error('💥 Prescription 파싱 오류 발생!')
            console.error('❌ 에러 메시지:', parseError.message)
            console.error('❌ 에러 스택:', parseError.stack)
            console.log('📄 파싱 실패한 원본 문자열 (전체):', prescriptionString)
            
            // JSON 파싱 에러인 경우 더 상세한 정보 제공
            if (parseError instanceof SyntaxError) {
                console.error('🔧 JSON 구문 오류 상세:')
                console.error('   - 에러 위치:', parseError.message)
                
                // 문제가 되는 부분 찾기 시도
                try {
                    const lines = prescriptionString.split('\n')
                    console.log('📋 라인별 분석:')
                    lines.forEach((line, index) => {
                        console.log(`   ${index + 1}: ${line}`)
                    })
                } catch (e) {
                    console.log('라인 분석 실패')
                }
            }
            
            // 파싱 실패 시 빈 루틴 반환
            return {
                weeklyRoutine: [],
                error: '운동 프로그램 데이터 파싱에 실패했습니다.',
                originalError: parseError.message
            }
        }
    }

    const saveSurvey = () => {
        // 로컬 스토리지에 설문 데이터 저장
        localStorage.setItem('survey_data', JSON.stringify(formData))
        console.log('설문 데이터가 저장되었습니다:', formData)
        return true
    }

    // 유저의 모든 운동 루틴(처방) 불러오기
    const fetchAllPrescriptions = async () => {
        const authStore = useAuthStore()
        if (!authStore.isAuthenticated) {
            throw new Error('로그인이 필요한 서비스입니다.')
        }
        isLoading.value = true
        error.value = null
        try {
            const response = await getAllPrescriptions(true)
            // response.data.data는 배열 (최신순 정렬 가정)
            const prescriptions = response.data?.data || []
            if (!prescriptions.length) {
                rehabPrograms.value = []
                return []
            }
            // prescription 필드 파싱 (가장 최근 것만 사용)
            const latest = prescriptions[0]
            if (!latest.prescription) {
                rehabPrograms.value = []
                return []
            }
            const prescriptionData = parsePrescription(latest.prescription)
            
            // rehabProgramId를 각 요일 데이터에 추가
            const routineWithId = prescriptionData.weeklyRoutine.map(day => ({
                ...day,
                rehabProgramId: latest.rehabProgramId
            }))
            
            rehabPrograms.value = routineWithId || []
            return rehabPrograms.value
        } catch (err) {
            error.value = err.response?.data?.message || err.message || '운동 루틴을 불러오는데 실패했습니다.'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    return {
        formData,
        rehabPrograms,
        isLoading,
        error,
        updateForm,
        resetForm,
        fetchRehabPrograms,
        saveSurvey,
        fetchAllPrescriptions
    }
})
