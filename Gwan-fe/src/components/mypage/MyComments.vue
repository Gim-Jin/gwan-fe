<template>
  <div>
    <h5 class="mb-3">내 댓글</h5>
    <div class="text-end mb-2">
      <small class="text-muted">정렬: 최신순</small>
    </div>

    <div
      v-for="comment in comments"
      :key="comment.id"
      class="card mb-3 p-3 d-flex flex-row align-items-center"
    >
      <!-- 썸네일 -->
      <div style="width: 300px; height: 200px; background-color: #eee;" class="me-4 d-flex justify-content-center align-items-center">
        <span>300×200</span>
      </div>

      <!-- 내용 -->
      <div class="flex-grow-1">
        <h6 class="mb-1">{{ comment.videoTitle }}</h6>
        <p class="text-muted mb-1">{{ comment.content }}</p>
      </div>

      <!-- 날짜 & 버튼 -->
      <div class="text-end" style="min-width: 120px;">
        <small class="d-block text-muted mb-2">{{ comment.date }}</small>
        <div class="d-flex justify-content-end gap-2">
          <button class="btn btn-primary btn-sm">수정</button>
          <button class="btn btn-danger btn-sm">삭제</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const comments = [
  {
    id: 1,
    videoTitle: '전신 운동 루틴',
    content: 'ㅋㅋㅋ 너무 힘드네',
    date: '2024-01-15',
  },
  {
    id: 2,
    videoTitle: '스트레칭 가이드',
    content: 'ㅋㅋㅋ 너무 힘드네',
    date: '2024-01-14',
  },
  {
    id: 3,
    videoTitle: '고관절 내회전 운동',
    content: 'ㅋㅋㅋ 너무 힘드네',
    date: '2024-01-14',
  },
]
</script>