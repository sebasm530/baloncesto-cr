const router = require('express').Router()
const { register, login, getMe, verifyTwoFactor, resendCode } = require('../controllers/auth.controller')
const { protect } = require('../middlewares/auth.middleware')

router.post('/register', register)
router.post('/login', login)
router.post('/verify-2fa', verifyTwoFactor)
router.post('/resend-code', resendCode)
router.get('/me', protect, getMe)

module.exports = router