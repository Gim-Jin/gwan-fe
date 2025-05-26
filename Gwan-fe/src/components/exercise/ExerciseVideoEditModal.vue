<template>
    <div class="modal-backdrop">
      <transition name="modal-fade">
        <div v-if="visible" class="modal-container">
          <h2 class="modal-title">운동 영상 수정</h2>
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label>제목</label>
              <input v-model="form.title" required class="form-control" placeholder="영상 제목을 입력하세요" />
            </div>
            <div class="form-group">
              <label>설명</label>
              <textarea v-model="form.description" required class="form-control" rows="3" placeholder="영상 설명을 입력하세요"></textarea>
            </div>
            <div class="form-group">
              <label>영상 URL</label>
              <input v-model="form.url" required class="form-control" placeholder="영상 URL을 입력하세요" />
            </div>
            <div class="form-group">
              <label>YouTube ID</label>
              <input v-model="form.youtubeId" class="form-control" placeholder="YouTube ID (선택)" />
            </div>
            <div class="form-group">
              <label>운동 부위</label>
              <select v-model="form.targetId" required class="form-select">
                <option value="">운동 부위 선택</option>
                <option v-for="target in targets" :key="target.targetId" :value="target.targetId">
                  {{ target.name }}
                </option>
              </select>
            </div>
            <div class="modal-actions">
              <button type="submit" class="btn btn-primary w-50" :disabled="loading">수정</button>
              <button type="button" class="btn btn-outline-secondary w-50" @click="$emit('close')">취소</button>
            </div>
            <div v-if="error" class="text-danger mt-2 text-center">{{ error }}</div>
          </form>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue'
  import { getAllTargets } from '@/api/exerciseVideo'
  import { useExerciseVideoStore } from '@/stores/exerciseVideoStore'
  
  const props = defineProps({
    video: { type: Object, required: true }
  })
  const emit = defineEmits(['close', 'refresh'])
  
  const visible = ref(false) // 애니메이션 컨트롤용
  
  const form = ref({
    title: '',
    description: '',
    url: '',
    youtubeId: '',
    targetId: ''
  })
  const loading = ref(false)
  const error = ref('')
  const targets = ref([])
  const store = useExerciseVideoStore()
  
  onMounted(async () => {
    visible.value = true // 애니메이션 트리거
    Object.assign(form.value, {
      title: props.video.title,
      description: props.video.description,
      url: props.video.url,
      youtubeId: props.video.youtubeId,
      targetId: props.video.targetId
    })
    try {
      const res = await getAllTargets()
      targets.value = res.data.data || []
    } catch (e) {
      targets.value = []
    }
  })
  
  function extractYoutubeId(url) {
    if (!url) return ''
    const regExp = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([\w-]{11})/
    const match = url.match(regExp)
    return match ? match[1] : ''
  }
  
  watch(
    () => form.value.url,
    (newUrl) => {
      const id = extractYoutubeId(newUrl)
      if (id) form.value.youtubeId = id
    }
  )
  
  const handleSubmit = async () => {
    loading.value = true
    error.value = ''
    try {
      await store.editExerciseVideo(props.video.exerciseVideoId, {
        title: form.value.title,
        description: form.value.description,
        url: form.value.url,
        youtubeId: form.value.youtubeId,
        targetId: form.value.targetId
      })
      emit('refresh')
      emit('close')
    } catch (err) {
      error.value = err.response?.data?.message || '수정 실패'
    } finally {
      loading.value = false
    }
  }
  </script>
  
  <style scoped>
  .modal-backdrop {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.3);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .modal-container {
    background: #fff;
    border-radius: 16px;
    padding: 2.5rem 2rem 2rem 2rem;
    min-width: 380px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.18);
    max-width: 95vw;
  }
  
  /* 트랜지션 */
  .modal-fade-enter-from {
    opacity: 0;
    transform: scale(0.9);
  }
  .modal-fade-enter-active {
    transition: all 0.3s ease;
  }
  .modal-fade-leave-to {
    opacity: 0;
    transform: scale(0.95);
  }
  .modal-fade-leave-active {
    transition: all 0.2s ease;
  }
  
  .modal-title {
    text-align: center;
    font-weight: bold;
    margin-bottom: 1.5rem;
    color: #fa8a65;
    font-size: 1.6rem;
  }
  .form-group {
    margin-bottom: 1.2rem;
  }
  .form-control, .form-select {
    width: 100%;
    padding: 0.6rem 0.8rem;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    font-size: 1rem;
    background: #fafafa;
  }
  .form-control:focus, .form-select:focus {
    outline: none;
    border-color: #fa8a65;
    background: #fff;
  }
  .modal-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  .btn-primary {
    background: #fa8a65;
    border: none;
  }
  .btn-primary:disabled {
    background: #ffd6c2;
  }
  </style>
  