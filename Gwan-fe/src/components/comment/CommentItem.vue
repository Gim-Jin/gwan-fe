<template>
  <div class="mb-4">
    <div class="d-flex justify-content-between">
      <strong>{{ comment.nickname }}</strong>
      <small class="text-muted">{{ comment.createdAt }}</small>
    </div>
    <p class="mt-2 text-secondary">{{ comment.content }}</p>
    <hr />
  </div>
</template>

<script setup>
defineProps({
  comment: Object
})
</script>

<style scoped>

</style>
