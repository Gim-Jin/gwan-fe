<template>
  <div class="card text-center p-3" style="max-width: 300px; margin: 6rem auto; border-radius: 12px;">
    <div class="mt-3 mb-2 d-flex justify-content-center">
      <ProfileAvatar :userType="getUserType(user)" :size="80" />
    </div>
    <div class="card-body">
      <h4 class="card-title fw-bold mb-1">{{ user.nickName }}</h4>
      <p class="card-text text-muted mb-3" style="font-size: 0.98rem;">{{ user.email }}</p>
      <div class="d-flex justify-content-center mb-3 gap-4">
        <div>
          <span class="fw-bold text-primary" style="font-size: 1.3rem;">{{ user.videoCnt }}</span>
          <div class="small text-secondary">운동</div>
        </div>
        <div>
          <span class="fw-bold text-primary" style="font-size: 1.3rem;">{{ user.commentCnt }}</span>
          <div class="small text-secondary">댓글</div>
        </div>
      </div>
      <RouterLink class="btn btn-primary w-100" :to="{name : 'infoRevise'}">프로필 수정</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import ProfileAvatar from '@/components/common/ProfileAvatar.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

// 사용자 타입을 결정하는 함수
const getUserType = (user) => {
  // 1순위: authStore에서 역할 확인 (로그인 시 설정된 정보)
  const authRole = authStore.user?.role
  if (authRole) {
    if (authRole === 'ADMIN') {
      return 'admin'
    } else if (authRole === 'ADVISOR') {
      return 'prescriber'
    } else {
      return 'user'
    }
  }
  
  // 2순위: 마이페이지 API에서 온 user 객체의 role 확인
  if (user.role === 'ADMIN') {
    return 'admin'
  } else if (user.role === 'ADVISOR') {
    return 'prescriber'
  } else {
    return 'user' // GENERAL이나 기타 모든 경우
  }
}
</script> 