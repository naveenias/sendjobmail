const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Handle preflight requests
// app.options('*', (req, res) => {
//     res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all or specify your domain
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//     return res.status(200).end();
//   });
  
  // Enable CORS for all routes
  app.use(cors({
    origin: "https://naveensjobmail.vercel.app/", // Change '*' to a specific origin for security
    methods: ['GET', 'POST', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, 
  }));

// ✅ Middleware to parse JSON requests
app.use(express.json());

// ✅ Load email routes
const emailroute = require('./api/email');
app.use('/api/email', emailroute);

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
