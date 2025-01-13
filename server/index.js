const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./db/db');
require('dotenv').config();

const app = express();
app.use(cors());

// Connect to MongoDB
connectDB();

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));