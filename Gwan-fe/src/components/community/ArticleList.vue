<template>
  <div class="article-list-container">
    <div class="list-header">
      <h1 class="page-title">
        <i class="bi bi-chat-square-text-fill"></i>
        커뮤니티
      </h1>
      <button v-if="isAuthenticated" class="write-btn" @click="goWrite">
        <i class="bi bi-pencil-square"></i>
        글쓰기
      </button>
    </div>
    
    <!-- 로딩 상태 -->
    <div v-if="loading" class="loading-container">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">불러오는 중...</span>
      </div>
      <p class="mt-2">게시글을 불러오는 중...</p>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="alert alert-danger">
      <i class="bi bi-exclamation-triangle"></i>
      {{ error }}
      <button @click="communityStore.fetchArticles()" class="btn btn-outline-danger btn-sm ms-2">
        다시 시도
      </button>
    </div>
    
    <!-- 빈 상태 -->
    <div v-else-if="articles.length === 0" class="empty-state">
      <i class="bi bi-inbox"></i>
      <h3>아직 게시글이 없습니다</h3>
      <p>첫 번째 게시글을 작성해보세요!</p>
      <button v-if="isAuthenticated" class="write-btn-empty" @click="goWrite">
        글쓰기
      </button>
    </div>
    
    <transition-group name="list" tag="div" class="article-grid" v-else>
      <article
        v-for="article in articles"
        :key="article.articleId || article.id"
        class="article-card"
        @click="goDetail(article.articleId || article.id)"
      >
        <div class="article-content">
          <h2 class="article-title">{{ article.title }}</h2>
          <div class="article-meta">
            <div class="meta-item">
              <i class="bi bi-person"></i>
              <span>{{ article.userName || '익명' }}</span>
            </div>
            <div class="meta-item">
              <i class="bi bi-calendar3"></i>
              <span>{{ formatDate(article.createAt || article.createdAt) }}</span>
            </div>
          </div>
        </div>
        
        <div class="article-stats">
          <div class="stat-item">
            <i class="bi bi-chat-dots"></i>
            <span>{{ article.reviews?.length || 0 }}</span>
          </div>
        </div>
      </article>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCommunityStore } from '@/stores/communityStore'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const communityStore = useCommunityStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const articles = computed(() => communityStore.articles)
const loading = computed(() => communityStore.loading)
const error = computed(() => communityStore.error)

function goWrite() {
  if (!isAuthenticated.value) {
    alert('로그인 후 게시글을 작성할 수 있습니다.')
    router.push({ name: 'login' })
    return
  }
  router.push({ name: 'ArticleWrite' })
}

function goDetail(id) {
  router.push({ name: 'ArticleDetail', params: { id } })
}

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

// 컴포넌트 마운트 시 게시글 목록 불러오기
onMounted(() => {
  communityStore.fetchArticles()
})
</script>

<style scoped>
.article-list-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: calc(100vh - 200px);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid var(--primary-color);
}

.page-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.page-title i {
  color: var(--primary-color);
  font-size: 2rem;
}

.write-btn {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover-color) 100%);
  color: var(--secondary-color);
  border: none;
  border-radius: 12px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(255, 138, 101, 0.15);
}

.write-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 138, 101, 0.18);
  background: var(--primary-hover-color);
}

.write-btn:active {
  transform: translateY(0);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-color);
}

.empty-state i {
  font-size: 5rem;
  color: #ffd6c2;
  margin-bottom: 1.5rem;
  display: block;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.empty-state p {
  margin-bottom: 2rem;
}

.write-btn-empty {
  background: var(--primary-color);
  color: var(--secondary-color);
  border: none;
  border-radius: 8px;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.write-btn-empty:hover {
  background: var(--primary-hover-color);
}

.loading-container {
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
}

.article-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
}

.article-card {
  background: var(--secondary-color);
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #ffe0d3;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(255, 138, 101, 0.06);
}

.article-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--primary-color);
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.article-card:hover {
  transform: translateX(4px);
  box-shadow: 0 8px 25px rgba(255, 138, 101, 0.13);
  border-color: var(--primary-color);
}

.article-card:hover::before {
  transform: scaleY(1);
}

.article-content {
  flex: 1;
  padding-right: 1rem;
}

.article-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 0.8rem 0;
  line-height: 1.4;
  transition: color 0.3s ease;
}

.article-card:hover .article-title {
  color: var(--primary-color);
}

.article-meta {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #b26a4c;
  font-size: 0.9rem;
}

.meta-item i {
  font-size: 0.95rem;
  color: #ffab91;
}

.article-stats {
  display: flex;
  gap: 1.2rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.8rem;
  background: #fff2eb;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #b26a4c;
  transition: all 0.3s ease;
}

.stat-item i {
  font-size: 1rem;
}

.article-card:hover .stat-item {
  background: #ffe0d3;
  color: var(--primary-color);
}

/* 리스트 애니메이션 */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .article-list-container {
    padding: 1.5rem 0.8rem;
  }
  
  .page-title {
    font-size: 1.8rem;
  }
  
  .write-btn {
    padding: 0.7rem 1.2rem;
    font-size: 0.9rem;
  }
  
  .article-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .article-stats {
    width: 100%;
    justify-content: flex-start;
  }
}
</style> 