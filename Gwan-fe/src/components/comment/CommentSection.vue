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
    <div class="bg-light p-4 rounded-4">
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
  </div>
</template>

<script setup>
import { useCommentStore } from '@/stores/commentStore';
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import CommentItem from './CommentItem.vue';


const route = useRoute();
const comments = computed(() => commentStore.comments)

const commentStore = useCommentStore();

// 서버에서 받아올 댓글들
onMounted(() => {
  commentStore.getComments(route.params.id);
})

// 댓글 입력값
const newComment = ref('')

// 댓글 등록 함수
function submitComment() {
  // TODO: axios 요청으로 등록 처리 예정
  // axios.post(...) → 성공 시 목록 새로 불러오기
  console.log('댓글 내용:', newComment.value)
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
