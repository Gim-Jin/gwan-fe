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
        <transition name="tab" mode="out-in">
        <!-- key 로 currentTab 주면 매번 애니메이션 실행 -->
          <component :is="currentComp" :key="currentTab" />
        </transition>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { fetchMypage } from '@/api/user'
  import MyPageProfileCard from '@/components/mypage/MyPageProfileCard.vue'
  import LikedVideos from '@/components/mypage/LikeVideos.vue'
  import MyComments from '@/components/mypage/MyComments.vue'
  import MyRoutines from '@/components/mypage/MyRoutines.vue'
  import LikedArticles from '@/components/mypage/LikedArticles.vue'
//   import MyInfo from '@/components/mypage/MyInfo.vue'
  
  const router = useRouter()
  const tabs = ['찜한 영상', '좋아요', '내 댓글', '운동 루틴']
  const currentTab = ref('찜한 영상')
  
  const compMap = {
    '찜한 영상': LikedVideos,
    '좋아요': LikedArticles,
    '내 댓글'  : MyComments,
    '운동 루틴': MyRoutines
  }

  const currentComp = computed(() => compMap[currentTab.value])
  const user = ref(null)
  const error = ref(null)
  
  const fetchUserData = async () => {
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
  }
  
  onMounted(async () => {
    // 라우터 가드에서 인증을 보장하므로 바로 데이터 fetch
    await fetchUserData()
  })
  </script>

  <style>

/* ---------- 탭 전환 애니메이션 ---------- */
.tab-enter-from,
.tab-leave-to   { opacity: 0; transform: translateY(20px); }

.tab-enter-to,
.tab-leave-from { opacity: 1; transform: translateY(0); }

.tab-enter-active,
.tab-leave-active {
  transition: all 280ms cubic-bezier(.25,.8,.5,1);
}

</style>
  