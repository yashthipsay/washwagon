// /Users/karanpaigude/Desktop/projects/Washwagon/server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const Customer = require('../controllers/customerController');

// Route to create a new customer
router.post('/', Customer.createUser);  // POST method for creating a customer

// Route to get all customers
router.get('/', Customer.getUsers);    // GET method for fetching customers

module.exports = router;
