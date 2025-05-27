<template>
  <div>
    <h5 class="mb-3">내 댓글</h5>
    
    <!-- 탭 메뉴 -->
    <div class="mb-3">
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <button 
            class="nav-link" 
            :class="{ active: activeTab === 'video' }"
            @click="activeTab = 'video'"
          >
            운동 영상 댓글 ({{ videoComments.length }})
          </button>
        </li>
        <li class="nav-item">
          <button 
            class="nav-link" 
            :class="{ active: activeTab === 'article' }"
            @click="activeTab = 'article'"
          >
            게시글 댓글 ({{ articleCommentsCount }})
          </button>
        </li>
      </ul>
    </div>

    <div class="text-end mb-2">
      <small class="text-muted">정렬: 최신순</small>
    </div>

    <!-- 운동 영상 댓글 탭 -->
    <div v-if="activeTab === 'video'">
      <div v-if="videoComments.length === 0" class="text-center py-5 text-muted">
        <i class="bi bi-chat-left-dots fs-1 mb-3"></i>
        <p>작성한 운동 영상 댓글이 없습니다.</p>
      </div>
      <div
        v-for="comment in videoComments"
        :key="`video-${comment.commentId}`"
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
          <small class="d-block text-muted mb-2">{{ formatDate(comment.updatedAt) }}</small>
          <div class="d-flex justify-content-end gap-2">
            <template v-if="editingCommentId !== comment.commentId">
              <button class="btn btn-primary btn-sm" @click="startEditing(comment)">수정</button>
              <button class="btn btn-danger btn-sm" @click="removeVideoComment(comment.commentId)">삭제</button>
            </template>
            <template v-else>
              <button class="btn btn-success btn-sm" @click="saveEdit(comment.commentId)">저장</button>
              <button class="btn btn-secondary btn-sm" @click="cancelEditing">취소</button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- 게시글 댓글 탭 -->
    <div v-if="activeTab === 'article'">
      <div v-if="articleComments.length === 0" class="text-center py-5 text-muted">
        <i class="bi bi-chat-square-text fs-1 mb-3"></i>
        <p>작성한 게시글 댓글이 없습니다.</p>
      </div>
      <ArticleReviewCard
        v-for="review in articleComments"
        :key="`article-${review.reviewId}`"
        :review="review"
        @update="handleReviewUpdate"
        @delete="handleReviewDelete"
      />
    </div>
  </div>
</template>

<script setup>
import { useCommentStore } from '@/stores/commentStore';
import { computed, onMounted, ref } from 'vue';
import ArticleReviewCard from '@/components/community/ArticleReviewCard.vue';

const commentStore = useCommentStore();

// 탭 상태
const activeTab = ref('video');

// 댓글 데이터
const videoComments = computed(() => commentStore.myComments);
const articleComments = ref([]);

// 반응형 확인을 위한 computed
const articleCommentsCount = computed(() => {
  console.log('articleCommentsCount computed 실행:', articleComments.value.length);
  return articleComments.value.length;
});

// 비디오 댓글 수정 관련 상태
const editingCommentId = ref(null);
const editingContent = ref('');

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  
  // 유효하지 않은 날짜 체크
  if (isNaN(date.getTime())) return '날짜 오류';
  
  // 시간 차이 계산 (밀리초)
  const diffTime = now.getTime() - date.getTime();
  
  // 미래 날짜인 경우
  if (diffTime < 0) {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  // 분 단위 계산
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  
  // 1분 미만
  if (diffMinutes < 1) return '방금 전';
  
  // 1시간 미만
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  
  // 24시간 미만
  if (diffHours < 24) return `${diffHours}시간 전`;
  
  // 1일
  if (diffDays === 1) return '어제';
  
  // 7일 미만
  if (diffDays < 7) return `${diffDays}일 전`;
  
  // 4주 미만
  if (diffWeeks < 4) return `${diffWeeks}주 전`;
  
  // 1개월 이상
  if (diffMonths >= 1) return `${diffMonths}개월 전`;
  
  // 기본값 (날짜 형식)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 비디오 댓글 수정 관련
const startEditing = (comment) => {
  editingCommentId.value = comment.commentId;
  editingContent.value = comment.content;
};

const saveEdit = async (commentId) => {
  await commentStore.modifyComment(commentId, editingContent.value);
  editingCommentId.value = null;
  editingContent.value = '';
};

const removeVideoComment = async (commentId) => {
  if (confirm('댓글을 삭제하시겠습니까?')) {
    await commentStore.removeComment(commentId);
    await commentStore.getMyComments();
  }
};

// 게시글 댓글 이벤트 핸들러
const handleReviewUpdate = async (data) => {
  try {
    // TODO: 게시글 댓글 수정 API 호출
    console.log('게시글 댓글 수정:', data.reviewId, data.content);
    // 수정 후 목록 새로고침
    await loadArticleComments();
  } catch (error) {
    console.error('게시글 댓글 수정 실패:', error);
    alert('댓글 수정에 실패했습니다.');
  }
};

const handleReviewDelete = async (reviewId) => {
  try {
    // TODO: 게시글 댓글 삭제 API 호출
    console.log('게시글 댓글 삭제:', reviewId);
    // 삭제 후 목록 새로고침
    await loadArticleComments();
  } catch (error) {
    console.error('게시글 댓글 삭제 실패:', error);
    alert('댓글 삭제에 실패했습니다.');
  }
};

// 비디오 댓글 취소 함수
const cancelEditing = () => {
  editingCommentId.value = null;
  editingContent.value = '';
};

// 게시글 댓글 로드
const loadArticleComments = async () => {
  try {
    console.log('게시글 댓글 로드 시작...');
    const reviews = await commentStore.getMyReviews();
    console.log('받은 게시글 댓글 데이터:', reviews);
    articleComments.value = reviews;
    console.log('articleComments.value 설정 완료:', articleComments.value);
  } catch (error) {
    console.error('게시글 댓글 로드 실패:', error);
    articleComments.value = [];
  }
};

onMounted(async () => {
  await commentStore.getMyComments();
  await loadArticleComments();
});
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

.nav-tabs .nav-link {
  border: none;
  background: none;
  color: #6c757d;
  font-weight: 500;
  padding: 0.75rem 1rem;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.nav-tabs .nav-link:hover {
  color: var(--primary-color, #ff8a65);
  border-bottom-color: var(--primary-color, #ff8a65);
}

.nav-tabs .nav-link.active {
  color: var(--primary-color, #ff8a65);
  border-bottom-color: var(--primary-color, #ff8a65);
  background: none;
}

.border-start {
  border-left-width: 3px !important;
}

.text-primary {
  color: var(--primary-color, #ff8a65) !important;
}

.border-primary {
  border-color: var(--primary-color, #ff8a65) !important;
}
</style>