<template>
  <div>
    <h5 class="mb-3">내 댓글</h5>
    <div class="text-end mb-2">
      <small class="text-muted">정렬: 최신순</small>
    </div>

    <div
      v-for="comment in comments"
      :key="comment.commentId"
      class="card mb-3 p-3 d-flex flex-row align-items-center"
    >
      <img
        class="me-4"
        :src="`https://img.youtube.com/vi/${comment.youtubeUrl}/mqdefault.jpg`"
        :alt="comment.exerciseVideoTitle"
        style="width: 300px; height: 200px; object-fit: cover; border-radius: 0.5rem;"
      />
      <!-- 내용 -->
      <div class="flex-grow-1">
        <h6 class="mb-1">{{ comment.exerciseVideoTitle }}</h6>
        <div v-if="editingCommentId !== comment.commentId">
          <p class="text-muted mb-1">{{ comment.content }}</p>
        </div>
        <div v-else>
          <textarea
            v-model="editingContent"
            class="form-control mb-2"
            rows="2"
          ></textarea>
        </div>
      </div>

      <!-- 날짜 & 버튼 -->
      <div class="text-end" style="min-width: 120px;">
        <small class="d-block text-muted mb-2">{{ comment.updatedAt }}</small>
        <div class="d-flex justify-content-end gap-2">
          <template v-if="editingCommentId !== comment.commentId">
            <button class="btn btn-primary btn-sm" @click="startEditing(comment)">수정</button>
            <button class="btn btn-danger btn-sm" @click="removeComment(comment.commentId)">삭제</button>
          </template>
          <template v-else>
            <button class="btn btn-success btn-sm" @click="saveEdit(comment.commentId)">저장</button>
            <button class="btn btn-secondary btn-sm" @click="cancelEditing">취소</button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCommentStore } from '@/stores/commentStore';
import { computed, onMounted, ref } from 'vue';

// const comments = [
//   {
//     id: 1,
//     videoTitle: '전신 운동 루틴',
//     content: 'ㅋㅋㅋ 너무 힘드네',
//     date: '2024-01-15',
//   },
//   {
//     id: 2,
//     videoTitle: '스트레칭 가이드',
//     content: 'ㅋㅋㅋ 너무 힘드네',
//     date: '2024-01-14',
//   },
//   {
//     id: 3,
//     videoTitle: '고관절 내회전 운동',
//     content: 'ㅋㅋㅋ 너무 힘드네',
//     date: '2024-01-14',
//   },
// ]

const commentStore = useCommentStore();
const comments = computed(() => commentStore.myComments);

// 수정 관련 상태
const editingCommentId = ref(null);
const editingContent = ref('');

const startEditing = (comment) => {
  editingCommentId.value = comment.commentId;
  editingContent.value = comment.content;
};

const cancelEditing = () => {
  editingCommentId.value = null;
  editingContent.value = '';
};

const saveEdit = async (commentId) => {
  await commentStore.modifyComment(commentId, editingContent.value);
  editingCommentId.value = null;
  editingContent.value = '';
};

onMounted(async () => {
  await commentStore.getMyComments();
});

const removeComment = async (commentId) => {
  await commentStore.removeComment(commentId);
  await commentStore.getMyComments();
};
</script>

<style scoped>
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

textarea {
  resize: none;
}
</style>