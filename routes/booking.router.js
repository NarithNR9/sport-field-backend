const express = require('express')

const bookingController = require('../controllers/booking.controller')

const router = express.Router()

// GET requset
router.get('/', bookingController.getAllBookings)

// POST req
router.post('/', bookingController.createBooking)

module.exports = router   