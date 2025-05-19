<template>
  <div class="about">
    <h1>게시판 페이지</h1>
    <router-view/>
  </div>
</template>

<script setup>

</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
