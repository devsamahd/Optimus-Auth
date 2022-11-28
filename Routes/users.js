const handleRefreshToken = require('../Controllers/handleRefreshToken')
const { handleNewUser, handleLogin, getAllUsers } = require('../Controllers/usersController')
const { sendCode, confirmCode } = require('../Controllers/verificationCodeController')
const router = require('express').Router()
const verifyJWT = require('../Middleware/verifyJWT')

router.get('/',verifyJWT, getAllUsers)
router.post('/register', handleNewUser)
router.post('/auth', handleLogin)
router.get('/refresh', handleRefreshToken)
router.post('/sendVerificationCode', sendCode)
router.post('/confirmverficationcode', confirmCode)

module.exports = router