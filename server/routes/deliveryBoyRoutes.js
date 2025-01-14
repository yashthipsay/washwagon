// /Users/karanpaigude/Desktop/projects/Washwagon/server/routes/deliveryBoyRoutes.js
const express = require('express');
const router = express.Router();
const deliveryBoyController = require('../controllers/deliveryBoyController');

// Route to create a new delivery boy
router.post('/api/deliveryboys', deliveryBoyController.createDeliveryBoy); // POST method for creating a delivery boy

// Route to get all delivery boys
router.get('/api/deliveryboys', deliveryBoyController.getDeliveryBoys);    // GET method for fetching delivery boys

module.exports = router;
