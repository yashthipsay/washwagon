const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/customer.controller'); // Use the correct path to your controller

// Route to create a new customer
router.post('/signup', CustomerController.createUser);  // POST method for creating a customer

// Route to get all customers
router.get('/login', CustomerController.getUsers);  // GET method for fetching customers

router.post('/login', CustomerController.loginUser);  // POST method for customer login

module.exports = router;
