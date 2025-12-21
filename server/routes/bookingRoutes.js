const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// 1. Create Booking
router.post('/', bookingController.createBooking);

// 2. Student Status (Changed from URL param to generic GET for Query Params)
router.get('/student-lookup', bookingController.getStudentBookings);

// 3. Faculty Routes
router.get('/pending', bookingController.getPendingBookings);
router.get('/available', bookingController.getAvailableRooms); // Dropdown logic
router.get('/room-status', bookingController.getRoomStatus);   // NEW: General View logic
router.put('/assign/:id', bookingController.assignRoom);
router.put('/:id', bookingController.updateStatus);
router.get('/allocated', bookingController.getAllocatedBookings);

module.exports = router;