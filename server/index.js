// 1. Import dependencies
const express = require('express');
const cors = require('cors');

// 2. Initialize the app
const app = express();

// 3. Middleware (Security & JSON parsing)
app.use(express.json()); // Allows server to understand JSON data sent from frontend
app.use(cors());         // Allows frontend (React) to talk to backend

// 4. A simple test route
// When someone visits the root URL '/', send back a message.
app.get('/', (req, res) => {
    res.send('Hello from VNIT Booking Server!');
});

// 5. Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});