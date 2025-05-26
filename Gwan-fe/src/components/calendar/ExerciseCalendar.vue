<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <h2 class="calendar-title">주간 운동 일정</h2>
      <div class="calendar-actions">
        <button class="btn-today" @click="goToToday">오늘</button>
        <div class="date-navigation">
          <button class="nav-btn" @click="prevMonth">
            <i class="bi bi-chevron-left"></i>
          </button>
          <span class="current-month">{{ currentMonthYear }}</span>
          <button class="nav-btn" @click="nextMonth">
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="full-width-calendar">
      <FullCalendar 
        ref="fullCalendar"
        :options="calendarOptions"
      />
    </div>
    
    <div v-if="selectedEvent" class="event-detail-panel">
      <DayRoutineDetail
        :routine="selectedEvent"
        @close="closeDetail"
        @complete="completeExercise"
        @reschedule="rescheduleExercise"
      />
    </div>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import koLocale from '@fullcalendar/core/locales/ko'
import DayRoutineDetail from './DayRoutineDetail.vue'
import { doneRehabProgram } from '@/api/survey'

export default {
  name: 'ExerciseCalendar',
  components: {
    FullCalendar,
    DayRoutineDetail
  },
  props: {
    weeklyRoutine: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedEvent: null,
      currentMonthYear: '',
      calendarOptions: {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        locale: koLocale,
        headerToolbar: false, // 기본 헤더 대신 커스텀 헤더 사용
        firstDay: 1, // 월요일부터 시작
        dayMaxEvents: 3, // 날짜당 최대 표시 이벤트 수
        events: [],
        eventContent: this.renderEventContent,
        eventDidMount: this.eventDidMount,
        datesSet: this.handleDatesSet,
        height: 'auto',
        aspectRatio: 2, // 캘린더 가로/세로 비율 조정
        dayHeaderFormat: { weekday: 'short' }, // 요일 헤더 포맷 설정
        fixedWeekCount: false, // 주 수를 고정하지 않음
        contentHeight: 700 // 캘린더 콘텐츠 높이 설정
      }
    }
  },
  watch: {
    weeklyRoutine: {
      handler(newValue) {
        if (newValue && newValue.length > 0) {
          this.calendarOptions.events = this.generateEvents(newValue);
        }
      },
      immediate: true
    }
  },
  methods: {
    eventDidMount(info) {
      info.el.addEventListener('click', () => {
        this.handleEventClick(info);
      });
    },
    handleEventClick(info) {
      this.selectedEvent = info.event.extendedProps;
      this.$emit('exercise-selected', this.selectedEvent);
    },
    closeDetail() {
      this.selectedEvent = null;
    },
    renderEventContent(eventInfo) {
      const exercises = eventInfo.event.extendedProps.exercises || [];
      if (exercises.length > 0) {
        const names = exercises.map(ex => ex.name).filter(Boolean);
        const shown = names.slice(0, 2);
        const more = names.length > 2 ? `<span class="exercise-more">외 ${names.length - 2}개</span>` : '';
        return {
          html: `
            <div class="exercise-event">
              ${shown.map(n => `<span class="exercise-badge">${n}</span>`).join('')}
              ${more}
            </div>
          `
        };
      } else {
        return {
          html: `<div class="rest-event">휴식</div>`
        };
      }
    },
    generateEvents(routineData) {
      if (!routineData || routineData.length === 0) return [];
      
      return routineData.map(day => {
        const hasExercises = day.exercises && day.exercises.length > 0;
        
        return {
          title: hasExercises ? `${day.exercises.length}개 운동` : '휴식일',
          date: day.date,
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          textColor: '#333',
          classNames: hasExercises ? ['has-exercises'] : ['rest-day'],
          extendedProps: {
            ...day,
            title: `${day.day} 운동 루틴`,
            date: day.date
          }
        };
      });
    },
    handleDatesSet(dateInfo) {
      const date = dateInfo.view.currentStart;
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      this.currentMonthYear = `${year}년 ${month}월`;
    },
    goToToday() {
      const calendarApi = this.$refs.fullCalendar.getApi();
      calendarApi.today();
    },
    prevMonth() {
      const calendarApi = this.$refs.fullCalendar.getApi();
      calendarApi.prev();
    },
    nextMonth() {
      const calendarApi = this.$refs.fullCalendar.getApi();
      calendarApi.next();
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return `${date.getMonth() + 1}월 ${date.getDate()}일`;
    },
    completeExercise(rehabProgramId) {
      if (!rehabProgramId) {
        alert('루틴 ID가 없습니다.');
        return;
      }
      doneRehabProgram(rehabProgramId)
        .then(() => {
          alert('운동이 완료되었습니다!');
        })
        .catch((err) => {
          alert('운동 완료 처리에 실패했습니다.');
          console.error(err);
        });
    },
    rescheduleExercise() {
      // 일정 변경 처리 로직
      alert('일정 변경 기능은 개발 중입니다.');
    }
  }
}
</script>

