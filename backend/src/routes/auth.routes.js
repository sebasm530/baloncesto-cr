const router = require('express').Router()
const { register, login, getMe, verifyTwoFactor, resendCode, changePassword, deleteMyAccount } = require('../controllers/auth.controller')
const { protect } = require('../middlewares/auth.middleware')

router.post('/register', register)
router.post('/login', login)
router.post('/verify-2fa', verifyTwoFactor)
router.post('/resend-code', resendCode)
router.get('/me', protect, getMe)
router.patch('/change-password', protect, changePassword)
router.delete('/me', protect, deleteMyAccount)

module.exports = router
