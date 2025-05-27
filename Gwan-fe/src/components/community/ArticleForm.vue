<template>
  <div class="article-form-container">
    <div class="form-card">
      <div class="form-header">
        <h1 class="form-title">
          <i class="bi" :class="isEdit ? 'bi-pencil-square' : 'bi-pencil'"></i>
          {{ isEdit ? '게시글 수정' : '새 게시글 작성' }}
        </h1>
      </div>
      
      <form @submit.prevent="submit" class="article-form">
        <div class="form-group">
          <label for="title" class="form-label">제목</label>
          <input
            id="title"
            v-model="title"
            type="text"
            class="form-input"
            :placeholder="isAuthenticated ? '제목을 입력하세요' : '로그인이 필요합니다'"
            :disabled="!isAuthenticated"
            maxlength="100"
          />
          <span class="char-count">{{ title.length }}/100</span>
        </div>
        
        <div class="form-group">
          <label for="content" class="form-label">내용</label>
          <textarea
            id="content"
            v-model="content"
            class="form-textarea"
            :placeholder="isAuthenticated ? '내용을 입력하세요' : '로그인이 필요합니다'"
            :disabled="!isAuthenticated"
            rows="12"
          />
        </div>
        
        <div class="form-actions">
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="!isAuthenticated || !title.trim() || !content.trim() || submitLoading"
          >
            <span v-if="submitLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
            <i v-else class="bi bi-check-lg"></i>
            {{ submitLoading ? '저장 중...' : (isEdit ? '수정 완료' : '작성 완료') }}
          </button>
          <button type="button" class="btn btn-secondary" @click="goList" :disabled="submitLoading">
            <i class="bi bi-x-lg"></i>
            취소
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCommunityStore } from '@/stores/communityStore'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const communityStore = useCommunityStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isEdit = computed(() => route.name === 'ArticleEdit')
const loading = computed(() => communityStore.loading)
const error = computed(() => communityStore.error)

const title = ref('')
const content = ref('')
const submitLoading = ref(false)

const submit = async () => {
  // 로그인 체크
  if (!isAuthenticated.value) {
    alert('로그인 후 게시글을 작성할 수 있습니다.')
    router.push({ name: 'login' })
    return
  }
  
  if (!title.value.trim() || !content.value.trim()) {
    alert('제목과 내용을 모두 입력해주세요.')
    return
  }
  
  submitLoading.value = true
  
  try {
    const articleData = {
      title: title.value.trim(),
      content: content.value.trim()
    }
    
    if (isEdit.value) {
      const articleId = Number(route.params.id)
      const updatedArticle = await communityStore.editArticle(articleId, articleData)
      console.log('수정된 게시글:', updatedArticle)
      const id = updatedArticle.articleId || updatedArticle.id
      if (!id) {
        throw new Error('게시글 ID를 찾을 수 없습니다.')
      }
      router.push({ name: 'ArticleDetail', params: { id } })
    } else {
      const newArticle = await communityStore.addArticle(articleData)
      
      // 서버에서 ID를 반환하지 않는 경우 목록 페이지로 이동
      const id = newArticle.articleId || newArticle.id
      if (id) {
        router.push({ name: 'ArticleDetail', params: { id } })
      } else {
        // ID가 없으면 목록 페이지로 이동하고 성공 메시지 표시
        alert('게시글이 성공적으로 작성되었습니다!')
        router.push({ name: 'ArticleList' })
      }
    }
  } catch (err) {
    console.error('게시글 저장 실패:', err)
    
    // 401 에러인 경우 로그인 페이지로 리다이렉트
    if (err.response?.status === 401) {
      alert('로그인이 필요합니다.')
      router.push({ name: 'login' })
      return
    }
    
    alert(err.response?.data?.message || '게시글 저장에 실패했습니다.')
  } finally {
    submitLoading.value = false
  }
}

function goList() {
  router.push({ name: 'ArticleList' })
}

// 편집 모드일 때 기존 게시글 데이터 불러오기
onMounted(async () => {
  // 로그인 체크 (라우터 가드가 있지만 추가 보안)
  if (!isAuthenticated.value) {
    alert('로그인이 필요한 페이지입니다.')
    router.push({ name: 'login' })
    return
  }
  
  if (isEdit.value) {
    const articleId = Number(route.params.id)
    try {
      const article = await communityStore.fetchArticle(articleId)
      if (article) {
        title.value = article.title || ''
        content.value = article.content || ''
      }
    } catch (err) {
      console.error('게시글 불러오기 실패:', err)
      alert('게시글을 불러오는데 실패했습니다.')
      router.push({ name: 'ArticleList' })
    }
  }
})
</script>

<style scoped>
.article-form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
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

.form-card {
  background: var(--secondary-color);
  border-radius: 16px;
  box-shadow: 0 2px 20px rgba(255, 138, 101, 0.08);
  overflow: hidden;
}

.form-header {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover-color) 100%);
  color: var(--secondary-color);
  padding: 2rem;
}

.form-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.form-title i {
  font-size: 1.6rem;
}

.article-form {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.form-label {
  display: block;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 2px solid #ffe0d3;
  border-radius: 8px;
  font-size: 1rem;
  color: var(--text-color);
  transition: all 0.3s ease;
  background: #fff7f0;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  background: var(--secondary-color);
  box-shadow: 0 0 0 3px rgba(255, 138, 101, 0.08);
}

.form-input:disabled,
.form-textarea:disabled {
  background: #ffe0d3;
  color: #b26a4c;
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
  min-height: 200px;
  line-height: 1.6;
}

.char-count {
  position: absolute;
  right: 1rem;
  top: 2.3rem;
  font-size: 0.8rem;
  color: #ffab91;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #ffe0d3;
}

.btn {
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn i {
  font-size: 1.1rem;
}

.btn-primary {
  background: var(--primary-color);
  color: var(--secondary-color);
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-hover-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 138, 101, 0.18);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  background: #ffd6c2;
  cursor: not-allowed;
  opacity: 0.7;
}

.btn-secondary {
  background: #ffe0d3;
  color: var(--primary-color);
}

.btn-secondary:hover {
  background: #ffd6c2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 138, 101, 0.08);
}

.btn-secondary:active {
  transform: translateY(0);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .article-form-container {
    padding: 1rem 0.5rem;
  }
  
  .form-header {
    padding: 1.5rem;
  }
  
  .form-title {
    font-size: 1.5rem;
  }
  
  .article-form {
    padding: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style> 