import instance from './axios';

export function fetchMypage() {
  return instance.get('/api/user/mypage');
} 