<template>
  <div class="routine-card" :class="getCategoryClass()">
    <div class="category-badge">
      <i :class="getCategoryIcon()"></i> {{ getCategoryLabel() }}
    </div>
    
    <div class="routine-content">
      <h4 class="exercise-name">
        {{ exercise.name }}
      </h4>
      
      <div class="exercise-details">
        <div class="detail-item">
          <i class="bi bi-clock-fill text-primary"></i>
          <span>{{ exercise.duration }}</span>
        </div>
        
        <div class="detail-item">
          <i class="bi bi-tools text-danger"></i>
          <span>{{ exercise.equipment }}</span>
        </div>
      </div>
      
      <p class="note" v-if="exercise.note">
        <i class="bi bi-info-circle text-warning"></i>
        <span>{{ exercise.note }}</span>
      </p>
    </div>
    
    <div class="difficulty-indicator" :class="getDifficultyClass()">
      <span class="visually-hidden">난이도</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RoutineCard',
  props: {
    exercise: {
      type: Object,
      required: true
    }
  },
  methods: {
    getCategoryClass() {
      const category = this.exercise.category || '';
      
      if (category.includes('준비') || category.includes('근막이완')) {
        return 'warm';
      } else if (category.includes('마무리') || category.includes('스트레칭')) {
        return 'cool';
      } else {
        return 'main';
      }
    },
    getCategoryLabel() {
      const category = this.exercise.category || '';
      
      if (category.includes('준비') || category.includes('근막이완')) {
        return '준비 운동';
      } else if (category.includes('신경 활주')) {
        return '신경 운동';
      } else if (category.includes('강화')) {
        return '근력 강화';
      } else if (category.includes('안정화')) {
        return '안정화';
      } else if (category.includes('유지 운동')) {
        return '유지 운동';
      } else if (category.includes('마무리') || category.includes('스트레칭')) {
        return '마무리';
      } else {
        return '기타 운동';
      }
    },
    getCategoryIcon() {
      const category = this.exercise.category || '';
      
      if (category.includes('준비') || category.includes('근막이완')) {
        return 'bi bi-fire text-warning';
      } else if (category.includes('신경 활주')) {
        return 'bi bi-lightning-charge text-info';
      } else if (category.includes('강화')) {
        return 'bi bi-trophy text-primary';
      } else if (category.includes('안정화')) {
        return 'bi bi-shield-check text-success';
      } else if (category.includes('유지 운동')) {
        return 'bi bi-arrow-repeat text-primary';
      } else if (category.includes('마무리') || category.includes('스트레칭')) {
        return 'bi bi-check-circle text-success';
      } else {
        return 'bi bi-lightning text-secondary';
      }
    },
    getDifficultyClass() {
      // 난이도 정보가 있다면 사용, 없으면 기본값으로 '중급'
      const difficulty = this.exercise.difficulty || 'medium';
      
      if (difficulty === 'easy' || difficulty === '초급') {
        return 'easy';
      } else if (difficulty === 'hard' || difficulty === '고급') {
        return 'hard';
      } else {
        return 'medium';
      }
    }
  }
}
</script>

<style scoped>
.routine-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  position: relative;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
  border-left: 5px solid #ccc;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.routine-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.routine-content {
  padding-top: 1.5rem;
}

.routine-card.warm {
  border-left-color: #ff7e67;
  background-color: #fff9f8;
}

.routine-card.main {
  border-left-color: #365fff;
  background-color: #f8faff;
}

.routine-card.cool {
  border-left-color: #5cdb95;
  background-color: #f8fff9;
}

.category-badge {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 0.3rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  border-radius: 0;
}

.routine-card.warm .category-badge {
  background-color: #ff7e67;
}

.routine-card.main .category-badge {
  background-color: #365fff;
}

.routine-card.cool .category-badge {
  background-color: #5cdb95;
}

.exercise-name {
  margin: 0 0 0.8rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  line-height: 1.3;
}

.exercise-details {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.8rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #555;
  background-color: rgba(0, 0, 0, 0.03);
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
}

.detail-item i {
  font-size: 0.9rem;
}

.note {
  margin: 0.5rem 0 0 0;
  font-size: 0.8rem;
  color: #666;
  background-color: rgba(0, 0, 0, 0.02);
  padding: 0.5rem;
  border-radius: 4px;
  border-left: 2px solid #ffc107;
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
  line-height: 1.4;
}

.note i {
  margin-top: 0.1rem;
}

.difficulty-indicator {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.difficulty-indicator.easy {
  background-color: #5cdb95;
}

.difficulty-indicator.medium {
  background-color: #ffc107;
}

.difficulty-indicator.hard {
  background-color: #dc3545;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.text-primary {
  color: #365fff;
}

.text-danger {
  color: #dc3545;
}

.text-warning {
  color: #ffc107;
}

.text-info {
  color: #0dcaf0;
}

.text-success {
  color: #5cdb95;
}

.text-secondary {
  color: #6c757d;
}
</style> 