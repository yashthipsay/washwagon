const express = require('express');
const http = require('http');
const cors = require('cors'); // Import CORS
require('dotenv').config();
const mongoose = require('mongoose');
const laundryOwner = require('./routes/laundryOwner');
// const bnkVerification = require('./routes/bnkVerification');
const customerRoutes = require('./routes/customerRoutes'); // Import the customerRoutes file
const deliveryBoyRoutes = require('./routes/deliveryBoyRoutes'); // Import the deliveryBoyRoutes file
const orderRoutes = require('./routes/orderDetailsRoutes');
const socketIo = require('socket.io'); // Import Socket.IO

const app = express();

// Enable CORS for all origins (you can restrict this to specific origins later)
app.use(cors());

// Increase payload size limit
app.use(express.json({ limit: '10mb' })); // Adjust the limit as needed
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Define routes
app.use('/api/laundryOwners', laundryOwner);
// app.use('/api/bank-verification', bnkVerification);
app.use('/api', require('./routes/orderDetailsRoutes'));
app.use('/api/customers', customerRoutes); // For customer routes (signup should be here)
app.use('/api/deliveryBoys', deliveryBoyRoutes); // For delivery routes

// Proxy route for geocoding
app.use('/proxy', async (req, res) => {
  console.log("start");
  const { lat, lon, apiKey } = req.query;
  const url = `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${lat},${lon}&api_key=${apiKey}`;
  const response = await fetch(url, {
    headers: {
      'X-Request-Id': 'a623e8cd-bcd5-4d9a-beb3-ea7df3f5092e',
      Authorization: `Bearer ${apiKey}`,
    },
  });

  const data = await response.json();
  console.log('Reverse geocoding response:', data);
  res.set('Access-Control-Allow-Origin', '*'); // Allow all origins for proxy
  res.json(data);
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with CORS options
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',  // Frontend URL
    methods: ['GET', 'POST'],        // Allowed methods
    allowedHeaders: ['Content-Type'], // Allowed headers
  }
});

// Set up a basic WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for any specific events from the client (e.g., delivery boy accepting an order)
  socket.on('acceptOrder', (data) => {
    console.log('Order accepted:', data);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
