<template>
  <!-- 로딩 상태 -->
  <div v-if="loading" class="loading-container">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">불러오는 중...</span>
    </div>
    <p class="mt-2">게시글을 불러오는 중...</p>
  </div>

  <!-- 에러 상태 -->
  <div v-else-if="error" class="error-container">
    <div class="alert alert-danger">
      <i class="bi bi-exclamation-triangle"></i>
      {{ error }}
      <button @click="communityStore.fetchArticle(Number(route.params.id))" class="btn btn-outline-danger btn-sm ms-2">
        다시 시도
      </button>
    </div>
  </div>

  <!-- 게시글 상세 -->
  <div v-else-if="article" class="article-detail-container">
    <div class="article-card">
      <div class="article-header">
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-meta">
          <div class="meta-item">
            <i class="bi bi-person-circle"></i>
            <span>{{ article.userName || '익명' }}</span>
          </div>
          <div class="meta-item">
            <i class="bi bi-clock"></i>
            <span>{{ formatDate(article.createTime || article.createAt || article.createdAt || article.created_at) }}</span>
          </div>
          <div class="meta-item">
            <i class="bi bi-chat-dots"></i>
            <span>{{ article.reviews?.length || 0 }}개의 댓글</span>
          </div>
        </div>
      </div>
      
      <div class="article-content">{{ article.content }}</div>
      

    </div>

    <div class="comments-section">
      <h3 class="comments-title">
        <i class="bi bi-chat-square-text"></i>
        댓글
      </h3>
      <CommentList :reviews="article.reviews || []" :isAuthenticated="isAuthenticatedValue" :article="article" @deleted="handleReviewDeleted" />
      <CommentForm :article="article" :isAuthenticated="isAuthenticatedValue" />
    </div>
  </div>
  <div v-else class="not-found">
    <i class="bi bi-file-earmark-x"></i>
    <p>게시글을 찾을 수 없습니다.</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCommunityStore } from '@/stores/communityStore'
import { useAuthStore } from '@/stores/auth'

import CommentList from './ReviewList.vue'
import CommentForm from './ReviewForm.vue'

const route = useRoute()
const authStore = useAuthStore()
const communityStore = useCommunityStore()

const isAuthenticatedValue = computed(() => authStore.isAuthenticated)
const article = computed(() => communityStore.currentArticle)
const loading = computed(() => communityStore.loading)
const error = computed(() => communityStore.error)

// 날짜 포맷팅 함수
function formatDate(dateString) {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const now = new Date()
  
  // 유효하지 않은 날짜 체크
  if (isNaN(date.getTime())) return '날짜 오류'
  
  // 시간 차이 계산 (밀리초)
  const diffTime = now.getTime() - date.getTime()
  
  // 미래 날짜인 경우
  if (diffTime < 0) {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  // 분 단위 계산
  const diffMinutes = Math.floor(diffTime / (1000 * 60))
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  
  // 1분 미만
  if (diffMinutes < 1) return '방금 전'
  
  // 1시간 미만
  if (diffMinutes < 60) return `${diffMinutes}분 전`
  
  // 24시간 미만
  if (diffHours < 24) return `${diffHours}시간 전`
  
  // 1일
  if (diffDays === 1) return '어제'
  
  // 7일 미만
  if (diffDays < 7) return `${diffDays}일 전`
  
  // 4주 미만
  if (diffWeeks < 4) return `${diffWeeks}주 전`
  
  // 1개월 이상
  if (diffMonths >= 1) return `${diffMonths}개월 전`
  
  // 기본값 (날짜 형식)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function handleReviewDeleted(deletedId) {
  if (!article.value || !article.value.reviews) return
  article.value.reviews = article.value.reviews.filter(r => (r.reviewId || r.id) !== deletedId)
}

// 컴포넌트 마운트 시 게시글 상세 정보 불러오기
onMounted(() => {
  const articleId = route.params.id
  if (articleId) {
    communityStore.fetchArticle(Number(articleId))
  }
})
</script>

<style scoped>
.article-detail-container {
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

.article-card {
  background: var(--secondary-color);
  border-radius: 16px;
  box-shadow: 0 2px 20px rgba(255, 138, 101, 0.08);
  padding: 2.5rem;
  margin-bottom: 2rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 30px rgba(255, 138, 101, 0.13);
}

.article-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid var(--primary-color);
}

.article-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0 0 1rem 0;
  line-height: 1.4;
}

.article-meta {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #b26a4c;
  font-size: 0.95rem;
}

.meta-item i {
  font-size: 1.1rem;
  color: #ffab91;
}

.article-content {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-color);
  margin-bottom: 2rem;
  white-space: pre-line;
}

.article-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #ffe0d3;
}

.comments-section {
  background: var(--secondary-color);
  border-radius: 16px;
  box-shadow: 0 2px 20px rgba(255, 138, 101, 0.08);
  padding: 2rem;
  animation: slideUp 0.4s ease-out 0.1s both;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.comments-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--primary-color);
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.comments-title i {
  color: var(--primary-color);
}

.not-found {
  text-align: center;
  padding: 4rem 2rem;
  color: #b26a4c;
}

.not-found i {
  font-size: 4rem;
  color: #ffd6c2;
  margin-bottom: 1rem;
  display: block;
}

.not-found p {
  font-size: 1.1rem;
}

.loading-container,
.error-container {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-color);
}

.alert {
  margin: 2rem 0;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .article-detail-container {
    padding: 1rem 0.5rem;
  }
  
  .article-card,
  .comments-section {
    padding: 1.5rem;
  }
  
  .article-title {
    font-size: 1.5rem;
  }
  
  .article-meta {
    gap: 1rem;
    font-size: 0.9rem;
  }
}
</style> 