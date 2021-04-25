const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/auth')

router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/loginWithGoogle', userController.loginWithGoogle)
router.get('/me', authMiddleware, userController.me)

module.exports = router
