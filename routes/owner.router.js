const express = require('express')

const ownerController = require('../controllers/owner.controller')

const router = express.Router()

// GET requset
router.get('/', ownerController.getOwners)

// POST request
router.post('/register', ownerController.createOwner)

// login request
router.post('/login', ownerController.loginOwner)

/***** 
Ban player to blacklist
*****/

// Get
router.get('/ban/:field_id', ownerController.getBanPlayers)

// Post
router.post('/ban', ownerController.banPlayer)

// Delete
router.delete('/ban', ownerController.unbanPlayers)

module.exports = router 