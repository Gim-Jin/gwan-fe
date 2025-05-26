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
    
    <div v-if="articles.length === 0" class="empty-state">
      <i class="bi bi-inbox"></i>
      <h3>아직 게시글이 없습니다</h3>
      <p>첫 번째 게시글을 작성해보세요!</p>
      <button v-if="isAuthenticated" class="write-btn-empty" @click="goWrite">
        글쓰기
      </button>
    </div>
    
    <transition-group name="list" tag="div" class="article-grid">
      <article
        v-for="article in articles"
        :key="article.article_id"
        class="article-card"
        @click="goDetail(article.article_id)"
      >
        <div class="article-content">
          <h2 class="article-title">{{ article.title }}</h2>
          <div class="article-meta">
            <div class="meta-item">
              <i class="bi bi-person"></i>
              <span>로그인 유저</span>
            </div>
            <div class="meta-item">
              <i class="bi bi-calendar3"></i>
              <span>{{ formatDate(article.created_at) }}</span>
            </div>
          </div>
        </div>
        
        <div class="article-stats">
          <div class="stat-item">
            <i class="bi bi-hand-thumbs-up"></i>
            <span>{{ article.recommends.length }}</span>
          </div>
          <div class="stat-item">
            <i class="bi bi-chat-dots"></i>
            <span>{{ article.comments.length }}</span>
          </div>
        </div>
      </article>
    </transition-group>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { dummyArticles } from '@/stores/communityDummy'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isAuthenticated = authStore.isAuthenticated
const articles = ref(dummyArticles)

function goWrite() {
  router.push({ name: 'ArticleWrite' })
}

function goDetail(id) {
  router.push({ name: 'ArticleDetail', params: { id } })
}

function formatDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return '오늘'
  if (diffDays === 1) return '어제'
  if (diffDays < 7) return `${diffDays}일 전`
  
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
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
  border-bottom: 2px solid #f0f0f0;
}

.page-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.page-title i {
  color: #3498db;
  font-size: 2rem;
}

.write-btn {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
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
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

.write-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
}

.write-btn:active {
  transform: translateY(0);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #7f8c8d;
}

.empty-state i {
  font-size: 5rem;
  color: #bdc3c7;
  margin-bottom: 1.5rem;
  display: block;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #34495e;
  margin-bottom: 0.5rem;
}

.empty-state p {
  margin-bottom: 2rem;
}

.write-btn-empty {
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.write-btn-empty:hover {
  background: #2980b9;
}

.article-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
}

.article-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #ecf0f1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.article-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: #3498db;
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.article-card:hover {
  transform: translateX(4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  border-color: #3498db;
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
  color: #2c3e50;
  margin: 0 0 0.8rem 0;
  line-height: 1.4;
  transition: color 0.3s ease;
}

.article-card:hover .article-title {
  color: #3498db;
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
  color: #7f8c8d;
  font-size: 0.9rem;
}

.meta-item i {
  font-size: 0.95rem;
  color: #95a5a6;
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
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #606770;
  transition: all 0.3s ease;
}

.stat-item i {
  font-size: 1rem;
}

.article-card:hover .stat-item {
  background: #e3f2fd;
  color: #3498db;
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