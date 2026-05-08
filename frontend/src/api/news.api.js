import api from './client'

export const getNews = (params) => api.get('/news', { params })
export const getNewsById = (id) => api.get(`/news/${id}`)
export const createNews = (data) => api.post('/news', data)
export const updateNews = (id, data) => api.put(`/news/${id}`, data)
export const deleteNews = (id) => api.delete(`/news/${id}`)