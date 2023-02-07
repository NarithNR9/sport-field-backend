const express = require('express')

const adminController = require('../controllers/admin.controller')

const router = express.Router()

// GET requset
router.get('/', adminController.getAdmin)

// POST request
router.post('/create', adminController.createAdmin)

// login request
router.post('/login', adminController.loginAdmin)

module.exports = router