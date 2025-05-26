<template>
  <div v-if="article" class="article-detail-container">
    <div class="article-card">
      <div class="article-header">
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-meta">
          <div class="meta-item">
            <i class="bi bi-person-circle"></i>
            <span>로그인 유저</span>
          </div>
          <div class="meta-item">
            <i class="bi bi-clock"></i>
            <span>{{ article.created_at }}</span>
          </div>
          <div class="meta-item">
            <i class="bi bi-chat-dots"></i>
            <span>{{ article.comments.length }}개의 댓글</span>
          </div>
        </div>
      </div>
      
      <div class="article-content">{{ article.content }}</div>
      
      <div class="article-actions">
        <RecommendButton :article="article" :isAuthenticated="isAuthenticatedValue" />
      </div>
    </div>

    <div class="comments-section">
      <h3 class="comments-title">
        <i class="bi bi-chat-square-text"></i>
        댓글
      </h3>
      <CommentList :comments="article.comments" :isAuthenticated="isAuthenticatedValue" :article="article" />
      <CommentForm :article="article" :isAuthenticated="isAuthenticatedValue" />
    </div>
  </div>
  <div v-else class="not-found">
    <i class="bi bi-file-earmark-x"></i>
    <p>게시글을 찾을 수 없습니다.</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { dummyArticles } from '@/stores/communityDummy'
import { useAuthStore } from '@/stores/auth'
import RecommendButton from './RecommendButton.vue'
import CommentList from './CommentList.vue'
import CommentForm from './CommentForm.vue'

const route = useRoute()
const authStore = useAuthStore()
// computed를 값으로 변환
const isAuthenticatedValue = computed(() => authStore.isAuthenticated)
const article = ref(dummyArticles.find(a => a.article_id === Number(route.params.id)))
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