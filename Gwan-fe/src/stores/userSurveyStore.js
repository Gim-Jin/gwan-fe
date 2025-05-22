import { defineStore } from 'pinia'
import { reactive } from 'vue'

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

    const updateForm = (payload) => {
        Object.assign(formData, payload)
    }

    const resetForm = () => {
        for (const key in formData) {
            formData[key] = ''
        }
    }

    const saveSurvey = () => {
        // 로컬 스토리지에 설문 데이터 저장
        localStorage.setItem('survey_data', JSON.stringify(formData))
        console.log('설문 데이터가 저장되었습니다:', formData)
        
        // 실제 구현에서는 여기서 서버 API 호출을 하거나 
        // 다른 작업을 수행할 수 있습니다.
        return true
    }

    return {
        formData,
        updateForm,
        resetForm,
        saveSurvey
    }
})
