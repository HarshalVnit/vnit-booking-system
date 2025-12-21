const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    enrollmentId: { type: String, required: true }, 
    studentId: { type: String, required: true },

    reason: { type: String, required: true },
    roomType: { type: String, required: true }, // 'Single' or 'Double'
    ac: { type: Boolean, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, default: 'pending' }, // pending, approved, rejected
    assignedRoomNumber: { type: String, default: null },
    totalPrice: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);