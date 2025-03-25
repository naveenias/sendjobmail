const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Enable CORS with specific configuration
app.use(cors({
    origin: "https://naveensjobmail.vercel.app",
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Explicitly handle preflight requests
app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://naveensjobmail.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(200); // Respond to OPTIONS requests
});

// Middleware to parse JSON requests
app.use(express.json());

// Load email routes
const emailroute = require('./routes/email');
app.use('/api/email', emailroute);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
