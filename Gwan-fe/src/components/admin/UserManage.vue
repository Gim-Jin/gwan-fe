<template>
  <div>
    <!-- 사용자 목록 테이블 -->
    <div class="user-table-container">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">불러오는 중...</span>
        </div>
      </div>
      
      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover">
          <thead class="table-light">
            <tr>
              <th>프로필</th>
              <th>사용자 정보</th>
              <th>역할</th>
              <th>가입일</th>
              <th>활동</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in paginatedUsers" :key="user.id">
              <td>
                <ProfileAvatar :userType="getUserType(user)" :size="40" />
              </td>
              <td>
                <div>
                  <strong>{{ user.name }}</strong>
                  <br>
                  <small class="text-muted">{{ user.email }}</small>
                </div>
              </td>
              <td>
                <span class="badge" :class="getRoleBadgeClass(user.role)">
                  {{ getRoleLabel(user.role) }}
                </span>
              </td>
              <td>
                <small>{{ formatDate(user.createTime) }}</small>
              </td>
              <td>
                <div class="activity-stats">
                  <small>
                    <i class="bi bi-lightning-charge text-warning"></i> {{ user.videoCnt || 0 }}
                    <i class="bi bi-chat-dots text-info ms-2"></i> {{ user.commentCnt || 0 }}
                  </small>
                </div>
              </td>
              <td>
                <span class="badge" :class="user.isActive ? 'bg-success' : 'bg-secondary'">
                  {{ user.isActive ? '활성' : '비활성' }}
                </span>
              </td>
              <td>
                <div class="btn-group btn-group-sm">
                  <button class="btn btn-outline-primary" @click="viewUser(user)">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button class="btn btn-outline-warning" @click="editUser(user)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button 
                    class="btn btn-outline-danger" 
                    @click="toggleUserStatus(user)"
                    :disabled="user.role === 'ADMIN'"
                  >
                    <i class="bi" :class="user.isActive ? 'bi-person-x' : 'bi-person-check'"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 페이지네이션 -->
    <nav v-if="totalPages > 1" class="mt-4">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="changePage(currentPage - 1)">이전</button>
        </li>
        <li 
          v-for="page in visiblePages" 
          :key="page" 
          class="page-item" 
          :class="{ active: page === currentPage }"
        >
          <button class="page-link" @click="changePage(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="changePage(currentPage + 1)">다음</button>
        </li>
      </ul>
    </nav>

    <!-- 사용자 상세 정보 / 편집 모달 -->
    <div v-if="showEditModal" class="user-edit-modal">
      <div class="user-edit-backdrop" @click="closeEditModal"></div>
      <div class="user-edit-content">
        <h5>사용자 정보 수정</h5>
        <form @submit.prevent="submitUserEdit">
          <div class="form-group">
            <label for="editUserName">닉네임</label>
            <input type="text" id="editUserName" v-model="editingUser.name" />
          </div>
          <div class="form-group">
            <label for="editUserRole">역할</label>
            <select id="editUserRole" v-model="editingUser.role">
              <option value="GENERAL">일반 사용자</option>
              <option value="ADVISOR">처방사</option>
              <option value="ADMIN">관리자</option>
            </select>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="closeEditModal">취소</button>
            <button type="submit" class="btn-primary">저장</button>
          </div>
        </form>
        <button class="close-btn" @click="closeEditModal">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    </div>

    <!-- 삭제 확인 모달 -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">사용자 삭제 확인</h5>
          <button type="button" class="close-btn" @click="closeDeleteModal">&times;</button>
        </div>
        <div class="modal-body">
          <p>정말로 <strong>{{ editingUser.name }}</strong> 사용자를 삭제하시겠습니까?</p>
          <p class="text-danger">이 작업은 되돌릴 수 없습니다.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-secondary" @click="closeDeleteModal">취소</button>
          <button type="button" class="btn-danger" @click="confirmDeleteUser">삭제</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ProfileAvatar from '@/components/common/ProfileAvatar.vue';
import { updateUser, deleteUser } from '@/api/userApi.js';

// Props 정의
const props = defineProps({
  users: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  },
  searchQuery: {
    type: String,
    default: ''
  },
  roleFilter: {
    type: String,
    default: ''
  },
  statusFilter: {
    type: String,
    default: ''
  }
});

// Emits 정의
const emit = defineEmits(['user-updated', 'user-deleted', 'update-stats', 'refresh-users']);

const router = useRouter();

// 상태 관리
const filteredUsers = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;

// 모달 상태 관리
const showEditModal = ref(false);
const showDeleteModal = ref(false);

// 드롭백 스타일 모달용 상태
const showBackdrop = ref(false);

// 편집용 상태
const editingUser = ref({
  userId: '',
  loginId: '',
  name: '',
  email: '',
  password: '',
  role: ''
});

// 계산된 속성
const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage));
const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, start + 4);
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredUsers.value.slice(start, end);
});

