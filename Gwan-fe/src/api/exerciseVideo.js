import api from './axios'

export const addExerciseVideo = (data) => {
  // data: { title, description, url, youtubeId, targetId }
  return api.post('/api/exercise-videos', data)
}

export const getAllTargets = () => {
  return api.get('/api/targets')
} 