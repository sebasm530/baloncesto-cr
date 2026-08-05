import api from './client'

export const login = (data) => api.post('/auth/login', data)
export const register = (data) => api.post('/auth/register', data)
export const getMe = () => api.get('/auth/me')
export const verifyTwoFactor = (data) => api.post('/auth/verify-2fa', data)
export const resendCode = (data) => api.post('/auth/resend-code', data)
export const changePassword = (data) => api.patch('/auth/change-password', data)
export const deleteMyAccount = (confirmation) => api.delete('/auth/me', { data: { confirmation } })
