<template>
    <div class="app-container">
        <HeaderNav/>
        <main class="main-content"><router-view/></main>
        <Footer/>
    </div>
    
</template>

<script setup>
import HeaderNav from './components/common/HeaderNav.vue'
import Footer from './components/common/Footer.vue'

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
</style>