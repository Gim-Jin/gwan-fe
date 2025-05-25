<template>
  <div class="mb-4">
    <div class="d-flex justify-content-between align-items-start">
      <strong>{{ comment.nickname }}</strong>
      <div class="d-flex align-items-center gap-2">
        <small class="text-muted" v-html="formatDate(comment.createdAt)"></small>
        <div v-if="isMyComment" class="d-flex gap-1">
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
    
    <!-- 수정 모드일 때 textarea 표시 -->
    <div v-if="isEditing" class="mt-2">
      <textarea
        v-model="editContent"
        class="form-control"
        rows="3"
        placeholder="댓글을 수정하세요"
      ></textarea>
    </div>
    
    <!-- 일반 모드일 때 댓글 내용 표시 -->
    <p v-else class="mt-2 text-secondary">{{ comment.content }}</p>
    
    <hr />
  </div>
</template>

<script setup>
import { useCommentStore } from '@/stores/commentStore'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'

const route = useRoute()
const commentStore = useCommentStore()
const authStore = useAuthStore()

const props = defineProps({
  comment: Object
})

// 수정 모드 상태
const isEditing = ref(false)
const editContent = ref('')

// 본인이 작성한 댓글인지 확인
const isMyComment = computed(() => {
  if (!props.comment || !authStore.user) {
    return false
  }
  
  // 사용자 객체의 가능한 닉네임 필드들 확인
  const possibleNicknameFields = ['nickName', 'nickname', 'name', 'userName', 'username', 'displayName']
  let userNickname = null
  
  for (const field of possibleNicknameFields) {
    if (authStore.user[field]) {
      userNickname = authStore.user[field]
      break
    }
  }
  
  if (!userNickname || !props.comment.nickname) {
    return false
  }
  
  // 닉네임으로 비교
  const commentNickname = String(props.comment.nickname).trim()
  const trimmedUserNickname = String(userNickname).trim()
  
  return commentNickname === trimmedUserNickname
})

// 날짜 포맷팅 함수 (날짜<br>시간 형태로 변경, T 제거)
const formatDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  return `${year}-${month}-${day}<br>${hours}:${minutes}`
}

// 수정 모드 시작
const startEdit = () => {
  isEditing.value = true
  editContent.value = props.comment.content
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
    const commentId = props.comment.commentId || props.comment.id
    await commentStore.updateComment(route.params.id, commentId, editContent.value.trim())
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
      const commentId = props.comment.commentId || props.comment.id
      await commentStore.deleteComment(route.params.id, commentId)
    } catch (error) {
      alert('댓글 삭제에 실패했습니다.')
    }
  }
}
</script>

<style scoped>
textarea {
  resize: none;
}
</style>
