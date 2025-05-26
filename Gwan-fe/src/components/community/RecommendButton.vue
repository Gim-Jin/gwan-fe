<template>
  <button
    class="recommend-btn"
    :class="{ active: isRecommended }"
    :disabled="!isAuthenticated"
    @click.stop="recommend"
  >
    <i class="bi" :class="isRecommended ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'"></i>
    <span>추천</span>
    <span class="count">{{ article.recommends.length }}</span>
  </button>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  article: Object,
  isAuthenticated: Boolean
})

const isRecommended = ref(false)

function recommend() {
  if (props.isAuthenticated && !isRecommended.value) {
    props.article.recommends.push(1)
    isRecommended.value = true
  }
}
</script>

<style scoped>
.recommend-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #fff2eb;
  border: 2px solid #ffe0d3;
  border-radius: 12px;
  padding: 0.6rem 1.2rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #b26a4c;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.recommend-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 138, 101, 0.08);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.4s ease, height 0.4s ease;
}

.recommend-btn:hover:not(:disabled)::before {
  width: 100%;
  height: 100%;
}

.recommend-btn:hover:not(:disabled) {
  background: var(--secondary-color);
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 138, 101, 0.13);
}

.recommend-btn:active:not(:disabled) {
  transform: translateY(0);
}

.recommend-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: var(--secondary-color);
}

.recommend-btn.active:hover:not(:disabled) {
  background: var(--primary-hover-color);
  border-color: var(--primary-hover-color);
}

.recommend-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.recommend-btn:disabled:hover {
  transform: none;
  box-shadow: none;
}

.recommend-btn i {
  font-size: 1.1rem;
  position: relative;
  z-index: 1;
  color: inherit;
}

.recommend-btn span {
  position: relative;
  z-index: 1;
}

.count {
  background: #ffe0d3;
  padding: 0.1rem 0.5rem;
  border-radius: 8px;
  font-size: 0.85rem;
  margin-left: 0.2rem;
}

.recommend-btn.active .count {
  background: rgba(255, 255, 255, 0.2);
}

/* 애니메이션 효과 */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.recommend-btn:active:not(:disabled) i {
  animation: pulse 0.3s ease;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .recommend-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
  
  .recommend-btn i {
    font-size: 1rem;
  }
}
</style> 