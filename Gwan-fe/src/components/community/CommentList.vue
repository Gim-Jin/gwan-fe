<template>
  <div class="comment-list">
    <transition-group name="comment" tag="div">
      <div
        v-for="comment in comments"
        :key="comment.review_id"
        class="comment-item"
      >
        <div class="comment-avatar">
          <i class="bi bi-person-circle"></i>
        </div>
        <div class="comment-body">
          <div class="comment-header">
            <span class="comment-author">로그인 유저</span>
            <span class="comment-date">{{ comment.created_at }}</span>
          </div>
          <div class="comment-content">{{ comment.content }}</div>
        </div>
      </div>
    </transition-group>
    
    <div v-if="comments.length === 0" class="no-comments">
      <i class="bi bi-chat-left-dots"></i>
      <p>아직 댓글이 없습니다.</p>
      <p class="sub-text">첫 번째 댓글을 작성해보세요!</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  comments: Array,
  isAuthenticated: Boolean,
  article: Object
})
</script>

<style scoped>
.comment-list {
  margin-bottom: 1.5rem;
}

.comment-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #ecf0f1;
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

.comment-item:last-child {
  border-bottom: none;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.comment-avatar i {
  font-size: 1.2rem;
  color: #95a5a6;
}

.comment-body {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.4rem;
}

.comment-author {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}

.comment-date {
  font-size: 0.85rem;
  color: #95a5a6;
}

.comment-content {
  color: #34495e;
  line-height: 1.6;
  font-size: 0.95rem;
  white-space: pre-wrap;
  word-break: break-word;
}

.no-comments {
  text-align: center;
  padding: 3rem 1rem;
  color: #95a5a6;
}

.no-comments i {
  font-size: 3rem;
  color: #bdc3c7;
  margin-bottom: 1rem;
  display: block;
}

.no-comments p {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.no-comments .sub-text {
  font-size: 0.9rem;
  color: #bdc3c7;
}

/* 댓글 애니메이션 */
.comment-enter-active,
.comment-leave-active {
  transition: all 0.3s ease;
}

.comment-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.comment-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .comment-item {
    gap: 0.8rem;
    padding: 0.8rem 0;
  }
  
  .comment-avatar {
    width: 32px;
    height: 32px;
  }
  
  .comment-avatar i {
    font-size: 1rem;
  }
  
  .comment-author {
    font-size: 0.9rem;
  }
  
  .comment-content {
    font-size: 0.9rem;
  }
}
</style> 