const Booking = require('../models/Booking');
const Room = require('../models/Room');

// 1. SMART CREATE BOOKING
exports.createBooking = async (req, res) => {
    console.log("🔥 CONTROLLER HIT! Processing booking for:", req.body.studentName);

    try {
        // 1. EXTRACT DATA (Crucial Step: Check if enrollmentId is here!)
        const { 
            studentName, 
            studentEmail, 
            enrollmentId, // <--- MUST BE HERE
            studentId,    // <--- MUST BE HERE TOO
            reason, 
            roomType, 
            ac, 
            startDate, 
            endDate 
        } = req.body;

        // Debug Log: Check what the server actually sees
        console.log("DEBUG DATA:", { enrollmentId, studentId }); 

        // Basic Checks
        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Dates are required" });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();

        // Fix: Block "Backwards" dates
        if (end <= start) {
            return res.status(400).json({ message: "❌ Check-out date must be after Check-in date." });
        }

        // 7-Day Advance Rule
        const minDate = new Date();
        minDate.setDate(today.getDate() + 7);
        minDate.setHours(0,0,0,0); 
        
        if (start < minDate) {
            return res.status(400).json({ message: "❌ Booking must be at least 7 days in advance." });
        }

        // 5-Day Limit
        const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
        if (diffDays > 5) {
            return res.status(400).json({ message: "❌ Maximum stay allowed is 5 days." });
        }

        // Calculate Bill
        let pricePerNight = 0;
        if (roomType === 'Single') pricePerNight = (ac === 'true' || ac === true) ? 400 : 300;
        else pricePerNight = (ac === 'true' || ac === true) ? 800 : 600;
        
        const totalBill = pricePerNight * diffDays;

        // 2. SAVE DATA (Crucial Step: Check if enrollmentId is passed here!)
        const newBooking = new Booking({
            studentName, 
            studentEmail, 
            enrollmentId, // <--- MUST BE PASSED HERE
            studentId,    
            reason,
            roomType, ac: (ac === 'true' || ac === true),
            startDate, endDate,
            totalPrice: totalBill,
            status: 'pending'
        });

        const savedBooking = await newBooking.save();
        console.log("✅ Saved successfully!");

        res.status(201).json({ 
            message: "Request Sent Successfully! Bill: ₹" + totalBill, 
            booking: savedBooking 
        });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Server Error: " + error.message, error: error.message });
    }
};    
      

// 2. GET PENDING BOOKINGS (Faculty)
exports.getPendingBookings = async (req, res) => {
    try { const bookings = await Booking.find({ status: 'pending' }); res.json(bookings); } 
    catch (e) { res.status(500).json({ message: e.message }); }
};

// 3. GET AVAILABLE ROOMS (Faculty)
exports.getAvailableRooms = async (req, res) => {
    try {
        const { roomType, ac, startDate, endDate } = req.query;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const clashing = await Booking.find({ status: 'approved', $or: [{ startDate: { $lt: end }, endDate: { $gt: start } }] }).select('assignedRoomNumber');
        const occupied = clashing.map(b => b.assignedRoomNumber);
        const rooms = await Room.find({ type: roomType, ac: (ac === 'true'), roomNumber: { $nin: occupied } });
        res.json(rooms);
    } catch (e) { res.status(500).json({ message: e.message }); }
};

// 4. ASSIGN ROOM (Faculty)
exports.assignRoom = async (req, res) => {
    try {
        await Booking.findByIdAndUpdate(req.params.id, { status: 'approved', assignedRoomNumber: req.body.roomNumber });
        res.json({ message: "Room Assigned!" });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

// 5. UPDATE STATUS (Reject)
exports.updateStatus = async (req, res) => {
    try { await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }); res.json({ message: "Status Updated" }); } 
    catch (e) { res.status(500).json({ message: e.message }); }
};

// ... keep all your existing functions (createBooking, etc.) ...

// --- MODIFIED: Strict Student Search (Email + ID) ---
// --- 6. GET STUDENT BOOKINGS (Updated for Student ID) ---
exports.getStudentBookings = async (req, res) => {
    // 1. Log what the frontend sent us
    console.log("🔍 SEARCH HIT! Params:", req.query); 

    try {
        // Extract 'email' and 'studentId' (NOT enrollmentId)
        const { email, studentId } = req.query; 
        
        // 2. Validate
        if (!email || !studentId) {
            console.log("❌ Missing fields in search");
            return res.status(400).json({ message: "Please provide both Email and Student ID." });
        }

        // 3. Search Database
        const bookings = await Booking.find({ 
            studentEmail: email, 
            studentId: studentId 
        }).sort({ createdAt: -1 });
        
        // 4. Handle Results
        if (bookings.length === 0) {
            console.log("⚠️ No bookings found for this combo.");
            return res.status(404).json({ message: "No booking found." });
        }

        console.log(`✅ Found ${bookings.length} booking(s)!`);
        res.json(bookings);

    } catch (error) {
        console.error("❌ Search Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// --- NEW: Faculty Room Status View ---
exports.getRoomStatus = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if(!startDate || !endDate) return res.status(400).json({message: "Dates required"});

        const start = new Date(startDate);
        const end = new Date(endDate);

        // 1. Get ALL Rooms
        const allRooms = await Room.find().sort({ roomNumber: 1 });

        // 2. Find Bookings in this range that are APPROVED
        const activeBookings = await Booking.find({
            status: 'approved',
            $or: [{ startDate: { $lt: end }, endDate: { $gt: start } }]
        });

        // 3. Map status to each room
        const roomStatus = allRooms.map(room => {
            // Check if this room is in the active bookings list
            const booking = activeBookings.find(b => b.assignedRoomNumber === room.roomNumber);
            
            if (booking) {
                return {
                    roomNumber: room.roomNumber,
                    status: 'Occupied',
                    details: `Booked: ${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}`
                };
            } else {
                return { roomNumber: room.roomNumber, status: 'Available', details: 'Free' };
            }
        });

        res.json(roomStatus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// --- 7. GET ALL ALLOCATED ROOMS (For "Who is where?" Register) ---
exports.getAllocatedBookings = async (req, res) => {
    try {
        // Find all bookings with status 'approved', sorted by Room Number
        const bookings = await Booking.find({ status: 'approved' })
                                      .sort({ assignedRoomNumber: 1 }); // 1 = Ascending order (101, 102...)
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};