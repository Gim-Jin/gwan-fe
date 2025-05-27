<template>
  <form class="review-form" @submit.prevent="submitReview">
    <div class="form-wrapper">
      <div class="avatar-placeholder">
        <i class="bi bi-person-circle"></i>
      </div>
      <div class="input-wrapper">
        <textarea
          v-model="content"
          :disabled="!isAuthenticated"
          :placeholder="isAuthenticated ? '댓글을 입력하세요...' : '로그인 후 댓글을 작성할 수 있습니다.'"
          @keydown.enter.ctrl="submitReview"
          rows="1"
          ref="textareaRef"
          @input="adjustHeight"
        />
        <div class="form-actions">
          <span class="hint" v-if="isAuthenticated && content">
            <kbd>Ctrl</kbd> + <kbd>Enter</kbd>로 등록
          </span>
          <button
            type="submit"
            :disabled="!isAuthenticated || !content.trim() || isSubmitting"
            class="submit-btn"
          >
            <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status"></span>
            <i v-else class="bi bi-send"></i>
            {{ isSubmitting ? '등록 중...' : '등록' }}
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useCommunityStore } from '@/stores/communityStore'

const props = defineProps({
  article: Object,
  isAuthenticated: Boolean
})

const communityStore = useCommunityStore()
const content = ref('')
const textareaRef = ref(null)
const isSubmitting = ref(false)

function adjustHeight() {
  const textarea = textareaRef.value
  if (textarea) {
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }
}

async function submitReview() {
  if (!content.value.trim() || isSubmitting.value) return
  
  // 로그인 체크
  if (!props.isAuthenticated) {
    alert('로그인 후 댓글을 작성할 수 있습니다.')
    return
  }
  
  isSubmitting.value = true
  
  try {
    await communityStore.addComment(props.article.articleId || props.article.id, {
      content: content.value.trim()
    })
    
    content.value = ''
    await nextTick()
    adjustHeight()
  } catch (error) {
    console.error('댓글 작성 실패:', error)
    
    // 401 에러인 경우 로그인 페이지로 리다이렉트
    if (error.response?.status === 401) {
      alert('로그인이 필요합니다.')
      window.location.href = '/login'
      return
    }
    
    alert('댓글 작성에 실패했습니다.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.review-form {
  margin-top: 1.5rem;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-wrapper {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.avatar-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #ffe0d3;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-placeholder i {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.input-wrapper {
  flex: 1;
  background: #fff7f0;
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.input-wrapper:focus-within {
  background: var(--secondary-color);
  box-shadow: 0 0 0 2px var(--primary-color);
}

textarea {
  width: 100%;
  border: none;
  background: transparent;
  resize: none;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--text-color);
  outline: none;
  min-height: 24px;
  max-height: 120px;
  transition: height 0.2s ease;
}

textarea::placeholder {
  color: #ffab91;
}

textarea:disabled {
  cursor: not-allowed;
  color: #ffd6c2;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.input-wrapper:focus-within .form-actions,
.input-wrapper:hover .form-actions {
  opacity: 1;
}

.hint {
  font-size: 0.8rem;
  color: #b26a4c;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.hint kbd {
  background: var(--secondary-color);
  border: 1px solid #ffd6c2;
  color:#b26a4c;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.75rem;
  font-family: monospace;
  box-shadow: 0 2px 0 #ffd6c2;
}

.submit-btn {
  background: var(--primary-color);
  color: var(--secondary-color);
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.submit-btn:hover:not(:disabled) {
  background: var(--primary-hover-color);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 138, 101, 0.13);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  background: #ffd6c2;
  cursor: not-allowed;
  opacity: 0.6;
}

.submit-btn i {
  font-size: 0.9rem;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .avatar-placeholder {
    display: none;
  }
  
  .form-actions {
    opacity: 1;
  }
  
  .hint {
    display: none;
  }
}
</style> 