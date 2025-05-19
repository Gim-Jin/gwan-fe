<template>
    <div>
        <h2>Main</h2>
    </div>
    <HeaderNav/>
    <router-view/>
    <Footer/>
</template>

<script setup>
import HeaderNav from './components/common/HeaderNav.vue'
import Footer from './components/common/Footer.vue'

</script>

<style scoped>
</style>