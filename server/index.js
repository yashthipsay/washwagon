const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./db/db');
require('dotenv').config();
const laundryOwner = require('./routes/laundryOwner');


const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Connect to MongoDB
connectDB();

// Define routes
app.use('/api.laundryOwners', laundryOwner);

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));