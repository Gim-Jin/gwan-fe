<template>
    <div>
        <HeaderNav/>
        <main><router-view/></main>
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
    }
</style>