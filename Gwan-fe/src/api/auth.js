import api from './axios'

export const signup = (payload) => api.post('/api/auth/signup', payload)
export const login = (payload) => api.post('/api/auth/login', payload)
export const logout = () => api.post('/api/auth/logout')
