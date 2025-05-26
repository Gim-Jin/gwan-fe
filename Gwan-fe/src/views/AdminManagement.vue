<template>
  <div class="container my-5">
    <!-- 관리자 대시보드 헤더 -->
    <div class="admin-header mb-4">
      <div class="d-flex align-items-center mb-3">
        <i class="bi bi-person-gear me-3" style="font-size: 2rem; color: #FF8A65;"></i>
        <h2 class="mb-0" style="color: #3A3A3A;">관리자 페이지</h2>
      </div>
      <p class="text-muted">등록된 사용자들을 관리하고 모니터링할 수 있습니다.</p>
    </div>

    <!-- 통계 카드 -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="bi bi-people-fill"></i>
          </div>
          <div class="stat-content">
            <h3>{{ stats.totalUsers }}</h3>
            <p>전체 사용자</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="bi bi-person-check-fill"></i>
          </div>
          <div class="stat-content">
            <h3>{{ stats.generalUsers }}</h3>
            <p>일반 유저</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="bi bi-person-plus-fill"></i>
          </div>
          <div class="stat-content">
            <h3>{{ stats.advisorUsers }}</h3>
            <p>처방사</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="bi bi-shield-check"></i>
          </div>
          <div class="stat-content">
            <h3>{{ stats.adminUsers }}</h3>
            <p>관리자</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 검색 및 필터 -->
    <div class="search-filter-section mb-4">
      <div class="row">
        <div class="col-md-6">
          <div class="input-group">
            <span class="input-group-text">
              <i class="bi bi-search"></i>
            </span>
            <input 
              type="text" 
              class="form-control" 
              placeholder="사용자 이름, 이메일로 검색..."
              v-model="searchQuery"
              @input="handleSearch"
            />
          </div>
        </div>
        <div class="col-md-3">
          <select class="form-select" v-model="roleFilter" @change="handleFilterChange">
            <option value="">모든 역할</option>
            <option value="GENERAL">일반 사용자</option>
            <option value="ADVISOR">처방사</option>
            <option value="ADMIN">관리자</option>
          </select>
        </div>
      </div>
    </div>

    <!-- UserManage 컴포넌트 -->
    <UserManage 
      :users="users" 
      :loading="loading" 
      :error="error"
      :searchQuery="searchQuery"
      :roleFilter="roleFilter"
      :statusFilter="statusFilter"
      @user-updated="handleUserUpdated"
      @user-deleted="handleUserDeleted"
      @refresh-users="fetchUsers"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import UserManage from '@/components/admin/UserManage.vue';
import { getUsers } from '@/api/userApi.js';

// 상태 관리
const users = ref([]);
const loading = ref(false);
const error = ref(null);
const searchQuery = ref('');
const roleFilter = ref('');
const statusFilter = ref('');

// 통계 데이터
const stats = ref({
  totalUsers: 0,
  generalUsers: 0,
  advisorUsers: 0,
  adminUsers: 0
});

// 사용자 데이터 가져오기 (실제 API 호출)
const fetchUsers = async () => {
  console.log('fetchUsers 호출');
  loading.value = true;
  error.value = null;
  try {
    const userData = await getUsers();
    users.value = userData;
    updateStats(userData);
  } catch (err) {
    error.value = '사용자 데이터를 불러오는데 실패했습니다.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// 통계 업데이트
const updateStats = (userData) => {
  stats.value = {
    totalUsers: userData.length,
    generalUsers: userData.filter(u => u.role === 'GENERAL').length,
    advisorUsers: userData.filter(u => u.role === 'ADVISOR' || u.role === 'PRESCRIBER').length,
    adminUsers: userData.filter(u => u.role === 'ADMIN').length
  };
};

const isToday = (dateString) => {
  const today = new Date().toDateString();
  const date = new Date(dateString).toDateString();
  return today === date;
};

// 이벤트 핸들러
const handleSearch = () => {
  // 검색어 변경 시 자동으로 UserManage 컴포넌트에서 처리됨
};

const handleFilterChange = () => {
  // 필터 변경 시 자동으로 UserManage 컴포넌트에서 처리됨
};

const handleUserUpdated = ({ loginId, updates }) => {
  const index = users.value.findIndex(u => u.loginId === loginId);
  if (index !== -1) {
    users.value[index] = {
      ...users.value[index],
      ...updates
    };
  }
};

const handleUserDeleted = (loginId) => {
  users.value = users.value.filter(u => u.loginId !== loginId);
  updateStats(users.value);
};

onMounted(() => {
  fetchUsers();
});
</script>

<script>
export default {
  name: 'AdminManagement'
}
</script>

<style scoped>
.admin-header {
  background: linear-gradient(135deg, #FFF7F0 0%, #ffffff 100%);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #FF8A65;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #FF8A65;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.stat-icon i {
  font-size: 1.5rem;
  color: #FFF7F0;
}

.stat-content h3 {
  font-size: 2rem;
  font-weight: bold;
  color: #3A3A3A;
  margin-bottom: 0.5rem;
}

.stat-content p {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
}

.search-filter-section {
  background: #FFF7F0;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #FF8A65;
}
</style>