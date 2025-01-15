const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./db/db');
require('dotenv').config();
const laundryOwner = require('./routes/laundryOwner');
const bnkVerification = require('./routes/bnkVerification');
const customerRoutes = require('./routes/customerRoutes'); // Import the customerRoutes file
const deliveryBoyRoutes = require('./routes/deliveryBoyRoutes'); // Import the deliveryBoyRoutes file


const app = express();
app.use(cors());


// Increase payload size limit
app.use(express.json({ limit: '10mb' })); // Adjust the limit as needed
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Connect to MongoDB
connectDB();

// Define routes
app.use('/api/laundryOwners', laundryOwner);
app.use('/api/bank-verification', bnkVerification);
app.use(customerRoutes); // Use the customerRoutes file
app.use(deliveryBoyRoutes); // Use the deliveryBoyRoutes file

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));