<style scoped>
.calendar-container {
  width: 100%;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  max-width: 1400px;
  margin: 0 auto;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.calendar-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #222;
  margin: 0;
}

.calendar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-today {
  background-color: rgba(255, 138, 101, 0.1);
  color: var(--primary-color);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-today:hover {
  background-color: rgba(255, 138, 101, 0.2);
}

.date-navigation {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.current-month {
  font-size: 1rem;
  font-weight: 500;
  min-width: 100px;
  text-align: center;
}

.nav-btn {
  background: none;
  border: 1px solid #ddd;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn:hover {
  background-color: rgba(255,138,101,0.1);
  border-color: var(--primary-color);
}

.full-width-calendar {
  width: 100%;
  margin-bottom: 1.5rem;
  overflow-x: auto;
}

:deep(.fc) {
  width: 100%;
}

:deep(.fc-toolbar) {
  display: none;
}

:deep(.fc-day-today) {
  background-color: rgba(255,138,101,0.15) !important;
}

:deep(.fc-day-sat) {
  color: var(--primary-color);
}

:deep(.fc-day-sun) {
  color: #E74C3C;
}

/* 달력 속에 숫자 글자 조절 가능한 부분 */
:deep(.fc-daygrid-day-number) {
  font-weight: 700;
  font-size: 1.05rem;
  padding: 0.6rem;
    text-decoration: none !important; 
  color: #fa8a65 !important; 
}

:deep(.fc-daygrid-day-top) {
  justify-content: flex-start;
  padding-left: 0.5rem;
  
}

/* 요일쪽 글자 조절 가능한 부분 */
:deep(.fc-col-header-cell-cushion) {
  color: #fa8a65 !important;        
  font-weight: 700;                  
  font-size: 1.1rem;                 
  text-decoration: none !important;  
}

/* 날짜 셀 높이 설정 */
:deep(.fc-daygrid-day) {
  min-height: clamp(140px, 16vw, 220px);
  transition: background-color 0.2s;
  
}

:deep(.fc-daygrid-day:hover) {
  background-color: #f8f9ff;
}

/* 운동 이벤트 스타일링 */
:deep(.exercise-event) {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

:deep(.exercise-title) {
  font-size: 0.8rem;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0.1rem 0;
}

:deep(.more-exercises) {
  font-size: 0.75rem;
  color: #666;
  font-style: italic;
}

:deep(.rest-event) {
  padding: 0.3rem 0.5rem;
  background-color: #f5f5f5;
  border-left: 3px solid #c0c0c0;
  margin: 0.2rem 0;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #888;
  font-style: italic;
}

.event-detail-panel {
  margin-top: 1rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.detail-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #222;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;
}

.btn-close:hover {
  background-color: #e1e8ff;
  color: #333;
}

.detail-actions {
  display: flex;
  gap: 0.8rem;
  margin-top: 1.5rem;
}

.btn-complete, .btn-reschedule {
  flex: 1;
  padding: 0.8rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-complete {
  background-color: var(--primary-color);
  color: white;
}

.btn-complete:hover {
  background-color: var(--primary-hover-color);
}

.btn-reschedule {
  background-color: #f0f0f0;
  color: #555;
}

.btn-reschedule:hover {
  background-color: #e0e0e0;
}

/* 운동 부위 표시 스타일 */
:deep(.bodypart-event) {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: 0.1rem;
}

:deep(.bodypart-badge) {
  background-color: rgba(255,138,101,0.15);
  color: var(--primary-color);
  font-size: 0.8rem;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  white-space: nowrap;
}

:deep(.bodypart-more) {
  font-size: 0.7rem;
  color: #666;
  margin-left: 0.2rem;
}

@media (min-width: 1400px) {
  :deep(.fc-daygrid-day) {
    min-height: 220px;
  }
}

@media (max-width: 768px) {
  :deep(.fc-daygrid-day-number) {
    font-size: 0.9rem;
  }
  :deep(.bodypart-badge) {
    font-size: 0.75rem;
  }
}

.exercise-badge {
  display: inline-block;
  background: #f8f9ff;
  color: #365fff;
  border-radius: 6px;
  padding: 0.15em 0.6em;
  font-size: 0.85em;
  margin-right: 4px;
  max-width: 90px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}
.exercise-more {
  display: inline;
  color: #888;
  font-size: 0.8em;
  margin-left: 2px;
}
</style> 