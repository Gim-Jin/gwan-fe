<template>
    <div class="app-container">
        <div v-if="isInitializing" class="loading-container">
            <div class="loading-spinner">인증 상태 확인 중...</div>
        </div>
        <div v-else>

            
            <!-- 로그인 상태에 따라 헤더 렌더링 -->
            <HeaderNav v-if="!authStore.isAuthenticated" />
            <HeaderAdminNav v-else-if="currentUserRole === 'ADMIN'" />
            <HeaderLoginedNav v-else-if="currentUserRole === 'GENERAL' || currentUserRole === 'PRESCRIBER'" />
            <HeaderLoginedNav v-else />
     
            <main class="main-content">
                <router-view v-slot="{ Component }">
                <transition name="page" mode="out-in">
                    <component :is="Component" :key="$route.fullPath" />
                </transition>
            </router-view>
            </main>
            <Footer />
        </div>
    </div>
</template>


<script setup>
import HeaderNav from './components/common/HeaderNav.vue'
import Footer from './components/common/Footer.vue'
import HeaderLoginedNav from './components/common/HeaderLoginedNav.vue'
import HeaderAdminNav from './components/common/HeaderAdminNav.vue'
import { useAuthStore } from './stores/auth'
import { ref, onMounted, computed, watch } from 'vue'

const authStore = useAuthStore()
const isInitializing = ref(true)

// 개발 환경 확인
const isDevelopment = import.meta.env.DEV

// 현재 사용자 역할을 computed로 관리
const currentUserRole = computed(() => {
    const role = authStore.user?.role
    console.log('App.vue - currentUserRole computed:', role)
    return role
})

// 인증 상태 변경 감지
watch(() => authStore.isAuthenticated, (newValue) => {
    console.log('App.vue - 인증 상태 변경 감지:', newValue)
    console.log('App.vue - 현재 사용자 정보:', authStore.user)
    console.log('App.vue - 현재 사용자 역할:', currentUserRole.value)
})

// 사용자 정보 변경 감지
watch(() => authStore.user, (newValue) => {
    console.log('App.vue - 사용자 정보 변경 감지:', newValue)
    console.log('App.vue - 계산된 역할:', currentUserRole.value)
}, { deep: true })

onMounted(async () => {
    try {
        await authStore.initialize()
        console.log('App.vue - 초기화 완료, 사용자 정보:', authStore.user)
    } catch (error) {
        console.error('인증 초기화 중 에러 발생:', error)
    } finally {
        isInitializing.value = false
    }
})
</script>
<style>
    html, body, #app {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        overflow-x: hidden;
        min-height: 100vh;
    }

    .app-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    .main-content {
        padding-top: 60px;
        flex: 1;
    }

    .loading-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
    }

    .loading-spinner {
        font-size: 18px;
        color: #666;
    }

    .debug-info {
        position: fixed;
        top: 0;
        right: 0;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 5px 10px;
        font-size: 12px;
        z-index: 9999;
    }
    /* *:focus {
        outline: none;
    }
    html,body{
        caret-color: transparent;
    } */
     /* ---------- 라우트 전환 애니메이션 ---------- */
.page-enter-from,
.page-leave-to   {       /* 초기/퇴장 상태 */
  opacity: 0;
  transform: translateY(20px);   /* 아래서 위로 슬라이드  */
}

.page-enter-to,
.page-leave-from {       /* 최종/시작 상태 */
  opacity: 1;
  transform: translateY(0);
}

/* 트랜지션 시간·곡선만 조절해도 느낌 확 달라져요 */
.page-enter-active,
.page-leave-active {
  transition: all 350ms cubic-bezier(0.25, 0.8, 0.5, 1);
}

</style>