const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./db/db');
require('dotenv').config();
const laundryOwner = require('./routes/laundryOwner');
const customerRoutes = require('./routes/customerRoutes'); // Import the customerRoutes file
const deliveryBoyRoutes = require('./routes/deliveryBoyRoutes'); // Import the deliveryBoyRoutes file


const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Connect to MongoDB
connectDB();

// Define routes
app.use('/api.laundryOwners', laundryOwner);
app.use(customerRoutes); // Use the customerRoutes file
app.use(deliveryBoyRoutes); // Use the deliveryBoyRoutes file

const server = http.createServer(app);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));