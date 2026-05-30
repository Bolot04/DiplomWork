import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081/api',
})

// Подставляем токен во все запросы если есть
api.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const login = (password) => api.post('/admin', { password })

export const getHolidays = () => api.get('/holidays/')
export const getHoliday = (id) => api.get(`/holidays/${id}`)
export const getHolidaySongs = (id) => api.get(`/holidays/${id}/songs`)
export const getHolidayDances = (id) => api.get(`/holidays/${id}/dances`)
export const getSong = (id) => api.get(`/songs/${id}`)
export const getDance = (id) => api.get(`/dances/${id}`)

export const deleteHoliday = (id) => api.delete(`/holidays/${id}`)
export const deleteSong = (id) => api.delete(`/songs/${id}`)
export const deleteDance = (id) => api.delete(`/dances/${id}`)

export const uploadFile = (file) => {
  const form = new FormData()
  form.append('file', file)
  return api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
}