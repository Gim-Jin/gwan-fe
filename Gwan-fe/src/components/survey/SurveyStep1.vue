<template>
  <div class="survey-card">
    <p class="step-indicator">Step 1 of 4</p>
    <h2 class="title">기본 정보</h2>

    <form class="form">
      <input v-model="formData.age" type="number" placeholder="나이를 입력하세요" />
      <input v-model="formData.height" type="number" placeholder="키를 입력하세요 (cm)" />
      <input v-model="formData.weight" type="number" placeholder="몸무게를 입력하세요 (kg)" />
      <input v-model="formData.gender" type="text" placeholder="성별 (예: 남성, 여성)" />
    </form>

    <div class="btn-group">
      <button @click="$emit('next', formData)">다음</button>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'

export default {
  setup() {
    const formData = reactive({
      age: '',
      height: '',
      weight: '',
      gender: ''
    })

    return {
      formData
    }
  }
}
</script>

<style scoped>
@import './survey-styles.css';
</style>

