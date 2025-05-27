import api from '@/api/axios';

// ========== ARTICLE CONTROLLER ==========

// 게시글 목록 조회
export const getArticles = async () => {
  const response = await api.get('/api/articles');
  return response.data.data;
};

// 게시글 상세 조회  
export const getArticle = async (articleId) => {
  const response = await api.get(`/api/articles/${articleId}`);
  return response.data.data;
};

// 게시글 작성
export const createArticle = async (articleData) => {
  const response = await api.post('/api/articles/create', articleData);
  
  // 응답 구조 확인
  if (response.data.success) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || '게시글 작성에 실패했습니다.');
  }
};

// 게시글 수정
export const updateArticle = async (articleId, articleData) => {
  const response = await api.put(`/api/articles/${articleId}`, articleData);
  return response.data.data;
};

// 게시글 삭제
export const deleteArticle = async (articleId) => {
  const response = await api.delete(`/api/articles/${articleId}`);
  return response.data;
};

// 게시글 추천(좋아요) 추가
export const addRecommend = async (articleId) => {
  const response = await api.post('/api/recommand', { articleId })
  return response.data.data
}

// 게시글 추천(좋아요) 취소
export const removeRecommend = async (articleId) => {
  const response = await api.delete(`/api/recommand/${articleId}`)
  return response.data.data
}

// 내가 추천했는지 확인
export const isRecommended = async (articleId) => {
  const response = await api.get(`/api/recommand/${articleId}`)
  return response.data.data
}

// ========== REVIEW CONTROLLER ==========

// 댓글 수정
export const updateComment = async (articleId, reviewId, commentData) => {
  const response = await api.put(`/api/articles/${articleId}/review`, {
    reviewId,
    ...commentData
  });
  return response.data.data;
};

// 댓글 작성
export const createComment = async (articleId, commentData) => {
  const response = await api.post(`/api/articles/${articleId}/review`, commentData);
  return response.data.data;
};

// 댓글 삭제
export const deleteComment = async (articleId, reviewId) => {
  const response = await api.delete(`/api/articles/${articleId}/review/${reviewId}`);
  return response.data;
}; 