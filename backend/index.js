const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Enable CORS for all origins (*)
app.use(cors({
    origin: '*', // Allow requests from any origin
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Allow cookies & authentication headers
}));

// Middleware to parse JSON requests
app.use(express.json());

// Load email routes
const emailroute = require('./routes/email');
app.use('/api/email', emailroute);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
