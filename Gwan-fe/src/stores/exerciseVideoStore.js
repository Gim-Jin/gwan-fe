import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';

const REST_API_URL = 'http://localhost:8080/api/exercise-videos'

export const useExerciseVideoStore = defineStore('exerciseVideo', () => {

  // 리스트
  const exerciseVideoList = ref([]);
  
  // 인기 영상 9개만
  const rankedVideoList = ref([]);
  
  // 얘는 상세 조회용
  const exerciseVideo = ref({});
    

  const getRankedExerciseVideoList = async () => {
    await axios.get(`${REST_API_URL}?sort=likes`)
      .then((response) => {
        rankedVideoList.value = response.data.data.splice(0, 9);
      })
  }

  const getAllExerciseVideoList = async () => {
    await axios.get(REST_API_URL)
      .then((response) => {
        exerciseVideoList.value = response.data.data
      })
  }

  const getVideoDetailInfo = async (id) => {
    await axios.get(`${REST_API_URL}/${id}`)
      .then((response) => {
        exerciseVideo.value = response.data.data
      })
  }

  const searchExerciseVideos = async ({ keyword = '', sort = '', target = '' }) => {
    let url = REST_API_URL;
    const params = new URLSearchParams();
    
    if (keyword) params.append('keyword', keyword);
    if (sort) params.append('sort', sort);
    if (target) params.append('target', target);
    
    url += '?' + params.toString();
    
    await axios.get(url)
      .then((response) => {
        exerciseVideoList.value = response.data.data;
      })
      .catch((error) => {
        console.error('Error searching videos:', error);
      });
  }

  return { getRankedExerciseVideoList, getAllExerciseVideoList, exerciseVideoList, rankedVideoList, exerciseVideo, getVideoDetailInfo, searchExerciseVideos }
})
