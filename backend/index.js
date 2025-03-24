const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Enable CORS with specific configuration
app.use(cors(
    {
    origin: ['https://naveensjobmail.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, 
}
));

// Middleware to parse JSON requests
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API is working!");
  });
  

// Load email routes
const emailroute = require('./routes/email');
app.use('/api/email', emailroute);

// Start the server
const PORT = process.env.PORT || 5000; // Use PORT from environment or default to 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
