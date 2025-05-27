import { defineStore } from 'pinia'
import { ref } from 'vue'
import { 
  getArticles, 
  getArticle, 
  createArticle, 
  updateArticle, 
  deleteArticle,
  createComment,
  updateComment,
  deleteComment
} from '@/api/community'

export const useCommunityStore = defineStore('community', () => {
  // 상태
  const articles = ref([])
  const currentArticle = ref(null)
  const comments = ref([])
  const loading = ref(false)
  const error = ref(null)

  // 게시글 목록 조회
  const fetchArticles = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await getArticles()
      articles.value = data
    } catch (err) {
      error.value = err.response?.data?.message || '게시글을 불러오는데 실패했습니다.'
      console.error('게시글 목록 조회 실패:', err)
    } finally {
      loading.value = false
    }
  }

  // 게시글 상세 조회
  const fetchArticle = async (articleId) => {
    loading.value = true
    error.value = null
    try {
      const data = await getArticle(articleId)
      currentArticle.value = data
      return data
    } catch (err) {
      error.value = err.response?.data?.message || '게시글을 불러오는데 실패했습니다.'
      console.error('게시글 상세 조회 실패:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 게시글 작성
  const addArticle = async (articleData) => {
    loading.value = true
    error.value = null
    try {
      const newArticle = await createArticle(articleData)
      
      // 응답 데이터 구조 확인
      if (!newArticle) {
        throw new Error('서버에서 게시글 데이터를 반환하지 않았습니다.')
      }
      
      // 서버에서 ID를 반환하지 않는 경우 목록을 새로고침
      if (!newArticle.articleId && !newArticle.id) {
        // 목록을 새로고침하여 새 게시글 반영 (비동기로 실행)
        setTimeout(() => {
          fetchArticles()
        }, 100)
      } else {
        // ID가 있으면 목록에 추가
        articles.value.unshift(newArticle)
      }
      
      return newArticle
    } catch (err) {
      error.value = err.response?.data?.message || '게시글 작성에 실패했습니다.'
      console.error('게시글 작성 실패:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 게시글 수정
  const editArticle = async (articleId, articleData) => {
    loading.value = true
    error.value = null
    try {
      const updatedArticle = await updateArticle(articleId, articleData)
      
      // 목록에서 해당 게시글 업데이트
      const index = articles.value.findIndex(article => (article.articleId === articleId || article.id === articleId))
      if (index !== -1) {
        articles.value[index] = updatedArticle
      }
      
      // 현재 게시글이 수정된 게시글이면 업데이트
      if (currentArticle.value && (currentArticle.value.articleId === articleId || currentArticle.value.id === articleId)) {
        currentArticle.value = updatedArticle
      }
      
      return updatedArticle
    } catch (err) {
      error.value = err.response?.data?.message || '게시글 수정에 실패했습니다.'
      console.error('게시글 수정 실패:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 게시글 삭제
  const removeArticle = async (articleId) => {
    loading.value = true
    error.value = null
    try {
      await deleteArticle(articleId)
      
      // 목록에서 해당 게시글 제거
      articles.value = articles.value.filter(article => (article.articleId !== articleId && article.id !== articleId))
      
      // 현재 게시글이 삭제된 게시글이면 초기화
      if (currentArticle.value && (currentArticle.value.articleId === articleId || currentArticle.value.id === articleId)) {
        currentArticle.value = null
      }
    } catch (err) {
      error.value = err.response?.data?.message || '게시글 삭제에 실패했습니다.'
      console.error('게시글 삭제 실패:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 댓글 목록은 게시글 상세 조회 시 함께 가져옴
  const fetchComments = async (articleId) => {
    try {
      // 게시글 상세 조회 시 댓글도 함께 가져오므로 별도 API 호출 불필요
      if (currentArticle.value && (currentArticle.value.articleId === articleId || currentArticle.value.id === articleId)) {
        comments.value = currentArticle.value.reviews || []
        return comments.value
      }
      // 게시글이 없으면 상세 조회 먼저 실행
      await fetchArticle(articleId)
      comments.value = currentArticle.value?.reviews || []
      return comments.value
    } catch (err) {
      error.value = err.response?.data?.message || '댓글을 불러오는데 실패했습니다.'
      console.error('댓글 목록 조회 실패:', err)
      throw err
    }
  }

  // 댓글 작성
  const addComment = async (articleId, commentData) => {
    try {
      const newComment = await createComment(articleId, commentData)
      
      // 댓글 목록에 추가
      comments.value.push(newComment)
      
      // 현재 게시글의 댓글 목록 업데이트
      if (currentArticle.value && (currentArticle.value.articleId === articleId || currentArticle.value.id === articleId)) {
        if (!currentArticle.value.reviews) {
          currentArticle.value.reviews = []
        }
        currentArticle.value.reviews.push(newComment)
      }
      
      return newComment
    } catch (err) {
      error.value = err.response?.data?.message || '댓글 작성에 실패했습니다.'
      console.error('댓글 작성 실패:', err)
      throw err
    }
  }

  // 댓글 수정
  const editComment = async (articleId, reviewId, commentData) => {
    try {
      const updatedComment = await updateComment(articleId, reviewId, commentData)
      
      // 댓글 목록에서 해당 댓글 업데이트
      const index = comments.value.findIndex(comment => comment.id === reviewId)
      if (index !== -1) {
        comments.value[index] = updatedComment
      }
      
      // 현재 게시글의 댓글 목록에서도 업데이트
      if (currentArticle.value && currentArticle.value.reviews) {
        const articleIndex = currentArticle.value.reviews.findIndex(comment => comment.id === reviewId)
        if (articleIndex !== -1) {
          currentArticle.value.reviews[articleIndex] = updatedComment
        }
      }
      
      return updatedComment
    } catch (err) {
      error.value = err.response?.data?.message || '댓글 수정에 실패했습니다.'
      console.error('댓글 수정 실패:', err)
      throw err
    }
  }

  // 댓글 삭제
  const removeComment = async (articleId, reviewId) => {
    try {
      await deleteComment(articleId, reviewId)
      
      // 댓글 목록에서 해당 댓글 제거
      comments.value = comments.value.filter(comment => comment.id !== reviewId)
      
      // 현재 게시글의 댓글 목록에서도 제거
      if (currentArticle.value && currentArticle.value.reviews) {
        currentArticle.value.reviews = currentArticle.value.reviews.filter(comment => comment.id !== reviewId)
        currentArticle.value.commentCount = currentArticle.value.reviews.length
      }
    } catch (err) {
      error.value = err.response?.data?.message || '댓글 삭제에 실패했습니다.'
      console.error('댓글 삭제 실패:', err)
      throw err
    }
  }



  // 상태 초기화
  const resetState = () => {
    articles.value = []
    currentArticle.value = null
    comments.value = []
    error.value = null
  }

  return {
    // 상태
    articles,
    currentArticle,
    comments,
    loading,
    error,
    
    // 액션
    fetchArticles,
    fetchArticle,
    addArticle,
    editArticle,
    removeArticle,
    fetchComments,
    addComment,
    editComment,
    removeComment,
    resetState
  }
}) 