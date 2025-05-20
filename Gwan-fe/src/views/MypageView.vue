<template>
    <div class="container my-5">
      <MyPageProfileCard />
  
      <!-- 탭 버튼 -->
      <div class="d-flex justify-content-center mt-4 gap-3">
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
      <div class="mt-4">
        <LikedVideos v-if="currentTab === '찜한 영상'" />
        <MyComments v-if="currentTab === '내 댓글'" />
        <MyRoutines v-if="currentTab === '운동 루틴'" />
        <!-- <MyInfo v-if="currentTab === '내 정보'" /> -->
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import MyPageProfileCard from '@/components/mypage/MyPageProfileCard.vue'
  import LikedVideos from '@/components/mypage/LikeVideos.vue'
  import MyComments from '@/components/mypage/MyComments.vue'
  import MyRoutines from '@/components/mypage/MyRoutines.vue'
//   import MyInfo from '@/components/mypage/MyInfo.vue'
  
  const tabs = ['찜한 영상', '내 댓글', '운동 루틴', '내 정보']
  const currentTab = ref('찜한 영상')
  </script>
  