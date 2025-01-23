const express = require('express');
const router = express.Router();
const laundryOwnerController = require('../controllers/laundryOwnerController');

// Create a new laundry owner
router.post('/', laundryOwnerController.createLaundryOwner);

// Get all laundry owners
router.get('/', laundryOwnerController.getAllLaundryOwners);

// Get bank account details of a specific laundry owner by ID
router.get('/:id/bankDetails', laundryOwnerController.getBankDetails);

module.exports = router;