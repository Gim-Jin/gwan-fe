<template>
  <div>
    <h5 class="mb-3">좋아요 누른 게시글</h5>
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">불러오는 중...</span>
      </div>
    </div>
    <div v-else-if="likedArticles.length === 0" class="text-center py-5 text-muted">
      <i class="bi bi-hand-thumbs-up fs-1 mb-3"></i>
      <p>좋아요 누른 게시글이 없습니다.</p>
    </div>
    <div v-else>
      <div
        v-for="article in likedArticles"
        :key="article.articleId"
        class="card mb-3 p-3 hover-card"
        @click="goToArticle(article.articleId)"
        style="cursor: pointer;"
      >
        <div class="d-flex justify-content-between align-items-center">
          <div class="flex-grow-1">
            <h6 class="mb-1">{{ article.title }}</h6>
            <div class="d-flex gap-3 text-muted small">
              <span><i class="bi bi-person"></i> {{ article.userName || '익명' }}</span>
              <span><i class="bi bi-calendar3"></i> {{ formatDate(article.createAt) }}</span>
              <span><i class="bi bi-chat-dots"></i> {{ article.reviewCount || 0 }}개</span>
              <span><i class="bi bi-hand-thumbs-up-fill text-primary"></i> {{ article.recommentCount || 0 }}개</span>
            </div>
          </div>
          <button 
            class="btn btn-outline-danger btn-sm ms-3" 
            @click.stop="removeLike(article.articleId)"
          >
            좋아요 취소
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { removeRecommend } from '@/api/community'
import api from '@/api/axios'

const router = useRouter()
const likedArticles = ref([])
const loading = ref(false)

// 좋아요 누른 게시글 목록 가져오기
const fetchLikedArticles = async () => {
  loading.value = true
  try {
    const response = await api.get('/api/recommand', { withCredentials: true })
    likedArticles.value = response.data.data || []
  } catch (error) {
    console.error('좋아요 게시글 조회 실패:', error)
    likedArticles.value = []
  } finally {
    loading.value = false
  }
}

// 좋아요 취소
const removeLike = async (articleId) => {
  if (!confirm('좋아요를 취소하시겠습니까?')) return
  
  try {
    await removeRecommend(articleId)
    // 목록에서 즉시 제거
    likedArticles.value = likedArticles.value.filter(a => a.articleId !== articleId)
  } catch (error) {
    console.error('좋아요 취소 실패:', error)
    alert('좋아요 취소에 실패했습니다.')
  }
}

// 게시글로 이동
const goToArticle = (articleId) => {
  router.push({ name: 'ArticleDetail', params: { id: articleId } })
}

// 날짜 포맷팅
const formatDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const now = new Date()
  
  if (isNaN(date.getTime())) return '날짜 오류'
  
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return '오늘'
  if (diffDays === 1) return '어제'
  if (diffDays < 7) return `${diffDays}일 전`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`
  
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  fetchLikedArticles()
})
</script>

<style scoped>
.hover-card {
  transition: all 0.2s ease;
  border: 1px solid #e9ecef;
}

.hover-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-color, #ff8a65);
}

.bi-hand-thumbs-up-fill.text-primary {
  color: var(--primary-color, #ff8a65) !important;
}
</style> 