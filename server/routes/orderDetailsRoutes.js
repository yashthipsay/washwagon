const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderdetails.controller');

// Route to create a new order
router.post('/orders', orderController.createOrder);

// Route to get details of an order by order ID
router.get('/orders/:orderId', orderController.getOrderDetails);

// Route to get all orders of a specific customer
router.get('/customers/:customerId/orders', orderController.getOrdersByCustomer);

// Route to update an order (PUT /api/orderDetails)
router.put('/orderDetails', orderController.updateOrderDetails);

module.exports = router;
