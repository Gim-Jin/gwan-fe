// 커뮤니티(게시판)용 더미 데이터
export const dummyUsers = [
  { user_id: 1, nickname: '관리자', role: 'ADMIN' },
  { user_id: 2, nickname: '홍길동', role: 'GENERAL' },
  { user_id: 3, nickname: '김철수', role: 'GENERAL' },
  { user_id: 4, nickname: '이영희', role: 'GENERAL' },
]

export const dummyArticles = [
  {
    article_id: 1,
    user_id: 2,
    title: '첫 번째 게시글',
    content: '안녕하세요! 첫 글입니다.',
    created_at: '2024-06-01 12:00',
    updated_at: '2024-06-01 12:00',
    recommends: [3, 4], // user_id
    comments: [
      { review_id: 1, user_id: 3, content: '환영합니다!', created_at: '2024-06-01 12:10' }
    ]
  },
  {
    article_id: 2,
    user_id: 3,
    title: '두 번째 글',
    content: '두 번째 글 내용입니다.',
    created_at: '2024-06-02 09:30',
    updated_at: '2024-06-02 09:30',
    recommends: [2],
    comments: []
  },
] 