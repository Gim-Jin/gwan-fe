<template>
  <button
    class="recommend-btn"
    :class="{ active: isRecommended, loading: loading }"
    :disabled="!isAuthenticated || loading"
    @click.stop="toggle"
  >
    <span v-if="loading" class="spinner-border spinner-border-sm" role="status"></span>
    <i v-else class="bi" :class="isRecommended ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'"></i>
    <span>추천</span>
    <span class="count">{{ currentRecommendCount }}</span>
  </button>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useCommunityStore } from '@/stores/communityStore'
import { useAuthStore } from '@/stores/auth'
import { addRecommend, removeRecommend } from '@/api/community'

const props = defineProps({
  article: Object,
  isAuthenticated: Boolean,
  isRecommended: Boolean
})

const emit = defineEmits(['update:isRecommended'])

const communityStore = useCommunityStore()
const authStore = useAuthStore()

const loading = ref(false)
const currentRecommendCount = ref(0)

// 초기 추천 개수 설정
const initRecommendCount = () => {
  // article.recommends가 배열이면 길이를, recommentCount가 있으면 그 값을 사용
  if (Array.isArray(props.article.recommends)) {
    currentRecommendCount.value = props.article.recommends.length
  } else if (props.article.recommentCount !== undefined) {
    currentRecommendCount.value = props.article.recommentCount
  } else {
    // 둘 다 없으면 API로 가져오기
    communityStore.fetchRecommendCount(props.article.articleId || props.article.id).then(count => {
      currentRecommendCount.value = count
    })
  }
}

onMounted(() => {
  initRecommendCount()
})

watch(() => props.article, () => {
  initRecommendCount()
}, { deep: true })

const toggle = async () => {
  if (!props.isAuthenticated || loading.value) return
  loading.value = true
  
  try {
    if (props.isRecommended) {
      await removeRecommend(props.article.articleId || props.article.id)
      currentRecommendCount.value = Math.max(0, currentRecommendCount.value - 1)
      emit('update:isRecommended', false)
    } else {
      await addRecommend(props.article.articleId || props.article.id)
      currentRecommendCount.value += 1
      emit('update:isRecommended', true)
    }
  } catch (error) {
    console.error('추천 토글 실패:', error)
    // 실패 시 원래 상태로 복구
    await initRecommendCount()
  } finally {
    loading.value = false
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

.recommend-btn.loading {
  opacity: 0.7;
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

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: 0.15rem;
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