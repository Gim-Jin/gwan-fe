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
            :disabled="!isAuthenticated || !title.trim() || !content.trim()"
          >
            <i class="bi bi-check-lg"></i>
            {{ isEdit ? '수정 완료' : '작성 완료' }}
          </button>
          <button type="button" class="btn btn-secondary" @click="goList">
            <i class="bi bi-x-lg"></i>
            취소
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { dummyArticles } from '@/stores/communityDummy'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const isAuthenticated = authStore.isAuthenticated
const isEdit = computed(() => route.name === 'ArticleEdit')
const article = isEdit.value ? dummyArticles.find(a => a.article_id === Number(route.params.id)) : null
const title = ref(article ? article.title : '')
const content = ref(article ? article.content : '')

function submit() {
  if (!title.value.trim() || !content.value.trim()) return
  
  if (isEdit.value && article) {
    article.title = title.value
    article.content = content.value
    article.updated_at = new Date().toISOString().slice(0, 16).replace('T', ' ')
    router.push({ name: 'ArticleDetail', params: { id: article.article_id } })
  } else {
    const newId = (dummyArticles.at(-1)?.article_id || 0) + 1
    dummyArticles.push({
      article_id: newId,
      title: title.value,
      content: content.value,
      created_at: new Date().toISOString().slice(0, 16).replace('T', ' '),
      updated_at: new Date().toISOString().slice(0, 16).replace('T', ' '),
      recommends: [],
      comments: []
    })
    router.push({ name: 'ArticleDetail', params: { id: newId } })
  }
}

function goList() {
  router.push({ name: 'ArticleList' })
}
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
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.form-header {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
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
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  color: #2c3e50;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3498db;
  background: white;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-input:disabled,
.form-textarea:disabled {
  background: #e9ecef;
  color: #6c757d;
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
  color: #95a5a6;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
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
  background: #3498db;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  opacity: 0.7;
}

.btn-secondary {
  background: #ecf0f1;
  color: #34495e;
}

.btn-secondary:hover {
  background: #bdc3c7;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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