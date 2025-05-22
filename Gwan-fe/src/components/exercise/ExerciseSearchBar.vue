<template>
  <div class="search-bar container mb-4">
    <div class="row g-3">
      <!-- 검색 입력 -->
      <div class="col-md-6">
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            placeholder="운동 영상 검색..."
            v-model="searchKeyword"
            @keyup.enter="handleSearch"
          />
          <button class="btn btn-primary" @click="handleSearch">
            <i class="bi bi-search"></i>
          </button>
        </div>
      </div>

      <!-- 정렬 및 필터 -->
      <div class="col-md-6">
        <div class="d-flex gap-2">
          <select class="form-select" v-model="selectedSort" @change="handleSort">
            <option value="">정렬 방식</option>
            <option value="likes">좋아요 순</option>
          </select>
          <select class="form-select" v-model="selectedTarget" @change="handleTarget">
            <option value="">부위 선택</option>
            <option v-for="target in targetStore.targetList" :key="target.targetId" :value="target.name">
              {{ target.name }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useExerciseVideoStore } from '@/stores/exerciseVideoStore';
import { useTargetStore } from '@/stores/targetStore';

const exerciseVideoStore = useExerciseVideoStore();
const targetStore = useTargetStore();
const searchKeyword = ref('');
const selectedSort = ref('');
const selectedTarget = ref('');

onMounted(() => {
  if (targetStore.targetList.length === 0) {
    targetStore.fetchTargets();
  }
});

const handleSearch = () => {
  exerciseVideoStore.searchExerciseVideos({
    keyword: searchKeyword.value,
    sort: selectedSort.value,
    target: selectedTarget.value
  });
};

const handleSort = handleSearch;
const handleTarget = handleSearch;
</script>

<style scoped>
.search-bar {
  max-width: 900px;
  margin: 0 auto;
}

.input-group {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.form-control:focus {
  box-shadow: none;
  border-color: #0d6efd;
}

.form-select:focus {
  box-shadow: none;
  border-color: #0d6efd;
}

.btn-primary {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
</style> 