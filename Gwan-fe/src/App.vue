<template>
    <div class="app-container">
        <div v-if="isInitializing" class="loading-container">
            <div class="loading-spinner">인증 상태 확인 중...</div>
        </div>
        <div v-else>

            
            <!-- 로그인 상태에 따라 헤더 렌더링 -->
            <HeaderNav v-if="!authStore.isAuthenticated" />
            <HeaderAdminNav v-else-if="currentUserRole === 'ADMIN'" />
            <HeaderLoginedNav v-else />
            <main class="main-content"><router-view /></main>
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
const currentUserRole = computed(() => authStore.user?.role)

// 인증 상태 변경 감지
watch(() => authStore.isAuthenticated, (newValue) => {
    console.log('인증 상태 변경 감지:', newValue)
    console.log('현재 사용자 정보:', authStore.user)
})

// 사용자 정보 변경 감지
watch(() => authStore.user, (newValue) => {
    console.log('사용자 정보 변경 감지:', newValue)
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
</style>