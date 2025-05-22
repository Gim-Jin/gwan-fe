import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';


const REST_API_URL = 'http://localhost:8080/api/exercise-videos';

export const useExerciseVideoStore = defineStore('exerciseVideo', () => {

  // 리스트
  const exerciseVideoList = ref([]);
  
  // 얘는 상세 조회용
  const exerciseVideo = ref({});
    

  const getRankedExerciseVideoList = function() {
    axios({
        url: REST_API_URL,
        method: "GET",
        params: {
            sort: 'likes'
        }
    })
    .then((response) => {
        exerciseVideoList.value = response.data.data;
        
    })
  }

  const getVideoDetailInfo = function(id) {
    axios({
        url: `${REST_API_URL}/${id}`,
        method:"GET",
    })
    .then((response) => {
        exerciseVideo.value = response.data.data;
    })
  }

  return { getRankedExerciseVideoList, exerciseVideoList, exerciseVideo, getVideoDetailInfo }
})
