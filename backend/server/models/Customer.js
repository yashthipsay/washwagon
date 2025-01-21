const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
}); 

// Prevent overwriting the Customer model if it already exists
const Customer = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);

module.exports = Customer;
