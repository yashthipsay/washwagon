const express = require('express');
const router = express.Router();
const deliveryBoyController = require('../controllers/deliveryBoyController');

// Route to create a new delivery boy
router.post('/', deliveryBoyController.createDeliveryBoy); // POST method for creating a delivery boy

router.post('/signup', deliveryBoyController.createDeliveryBoy); 

// Route to get all delivery boys
router.get('/orders', deliveryBoyController.getDeliveryBoys);    // GET method for fetching delivery boys
// router.put('/orderDetails', orderController.updateOrderDetails);

module.exports = router;
