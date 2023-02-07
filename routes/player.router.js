const express = require('express')

const playerController = require('../controllers/player.controller')

const router = express.Router()

// GET requset
router.get('/', playerController.getPlayers)

// POST request
router.post('/register', playerController.createPlayer)

// login request
router.post('/login', playerController.loginPlayer)

module.exports = router 