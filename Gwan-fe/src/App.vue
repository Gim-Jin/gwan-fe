<template>
    <div class="app-container">
        <!-- 로그인 여부와 사용자 역할에 따라 헤더 선택 -->
        <HeaderNav v-if="!authStore.isAuthenticated"/>
        <HeaderAdminNav v-else-if="authStore.user?.role === 'ADMIN'"/>
        <HeaderLoginedNav v-else/>

        <main class="main-content"><router-view/></main>
        <Footer/>
    </div>
    
</template>

<script setup>
import HeaderNav from './components/common/HeaderNav.vue'
import Footer from './components/common/Footer.vue'
import HeaderLoginedNav from './components/common/HeaderLoginedNav.vue'
import HeaderAdminNav from './components/common/HeaderAdminNav.vue'
import { useAuthStore } from './stores/auth'
import { onMounted } from 'vue'

const authStore = useAuthStore()

onMounted(async () => {
    await authStore.initialize()
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
    /* *:focus {
        outline: none;
    }
    html,body{
        caret-color: transparent;
    } */
</style>