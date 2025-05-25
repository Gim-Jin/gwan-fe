<template>
  <div class="comment-section container my-5">
    <!-- 댓글 제목 -->
    <h4 class="fw-bold mb-4">댓글({{ comments.length }})</h4>

    <!-- 댓글 목록 -->
    <CommentItem
      v-for="comment in comments"
      :key="comment.id"
      :comment="comment"
    />

    <!-- 댓글 작성 -->
    <div v-if="authStore.isAuthenticated" class="bg-light p-4 rounded-4">
      <label for="commentInput" class="form-label fw-semibold">댓글 작성</label>
      <textarea
        v-model="newComment"
        id="commentInput"
        class="form-control mb-3"
        rows="3"
        placeholder="댓글을 입력하세요"
      ></textarea>
      <div class="text-end">
        <button class="btn btn-primary btn-sm" @click="submitComment">댓글 작성</button>
      </div>
    </div>
    
    <!-- 로그인하지 않은 사용자에게 표시할 메시지 -->
    <div v-else class="bg-light p-4 rounded-4 text-center">
      <p class="mb-2 text-muted">댓글을 작성하려면 로그인이 필요합니다.</p>
      <RouterLink :to="{ name: 'login' }" class="btn btn-outline-primary btn-sm">
        로그인하기
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { useCommentStore } from '@/stores/commentStore';
import { useAuthStore } from '@/stores/auth';
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import CommentItem from './CommentItem.vue';

const route = useRoute();
const commentStore = useCommentStore();
const authStore = useAuthStore();

const comments = computed(() => commentStore.comments)

// 서버에서 받아올 댓글들
onMounted(async () => {
  // 사용자 정보 초기화
  if (!authStore.user) {
    await authStore.initialize();
  }
  
  commentStore.getComments(route.params.id);
  
  // 디버깅용
  console.log('CommentSection mounted - authStore.user:', authStore.user);
})

// 댓글 입력값
const newComment = ref('')

// 댓글 등록 함수
function submitComment() {
  // 로그인 체크
  if (!authStore.isAuthenticated) {
    alert('로그인 후 댓글을 작성할 수 있습니다.')
    return
  }

  // 빈 내용 체크
  if (!newComment.value.trim()) {
    alert('댓글 내용을 입력해주세요.')
    return
  }

  commentStore.saveComment(route.params.id, newComment.value.trim());
  newComment.value = ''
}
</script>

<style scoped>
.text-purple {
  color: #7e22ce;
}
textarea {
  resize: none;
}
</style>
