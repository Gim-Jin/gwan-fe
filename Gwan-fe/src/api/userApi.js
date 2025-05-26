import api from '@/api/axios';

// 사용자 전체 조회
export const getUsers = async () => {
  const response = await api.get('/api/admin/users');
  return response.data.data;
};

// 사용자 정보 수정
export const updateUser = async (userId, updateData) => {
  // updateData: { name, loginId, email, role }
  const response = await api.put(`/api/admin/users/${userId}`, updateData);
  return response.data;
};

// 사용자 삭제
export const deleteUser = async (userId) => {
  const response = await api.delete(`/api/admin/users/${userId}`);
  return response.data;
}; 