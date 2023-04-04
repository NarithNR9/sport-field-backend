const express = require('express')

const bookingController = require('../controllers/booking.controller')

const router = express.Router()

// GET requset
router.get('/', bookingController.getAllBookings)

// GET requset
router.get('/mine/:playerId', bookingController.getMyBookings)

// GET owner requset
router.get('/owner', bookingController.getOwnerBooking)

// POST req
router.post('/', bookingController.createBooking)

module.exports = router   