<template>
  <div class="card">
    <p class="step">Step {{ step }} of 4</p>
    <h2 class="title">{{ title }}</h2>

    <slot></slot>

    <div class="btn-group">
      <button v-if="step > 1" @click="$emit('prev')">이전</button>
      <button @click="$emit('next')">다음</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['step', 'title'],
  emits: ['prev', 'next']
}
</script>

<style scoped>
@import './survey-styles.css';
.card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 0 10px #ddd;
  max-width: 500px;
  margin: auto;
}
.step {
  font-size: 0.9rem;
  color: gray;
  margin-bottom: 0.5rem;
}
.btn-group {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}
button {
  background: #365fff;
  color: white;
  border: none;
  padding: 0.6rem 1.4rem;
  border-radius: 6px;
  cursor: pointer;
}
button:hover {
  background-color: #2f50c0;
}
</style>
