<template>
    <div class="progress-bar-container">
      <div class="progress-bar">
        <div class="progress-bar-fill" :style="{ width: percent + '%' }"></div>
      </div>
  
      <div class="progress-info">
        <span>단계 {{ currentStep }}/{{ totalSteps }}</span>
        <span>{{ percent }}%</span>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    currentStep: { type: Number, required: true },
    totalSteps : { type: Number, default : 4 }
  })
  
  const percent = computed(() =>
    Math.round((props.currentStep / props.totalSteps) * 100)
  )
  </script>
  
  <style scoped>
  .progress-bar-container { margin-bottom: 1.5rem; }
  .progress-bar {
    height: 6px; background: #e9ecef;
    border-radius: 9999px; overflow: hidden;
  }
  .progress-bar-fill {
    height: 100%; background: var(--primary-color, #fd866e);
    width: 0;                       /* 시작은 0% */
    transition: width 400ms ease;   /* 부드럽게 이동 */
  }
  .progress-info {
    margin-top: .35rem;
    display: flex; justify-content: space-between;
    font-size: .85rem; color: #666;
  }
  </style>
  