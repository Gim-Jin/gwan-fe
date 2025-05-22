import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTargetStore = defineStore('target', () => {
  const targetList = ref([])
  const popularTargetList = ref([])

  const fetchTargets = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/targets')
      const data = await res.json()
      targetList.value = data.data || []
    } catch (e) {
      targetList.value = []
    }
  }

  const fetchPopularTargets = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/targets?sort=popular')
      const data = await res.json()
      popularTargetList.value = (data.data || []).slice(0, 5)
    } catch (e) {
      popularTargetList.value = []
    }
  }

  return { targetList, fetchTargets, popularTargetList, fetchPopularTargets }
}) 