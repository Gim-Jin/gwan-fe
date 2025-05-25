import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';

const REST_API_URL = 'http://localhost:8080/api/exercise-videos'

export const useCommentStore = defineStore('comment', () => {

  // 상태
  const comments = ref([]);
  const myComments = ref([]);
  
  // 비디오 페이지용 댓글 조회
  const getComments = async (id) => {
    await axios.get(`${REST_API_URL}/${id}/comments`)
      .then((response) => {
        comments.value = response.data.data;
      })
      .catch((error) => {
        console.error('댓글 목록 조회 실패:', error)
      })
  }

  // 댓글 작성
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

  // 마이페이지용 댓글 조회
  const getMyComments = async () => {
    await axios.get(`http://localhost:8080/api/users/comments`, {withCredentials: true})
      .then((response) => {
        myComments.value = response.data.data;
      })
  }

  // 비디오 페이지용 댓글 삭제
  const deleteComment = async (videoId, commentId) => {
    try {
      await axios.delete(`http://localhost:8080/api/users/comments/${commentId}`, {
        withCredentials: true
      });
      await getComments(videoId);
    } catch (error) {
      console.error("삭제 실패:", error);
      throw error;
    }
  }

  // 마이페이지용 댓글 삭제
  const removeComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8080/api/users/comments/${commentId}`, {withCredentials: true});
      myComments.value = myComments.value.filter((comment) => comment.id !== commentId);
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  }

  // 비디오 페이지용 댓글 수정
  const updateComment = async (videoId, commentId, content) => {
    try {
      await axios.put(`http://localhost:8080/api/users/comments/${commentId}`, {
        content
      }, {
        withCredentials: true
      });
      await getComments(videoId);
    } catch (error) {
      console.error("수정 실패:", error);
      throw error;
    }
  }

  // 마이페이지용 댓글 수정
  const modifyComment = async (commentId, content) => {
    try {
      await axios.put(`http://localhost:8080/api/users/comments/${commentId}`, {
        content
      }, { withCredentials: true });
      await getMyComments();
    } catch (error) {
      console.error('댓글 수정 실패:', error);
    }
  }

  return { 
    comments, 
    myComments,
    getComments, 
    saveComment, 
    getMyComments, 
    deleteComment,
    removeComment, 
    updateComment,
    modifyComment
  }
})
