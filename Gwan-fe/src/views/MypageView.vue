<template>
    <div class="container my-5">
      <MyPageProfileCard v-if="user" :user="user" />
      <div v-else-if="error" class="alert alert-danger text-center">
        {{ error }}
        <div class="mt-3">
          <RouterLink to="/login" class="btn btn-primary">로그인하기</RouterLink>
        </div>
      </div>
      <div v-else class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">불러오는 중...</span>
        </div>
      </div>
  
      <!-- 탭 버튼 -->
      <div v-if="user" class="d-flex justify-content-center mt-4 gap-3">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="currentTab = tab"
          class="btn"
          :class="currentTab === tab ? 'btn-primary' : 'btn-outline-secondary'"
        >
          {{ tab }}
        </button>
      </div>
  
      <!-- 탭 내용 -->
      <div v-if="user" class="mt-4">
        <LikedVideos v-if="currentTab === '찜한 영상'" />
        <MyComments v-if="currentTab === '내 댓글'" />
        <MyRoutines v-if="currentTab === '운동 루틴'" />
        <!-- <MyInfo v-if="currentTab === '내 정보'" /> -->
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { fetchMypage } from '@/api/user'
  import MyPageProfileCard from '@/components/mypage/MyPageProfileCard.vue'
  import LikedVideos from '@/components/mypage/LikeVideos.vue'
  import MyComments from '@/components/mypage/MyComments.vue'
  import MyRoutines from '@/components/mypage/MyRoutines.vue'
//   import MyInfo from '@/components/mypage/MyInfo.vue'
  
  const router = useRouter()
  const tabs = ['찜한 영상', '내 댓글', '운동 루틴']
  const currentTab = ref('찜한 영상')
  
  const user = ref(null)
  const error = ref(null)
  
  onMounted(async () => {
    try {
      const response = await fetchMypage()
      user.value = response.data.data
    } catch (e) {
      if (e.response?.status === 403) {
        error.value = '로그인이 필요한 서비스입니다.'
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        error.value = '마이페이지 정보를 불러오는데 실패했습니다.'
      }
      console.error(e)
    }
  })
  </script>
  