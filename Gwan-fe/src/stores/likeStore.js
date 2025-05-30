import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';
import { useAuthStore } from './auth';

const REST_API_URL = 'http://localhost:8080/api/likes'

export const useLikeStore = defineStore('like', () => {
  const isLiked = ref(false);

  const checkLike = async (videoId) => {
    try {
      const response = await axios.get(`${REST_API_URL}/${videoId}`, { withCredentials: true });
      isLiked.value = response.data.data;
    } catch (error) {
      console.error('Error checking like status:', error);
      isLiked.value = false;
    }
  };

  const toggleLike = async (videoId) => {
    const authStore = useAuthStore();
    
    // 로그인 체크
    if (!authStore.isAuthenticated) {
      throw new Error('로그인이 필요합니다.');
    }

    try {
      if (isLiked.value) {
        await axios.delete(`${REST_API_URL}/${videoId}`, { withCredentials: true });
      } else {
        await axios.post(REST_API_URL, { exerciseVideoId : videoId }, { withCredentials: true });
      }
      isLiked.value = !isLiked.value;
    } catch (error) {
      console.error('Error toggling like:', error);

      throw error;
    }
  };


  const likedVideos = ref([]);
  const getLikedVideos = async () => {
    try {
      const response = await axios.get(REST_API_URL, { withCredentials: true });
      likedVideos.value = response.data.data;
    } catch (error) {
      console.error('Error getting liked videos:', error);
    }
  }

  return { isLiked, checkLike, toggleLike, likedVideos, getLikedVideos }
}) 