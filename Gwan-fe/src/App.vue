<template>
    <div class="app-container">
        <!-- islogined라는 boolean 변수를 통해 로그인 여부를 확인 -->
        <HeaderNav v-if="!authStore.isAuthenticated"/>
        <HeaderLoginedNav v-else/>

        <main class="main-content"><router-view/></main>
        <Footer/>
    </div>
    
</template>

<script setup>
import HeaderNav from './components/common/HeaderNav.vue'
import Footer from './components/common/Footer.vue'
import HeaderLoginedNav from './components/common/HeaderLoginedNav.vue';
import { useAuthStore } from './stores/auth'
import { onMounted } from 'vue'

const authStore = useAuthStore()

onMounted(() => {
    authStore.initialize()
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