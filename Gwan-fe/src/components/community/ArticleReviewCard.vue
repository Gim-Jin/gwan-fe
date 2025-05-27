<template>
  <div class="review-card mb-3" @click="goToArticle" style="cursor: pointer;">
    <div class="card p-3">
      <!-- 댓글 내용 -->
      <div class="border-start border-3 border-primary ps-3">
        <!-- 수정 모드일 때 textarea 표시 -->
        <div v-if="isEditing" class="mt-2" @click.stop>
          <textarea
            v-model="editContent"
            class="form-control"
            rows="3"
            placeholder="댓글을 수정하세요"
          ></textarea>
        </div>
        
        <!-- 일반 모드일 때 댓글 내용 표시 -->
        <p v-else class="text-secondary mb-2">{{ review.content }}</p>
        
        <!-- 날짜 & 버튼 -->
        <div class="d-flex justify-content-between align-items-center">
          <small class="text-muted" v-html="formatDate(review.createdAt || review.updatedAt)"></small>
          <div v-if="isMyReview" class="d-flex gap-1" @click.stop>
            <button 
              v-if="!isEditing"
              @click="startEdit"
              class="btn btn-outline-secondary btn-sm"
              style="font-size: 0.75rem; padding: 0.25rem 0.5rem;"
            >
              수정
            </button>
            <button 
              v-if="isEditing"
              @click="saveEdit"
              class="btn btn-outline-success btn-sm"
              style="font-size: 0.75rem; padding: 0.25rem 0.5rem;"
            >
              저장
            </button>
            <button 
              v-if="isEditing"
              @click="cancelEdit"
              class="btn btn-outline-secondary btn-sm"
              style="font-size: 0.75rem; padding: 0.25rem 0.5rem;"
            >
              취소
            </button>
            <button 
              v-if="!isEditing"
              @click="handleDelete"
              class="btn btn-outline-danger btn-sm"
              style="font-size: 0.75rem; padding: 0.25rem 0.5rem;"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'

const authStore = useAuthStore()
const router = useRouter()

const props = defineProps({
  review: Object
})

const emit = defineEmits(['update', 'delete'])

// 수정 모드 상태
const isEditing = ref(false)
const editContent = ref('')

// 역할 텍스트 변환 함수
const getRoleText = (role) => {
  switch(role) {
    case 'ADMIN': return '관리자'
    case 'USER': return '일반회원'
    case 'GENERAL': return '일반회원'
    case 'ADVISOR': return '처방사'
    case 'PRESCRIBER': return '처방사'
    default: return ''
  }
}

// 본인이 작성한 댓글인지 확인
const isMyReview = computed(() => {
  if (!props.review || !authStore.user) {
    return false
  }
  
  // 사용자 ID로 비교
  if (authStore.user.id && props.review.userId) {
    return authStore.user.id === props.review.userId
  }
  
  // 닉네임으로 비교 (fallback)
  const possibleNicknameFields = ['nickName', 'nickname', 'name', 'userName', 'username', 'displayName']
  let userNickname = null
  
  for (const field of possibleNicknameFields) {
    if (authStore.user[field]) {
      userNickname = authStore.user[field]
      break
    }
  }
  
  if (!userNickname || !props.review.writerNickName) {
    return false
  }
  
  // 닉네임으로 비교
  const reviewNickname = String(props.review.writerNickName).trim()
  const trimmedUserNickname = String(userNickname).trim()
  
  return reviewNickname === trimmedUserNickname
})

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
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

// 수정 모드 시작
const startEdit = () => {
  isEditing.value = true
  editContent.value = props.review.content
}

// 수정 취소
const cancelEdit = () => {
  isEditing.value = false
  editContent.value = ''
}

// 수정 저장
const saveEdit = async () => {
  if (!editContent.value.trim()) {
    alert('댓글 내용을 입력해주세요.')
    return
  }
  
  try {
    emit('update', {
      reviewId: props.review.reviewId,
      content: editContent.value.trim()
    })
    
    isEditing.value = false
    editContent.value = ''
  } catch (error) {
    alert('댓글 수정에 실패했습니다.')
  }
}

// 댓글 삭제 함수
const handleDelete = async () => {
  if (confirm('댓글을 삭제하시겠습니까?')) {
    try {
      emit('delete', props.review.reviewId)
    } catch (error) {
      alert('댓글 삭제에 실패했습니다.')
    }
  }
}

// 게시글로 이동
const goToArticle = () => {
  router.push({ name: 'ArticleDetail', params: { id: props.review.articleId } })
}
</script>

<style scoped>
.review-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.review-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card {
  border: 1px solid #e9ecef;
  border-radius: 12px;
}

textarea {
  resize: none;
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