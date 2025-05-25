<template>
  <div class="container my-5">
    <!-- 관리자 대시보드 헤더 -->
    <div class="admin-header mb-4">
      <div class="d-flex align-items-center mb-3">
        <i class="bi bi-person-gear me-3" style="font-size: 2rem; color: #FF8A65;"></i>
        <h2 class="mb-0" style="color: #3A3A3A;">유저 관리</h2>
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
            <h3>{{ stats.activeUsers }}</h3>
            <p>활성 사용자</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="bi bi-person-plus-fill"></i>
          </div>
          <div class="stat-content">
            <h3>{{ stats.newUsersToday }}</h3>
            <p>오늘 가입</p>
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
              @input="filterUsers"
            />
          </div>
        </div>
        <div class="col-md-3">
          <select class="form-select" v-model="roleFilter" @change="filterUsers">
            <option value="">모든 역할</option>
            <option value="GENERAL">일반 사용자</option>
            <option value="ADVISOR">처방사</option>
            <option value="ADMIN">관리자</option>
          </select>
        </div>
        <div class="col-md-3">
          <select class="form-select" v-model="statusFilter" @change="filterUsers">
            <option value="">모든 상태</option>
            <option value="active">활성</option>
            <option value="inactive">비활성</option>
          </select>
        </div>
      </div>
    </div>

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
            <tr v-for="user in filteredUsers" :key="user.id">
              <td>
                <ProfileAvatar :userType="getUserType(user)" :size="40" />
              </td>
              <td>
                <div>
                  <strong>{{ user.nickName || user.name }}</strong>
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
                <small>{{ formatDate(user.createdAt) }}</small>
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import ProfileAvatar from '@/components/common/ProfileAvatar.vue'

const router = useRouter()

// 상태 관리
const users = ref([])
const filteredUsers = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

// 통계 데이터
const stats = ref({
  totalUsers: 0,
  activeUsers: 0,
  newUsersToday: 0,
  adminUsers: 0
})

// 계산된 속성
const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage))
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// 사용자 데이터 가져오기 (임시 데이터)
const fetchUsers = async () => {
  loading.value = true
  error.value = null
  
  try {
    // 실제 API 호출로 대체 필요
    // const response = await api.get('/api/admin/users')
    
    // 임시 데이터
    const mockUsers = [
      {
        id: 1,
        nickName: '김건강',
        email: 'user1@example.com',
        role: 'GENERAL',
        createdAt: '2024-01-15',
        isActive: true,
        videoCnt: 15,
        commentCnt: 8
      },
      {
        id: 2,
        nickName: '이처방',
        email: 'advisor@example.com',
        role: 'ADVISOR',
        createdAt: '2024-01-10',
        isActive: true,
        videoCnt: 5,
        commentCnt: 12
      },
      {
        id: 3,
        nickName: '관리자',
        email: 'admin@example.com',
        role: 'ADMIN',
        createdAt: '2024-01-01',
        isActive: true,
        videoCnt: 0,
        commentCnt: 3
      }
    ]
    
    users.value = mockUsers
    filteredUsers.value = mockUsers
    
    // 통계 계산
    stats.value = {
      totalUsers: mockUsers.length,
      activeUsers: mockUsers.filter(u => u.isActive).length,
      newUsersToday: mockUsers.filter(u => isToday(u.createdAt)).length,
      adminUsers: mockUsers.filter(u => u.role === 'ADMIN').length
    }
    
  } catch (err) {
    error.value = '사용자 데이터를 불러오는데 실패했습니다.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// 유틸리티 함수들
const getUserType = (user) => {
  if (user.role === 'ADMIN') return 'admin'
  if (user.role === 'ADVISOR') return 'prescriber'
  return 'user'
}

const getRoleLabel = (role) => {
  const labels = {
    'GENERAL': '일반 사용자',
    'ADVISOR': '처방사',
    'ADMIN': '관리자'
  }
  return labels[role] || role
}

const getRoleBadgeClass = (role) => {
  const classes = {
    'GENERAL': 'bg-primary',
    'ADVISOR': 'bg-success',
    'ADMIN': 'bg-danger'
  }
  return classes[role] || 'bg-secondary'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ko-KR')
}

const isToday = (dateString) => {
  const today = new Date().toDateString()
  const date = new Date(dateString).toDateString()
  return today === date
}

// 필터링 함수
const filterUsers = () => {
  let filtered = users.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.nickName?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    )
  }
  
  if (roleFilter.value) {
    filtered = filtered.filter(user => user.role === roleFilter.value)
  }
  
  if (statusFilter.value) {
    const isActive = statusFilter.value === 'active'
    filtered = filtered.filter(user => user.isActive === isActive)
  }
  
  filteredUsers.value = filtered
  currentPage.value = 1
}

// 페이지네이션
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// 사용자 관리 함수들
const viewUser = (user) => {
  // 사용자 상세 보기 모달 또는 페이지로 이동
  console.log('사용자 보기:', user)
}

const editUser = (user) => {
  // 사용자 편집 모달 또는 페이지로 이동
  console.log('사용자 편집:', user)
}

const toggleUserStatus = (user) => {
  if (user.role === 'ADMIN') return
  
  const action = user.isActive ? '비활성화' : '활성화'
  if (confirm(`${user.nickName} 사용자를 ${action}하시겠습니까?`)) {
    user.isActive = !user.isActive
    // 실제 API 호출 필요
    console.log(`사용자 ${action}:`, user)
  }
}

onMounted(() => {
  fetchUsers()
})
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
</style> 