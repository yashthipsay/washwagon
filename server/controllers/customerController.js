// /Users/karanpaigude/Desktop/projects/Washwagon/server/controllers/userController.js
const Customer = require('../models/Customer'); // Change User to Customer

// Create a new customer
exports.createUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const newCustomer = new Customer({ name, email, password }); // Changed User to Customer
        await newCustomer.save();
        res.status(201).json(newCustomer);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get all customers
exports.getUsers = async (req, res) => {
    try {
        const customers = await Customer.find(); // Changed User to Customer
        res.json(customers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
