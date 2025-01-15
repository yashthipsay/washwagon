const LaundryOwner = require('../models/LaundryOwner');

// Create a new laundry owner
exports.createLaundryOwner = async (req, res) => {
  try {
    console.log("Incoming Payload:", req.body); // Log payload
    const laundryOwner = new LaundryOwner(req.body);
    await laundryOwner.save();
    res.status(201).send(laundryOwner);
  } catch (err) {
    console.error("Error creating laundry owner:", err); // Log error
    res.status(400).send({ message: err.message });
  }
};

  // Get all laundry owners
exports.getAllLaundryOwners = async (req, res) => {
    try {
      const laundryOwners = await LaundryOwner.find();
      res.status(200).send(laundryOwners);
    } catch (err) {
      res.status(500).send(err.message);
    }
  };

  // Get bank account details of a specific laundry owner by ID
exports.getBankDetails = async (req, res) => {
    try {
      const laundryOwner = await LaundryOwner.findById(req.params.id).select('bankDetails');
      if (!laundryOwner) {
        return res.status(404).send('Laundry owner not found');
      }
      res.status(200).send(laundryOwner.bankDetails);
    } catch (err) {
      res.status(500).send(err.message);
    }
  };