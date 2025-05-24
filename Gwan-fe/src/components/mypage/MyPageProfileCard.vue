<template>
  <div class="card text-center p-3" style="max-width: 300px; margin: 6rem auto; border-radius: 12px;">
    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/Bitmap_Icon_Classic_Mac.png" alt="profile" class="mx-auto d-block mt-3 mb-2" style="width: 80px; opacity: 0.5;" />
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

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})
</script> 