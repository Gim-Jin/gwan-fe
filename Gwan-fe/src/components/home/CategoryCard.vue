<template>
  <div class="card category-card shadow-sm">
    <div class="card-body d-flex align-items-center justify-content-center text-center">
      <h5 class="card-title m-0">{{ target.name }}</h5>
    </div>
  </div>
</template>

<script setup>
defineProps({
  target: Object
})
</script>

<style scoped>
.category-card {
  height: 150px;
  border: none;
  border-radius: 1rem; 
  
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-5px); /* 살짝 뜨는 효과 */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1); /* hover shadow */
}

.card-title {
  font-weight: 600;
  font-size: 1.2rem;
  color: #343a40;
}
</style>
