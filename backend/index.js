const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Enable CORS with specific configuration
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Load email routes
const emailroute = require('./routs/email');
app.use('/api/email', emailroute);

// Start the server
const PORT = process.env.PORT || 5000; // Use PORT from environment or default to 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
