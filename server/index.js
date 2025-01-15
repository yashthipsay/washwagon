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
    res.set('Access-Control-Allow-Origin', '*');
    res.json(data);
  });

const server = http.createServer(app);



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));