const express = require('express')

const ownerController = require('../controllers/owner.controller')

const router = express.Router()

// GET requset
router.get('/', ownerController.getOwners)

// POST request
router.post('/register', ownerController.createOwner)

// login request
router.post('/login', ownerController.loginOwner)

module.exports = router 