<template>
  <FullCalendar :options="calendarOptions" />
</template>

<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import { computed } from 'vue'
import { useCalendarEvents } from './useCalendarEvents'

// 예시 json 데이터 (props로 받아도 무방)
const routineJson = [/* 여기에 JSON 데이터 삽입 */]

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin],
  initialView: 'dayGridMonth',
  events: useCalendarEvents(routineJson)
}))
</script>

<style>
</style>