// 필터링 함수
const filterUsers = () => {
  let filtered = [...props.users];

  // 이름, 이메일로 검색
  if (props.searchQuery) {
    const query = props.searchQuery.toLowerCase();
    filtered = filtered.filter(user =>
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    );
  }

  if (props.roleFilter) {
    filtered = filtered.filter(user => user.role === props.roleFilter);
  }

  if (props.statusFilter) {
    const isActive = props.statusFilter === 'active';
    filtered = filtered.filter(user => user.isActive === isActive);
  }

  filteredUsers.value = filtered;
  currentPage.value = 1;
};

// 사용자 목록 변경 감지
watch(() => props.users, (newUsers) => {
  filterUsers();
}, { immediate: true });

watch(() => props.searchQuery, () => {
  filterUsers();
});

watch(() => props.roleFilter, () => {
  filterUsers();
});

watch(() => props.statusFilter, () => {
  filterUsers();
});

// 유틸리티 함수들
const getUserType = (user) => {
  if (user.role === 'ADMIN') return 'admin';
  if (user.role === 'ADVISOR') return 'prescriber';
  return 'user';
};

const getRoleLabel = (role) => {
  const labels = {
    'GENERAL': '일반 사용자',
    'ADVISOR': '처방사',
    'ADMIN': '관리자'
  };
  return labels[role] || role;
};

const getRoleBadgeClass = (role) => {
  const classes = {
    'GENERAL': 'bg-primary',
    'ADVISOR': 'bg-success',
    'ADMIN': 'bg-danger'
  };
  return classes[role] || 'bg-secondary';
};

// 페이지네이션
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// 모달 관련 함수
const closeEditModal = () => {
  showEditModal.value = false;
  showBackdrop.value = false;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
};

// 사용자 관리 함수들
const viewUser = (user) => {
  // 사용자 상세 보기 페이지로 이동
  router.push(`/admin/users/${user.id}`);
};

const editUser = (user) => {
  editingUser.value = {
    userId: user.userId || user.id,
    loginId: user.loginId,
    name: user.nickname || '',
    email: user.email || '',
    password: user.password || '',
    role: user.role
  };
  showEditModal.value = true;
  showBackdrop.value = true;
};

const submitUserEdit = async () => {
  if (!editingUser.value.userId) {
    alert('유저 고유번호(userId)가 없습니다. 관리자에게 문의하세요.');
    return;
  }

  try {
    const updateData = {
      loginId: editingUser.value.loginId,
      email: editingUser.value.email,
      nickname: editingUser.value.name,
      role: editingUser.value.role,
      password: editingUser.value.password
    };
    await updateUser(editingUser.value.userId, updateData);
    emit('user-updated', {
      loginId: editingUser.value.loginId,
      updates: updateData
    });
    showEditModal.value = false;
    showBackdrop.value = false;
    alert('수정이 완료되었습니다');
    emit('refresh-users');
  } catch (err) {
    console.error('사용자 정보 업데이트에 실패했습니다.', err);
    alert('사용자 정보 업데이트에 실패했습니다.');
  }
};

const toggleUserStatus = (user) => {
  if (user.role === 'ADMIN') return;
  editingUser.value = user;
  showDeleteModal.value = true;
};

const confirmDeleteUser = async () => {
  try {
    const response = await deleteUser(editingUser.value.userId);
    if (response.success) {
      emit('user-deleted', editingUser.value.loginId);
      showDeleteModal.value = false;
      alert('삭제가 완료되었습니다');
      emit('refresh-users');
    }
  } catch (err) {
    console.error('사용자 삭제에 실패했습니다.', err);
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  // LocalDateTime 문자열(예: 2025-05-25T01:32:03)도 지원
  const date = new Date(dateString.includes('T') ? dateString.replace('T', ' ') : dateString);
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

onMounted(() => {
  filterUsers();
});
</script>

<style scoped>
.user-table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table th {
  background-color: #FFF7F0;
  color: #3A3A3A;
  font-weight: 600;
  border: none;
}

.table td {
  vertical-align: middle;
  border-color: #f0f0f0;
}

.activity-stats i {
  font-size: 0.9rem;
}

.btn-group-sm .btn {
  padding: 0.25rem 0.5rem;
}

.pagination .page-link {
  color: #FF8A65;
  border-color: #FF8A65;
}

.pagination .page-item.active .page-link {
  background-color: #FF8A65;
  border-color: #FF8A65;
}

.pagination .page-link:hover {
  color: #3A3A3A;
  background-color: #FFF7F0;
  border-color: #FF8A65;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f8f9fa;
}

.modal-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
  gap: 0.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.btn-primary {
  background-color: #FF8A65;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.text-danger {
  color: #dc3545;
}

.user-edit-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.user-edit-backdrop {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
}
.user-edit-content {
  position: relative;
  z-index: 10;
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  min-width: 400px;
  max-width: 90vw;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}
.close-btn {
  position: absolute;
  top: 1.2rem; right: 1.2rem;
  background: none;
  border: none;
  font-size: 1.3rem;
  color: #666;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.close-btn:hover {
  background-color: #f5f5f5;
  color: #333;
}
</style>
