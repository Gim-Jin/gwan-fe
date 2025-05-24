import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';

const REST_API_URL = 'http://localhost:8080/api/exercise-videos'

export const useCommentStore = defineStore('comment', () => {

  // 리스트
  const comments = ref([]);
  
  

  const getComments = async (id) => {
    await axios.get(`${REST_API_URL}/${id}/comments`)
      .then((response) => {
        comments.value = response.data.data;
      })
  }

  const saveComment = async (videoId, content) => {
    try {
    
        const response = await axios.post(`${REST_API_URL}/${videoId}/comments`, {
            content,
        }, {withCredentials: true});
        await getComments(videoId);
    } catch(error) {
        console.log("저장 실패:" , error);
    }
  } 

  return { comments, getComments, saveComment }
})
