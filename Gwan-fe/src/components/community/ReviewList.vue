<template>
  <div class="review-list">
    <transition-group name="review" tag="div">
      <div
        v-for="review in reviews"
        :key="review.reviewId || review.id"
        class="review-item"
      >
        <div class="review-avatar">
          <i class="bi bi-person-circle"></i>
        </div>
        <div class="review-body">
          <div class="review-header">
            <span class="review-author">{{ review.writerNickName || '익명' }}</span>
            <span class="review-role" v-if="review.userRole">{{ getRoleText(review.userRole) }}</span>
            <span class="review-date">{{ formatDate(review.createdAt || review.created_at) }}</span>
            <button 
              v-if="canDeleteReview(review)" 
              @click="deleteReview(review)"
              class="delete-btn"
              title="댓글 삭제"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
          <div class="review-content">{{ review.content }}</div>
        </div>
      </div>
    </transition-group>
    
    <div v-if="reviews.length === 0" class="no-reviews">
      <i class="bi bi-chat-left-dots"></i>
      <p>아직 댓글이 없습니다.</p>
      <p class="sub-text">첫 번째 댓글을 작성해보세요!</p>
    </div>
  </div>
</template>

<script setup>
import { useCommunityStore } from '@/stores/communityStore'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  reviews: Array,
  isAuthenticated: Boolean,
  article: Object
})

const communityStore = useCommunityStore()
const authStore = useAuthStore()
const emit = defineEmits(['deleted'])

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
  const diffYears = Math.floor(diffDays / 365)
  
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
  
  // 12개월 미만
  if (diffMonths < 12) return `${diffMonths}개월 전`
  
  // 1년 이상
  if (diffYears >= 1) return `${diffYears}년 전`
  
  // 기본값 (날짜 형식)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function getRoleText(role) {
  switch(role) {
    case 'ADMIN': return '관리자'
    case 'USER': return '일반회원'
    case 'GENERAL': return '일반회원'
    case 'ADVISOR': return '처방사'
    case 'PRESCRIBER': return '처방사'
    default: return ''
  }
}

function canDeleteReview(review) {
  if (!props.isAuthenticated) return false
  
  const currentUser = authStore.user
  if (!currentUser) return false
  
  // 관리자는 모든 댓글 삭제 가능
  if (currentUser.role === 'ADMIN') return true
  
  // 본인이 작성한 댓글인 경우 삭제 가능
  if (currentUser.id && review.userId && currentUser.id === review.userId) {
    return true
  }
  
  return false
}

async function deleteReview(review) {
  if (!confirm('댓글을 삭제하시겠습니까?')) return
  
  try {
    await communityStore.removeComment(
      props.article.articleId || props.article.id, 
      review.reviewId || review.id
    )
    // 삭제 성공 시 부모에게 알림
    emit('deleted', review.reviewId || review.id)
  } catch (error) {
    console.error('댓글 삭제 실패:', error)
    alert('댓글 삭제에 실패했습니다.')
  }
}

function handleReviewDeleted(deletedId) {
  props.article.reviews = props.article.reviews.filter(r => (r.reviewId || r.id) !== deletedId)
}
</script>

<style scoped>
.review-list {
  margin-bottom: 1.5rem;
}

.review-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #ffe0d3;
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.review-item:last-child {
  border-bottom: none;
}

.review-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #ffe0d3;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.review-avatar i {
  font-size: 1.2rem;
  color: var(--primary-color);
}

.review-body {
  flex: 1;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.4rem;
}

.review-author {
  font-weight: 600;
  color: var(--primary-color);
  font-size: 0.95rem;
}

.review-role {
  font-size: 0.75rem;
  background: #ffe0d3;
  color: var(--primary-color);
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.review-date {
  font-size: 0.85rem;
  color: #ffab91;
  margin-left: auto;
}

.delete-btn {
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
}

.delete-btn:hover {
  background: #ffe0e0;
  opacity: 1;
  transform: scale(1.1);
}

.delete-btn i {
  font-size: 0.9rem;
}

.review-content {
  color: var(--text-color);
  line-height: 1.6;
  font-size: 0.95rem;
  white-space: pre-wrap;
  word-break: break-word;
}

.no-reviews {
  text-align: center;
  padding: 3rem 1rem;
  color: #b26a4c;
}

.no-reviews i {
  font-size: 3rem;
  color: #ffd6c2;
  margin-bottom: 1rem;
  display: block;
}

.no-reviews p {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.no-reviews .sub-text {
  font-size: 0.9rem;
  color: #ffab91;
}

/* 댓글 애니메이션 */
.review-enter-active,
.review-leave-active {
  transition: all 0.3s ease;
}

.review-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.review-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .review-item {
    gap: 0.8rem;
    padding: 0.8rem 0;
  }
  
  .review-avatar {
    width: 32px;
    height: 32px;
  }
  
  .review-avatar i {
    font-size: 1rem;
  }
  
  .review-header {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .review-author {
    font-size: 0.9rem;
  }
  
  .review-role {
    font-size: 0.7rem;
    padding: 1px 4px;
  }
  
  .review-date {
    font-size: 0.8rem;
    margin-left: 0;
    order: 3;
    width: 100%;
  }
  
  .delete-btn {
    padding: 2px;
  }
  
  .delete-btn i {
    font-size: 0.8rem;
  }
  
  .review-content {
    font-size: 0.9rem;
  }
}
</style> 